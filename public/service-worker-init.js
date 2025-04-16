/**
 * Service Worker Initialization
 * This script standardizes service worker registration and handling
 * Updated for consolidation on sw.js as the single service worker file
 * Version: 3.0.0
 */

// Global-safe logger pattern
window.logger = window.logger || {
  info: (message) => console.log('%c🐺 PWA %c' + message, 
    'background:#222;color:#bada55;padding:2px 4px;border-radius:3px', 
    'color:#888;padding:2px'),
  error: (message) => console.error('%c🐺 PWA Error %c' + message, 
    'background:#f44336;color:#fff;padding:2px 4px;border-radius:3px', 
    'color:#f44336;padding:2px'),
  success: (message) => console.log('%c🐺 PWA Success %c' + message, 
    'background:#4CAF50;color:#fff;padding:2px 4px;border-radius:3px', 
    'color:#4CAF50;padding:2px')
};
const logger = window.logger;

// Use the global app initialization state
window.__wolfAppInit = window.__wolfAppInit || {
  errorComponentsInitialized: false,
  serviceWorkerRegistered: false,
  serviceWorkerRegistering: false,
  pushNotificationsInitialized: false,
  polyfillsLoaded: false,
  errors: []
};

// Check if we're in development mode
const isDevelopment = 
  typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname.includes('.local'));

// Service worker version for tracking updates
const SW_VERSION = '3.0.0';

// Track registration status to prevent duplicate registrations
let serviceWorkerRegistered = false;

// Create custom event to notify the app when service worker is ready
const swReadyEvent = new CustomEvent('swReady', { detail: { version: SW_VERSION } });

