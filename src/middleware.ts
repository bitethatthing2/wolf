import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the existing response headers
  const response = NextResponse.next()

  // Add CSP header
  const cspHeader = `
    default-src 'self' https://*.elfsight.com https://static.elfsight.com https://*.googleusercontent.com https://*.instagram.com https://*.cdninstagram.com https://*.gstatic.com https://*.firebase.googleapis.com https://maps.googleapis.com https://www.google.com;
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.elfsight.com https://static.elfsight.com https://*.elfsightcdn.com https://universe-static.elfsightcdn.com https://core.service.elfsight.com https://*.gstatic.com https://*.googleapis.com https://*.firebase.googleapis.com https://*.google.com https://g.doubleclick.net https://maps.googleapis.com;
    style-src 'self' 'unsafe-inline' https://*.elfsight.com https://fonts.googleapis.com https://*.gstatic.com https://*.google.com;
    img-src 'self' data: https://*.googleusercontent.com https://*.instagram.com https://*.cdninstagram.com https://*.elfsight.com https://*.elfsightcdn.com https://lh3.googleusercontent.com https://phosphor.utils.elfsightcdn.com https://*.service.elfsight.com https://*.googleapis.com https://*.ggpht.com https://*.google.com https://maps.gstatic.com blob:;
    font-src 'self' data: https://fonts.gstatic.com https://*.elfsight.com https://*.elfsightcdn.com;
    media-src 'self' https://video.wixstatic.com https://*.elfsight.com https://*.elfsightcdn.com blob:;
    connect-src 'self' https://*.elfsight.com https://widget-data.service.elfsight.com https://*.service.elfsight.com https://*.googleapis.com https://*.instagram.com https://*.gstatic.com https://*.firebase.googleapis.com https://lh3.googleusercontent.com https://scontent.cdninstagram.com https://core.service.elfsight.com https://maps.googleapis.com https://www.google.com https://g.doubleclick.net https://accounts.google.com;
    frame-src 'self' https://*.elfsight.com https://core.service.elfsight.com https://*.google.com https://g.doubleclick.net https://accounts.google.com https://www.gstatic.com https://maps.googleapis.com https://www.google.com/maps/;
    worker-src 'self' blob:;
    child-src 'self' blob: https://*.google.com https://maps.googleapis.com;
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
  response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')

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
