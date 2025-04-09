/**
 * Google Maps Embed Fix
 * This script helps ensure Google Maps embeds work properly in production environments
 * by addressing common iframe loading issues and animation timing errors.
 */

(function() {
  // Execute immediately to fix timing issues before they occur
  console.log('Google Maps fix script running...');
  
  // Fix for the specific useManualTiming error
  // This directly patches the exact pattern causing the error
  window.l = window.l || {};
  window.n = window.n || {};
  window.n.timestamp = window.n.timestamp || (window.performance ? window.performance.now() : Date.now());
  
  // Define useManualTiming globally to prevent errors
  window.useManualTiming = function(timestamp) {
    return timestamp || (window.performance ? window.performance.now() : Date.now());
  };
  
  // Make l.useManualTiming safe
  Object.defineProperty(window.l, 'useManualTiming', {
    get: function() {
      return function(timestamp) {
        return timestamp || window.n.timestamp || (window.performance ? window.performance.now() : Date.now());
      };
    },
    set: function(val) {
      // Allow setting but ensure it's always a function
      if (typeof val !== 'function') {
        val = function(timestamp) {
          return timestamp || (window.performance ? window.performance.now() : Date.now());
        };
      }
    },
    configurable: true
  });
  
  // Create a safe version of performance.now
  const originalPerformanceNow = window.performance && window.performance.now ? 
    window.performance.now.bind(window.performance) : function() { return Date.now(); };
  
  if (window.performance) {
    window.performance.now = function() {
      try {
        return originalPerformanceNow();
      } catch (e) {
        return Date.now();
      }
    };
  }
  
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Find all Google Maps iframes
    const mapIframes = document.querySelectorAll('iframe[src*="google.com/maps"]');
    
    // Process each iframe
    mapIframes.forEach(iframe => {
      // Ensure proper loading attribute
      if (!iframe.hasAttribute('loading')) {
        iframe.setAttribute('loading', 'lazy');
      }
      
      // Ensure proper referrer policy
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      
      // Add event listeners to detect loading issues
      iframe.addEventListener('load', function() {
        console.log('Google Maps iframe loaded successfully');
        
        // Reapply timing fixes after map loads
        window.l = window.l || {};
        window.n = window.n || {};
        window.n.timestamp = window.n.timestamp || (window.performance ? window.performance.now() : Date.now());
        
        // Inject a script to fix timing inside the iframe if possible
        try {
          if (iframe.contentWindow && iframe.contentWindow.document) {
            const fixScript = document.createElement('script');
            fixScript.textContent = `
              // Fix timing issues
              window.l = window.l || {};
              window.n = window.n || {};
              window.n.timestamp = window.n.timestamp || (window.performance ? window.performance.now() : Date.now());
              window.useManualTiming = function(timestamp) {
                return timestamp || (window.performance ? window.performance.now() : Date.now());
              };
              console.log('Applied iframe timing fix');
            `;
            iframe.contentWindow.document.head.appendChild(fixScript);
          }
        } catch (e) {
          // Cross-origin restrictions may prevent this
          console.log('Could not inject timing fix into iframe (expected due to security)');
        }
      });
      
      iframe.addEventListener('error', function(e) {
        console.error('Error loading Google Maps iframe:', e);
        // Attempt to reload the iframe if it fails
        setTimeout(() => {
          const originalSrc = iframe.src;
          iframe.src = '';
          setTimeout(() => {
            iframe.src = originalSrc;
          }, 100);
        }, 1000);
      });
    });
    
    // Inject a script element with direct fixes for the animation timing
    const fixScript = document.createElement('script');
    fixScript.textContent = `
      // Direct fix for the specific line causing errors
      (function() {
        // Create safe versions of all objects and functions in the error path
        window.l = window.l || {};
        window.n = window.n || {};
        window.n.timestamp = window.n.timestamp || (window.performance ? window.performance.now() : Date.now());
        
        // Create a safe wrapper for the problematic line
        const originalGetTimestamp = Object.getOwnPropertyDescriptor(window, 'performance')?.get || 
                                    function() { return { now: function() { return Date.now(); } }; };
        
        // Override performance to ensure now() never fails
        Object.defineProperty(window, 'performance', {
          get: function() {
            try {
              const perf = originalGetTimestamp();
              if (!perf.now || typeof perf.now !== 'function') {
                perf.now = function() { return Date.now(); };
              }
              return perf;
            } catch (e) {
              return { now: function() { return Date.now(); } };
            }
          },
          configurable: true
        });
        
        // Directly patch the problematic pattern
        const safeGetTimestamp = function() {
          try {
            if (window.l && typeof window.l.useManualTiming === 'function') {
              return window.l.useManualTiming(window.n.timestamp);
            } else if (window.n && window.n.timestamp) {
              return window.n.timestamp;
            } else if (window.performance && typeof window.performance.now === 'function') {
              return window.performance.now();
            } else {
              return Date.now();
            }
          } catch (e) {
            return Date.now();
          }
        };
        
        // Add a global helper to safely execute the problematic line
        window._getSafeTimestamp = safeGetTimestamp;
        
        console.log('Applied direct fix for animation timing');
      })();
    `;
    
    // Add the fix script to the document
    document.head.insertBefore(fixScript, document.head.firstChild);
  });
})();
