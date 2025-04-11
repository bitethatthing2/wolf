/**
 * Early initialization of critical Next.js components and Service Worker
 * This script is designed to be loaded in the HTML head
 * before Next.js bundle to prevent "missing required error components" errors
 */

// Initialize required error components early
if (typeof window !== 'undefined') {
  // Create a global initialization state tracker
  window.__wolfAppInit = window.__wolfAppInit || {
    errorComponentsInitialized: false,
    serviceWorkerRegistered: false,
    serviceWorkerRegistering: false,
    pushNotificationsInitialized: false,
    polyfillsLoaded: false,
    errors: []
  };

  // Error handlers
  window.onRecoverableError = window.onRecoverableError || function(error) {
    console.warn('[Early Init] Recoverable error:', error);
  };
  
  window.onCaughtError = window.onCaughtError || function(error) {
    console.error('[Early Init] Caught error:', error);
  };
  
  window.callServer = window.callServer || async function() {
    return Promise.resolve(null);
  };
  
  // Server components
  window.shouldRenderRootLevelErrorOverlay = false;
  
  // Router init
  window.__next = window.__next || {
    router: {
      route: window.location.pathname,
      pathname: window.location.pathname,
      query: {},
      asPath: window.location.pathname,
      push: function(url) { return Promise.resolve(true); },
      replace: function(url) { return Promise.resolve(true); }
    }
  };
  
  // Action queue
  window.AppRouterActionQueue = window.AppRouterActionQueue || {
    queue: [],
    push: function(fn) { 
      if (typeof fn === 'function') setTimeout(fn, 0); 
    }
  };
  
  window.createMutableActionQueue = window.createMutableActionQueue || function() {
    return {
      execute: function(fn) { 
        if (typeof fn === 'function') setTimeout(fn, 0);
        return Promise.resolve();
      },
      push: function(fn) { 
        if (typeof fn === 'function') setTimeout(fn, 0);
      }
    };
  };
  
  // Initialize server data
  window.initialServerDataBuffer = window.initialServerDataBuffer || [];
  window.initialServerDataWriter = window.initialServerDataWriter || function() {};
  window.initialServerDataLoaded = window.initialServerDataLoaded || true;
  window.initialServerDataFlushed = window.initialServerDataFlushed || true;
  
  // Mark error components as initialized
  window.__wolfAppInit.errorComponentsInitialized = true;
  console.log('[Early Init] Next.js required components initialized');
  
  // Initialize service worker if supported
  function initServiceWorker() {
    // Skip if already registering
    if (window.__wolfAppInit.serviceWorkerRegistering) return;
    window.__wolfAppInit.serviceWorkerRegistering = true;
    
    if (!('serviceWorker' in navigator)) {
      console.log('[Early Init] Service workers not supported in this browser');
      window.__wolfAppInit.errors.push('Service workers not supported');
      return;
    }
    
    // Detect if we're on localhost
    const isLocalhost = 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1';
    
    // Only register in production (HTTPS) or on localhost
    if (window.location.protocol === 'https:' || isLocalhost) {
      console.log('[Early Init] Registering service worker');
      
      // Wait a short delay to let other scripts initialize
      setTimeout(() => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
          .then(registration => {
            console.log('[Early Init] Service Worker registered with scope:', registration.scope);
            window.__wolfAppInit.serviceWorkerRegistered = true;
            
            // Inject Firebase config if available
            if (registration.active && window.firebaseConfig) {
              try {
                registration.active.postMessage({
                  type: 'CONFIG_FIREBASE',
                  config: window.firebaseConfig
                });
                console.log('[Early Init] Sent Firebase config to service worker');
              } catch (err) {
                console.warn('[Early Init] Error sending config to service worker:', err);
              }
            }
            
            // Set up update handling
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[Early Init] New service worker available');
                  
                  // Store update available flag for later use
                  window.__wolfAppInit.updateAvailable = true;
                }
              });
            });
          })
          .catch(error => {
            console.error('[Early Init] Service Worker registration failed:', error);
            window.__wolfAppInit.errors.push('Service worker registration failed: ' + error.message);
            
            // Log specific error for localhost
            if (isLocalhost) {
              console.info('[Early Init] For local development:\n1. Use HTTPS with a local certificate\n2. Try Chrome with the --unsafely-treat-insecure-origin-as-secure flag');
            }
          })
          .finally(() => {
            window.__wolfAppInit.serviceWorkerRegistering = false;
          });
      }, 1000);
    } else {
      console.log('[Early Init] Service Worker registration skipped - requires HTTPS except on localhost');
      window.__wolfAppInit.errors.push('Service worker requires HTTPS');
      window.__wolfAppInit.serviceWorkerRegistering = false;
    }
  }
  
  // Run service worker initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceWorker);
  } else {
    initServiceWorker();
  }
}