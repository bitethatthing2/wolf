/**
 * Service Worker Initialization
 * This script helps ensure proper service worker registration and handling
 * Updated for compatibility with Next.js 15.x
 */

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // Check if navigation preload is supported
    const hasNavigationPreloadSupport = 'navigationPreload' in navigator.serviceWorker;
    if (hasNavigationPreloadSupport) {
      console.log('Navigation Preload is supported in this browser');
    }

    // First, check if we already have a service worker
    navigator.serviceWorker.getRegistration().then(existingReg => {
      if (existingReg && existingReg.active) {
        console.log('Service Worker already registered with scope:', existingReg.scope);
        
        // Send configurations to the existing service worker
        try {
          if (window.firebaseConfig) {
            existingReg.active.postMessage({
              type: 'CONFIG_FIREBASE',
              config: window.firebaseConfig
            });
          }
        } catch (error) {
          console.warn('Error sending config to existing service worker:', error);
        }
        
        return existingReg;
      } else {
        // If not registered yet, register it
        return navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
      }
    })
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Ensure the service worker fix is imported
        if (registration.active) {
          registration.active.postMessage({
            type: 'IMPORT_SCRIPTS',
            scripts: ['/service-worker-fix.js']
          });
          
          // Also send Firebase config if available
          try {
            // Send Firebase config if available
            if (window.firebaseConfig) {
              registration.active.postMessage({
                type: 'CONFIG_FIREBASE',
                config: window.firebaseConfig
              });
            }
            
            // Send information about Elfsight to the service worker
            registration.active.postMessage({
              type: 'ELFSIGHT_DOMAINS',
              domains: [
                'elfsight.com',
                'static.elfsight.com',
                'apps.elfsight.com',
                'service.elfsight.com',
                'elfsightcdn.com'
              ]
            });
          } catch (error) {
            console.warn('Error sending config to service worker:', error);
          }
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
