/**
 * Early initialization of critical Next.js components
 * This script is designed to be loaded in the HTML head
 * before Next.js bundle to prevent "missing required error components" errors
 */

// Initialize required error components early
if (typeof window !== 'undefined') {
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
  
  // Indicate initialization
  console.log('[Early Init] Next.js required components initialized');
}