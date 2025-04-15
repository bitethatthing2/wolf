/**
 * Side Hustle Bar Service Worker
 * This service worker handles caching, offline functionality, and coordinates with Firebase for push notifications
 * IMPORTANT: This is the standardized service worker file that should be used for all PWA functionality
 * Version: 3.0.0
 */

// Import CSP fix for Elfsight
importScripts('./only_these/csp-fix.js');

// Check if we're in development mode
const isDevelopment = self.location.hostname === 'localhost' || 
                      self.location.hostname === '127.0.0.1' || 
                      self.location.hostname.includes('.local');

// Service worker version for cache management
const SW_VERSION = '3.0.0'; // Updated for service worker consolidation
const CACHE_NAME = 'side-hustle-cache-v3'; // Updated cache version

// Log service worker initialization with version
console.log(`[Service Worker v${SW_VERSION}] Initializing...`);

// Initialize service worker state
self.state = {
  initialized: false,
  firebaseConfigured: false,
  version: SW_VERSION,
  startTime: Date.now()
};

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/elfsight-fix.js',
  '/only_these/csp-fix.js',
  '/app_icon_large.png',
  '/service-worker-registration.js',
  '/pwa-install-helper.js',
  '/only_these/notification-badge.png',
  '/only_these/notification-icon-android.png',
  '/only_these/notification-icon-ios.png',
  '/ios-add-homescreen-screenshot.png',
  '/ios-share-button.png',
  '/ios_add_to_homescreen_dark.png',
  '/ios_add_to_homescreen_light.png',
  '/app-install-android-dark.png',
  '/app-install-android-light.png',
  '/app-install-ios-dark.png',
  '/app-install-ios-light.png'
];

