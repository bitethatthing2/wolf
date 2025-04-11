/**
 * Side Hustle Bar Service Worker
 * This is the main service worker file that handles caching and offline functionality
 */

// Service worker version for cache management
const SW_VERSION = '1.0.0';
const CACHE_NAME = 'side-hustle-cache-v1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icons/splash_screens/icon.png'
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Precaching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((name) => {
            return name !== CACHE_NAME;
          }).map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        
        // Enable navigation preload if supported
        if (self.registration.navigationPreload) {
          return self.registration.navigationPreload.enable();
        }
      })
      .then(() => {
        // Claim clients so the SW is in control immediately
        return self.clients.claim();
      })
  );
});

// Special handling for Elfsight API requests
const isElfsightRequest = (url) => {
  return url.hostname.includes('elfsight.com') || 
         url.hostname.includes('elfsightcdn.com') || 
         url.hostname.includes('instagram.com') || 
         url.hostname.includes('cdninstagram.com');
};

// Fetch event - handle network requests with cache fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Special handling for Elfsight and Instagram requests
  if (isElfsightRequest(url)) {
    // For Elfsight/Instagram requests, use network with long timeout
    // and don't cache to avoid CORS issues
    event.respondWith(
      fetch(event.request, { 
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Origin': self.location.origin,
          'Referer': self.location.origin
        }
      })
      .catch(error => {
        console.error('[Service Worker] Elfsight fetch failed:', error);
        // Return a minimal response to prevent UI blocking
        return new Response(
          JSON.stringify({ error: 'Failed to fetch from Elfsight/Instagram' }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }
  
  // For navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try to use navigation preload response if available
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          
          // Otherwise use network-first strategy for HTML
          const networkResponse = await fetch(event.request);
          
          // Cache the response for future use
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
          
          return networkResponse;
        } catch (error) {
          // If network fails, try to return cached page
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If no cached page, try to return the cached homepage
          const homepageResponse = await caches.match('/');
          if (homepageResponse) {
            return homepageResponse;
          }
          
          // If all else fails, return a custom offline page
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Side Hustle Bar - Offline</title>
                <style>
                  body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #000; color: #fff; }
                  .container { max-width: 500px; text-align: center; padding: 2rem; }
                  h1 { font-size: 1.5rem; margin-bottom: 1rem; }
                  p { margin-bottom: 1.5rem; opacity: 0.8; }
                  button { background: #fff; color: #000; border: none; padding: 0.75rem 1.5rem; border-radius: 0.25rem; cursor: pointer; font-weight: bold; }
                  button:hover { background: #eee; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>You're Offline</h1>
                  <p>Sorry, you can't access Side Hustle Bar right now because you're offline. Please check your connection and try again.</p>
                  <button onclick="window.location.reload()">Try Again</button>
                </div>
              </body>
            </html>`,
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
    return;
  }
  
  // For all other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response and update cache in background
          const updateCache = fetch(event.request)
            .then((networkResponse) => {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                })
                .catch((error) => {
                  console.error('[Service Worker] Cache update failed:', error);
                });
              return networkResponse;
            })
            .catch((error) => {
              console.error('[Service Worker] Network fetch failed:', error);
            });
            
          // Return cached response immediately
          return cachedResponse;
        }
        
        // If not in cache, fetch from network and cache
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache the fetched response
            if (networkResponse.ok) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                })
                .catch((error) => {
                  console.error('[Service Worker] Caching failed:', error);
                });
            }
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // For image requests, return a placeholder
            if (event.request.destination === 'image') {
              return new Response(
                `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="#eee"/>
                  <text x="50%" y="50%" font-family="sans-serif" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="#999">Offline</text>
                </svg>`,
                {
                  status: 503,
                  headers: { 'Content-Type': 'image/svg+xml' }
                }
              );
            }
            
            // For other requests, just propagate the error
            throw error;
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
