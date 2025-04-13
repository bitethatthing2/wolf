import { NextRequest, NextResponse } from 'next/server';

/**
 * Elfsight Proxy API Route
 * This route proxies requests to Elfsight to avoid Content Security Policy issues
 */
export async function GET(request: NextRequest) {
  try {
    // Get the URL from the query parameter
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }
    
    // Validate that the URL is from Elfsight
    if (!url.includes('elfsight.com') && !url.includes('elfsightcdn.com')) {
      return NextResponse.json({ error: 'Only Elfsight URLs are allowed' }, { status: 403 });
    }
    
    // Fetch the content from Elfsight
    const response = await fetch(url, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'Next.js Proxy',
        'Accept': request.headers.get('accept') || '*/*',
        'Accept-Language': request.headers.get('accept-language') || 'en-US,en;q=0.9',
        'Referer': request.headers.get('referer') || 'https://sidehustlebar.com/'
      }
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch from Elfsight: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Get content type to properly handle the response
    const contentType = response.headers.get('content-type') || '';
    
    // Handle different content types
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    } else if (contentType.includes('text/javascript') || contentType.includes('application/javascript')) {
      const text = await response.text();
      return new NextResponse(text, {
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
        }
      });
    } else {
      // For other content types (e.g., images)
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  } catch (error) {
    console.error('Elfsight proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to Elfsight' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the request target URL
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }
    
    // Validate that the URL is from Elfsight
    if (!url.includes('elfsight.com') && !url.includes('elfsightcdn.com')) {
      return NextResponse.json({ error: 'Only Elfsight URLs are allowed' }, { status: 403 });
    }
    
    // Get the request body
    const body = await request.text();
    
    // Forward the request to Elfsight
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'Next.js Proxy',
        'Accept': request.headers.get('accept') || '*/*',
        'Origin': request.headers.get('origin') || 'https://sidehustlebar.com/',
        'Referer': request.headers.get('referer') || 'https://sidehustlebar.com/'
      },
      body
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch from Elfsight: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Get content type to properly handle the response
    const contentType = response.headers.get('content-type') || '';
    
    // Handle different content types
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      const text = await response.text();
      return new NextResponse(text, {
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  } catch (error) {
    console.error('Elfsight proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to Elfsight' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}