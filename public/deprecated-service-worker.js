/**
 * DEPRECATED: This file is being maintained only for backward compatibility.
 * Please use sw.js instead for all service worker functionality.
 * 
 * This file will be removed in a future update.
 */

// Redirect to the real service worker
self.addEventListener('install', event => {
  console.warn('[DEPRECATED service-worker.js] This service worker is deprecated. Please use sw.js instead.');
  
  // Skip waiting and immediately activate
  self.skipWaiting();
  
  // Unregister this service worker
  self.registration.unregister()
    .then(() => {
      console.log('[DEPRECATED service-worker.js] Successfully unregistered deprecated service worker');
      
      // Try to register the correct service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
          .then(reg => {
            console.log('[DEPRECATED service-worker.js] Registered correct service worker:', reg);
          })
          .catch(err => {
            console.error('[DEPRECATED service-worker.js] Failed to register correct service worker:', err);
          });
      }
    })
    .catch(err => {
      console.error('[DEPRECATED service-worker.js] Error unregistering:', err);
    });
});

// Handle activation just in case
self.addEventListener('activate', event => {
  console.warn('[DEPRECATED service-worker.js] Activated deprecated service worker. This should not happen.');
  
  // Unregister again just to be sure
  self.registration.unregister()
    .then(() => {
      console.log('[DEPRECATED service-worker.js] Unregistered on activate');
    });
});

// Handle fetch events by passing through to the network
self.addEventListener('fetch', event => {
  // Just use the network, don't attempt to cache or serve cached content
  event.respondWith(fetch(event.request));
});