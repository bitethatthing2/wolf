/**
 * Push Notification Initialization Script
 * This script helps initialize Firebase Cloud Messaging for push notifications
 */

(function() {
  console.log('[Push Notification Init] Starting initialization');
  
  // Use the global app initialization state
  window.__wolfAppInit = window.__wolfAppInit || {
    errorComponentsInitialized: false,
    serviceWorkerRegistered: false,
    serviceWorkerRegistering: false,
    pushNotificationsInitialized: false,
    polyfillsLoaded: false,
    errors: []
  };
  
  // Create a helper for pushing notification status
  window.__wolfAppInit.pushNotificationStatus = {
    initialized: false,
    serviceWorkerRegistered: false,
    permissionGranted: false,
    error: null,
    lastToken: null,
    retryCount: 0
  };
  
  // Create a global object for legacy support
  window.pushNotificationStatus = window.__wolfAppInit.pushNotificationStatus;
  
  // Function to extract Firebase config from environment
  function getFirebaseConfig() {
    // Handle Next.js environment variables
    const getEnvVar = (name) => {
      // Check if we have process.env from Next.js
      if (typeof process !== 'undefined' && process.env && process.env[name]) {
        return process.env[name];
      }
      
      // Check for window.__ENV from runtime environment
      if (window.__ENV && window.__ENV[name]) {
        return window.__ENV[name];
      }
      
      // Check for window.env as a fallback
      if (window.env && window.env[name]) {
        return window.env[name];
      }
      
      // Hardcoded fallback values for development and testing
      const fallbacks = {
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': '11762649284903810197',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID': 'new1-f04b3',
        'NEXT_PUBLIC_FIREBASE_API_KEY': 'AIzaSyBQwcudJ_aZl5o6i_FfsdsnaMxhjl3MjuE',
        'NEXT_PUBLIC_FIREBASE_APP_ID': '1:11762649284903810197:web:c7e4a1f3b3e6e2a28e2626'
      };
      
      return fallbacks[name] || '';
    };
    
    return {
      messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
      projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
      apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'), 
      appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID')
    };
  }
  
  // Wait for service worker registration
  function initializeWhenReady() {
    // If already initialized or retried too many times, abort
    if (window.__wolfAppInit.pushNotificationsInitialized) {
      return;
    }
    
    // Limit retry attempts
    if (window.__wolfAppInit.pushNotificationStatus.retryCount > 10) {
      console.error('[Push Notification Init] Too many retries, aborting initialization');
      window.__wolfAppInit.pushNotificationStatus.error = 'Initialization timeout';
      return;
    }
    
    window.__wolfAppInit.pushNotificationStatus.retryCount++;
    
    // If service worker is not available, abort
    if (!('serviceWorker' in navigator)) {
      console.log('[Push Notification Init] Service workers not supported');
      window.__wolfAppInit.pushNotificationStatus.error = 'Service workers not supported';
      return;
    }
    
    // First try the ready property for the current active service worker
    navigator.serviceWorker.ready
    .then(registration => {
      return { registration, fromReady: true };
    })
    .catch(() => {
      // Fallback to getting all service worker registrations
      return navigator.serviceWorker.getRegistrations()
      .then(registrations => {
        // Find one with our scope
        const registration = registrations.find(reg => 
          reg.scope.includes(window.location.origin) || 
          reg.scope === '/' || 
          reg.scope === window.location.origin + '/'
        );
        return { registration, fromReady: false };
      });
    })
    .then(({ registration, fromReady }) => {
      
      if (!registration) {
        console.log('[Push Notification Init] Service worker not registered yet, waiting...');
        
        // Check for registration again in 1 second
        setTimeout(initializeWhenReady, 1000);
        return;
      }
      
      console.log('[Push Notification Init] Found service worker registration', fromReady ? 'from navigator.serviceWorker.ready' : 'from registrations list');
      
      window.__wolfAppInit.pushNotificationStatus.serviceWorkerRegistered = true;
      window.__wolfAppInit.serviceWorkerRegistered = true;
      console.log('[Push Notification Init] Service worker found with scope:', registration.scope);
      
      // Send Firebase configuration to service worker
      try {
        if (registration.active) {
          // Get Firebase configuration 
          const config = getFirebaseConfig();
          
          // Store config for later use
          window.firebaseConfig = config;
          
          if (config.messagingSenderId && config.projectId) {
            console.log('[Push Notification Init] Sending Firebase config to service worker');
            registration.active.postMessage({
              type: 'CONFIG_FIREBASE',
              config: config
            });
          } else {
            console.warn('[Push Notification Init] Firebase config incomplete:', 
              config.messagingSenderId ? 'Has sender ID' : 'Missing sender ID',
              config.projectId ? 'Has project ID' : 'Missing project ID'
            );
          }
        }
      } catch (err) {
        console.warn('[Push Notification Init] Error sending config to service worker:', err);
      }
      
      // Check notification permission status
      if (Notification.permission === 'granted') {
        window.__wolfAppInit.pushNotificationStatus.permissionGranted = true;
        console.log('[Push Notification Init] Notification permission already granted');
      } else if (Notification.permission === 'denied') {
        window.__wolfAppInit.pushNotificationStatus.error = 'Notification permission denied';
        console.log('[Push Notification Init] Notification permission denied');
      } else {
        console.log('[Push Notification Init] Notification permission not determined yet');
      }
      
      // Mark as initialized
      window.__wolfAppInit.pushNotificationsInitialized = true;
      window.__wolfAppInit.pushNotificationStatus.initialized = true;
      console.log('[Push Notification Init] Initialization complete');
      
      // Trigger notification ready event
      const readyEvent = new CustomEvent('notificationsReady');
      window.dispatchEvent(readyEvent);
      
    }).catch(err => {
      window.__wolfAppInit.pushNotificationStatus.error = err.message;
      window.__wolfAppInit.errors.push('Push notification init error: ' + err.message);
      console.error('[Push Notification Init] Error getting service worker registration:', err);
      
      // Try a different approach after a few retries
      if (window.__wolfAppInit.pushNotificationStatus.retryCount > 3) {
        console.log('[Push Notification Init] Trying alternate service worker registration method');
        
        // Try to register the service worker directly as a last resort
        navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('[Push Notification Init] Registered service worker directly:', registration.scope);
          window.__wolfAppInit.serviceWorkerRegistered = true;
          window.__wolfAppInit.pushNotificationStatus.serviceWorkerRegistered = true;
          
          // Try again with the new registration
          setTimeout(initializeWhenReady, 1000);
        })
        .catch(regErr => {
          console.error('[Push Notification Init] Failed to register service worker directly:', regErr);
          
          // Give up after all attempts failed
          window.__wolfAppInit.pushNotificationStatus.error = 'Failed to initialize after multiple attempts';
        });
        return;
      }
      
      // Retry in case of temporary error
      setTimeout(initializeWhenReady, 2000);
    });
  }
  
  // Function to check if document and service worker are ready
  function checkReadiness() {
    // If service worker registration is already tracked as complete
    if (window.__wolfAppInit.serviceWorkerRegistered) {
      console.log('[Push Notification Init] Service worker ready, initializing push notifications');
      initializeWhenReady();
      return;
    }
    
    // If we've been waiting too long, try directly initializing
    if (window.__wolfAppInit.pushNotificationStatus.retryCount > 3) {
      console.log('[Push Notification Init] Service worker may be registered but not tracked, trying direct initialization');
      initializeWhenReady();
      return;
    }
    
    // Increment retry count
    window.__wolfAppInit.pushNotificationStatus.retryCount++;
    
    // Wait for service worker registration
    console.log('[Push Notification Init] Waiting for service worker registration...');
    setTimeout(checkReadiness, 1000);
  }
  
  // Start initialization when the page is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkReadiness);
  } else {
    checkReadiness();
  }
})();