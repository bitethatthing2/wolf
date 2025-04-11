// Netlify function to proxy Elfsight API requests and solve CORS issues
const fetch = require('node-fetch');

// List of allowed domains to proxy to
const ALLOWED_DOMAINS = [
  'widget-data.service.elfsight.com',
  'api.elfsight.com',
  'service.elfsight.com',
  'static.elfsight.com',
  'elfsight.com',
  'apps-api.elfsight.com'
];

exports.handler = async function(event, context) {
  // Only allow GET and POST requests
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST' && event.httpMethod !== 'OPTIONS') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    };
  }
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: ''
    };
  }
  
  try {
    // Extract the target URL from query parameters
    const { url } = event.queryStringParameters || {};
    
    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing url parameter' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }
    
    // Parse the URL to verify it's allowed
    let targetUrl;
    try {
      targetUrl = new URL(url);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid URL' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }
    
    // Check if the domain is allowed
    const isAllowedDomain = ALLOWED_DOMAINS.some(domain => 
      targetUrl.hostname === domain || targetUrl.hostname.endsWith('.' + domain)
    );
    
    if (!isAllowedDomain) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Domain not allowed' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }
    
    // Add cache-busting parameter to prevent issues
    const separator = targetUrl.search ? '&' : '?';
    targetUrl.search += `${separator}_cb=${Date.now()}`;
    
    // Forward the request to the target URL
    const requestOptions = {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 Netlify Function Proxy',
        'Origin': 'https://static.elfsight.com',
        'Referer': 'https://static.elfsight.com/',
        'Accept': 'application/json, text/plain, */*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };
    
    // If it's a POST request, include the body
    if (event.httpMethod === 'POST' && event.body) {
      requestOptions.body = event.body;
    }
    
    // Make the request to the target URL
    const response = await fetch(targetUrl.toString(), requestOptions);
    
    // Get the response body as text
    const responseBody = await response.text();
    
    // Get content type from response
    const contentType = response.headers.get('content-type') || 'application/json';
    
    // Return the response with appropriate headers
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Proxied-By': 'Netlify Function'
      },
      body: responseBody
    };
    
  } catch (error) {
    console.error('Proxy error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy error', message: error.message }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};