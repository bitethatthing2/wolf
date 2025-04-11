import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle specific endpoints that are causing 404 errors
  if (request.nextUrl.pathname === '/current-url/' || request.nextUrl.pathname === '/.identity') {
    // Return an empty 200 response for these endpoints
    const response = new NextResponse(JSON.stringify({ status: 'ok' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add security headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', '*');
    
    return response;
  }

  // For all other requests, continue with the existing middleware
  // Get the existing response headers
  const response = NextResponse.next()

  // Add CSP header with streamlined settings that don't include Elfsight
  const cspHeader = `
    default-src 'self' https://*.googleusercontent.com https://*.instagram.com https://*.cdninstagram.com https://*.gstatic.com https://*.firebase.googleapis.com https://maps.googleapis.com https://www.google.com;
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.gstatic.com https://*.googleapis.com https://*.firebase.googleapis.com https://*.google.com https://g.doubleclick.net https://maps.googleapis.com https://www.instagram.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.gstatic.com https://*.google.com https://www.instagram.com;
    img-src 'self' data: https://*.googleusercontent.com https://*.instagram.com https://*.cdninstagram.com https://*.fbcdn.net https://lh3.googleusercontent.com https://*.googleapis.com https://*.ggpht.com https://*.google.com https://maps.gstatic.com blob:;
    font-src 'self' data: https://fonts.gstatic.com;
    media-src 'self' https://video.wixstatic.com https://*.cdninstagram.com https://*.fbcdn.net blob:;
    connect-src 'self' https://*.googleapis.com https://*.instagram.com https://*.gstatic.com https://*.firebase.googleapis.com https://lh3.googleusercontent.com https://*.cdninstagram.com https://maps.googleapis.com https://www.google.com https://g.doubleclick.net https://accounts.google.com https://graph.instagram.com https://api.instagram.com;
    frame-src 'self' https://*.google.com https://g.doubleclick.net https://accounts.google.com https://www.gstatic.com https://maps.googleapis.com https://www.google.com/maps/ https://*.instagram.com;
    worker-src 'self' blob:;
    child-src 'self' blob: https://*.google.com https://maps.googleapis.com https://*.instagram.com;
    frame-ancestors 'self' https://*.netlify.app https://*.magnificent-churros-3c51ed.netlify.app;
    object-src 'none';
    base-uri 'self';
  `.replace(/\s+/g, ' ').trim()

  // Set security headers 
  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade')
  
  // Add Cross-Origin headers to help with iframe content
  response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none')
  response.headers.set('Cross-Origin-Opener-Policy', 'unsafe-none')
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
  
  // Add cache control headers to prevent stale responses during navigation
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  
  // Fix for client-side navigation issues
  // Allow prefetching and client-side navigation to work properly
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', '*')
  
  // Add service worker headers for better PWA support
  response.headers.set('Service-Worker-Allowed', '/')

  return response
}

// Specify which paths this middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)',
  ],
}