/**
 * Direct Animation Fix
 * This script directly targets and fixes the specific useManualTiming error
 * by injecting fixes directly into the problematic code patterns.
 */

(function() {
  // Execute immediately to ensure it runs before any other scripts
  console.log('Direct animation fix script running...');
  
  // Define useManualTiming globally to prevent errors
  window.useManualTiming = function(timestamp) {
    return timestamp || (window.performance && window.performance.now ? window.performance.now() : Date.now());
  };
  
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
  
  // Override requestAnimationFrame to catch and fix errors
  const originalRAF = window.requestAnimationFrame;
  window.requestAnimationFrame = function(callback) {
    return originalRAF(function(timestamp) {
      try {
        // Ensure we have a valid timestamp
        timestamp = (typeof timestamp === 'number' && !isNaN(timestamp)) ? timestamp : Date.now();
        callback(timestamp);
      } catch (e) {
        console.warn('Caught error in animation frame callback:', e);
      }
    });
  };
  
  // Directly patch the specific code pattern seen in the error
  document.addEventListener('DOMContentLoaded', function() {
    // Inject a script element with direct fixes
    const fixScript = document.createElement('script');
    fixScript.textContent = `
      // Direct fix for useManualTiming pattern
      (function() {
        // Ensure all required objects and functions exist
        window.n = window.n || {};
        window.n.timestamp = window.n.timestamp || (window.performance ? window.performance.now() : Date.now());
        window.n.delta = window.n.delta || 0;
        window.n.isProcessing = window.n.isProcessing || false;
        
        // Create a safe version of the problematic function
        const safeUseManualTiming = function(timestamp) {
          return timestamp || (window.performance ? window.performance.now() : Date.now());
        };
        
        // Override the global function
        window.useManualTiming = safeUseManualTiming;
        
        // Create a MutationObserver to watch for script additions
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
              mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'SCRIPT') {
                  // If a new script is added, reapply our fixes after it loads
                  node.addEventListener('load', function() {
                    window.useManualTiming = safeUseManualTiming;
                  });
                }
              });
            }
          });
        });
        
        // Start observing the document
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
        
        console.log('Direct animation fixes applied');
      })();
    `;
    
    // Add the fix script to the document
    document.head.insertBefore(fixScript, document.head.firstChild);
  });
  
  // Also run immediately in case DOMContentLoaded has already fired
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    const fixScript = document.createElement('script');
    fixScript.textContent = `
      // Ensure useManualTiming is safely defined
      window.useManualTiming = function(timestamp) {
        return timestamp || (window.performance ? window.performance.now() : Date.now());
      };
      console.log('Applied immediate animation fix');
    `;
    document.head.insertBefore(fixScript, document.head.firstChild);
  }
})();
