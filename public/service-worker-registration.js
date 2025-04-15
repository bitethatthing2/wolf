/**
 * Service Worker Registration for Side Hustle Bar
 * This script registers the service worker for PWA functionality
 * Version: 2.0.0
 */

// Create a console logger with app branding
const logger = {
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

// Check if we're in development mode
const isDevelopment = 
  typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' || 
   window.location.hostname.includes('.local'));

// Service worker version for tracking updates
const SW_VERSION = '2.0.0';

// Track registration status to prevent duplicate registrations
let serviceWorkerRegistered = false;

// Create custom event to notify the app when service worker is ready
const swReadyEvent = new CustomEvent('swReady', { detail: { version: SW_VERSION } });

// Function to register the service worker
function registerServiceWorker() {
  if (serviceWorkerRegistered) return Promise.resolve(null);
  
  return navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(function(registration) {
      serviceWorkerRegistered = true;
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
              // New content available - create custom UI notification instead of alert
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

// Register service workers when the page loads
if ('serviceWorker' in navigator) {
  // Wait for window to load to avoid competing with critical resources
  window.addEventListener('load', function() {
    // In development mode, we can still register but with warning
    if (isDevelopment) {
      logger.info('Development mode detected - service worker will still be registered but may have limited functionality');
      logger.info('For full PWA testing:');
      logger.info('1. Use a secure context (HTTPS or localhost)');
      logger.info('2. Consider using production mode for full testing');
      
      // Small delay to ensure we don't block page load
      setTimeout(() => {
        registerServiceWorker().catch(err => 
          logger.error(`Error in development registration: ${err}`)
        );
      }, 1000);
    } else {
      // In production, register immediately
      registerServiceWorker().catch(err => 
        logger.error(`Error in production registration: ${err}`)
      );
    }
  });
  
  // Check for service worker updates every hour
  setInterval(() => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CHECK_FOR_UPDATES' });
    }
  }, 60 * 60 * 1000); // Check every hour
}

// Create a unified install prompt handler
const pwaInstallHandler = {
  deferredPrompt: null,
  isBeforeInstallPromptSupported: 'onbeforeinstallprompt' in window,
  
  // Method to check if user is on iOS
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },
  
  // Method to check if the app is installed
  isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           navigator.standalone === true;
  },
  
  // Method to request installation (for Android/desktop)
  promptInstall() {
    if (!this.deferredPrompt) {
      logger.info('No installation prompt available');
      return Promise.resolve(false);
    }
    
    return this.deferredPrompt.prompt()
      .then(() => this.deferredPrompt.userChoice)
      .then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          logger.success('User accepted app install');
          this.deferredPrompt = null;
          window.dispatchEvent(new CustomEvent('appInstalled', { 
            detail: { source: 'browser-prompt' } 
          }));
          return true;
        } else {
          logger.info('User dismissed app install');
          window.dispatchEvent(new CustomEvent('appInstallDeclined', { 
            detail: { source: 'browser-prompt' } 
          }));
          return false;
        }
      })
      .catch(err => {
        logger.error(`Install prompt error: ${err}`);
        return false;
      });
  }
};

// Set up the beforeinstallprompt event listener
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Store the event for later use
  pwaInstallHandler.deferredPrompt = e;
  
  // Notify the app that installation is available
  window.dispatchEvent(new CustomEvent('appInstallAvailable', { 
    detail: { platform: 'android-or-desktop' } 
  }));
  
  logger.info('Install prompt captured and ready');
});

// Listen for app installed event
window.addEventListener('appinstalled', (event) => {
  pwaInstallHandler.deferredPrompt = null;
  logger.success('PWA was installed successfully');
  
  // Notify app components that installation succeeded
  window.dispatchEvent(new CustomEvent('appInstallSucceeded', { 
    detail: { timestamp: Date.now() } 
  }));
  
  // Track installation if analytics are available
  if (typeof gtag === 'function') {
    gtag('event', 'pwa_install', {
      'event_category': 'engagement',
      'event_label': 'PWA Installation'
    });
  }
});

// Make the handler available globally
window.pwaInstallHandler = pwaInstallHandler;