// External domains to exclude from caching (to prevent CORS issues)
const EXTERNAL_DOMAINS = [
  // Instagram domains
  'instagram.com',
  'cdninstagram.com',
  'api.instagram.com',
  
  // Google services 
  'google.com',
  'googleapis.com',
  'gstatic.com',
  'maps.google.com',
  'maps.googleapis.com',
  'lh3.googleusercontent.com',
  
  // Elfsight domains
  'elfsight.com',
  'static.elfsight.com',
  
  // Other third-party services
  'youtube.com',
  'youtu.be'
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
        
        // Cache files individually to prevent one failure from breaking the whole process
        const cachePromises = PRECACHE_ASSETS.map(url => {
          return fetch(url)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Request for ${url} returned status ${response.status}`);
              }
              return cache.put(url, response);
            })
            .catch(error => {
              console.error(`[Service Worker] Failed to cache ${url}:`, error);
              // Continue despite the error
              return Promise.resolve();
            });
        });
        
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
      })
      .catch((error) => {
        console.error('[Service Worker] Precaching failed:', error);
        // Installation continues despite errors
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log(`[Service Worker v${SW_VERSION}] Activating new service worker...`);
  
  // Claim clients immediately
  event.waitUntil(self.clients.claim());
  
  // In development, don't do cache cleanup
  if (isDevelopment) {
    console.log(`[Service Worker v${SW_VERSION}] Development mode - skipping cache cleanup`);
    
    // Mark as initialized even in development
    self.state.initialized = true;
    
    // Notify any connected clients
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SERVICE_WORKER_ACTIVE',
          version: SW_VERSION,
          environment: 'development'
        });
      });
    });
    
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
            console.log(`[Service Worker v${SW_VERSION}] Deleting old cache:`, name);
            return caches.delete(name);
          })
        );
      })
      .then(() => {
        console.log(`[Service Worker v${SW_VERSION}] Activation complete`);
        
        // Enable navigation preload if supported
        let preloadPromise = Promise.resolve();
        if (self.registration.navigationPreload) {
          preloadPromise = self.registration.navigationPreload.enable();
        }
        
        return preloadPromise;
      })
      .then(() => {
        // Mark as initialized
        self.state.initialized = true;
        
        // Notify any connected clients that the service worker is active
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SERVICE_WORKER_ACTIVE',
              version: SW_VERSION,
              environment: 'production',
              cacheVersion: CACHE_NAME,
              timestamp: Date.now()
            });
          });
        });
      })
  );
});

// Special handling for external domains that should bypass the service worker
const isExternalDomainRequest = (url) => {
  return EXTERNAL_DOMAINS.some(domain => url.hostname.includes(domain));
};

// Fetch event - handle network requests with cache fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Special handling for external domain requests (Elfsight, Google, etc.)
  if (isExternalDomainRequest(url)) {
    // For external domain requests, bypass the service worker completely
    // This prevents CORS issues and cache errors
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
              return caches.match('/apple-touch-icon.png')
                .catch(() => {
                  // If fallback image not found, return a response with a transparent 1x1 pixel
                  const transparentPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                  return fetch(transparentPixel);
                });
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
  
  // Handle update check requests
  if (event.data && event.data.type === 'CHECK_FOR_UPDATES') {
    console.log(`[Service Worker v${SW_VERSION}] Checking for updates...`);
    self.registration.update()
      .then(() => console.log(`[Service Worker v${SW_VERSION}] Update check complete`))
      .catch(err => console.error(`[Service Worker v${SW_VERSION}] Update check failed:`, err));
  }
  
  // Handle Firebase config updates
  if (event.data && event.data.type === 'CONFIG_FIREBASE') {
    console.log(`[Service Worker v${SW_VERSION}] Received Firebase config`);
    
    // Store the config internally for future use
    self.state.firebaseConfig = event.data.config;
    self.state.firebaseConfigured = true;
    
    // Try to initialize Firebase directly if it's already imported
    if (typeof firebase !== 'undefined' && firebase.messaging) {
      try {
        console.log(`[Service Worker v${SW_VERSION}] Updating Firebase configuration directly`);
        firebase.initializeApp(event.data.config);
      } catch (err) {
        // Firebase might already be initialized, ignore this error
        console.log(`[Service Worker v${SW_VERSION}] Firebase already initialized`);
      }
    }
    
    // Forward this message to any client windows that might be listening
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'FIREBASE_CONFIG_RECEIVED',
          timestamp: Date.now()
        });
      });
    });
  }
  
  // Handle Elfsight domains configuration
  if (event.data && event.data.type === 'ELFSIGHT_DOMAINS') {
    console.log(`[Service Worker v${SW_VERSION}] Received Elfsight domains config`);
    // Update external domains list with Elfsight domains
    if (Array.isArray(event.data.domains)) {
      event.data.domains.forEach(domain => {
        if (!EXTERNAL_DOMAINS.includes(domain)) {
          EXTERNAL_DOMAINS.push(domain);
        }
      });
    }
  }
  
  // Handle initialization status checks
  if (event.data && event.data.type === 'CHECK_INITIALIZATION') {
    console.log(`[Service Worker v${SW_VERSION}] Initialization status check`);
    
    const status = {
      version: SW_VERSION,
      initialized: self.state.initialized,
      firebaseConfigured: self.state.firebaseConfigured,
      uptime: Date.now() - self.state.startTime,
      externalDomains: EXTERNAL_DOMAINS.length
    };
    
    // Send status back to requesting client
    if (event.source) {
      event.source.postMessage({
        type: 'INITIALIZATION_STATUS',
        status: status
      });
    }
  }
});

// Handle push events and coordinate with Firebase
self.addEventListener('push', (event) => {
  // We don't directly handle push events here, as they're managed by firebase-messaging-sw.js
  // But we log them for debugging purposes
  console.log('[Service Worker] Push event received');
});

// Handle notification clicks and coordinate with Firebase
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event);
  
  // Close the notification
  event.notification.close();
  
  // Get the URL from the notification data
  const url = event.notification.data?.url || '/';
  
  // Focus or open a window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Try to focus an existing window
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no matching window, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
