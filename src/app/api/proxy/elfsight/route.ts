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
    
    // Forward the request to Elfsight
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'Next.js Proxy',
        'Accept': 'application/json',
        'Origin': 'https://magnificent-churros-3c51ed.netlify.app',
        'Referer': 'https://magnificent-churros-3c51ed.netlify.app/'
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

/**
 * Forward POST requests to Elfsight
 */
export async function POST(request: NextRequest) {
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
    
    // Get the request body
    const body = await request.text();
    
    // Forward the request to Elfsight
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'Next.js Proxy',
        'Accept': 'application/json',
        'Origin': 'https://magnificent-churros-3c51ed.netlify.app',
        'Referer': 'https://magnificent-churros-3c51ed.netlify.app/'
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