// Function to register the service worker with standardized paths
function registerServiceWorker() {
  if (serviceWorkerRegistered) {
    logger.info('Service worker already registered, skipping registration');
    return Promise.resolve(null);
  }
  
  // Mark registration as in progress
  window.__wolfAppInit.serviceWorkerRegistering = true;
  
  // Check if we already have a service worker registration
  return navigator.serviceWorker.getRegistration()
    .then(existingReg => {
      // If we have a registration but the scope doesn't match, unregister it
      if (existingReg && !existingReg.scope.endsWith('/')) {
        logger.info(`Found service worker with incorrect scope: ${existingReg.scope}, unregistering`);
        return existingReg.unregister().then(() => null);
      }
      
      // If we have a valid registration, use it
      if (existingReg && existingReg.active) {
        logger.success(`Using existing service worker registration (scope: ${existingReg.scope})`);
        
        // Verify the service worker is the correct one by checking its script URL
        return existingReg.active.scriptURL.includes('/sw.js') ? 
          existingReg : 
          existingReg.unregister().then(() => null);
      }
      
      return null;
    })
    .then(existingReg => {
      if (existingReg) {
        return existingReg;
      }
      
      // If no registration exists or we unregistered the previous one, register sw.js
      logger.info('Registering new service worker...');
      return navigator.serviceWorker.register('/sw.js', { scope: '/' });
    })
    .then(function(registration) {
      // Mark registration as complete
      serviceWorkerRegistered = true;
      window.__wolfAppInit.serviceWorkerRegistered = true;
      window.__wolfAppInit.serviceWorkerRegistering = false;
      
      logger.success(`Service Worker registered (scope: ${registration.scope})`);
      
      // Notify components that service worker is ready
      window.dispatchEvent(swReadyEvent);
      
      // Send Firebase config to service worker if available
      if (registration.active && window.firebaseConfig) {
        try {
          registration.active.postMessage({
            type: 'CONFIG_FIREBASE',
            config: window.firebaseConfig
          });
          logger.info('Firebase config sent to service worker');
          
          // Also send Elfsight domains for proper handling
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
        } catch (err) {
          logger.error(`Failed to send config to service worker: ${err}`);
        }
      }
      
      // Handle service worker updates
      registration.addEventListener('updatefound', function() {
        const installingWorker = registration.installing;
        
        installingWorker.addEventListener('statechange', function() {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content available - create custom UI notification
              const updateNotification = document.createElement('div');
              updateNotification.className = 'pwa-update-notification';
              updateNotification.innerHTML = `
                <div class="pwa-update-content">
                  <p>A new version of Side Hustle Bar is available!</p>
                  <div class="pwa-update-actions">
                    <button id="pwa-update-now">Update Now</button>
                    <button id="pwa-update-later">Later</button>
                  </div>
                </div>
              `;
              
              // Add styles for the notification
              const style = document.createElement('style');
              style.textContent = `
                .pwa-update-notification {
                  position: fixed;
                  bottom: 20px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: #1a1a1a;
                  color: white;
                  padding: 16px 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                  z-index: 9999;
                  font-family: system-ui, -apple-system, sans-serif;
                  animation: slide-up 0.3s ease;
                  max-width: 90%;
                  width: 360px;
                }
                .pwa-update-content p {
                  margin: 0 0 12px 0;
                  font-size: 14px;
                }
                .pwa-update-actions {
                  display: flex;
                  gap: 10px;
                  justify-content: flex-end;
                }
                .pwa-update-actions button {
                  background: #333;
                  border: none;
                  color: white;
                  padding: 8px 16px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 13px;
                  transition: background 0.2s;
                }
                .pwa-update-actions button:hover {
                  background: #444;
                }
                #pwa-update-now {
                  background: #4CAF50;
                }
                #pwa-update-now:hover {
                  background: #3d8b40;
                }
                @media (prefers-color-scheme: light) {
                  .pwa-update-notification {
                    background: white;
                    color: #1a1a1a;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                  }
                  .pwa-update-actions button {
                    background: #e0e0e0;
                    color: black;
                  }
                  .pwa-update-actions button:hover {
                    background: #d0d0d0;
                  }
                  #pwa-update-now {
                    background: #4CAF50;
                    color: white;
                  }
                  #pwa-update-now:hover {
                    background: #3d8b40;
                  }
                }
                @keyframes slide-up {
                  from { transform: translate(-50%, 100px); opacity: 0; }
                  to { transform: translate(-50%, 0); opacity: 1; }
                }
              `;
              
              document.head.appendChild(style);
              document.body.appendChild(updateNotification);
              
              // Add event listeners for buttons
              document.getElementById('pwa-update-now').addEventListener('click', function() {
                logger.info('User accepted update, reloading page');
                window.location.reload();
                updateNotification.remove();
              });
              
              document.getElementById('pwa-update-later').addEventListener('click', function() {
                logger.info('User postponed update');
                updateNotification.remove();
              });
              
              logger.info('New service worker content is available');
            } else {
              // Initial install complete
              logger.success('Service Worker installed for the first time');
            }
          }
        });
      });
      
      return registration;
    })
    .catch(function(error) {
      // Update state tracking
      window.__wolfAppInit.serviceWorkerRegistering = false;
      window.__wolfAppInit.errors.push('Service worker registration error: ' + error.message);
      
      logger.error(`Service Worker registration failed: ${error}`);
      return null;
    });
}

// Handle service worker updates
let refreshing = false;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (!refreshing) {
      refreshing = true;
      logger.info('Controller changed, reloading page');
      window.location.reload();
    }
  });
}

// Register service worker when the page loads
if ('serviceWorker' in navigator) {
  // Check if navigation preload is supported
  const hasNavigationPreloadSupport = 'navigationPreload' in navigator.serviceWorker;
  if (hasNavigationPreloadSupport) {
    logger.info('Navigation Preload is supported in this browser');
  }
  
  // Wait for window to load to avoid competing with critical resources
  window.addEventListener('load', function() {
    // Small delay to ensure we don't block page load
    setTimeout(() => {
      registerServiceWorker().catch(err => 
        logger.error(`Error in service worker registration: ${err}`)
      );
    }, isDevelopment ? 1000 : 200);
  });
  
  // Check for service worker updates every hour
  setInterval(() => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CHECK_FOR_UPDATES' });
    }
  }, 60 * 60 * 1000); // Check every hour
}

// Handle caching errors
window.addEventListener('unhandledrejection', function(event) {
  if (event.reason && event.reason.name === 'QuotaExceededError') {
    logger.warn('Cache storage quota exceeded, clearing caches');
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
