import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy API route for Elfsight requests to avoid CORS issues
 * This acts as a middleware between our frontend and Elfsight services
 */
export async function GET(request: NextRequest) {
  try {
    // Get the target URL from the query parameter
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    
    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Missing target URL parameter' },
        { status: 400 }
      );
    }
    
    // Validate that we're only proxying to Elfsight domains for security
    const validDomains = [
      'widget-data.service.elfsight.com',
      'static.elfsight.com',
      'apps.elfsight.com',
      'service.elfsight.com',
      'core.service.elfsight.com',
      'universe-static.elfsightcdn.com',
      'elfsightcdn.com', 
      'static.elfsightcdn.com',
      'apps-api.elfsight.com'
    ];
    
    const targetDomain = new URL(targetUrl).hostname;
    if (!validDomains.some(domain => targetDomain.includes(domain))) {
      return NextResponse.json(
        { error: 'Invalid target domain' },
        { status: 403 }
      );
    }
    
    // Add cache-busting parameter
    const urlObj = new URL(targetUrl);
    urlObj.searchParams.append('_cb', Date.now().toString());
    
    // Forward the request to Elfsight with custom headers
    const response = await fetch(urlObj.toString(), {
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'Next.js Proxy',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://static.elfsight.com',
        'Referer': 'https://static.elfsight.com/',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
    });
    
    // Get the response data
    const data = await response.text();
    
    // Create a new response with appropriate headers
    const proxyResponse = new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, X-Requested-With, Accept',
        'Access-Control-Max-Age': '86400',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Proxied-By': 'Next.js Proxy'
      },
    });
    
    return proxyResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}

/**
 * Direct proxy for widget data API calls
 * This handles the specific API endpoints that are failing
 */
export async function POST(request: NextRequest) {
  try {
    // Handle specific widget data endpoints directly
    const { searchParams, pathname } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    const widgetId = searchParams.get('widgetId');
    
    // If we have a direct widget ID, use it to construct the URL
    if (widgetId) {
      const body = await request.json();
      
      // Construct the appropriate URL for the widget data API
      let apiUrl = `https://widget-data.service.elfsight.com/api/source/${widgetId}/status`;
      
      if (pathname.includes('/posts')) {
        apiUrl = `https://widget-data.service.elfsight.com/api/posts`;
        // Add query parameters for posts endpoint
        const url = new URL(apiUrl);
        url.searchParams.append('sources[]', JSON.stringify({pid: widgetId, filters: []}));
        url.searchParams.append('sort', 'date');
        url.searchParams.append('limit', '50');
        url.searchParams.append('offset', '0');
        apiUrl = url.toString();
      }
      
      // Make the API request
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Next.js Proxy)',
          'Accept': 'application/json, text/plain, */*',
          'Origin': 'https://static.elfsight.com',
          'Referer': 'https://static.elfsight.com/',
          'Cache-Control': 'no-cache',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      // Get response data
      const data = await response.text();
      
      // Return proxied response
      return new NextResponse(data, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, X-Requested-With, Accept',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
    
    // Fall back to standard URL-based proxy
    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Missing target URL parameter' },
        { status: 400 }
      );
    }
    
    // Validate that we're only proxying to Elfsight domains for security
    const validDomains = [
      'widget-data.service.elfsight.com',
      'static.elfsight.com',
      'apps.elfsight.com',
      'service.elfsight.com',
      'core.service.elfsight.com',
      'universe-static.elfsightcdn.com',
      'elfsightcdn.com', 
      'static.elfsightcdn.com',
      'apps-api.elfsight.com'
    ];
    
    const targetDomain = new URL(targetUrl).hostname;
    if (!validDomains.some(domain => targetDomain.includes(domain))) {
      return NextResponse.json(
        { error: 'Invalid target domain' },
        { status: 403 }
      );
    }
    
    // Get the request body
    const body = await request.text();
    
    // Forward the request to Elfsight
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'Next.js Proxy',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://static.elfsight.com',
        'Referer': 'https://static.elfsight.com/',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      body
    });
    
    // Get the response data
    const data = await response.text();
    
    // Create a new response with appropriate headers
    const proxyResponse = new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, X-Requested-With, Accept',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    
    return proxyResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, X-Requested-With, Accept',
      'Access-Control-Max-Age': '86400',
    },
  });
}