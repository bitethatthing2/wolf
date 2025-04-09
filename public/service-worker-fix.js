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

// Handle navigation requests with preload support
self.addEventListener('fetch', event => {
  // Only handle navigation requests with preloadResponse
  if (event.request.mode === 'navigate' && event.preloadResponse) {
    // Properly handle the preloadResponse promise
    event.respondWith(
      (async () => {
        try {
          // Try to use the preloaded response first
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            console.log('[Service Worker] Using navigation preload response');
            return preloadResponse;
          }

          // If preload isn't available, fall back to network
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.error('[Service Worker] Navigation preload failed:', error);
          
          // Last resort - try fetching from network again
          try {
            return await fetch(event.request);
          } catch (fetchError) {
            console.error('[Service Worker] Network fetch failed:', fetchError);
            // Return a fallback response if everything fails
            return new Response('Navigation error. Please try again.', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          }
        }
      })()
    );
  }
  // For other requests, let the default handlers work
});
