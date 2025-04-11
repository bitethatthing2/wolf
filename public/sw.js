/* eslint-disable no-restricted-globals */

// IMPORTANT: This file is registered by service-worker-init.js and polyfill-init.js
// Version for cache busting
const SW_VERSION = '2.0.0';
console.log(`[SW v${SW_VERSION}] Service Worker initializing...`);

// Record initialization time for debugging
const SW_INIT_TIME = Date.now();

// Import service worker fix for navigation preload
importScripts("./service-worker-fix.js");

// Import Firebase messaging service worker
importScripts("./firebase-messaging-sw.js");

// Cache name with version
const CACHE_NAME = 'wolf-cache-v2';
const DYNAMIC_CACHE = 'wolf-dynamic-v2';
const STATIC_CACHE = 'wolf-static-v2';

// Resources to cache (critical assets)
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/polyfill-init.js',
  '/navigation-error-fix.js', 
  '/service-worker-fix.js',
  '/firebase-messaging-sw.js',
  '/push-notification-init.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/manifest.json'
];

// Track readiness state
let isReady = false;
let pendingMessages = [];

// Install event - cache critical resources
self.addEventListener('install', event => {
  console.log(`[SW v${SW_VERSION}] Service Worker installing...`);
  
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  // Cache critical resources
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(`[SW v${SW_VERSION}] Opened cache ${CACHE_NAME}`);
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .catch(error => {
        console.error(`[SW v${SW_VERSION}] Precaching failed:`, error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log(`[SW v${SW_VERSION}] Service Worker activating...`);
  
  // Clean up old caches
  event.waitUntil(
    Promise.all([
      // Enable navigation preload if supported
      self.registration.navigationPreload && 
        self.registration.navigationPreload.enable().catch(err => {
          console.log('[SW] Navigation preload error:', err);
        }),
        
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName.startsWith('wolf-') && 
                  !cacheName.includes(SW_VERSION) &&
                  cacheName !== CACHE_NAME &&
                  cacheName !== DYNAMIC_CACHE &&
                  cacheName !== STATIC_CACHE;
          }).map(cacheName => {
            console.log(`[SW v${SW_VERSION}] Deleting old cache:`, cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      
      // Claim all clients
      self.clients.claim()
    ])
    .then(() => {
      console.log(`[SW v${SW_VERSION}] Service Worker activated successfully`);
      isReady = true;
      
      // Process any pending messages
      processQueuedMessages();
    })
    .catch(err => {
      console.error(`[SW v${SW_VERSION}] Activation error:`, err);
      isReady = true; // Still mark as ready so we don't block indefinitely
      processQueuedMessages();
    })
  );
});

// Process queued messages
function processQueuedMessages() {
  if (pendingMessages.length > 0) {
    console.log(`[SW v${SW_VERSION}] Processing ${pendingMessages.length} queued messages`);
    pendingMessages.forEach(msg => processMessage(msg.data, msg.source));
    pendingMessages = [];
  }
}

// Process a client message
function processMessage(data, source) {
  if (!data || !data.type) return;
  
  console.log(`[SW v${SW_VERSION}] Processing message: ${data.type}`);
  
  switch (data.type) {
    case 'CONFIG_FIREBASE':
      // Handle Firebase config - this is forwarded to firebase-messaging-sw.js
      if (data.config) {
        console.log(`[SW v${SW_VERSION}] Received Firebase config`);
      }
      break;
      
    case 'SKIP_WAITING':
      // Skip waiting and activate immediately
      self.skipWaiting();
      break;
      
    case 'PING':
      // Simple ping to check service worker is alive
      if (source && source.postMessage) {
        console.log(`[SW v${SW_VERSION}] Received ping, responding with pong`);
        source.postMessage({ type: 'PONG', time: Date.now() });
      }
      break;
      
    case 'CACHE_URLS':
      // Cache specific URLs
      if (data.urls && Array.isArray(data.urls)) {
        caches.open(CACHE_NAME).then(cache => {
          console.log(`[SW v${SW_VERSION}] Caching ${data.urls.length} URLs`);
          return cache.addAll(data.urls);
        });
      }
      break;
      
    case 'CLEAR_CACHE':
      // Clear specific cache
      if (data.cacheName) {
        caches.delete(data.cacheName).then(success => {
          console.log(`[SW v${SW_VERSION}] Cache ${data.cacheName} cleared: ${success}`);
        });
      }
      break;
  }
}

// Fetch event - for offline capability
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (event.request.url.startsWith('http') && 
      new URL(event.request.url).origin !== location.origin) {
    return;
  }
  
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Check for special navigation header
  const isNextNavigation = event.request.headers.get('X-Next-Navigation') === 'true';
  
  // For navigation requests, use the service-worker-fix.js handling
  if (event.request.mode === 'navigate' || isNextNavigation) {
    // Navigation requests handled by service-worker-fix.js
    return;
  }
  
  // For images and static assets, use cache-first strategy
  if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            // Return from cache if available
            return response;
          }
          
          // Otherwise, fetch from network and cache
          return fetch(event.request).then(networkResponse => {
            // Check for valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Cache the response
            const responseToCache = networkResponse.clone();
            caches.open(STATIC_CACHE)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(err => {
                console.warn(`[SW v${SW_VERSION}] Error caching asset:`, err);
              });
            
            return networkResponse;
          });
        })
        .catch(error => {
          console.error(`[SW v${SW_VERSION}] Cache fetch error:`, error);
          
          // Return a fallback for images
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) {
            return caches.match('/img_placeholder_event_default.jpg');
          }
          
          // Return an error response for other assets
          return new Response('Network error occurred', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
              'Cache-Control': 'no-store',
              'X-SW-Error': error.message
            })
          });
        })
    );
    return;
  }
  
  // For API requests, use network-only strategy
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  // For other requests, use network-first strategy
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Only cache successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Cache the response for future use
        const responseToCache = response.clone();
        caches.open(DYNAMIC_CACHE)
          .then(cache => {
            cache.put(event.request, responseToCache);
          })
          .catch(err => {
            console.warn(`[SW v${SW_VERSION}] Error caching dynamic content:`, err);
          });
        
        return response;
      })
      .catch(() => {
        // If network fails, try the cache
        return caches.match(event.request).then(cacheResponse => {
          if (cacheResponse) {
            return cacheResponse;
          }
          
          // If not in cache, return a minimal error response
          return new Response(JSON.stringify({
            error: 'Network request failed',
            offline: true
          }), {
            status: 503,
            headers: new Headers({
              'Content-Type': 'application/json',
              'X-SW-Error': 'Network request failed'
            })
          });
        });
      })
  );
});

// Listen for messages from clients
self.addEventListener('message', event => {
  // If not ready, queue message for processing after activation
  if (!isReady) {
    pendingMessages.push({
      data: event.data,
      source: event.source
    });
    return;
  }
  
  // Process the message
  processMessage(event.data, event.source);
});

// Handle push events from Firebase Messaging
// These are already handled by firebase-messaging-sw.js imported above

// Periodic cache cleanup
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cleanup-caches') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            // Keep the current version caches
            return cacheName.startsWith('wolf-') && 
                  !cacheName.includes(SW_VERSION) &&
                  cacheName !== CACHE_NAME &&
                  cacheName !== DYNAMIC_CACHE &&
                  cacheName !== STATIC_CACHE;
          }).map(cacheName => {
            console.log(`[SW v${SW_VERSION}] Deleting old cache:`, cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});

// Statistics
const swStats = {
  version: SW_VERSION,
  initTime: SW_INIT_TIME,
  startTime: Date.now(),
  requests: 0,
  errors: 0,
  notifications: 0
};

console.log(`[SW v${SW_VERSION}] Service Worker initialized successfully (${Date.now() - SW_INIT_TIME}ms)`);