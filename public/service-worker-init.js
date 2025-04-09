/**
 * Service Worker Initialization
 * This script helps ensure proper service worker registration and handling
 */

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // Check if navigation preload is supported
    const hasNavigationPreloadSupport = 'navigationPreload' in navigator.serviceWorker;
    if (hasNavigationPreloadSupport) {
      console.log('Navigation Preload is supported in this browser');
    }

    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Ensure the service worker fix is imported
        if (registration.active) {
          registration.active.postMessage({
            type: 'IMPORT_SCRIPTS',
            scripts: ['/service-worker-fix.js']
          });
        }
        
        // Check for updates
        registration.addEventListener('updatefound', function() {
          const newWorker = registration.installing;
          console.log('Service Worker update found!');
          
          newWorker.addEventListener('statechange', function() {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New content is available; please refresh.');
              // You could show a notification to the user here
            }
          });
        });
      })
      .catch(function(error) {
        console.error('Service Worker registration failed:', error);
      });
      
    // Handle service worker updates
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      if (refreshing) return;
      refreshing = true;
      console.log('Controller changed, refreshing page');
      window.location.reload();
    });
  });
}

// Handle caching errors
window.addEventListener('unhandledrejection', function(event) {
  if (event.reason && event.reason.name === 'QuotaExceededError') {
    console.warn('Cache storage quota exceeded, clearing caches');
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      });
    }
  }
});
