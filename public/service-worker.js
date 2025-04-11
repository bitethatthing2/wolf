/**
 * Side Hustle Bar Service Worker
 * This service worker handles caching and offline functionality
 */

// Check if we're in development mode
const isDevelopment = self.location.hostname === 'localhost' || 
                      self.location.hostname === '127.0.0.1' || 
                      self.location.hostname.includes('.local');

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

// Elfsight domains to exclude from caching
const ELFSIGHT_DOMAINS = [
  'elfsight.com',
  'elfsightcdn.com',
  'instagram.com',
  'cdninstagram.com',
  'widget-data.service.elfsight.com'
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing new service worker...');
  
  // Skip waiting to activate new service worker immediately
  self.skipWaiting();
  
  // In development, don't cache anything
  if (isDevelopment) {
    console.log('[Service Worker] Development mode - skipping cache setup');
    return;
  }
  
  // In production, cache essential files
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
      })
      .catch((error) => {
        console.error('[Service Worker] Precaching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating new service worker...');
  
  // Claim clients immediately
  event.waitUntil(self.clients.claim());
  
  // In development, don't do cache cleanup
  if (isDevelopment) {
    console.log('[Service Worker] Development mode - skipping cache cleanup');
    return;
  }
  
  // In production, clean up old caches
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
  );
});

// Special handling for Elfsight API requests
const isElfsightRequest = (url) => {
  return ELFSIGHT_DOMAINS.some(domain => url.hostname.includes(domain));
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
    // For Elfsight/Instagram requests, bypass the service worker completely
    // This prevents CORS issues and workbox errors
    return;
  }
  
  // In development, don't intercept any requests
  if (isDevelopment) {
    // Just let the browser handle all requests normally
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
            
          return cachedResponse;
        }
        
        // If not in cache, fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache the response for future use
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Only cache successful responses
                if (networkResponse.status === 200) {
                  cache.put(event.request, responseToCache);
                }
              })
              .catch((error) => {
                console.error('[Service Worker] Cache put failed:', error);
              });
              
            return networkResponse;
          })
          .catch((error) => {
            console.error('[Service Worker] Network fetch failed:', error);
            
            // For image requests, return a fallback image
            if (event.request.destination === 'image') {
              return caches.match('/icons/splash_screens/icon.png');
            }
            
            // For other assets, return a simple response
            return new Response('Network error occurred', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
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
