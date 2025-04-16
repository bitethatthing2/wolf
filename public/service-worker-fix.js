/**
 * Service Worker Navigation Preload Fix
 * 
 * This script enhances the service worker with navigation preload support
 * to improve performance for navigation requests.
 */

// Enable navigation preload if supported
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.enable();
          console.log('[Service Worker] Navigation preload enabled');
        } catch (error) {
          console.error('[Service Worker] Navigation preload error:', error);
        }
      }
    })()
  );
});

// Handle navigation requests with improved error handling
self.addEventListener('fetch', event => {
  // Skip cross-origin requests to reduce risks
  if (new URL(event.request.url).origin !== location.origin) {
    return;
  }

  // Only handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Add a custom header to detect SW-processed requests
          const customHeaders = new Headers(event.request.headers);
          customHeaders.append('X-Handled-By-SW', 'true');
          
          // Create a modified request with our custom headers
          const modifiedRequest = new Request(event.request.url, {
            method: event.request.method,
            headers: customHeaders,
            mode: event.request.mode,
            credentials: event.request.credentials,
            redirect: event.request.redirect
          });

          // Try to use the preloaded response first if available
          if (event.preloadResponse) {
            try {
              const preloadResponse = await event.preloadResponse;
              if (preloadResponse) {
                console.log('[Service Worker] Using navigation preload response');
                return preloadResponse;
              }
            } catch (preloadError) {
              console.warn('[Service Worker] Preload failed, falling back:', preloadError);
            }
          }

          // If preload isn't available or failed, use network
          console.log('[Service Worker] Fetching from network:', event.request.url);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Fetch timeout')), 10000) // 10 second timeout
          );
          
          // Race the fetch against a timeout
          const networkResponse = await Promise.race([
            fetch(modifiedRequest, { cache: 'no-cache' }),
            timeoutPromise
          ]);
          
          // Clone the response so it can be used by the browser
          return networkResponse.clone();
        } catch (error) {
          console.error('[Service Worker] Navigation fetch failed:', error);
          
          // Check if we're offline and redirect to the fallback page if possible
          if (!navigator.onLine) {
            console.log('[Service Worker] Offline, returning cached home page if available');
            // Try to get home page from cache as fallback
            try {
              const cache = await caches.open('pages-cache');
              const cachedResponse = await cache.match('/');
              if (cachedResponse) {
                return cachedResponse;
              }
            } catch (cacheError) {
              console.error('[Service Worker] Cache retrieval failed:', cacheError);
            }
          }
          
          // Return an error response that tells the app to recover
          return new Response(
            `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Navigation Error</title>
                  <style>
                    body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f8f9fa; }
                    .container { max-width: 500px; text-align: center; padding: 2rem; border-radius: 0.5rem; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    h1 { font-size: 1.5rem; color: #333; }
                    p { color: #666; margin-bottom: 1.5rem; }
                    button { background: #000; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.25rem; cursor: pointer; font-weight: bold; }
                    button:hover { background: #222; }
                    @media (prefers-color-scheme: dark) {
                      body { background: #121212; }
                      .container { background: #1e1e1e; }
                      h1 { color: #fff; }
                      p { color: #aaa; }
                      button { background: #fff; color: #000; }
                      button:hover { background: #eee; }
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>Navigation Error</h1>
                    <p>We encountered a problem loading this page. This might be due to a network issue or a problem with cached data.</p>
                    <button onclick="window.location.reload()">Reload Page</button>
                  </div>
                  <script>
                    // Attempt to recover after a short delay
                    setTimeout(() => {
                      window.location.reload();
                    }, 3000);
                  </script>
                </body>
              </html>
            `,
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/html',
                'Cache-Control': 'no-store'
              })
            }
          );
        }
      })()
    );
  }
});

// Removed invalid <meta name="viewport"> tag from JS file. This file should not contain HTML meta tags.
