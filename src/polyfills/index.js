/**
 * Consolidated polyfills for browser compatibility
 */

// Polyfill for require
if (typeof window !== 'undefined' && typeof window.require === 'undefined') {
  // Create a simple module cache
  const moduleCache = {};
  
  // Define specific module implementations
  moduleCache['@emotion/is-prop-valid'] = function(prop) {
    // A simplified version that passes common props
    if (!prop) return false;
    
    // Common SVG and HTML attributes that should pass validation
    const validProps = [
      'id', 'className', 'style', 'width', 'height', 'viewBox', 'fill', 'stroke',
      'strokeWidth', 'src', 'alt', 'href', 'target', 'rel', 'disabled', 'type',
      'value', 'checked', 'selected', 'onChange', 'onClick', 'onMouseEnter',
      'onMouseLeave', 'onFocus', 'onBlur', 'animate', 'variants', 'initial',
      'exit', 'transition', 'whileHover', 'whileTap', 'whileFocus', 'whileDrag'
    ];
    
    // Accept data-* attributes
    if (prop.startsWith('data-')) return true;
    
    // Accept aria-* attributes
    if (prop.startsWith('aria-')) return true;
    
    // Check against our list
    return validProps.includes(prop);
  };
  
  // Define our require implementation
  window.require = function(moduleName) {
    // Return cached implementation if available
    if (moduleCache[moduleName]) {
      return moduleCache[moduleName];
    }
    
    // For @emotion/is-prop-valid specifically
    if (moduleName === '@emotion/is-prop-valid') {
      return function(prop) { return true; }; // Accept all props as valid
    }
    
    // Return empty objects for unknown modules
    return {};
  };
}

// Polyfill for requestIdleCallback/cancelIdleCallback
if (typeof window !== 'undefined') {
  window.requestIdleCallback = window.requestIdleCallback || 
    function(cb) {
      return setTimeout(function() {
        const start = Date.now();
        cb({
          didTimeout: false,
          timeRemaining: function() {
            return Math.max(0, 50 - (Date.now() - start));
          }
        });
      }, 1);
    };

  window.cancelIdleCallback = window.cancelIdleCallback || 
    function(id) {
      clearTimeout(id);
    };
}

// Polyfill for navigation preload
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  if (!('navigationPreload' in navigator.serviceWorker)) {
    navigator.serviceWorker.navigationPreload = {
      enable: () => Promise.resolve(),
      disable: () => Promise.resolve(),
      getState: () => Promise.resolve({ enabled: false })
    };
  }
}

// Polyfill for URLPattern (used by Next.js's router)
if (typeof window !== 'undefined' && typeof window.URLPattern === 'undefined') {
  window.URLPattern = class URLPattern {
    constructor(input, baseURL) {
      this.pattern = input;
      this.baseURL = baseURL;
    }
    
    test(input) {
      // Simple implementation that always matches
      return true;
    }
    
    exec(input) {
      // Return a match object with empty groups
      return {
        pathname: { groups: {} },
        hash: { groups: {} },
        search: { groups: {} },
        hostname: { groups: {} }
      };
    }
  };
}

// Next.js error handlers
if (typeof window !== 'undefined') {
  // Required error components for Next.js
  if (typeof window.onRecoverableError === 'undefined') {
    window.onRecoverableError = (error) => {
      console.warn('[Polyfill] Recoverable error:', error);
    };
  }
  
  if (typeof window.onCaughtError === 'undefined') {
    window.onCaughtError = (error) => {
      console.error('[Polyfill] Caught error:', error);
    };
  }
  
  if (typeof window.callServer === 'undefined') {
    window.callServer = async function() {
      return Promise.resolve(null);
    };
  }
  
  // ServerComponentsClientHook
  if (typeof window.shouldRenderRootLevelErrorOverlay === 'undefined') {
    Object.defineProperty(window, 'shouldRenderRootLevelErrorOverlay', {
      get: function() {
        return false;
      },
      configurable: true
    });
  }
  
  // Ensure AppRouter exists
  if (typeof window.__next === 'undefined') {
    window.__next = {};
  }
  
  if (typeof window.__next.router === 'undefined') {
    window.__next.router = {
      route: window.location.pathname,
      pathname: window.location.pathname,
      query: {},
      asPath: window.location.pathname,
      push: (url) => { 
        console.log('[Polyfill] Router.push:', url);
        return Promise.resolve(true); 
      },
      replace: (url) => { 
        console.log('[Polyfill] Router.replace:', url);
        return Promise.resolve(true); 
      }
    };
  }
  
  // Ensure AppRouterActionQueue exists
  if (typeof window.AppRouterActionQueue === 'undefined') {
    window.AppRouterActionQueue = {
      queue: [],
      push: (fn) => {
        console.log('[Polyfill] AppRouterActionQueue.push');
        if (typeof fn === 'function') {
          setTimeout(fn, 0);
        }
      }
    };
  }
  
  // Ensure createMutableActionQueue exists
  if (typeof window.createMutableActionQueue === 'undefined') {
    window.createMutableActionQueue = () => {
      return {
        execute: (fn) => {
          console.log('[Polyfill] ActionQueue.execute');
          if (typeof fn === 'function') {
            setTimeout(fn, 0);
          }
          return Promise.resolve();
        },
        push: (fn) => {
          console.log('[Polyfill] ActionQueue.push');
          if (typeof fn === 'function') {
            setTimeout(fn, 0);
          }
        }
      };
    };
  }
}

export default {
  loaded: true
};