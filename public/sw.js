/* eslint-disable no-restricted-globals */

// IMPORTANT: This file is registered by service-worker-init.js
// Version for cache busting
const SW_VERSION = '1.0.0';
console.log(`[SW v${SW_VERSION}] Service Worker initializing...`);

// Import service worker fix for navigation preload
importScripts("./service-worker-fix.js");

// Import Firebase messaging service worker
importScripts("./firebase-messaging-sw.js");

// Cache name with version
const CACHE_NAME = 'wolf-cache-v1';

// Resources to cache (critical assets)
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/manifest.json'
];

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
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('wolf-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log(`[SW v${SW_VERSION}] Deleting old cache:`, cacheName);
          return caches.delete(cacheName);
        })
      );
    })
    .then(() => {
      console.log(`[SW v${SW_VERSION}] Service Worker activated`);
      return self.clients.claim();
    })
  );
});

// Fetch event - for offline capability
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (new URL(event.request.url).origin !== location.origin) {
    return;
  }
  
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For navigation requests, use the service-worker-fix.js handling
  if (event.request.mode === 'navigate') {
    // Navigation requests handled by service-worker-fix.js
    return;
  }
  
  // For images and static assets, use cache-first strategy
  if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|css|js)$/)) {
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
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return networkResponse;
          });
        })
        .catch(error => {
          console.error(`[SW v${SW_VERSION}] Cache fetch error:`, error);
          // Return a fallback
          return new Response('Network error occurred', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
              'Cache-Control': 'no-store'
            })
          });
        })
    );
    return;
  }
  
  // For other requests, use network-first strategy
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache the response for future use
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      })
      .catch(() => {
        // If network fails, try the cache
        return caches.match(event.request);
      })
  );
});

// Listen for messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle push events from Firebase Messaging
// These are already handled by firebase-messaging-sw.js imported above

console.log(`[SW v${SW_VERSION}] Service Worker initialized successfully`);