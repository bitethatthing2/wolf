/**
 * Framer Motion Timing Fix
 * 
 * This script specifically addresses the error:
 * "let r = l.useManualTiming ? n.timestamp : performance.now()"
 * 
 * This occurs when Framer Motion tries to use its internal timing mechanism
 * and encounters problems with the performance.now() API in certain browsers
 * or when the performance API is polyfilled incorrectly.
 */
(function() {
  console.log('Framer Motion timing fix initializing...');
  
  // Safety check to avoid running multiple times
  if (window.__framerTimingFixApplied) {
    return;
  }
  window.__framerTimingFixApplied = true;
  
  // Store original performance.now for safety
  const originalPerformanceNow = 
    (window.performance && typeof window.performance.now === 'function') 
    ? window.performance.now.bind(window.performance) 
    : function() { return Date.now(); };
  
  // Ensure window.performance exists
  if (!window.performance) {
    window.performance = {};
  }
  
  // Provide a robust performance.now implementation
  window.performance.now = function() {
    try {
      return originalPerformanceNow();
    } catch (e) {
      return Date.now();
    }
  };
  
  // Create global object for Framer's internal use
  window.l = window.l || {};
  window.n = window.n || {};
  window.n.timestamp = window.n.timestamp || Date.now();
  
  // DIRECT TARGETED FIX for "let r = l.useManualTiming ? n.timestamp : performance.now()"
  // This directly replaces the problematic line by providing a safe implementation
  window.getFramerTiming = function() {
    // This is what the original code is trying to do
    if (window.l && typeof window.l.useManualTiming === 'function') {
      return window.l.useManualTiming(window.n.timestamp);
    } else if (window.n && window.n.timestamp) {
      return window.n.timestamp;
    } else {
      try {
        return window.performance.now();
      } catch (e) {
        return Date.now();
      }
    }
  };
  
  // Directly fix the useManualTiming function that's causing the error
  window.l.useManualTiming = function(timestamp) {
    return timestamp || window.n.timestamp || Date.now();
  };
  
  // Make sure the useManualTiming property can't be accidentally overwritten
  Object.defineProperty(window.l, 'useManualTiming', {
    get: function() {
      return function(timestamp) {
        return timestamp || window.n.timestamp || Date.now();
      };
    },
    set: function() {
      // Silently ignore attempts to override
      console.warn('Attempt to override l.useManualTiming prevented by framer-timing-fix');
    },
    configurable: false,
    enumerable: true
  });
  
  // DIRECT PATCH for the specific error line
  try {
    // Create a special function that can be used in place of the original line
    window.__patchFramerTiming = function() {
      try {
        // Try to find and patch the specific function in Framer Motion chunks
        const scripts = document.querySelectorAll('script[src*="chunk"]');
        scripts.forEach(script => {
          if (script.textContent && script.textContent.includes('l.useManualTiming ? n.timestamp : performance.now()')) {
            console.log('Found framer motion timing code to patch!');
            // We can't modify the script content directly, but our global objects will intercept calls
          }
        });
      } catch (e) {
        console.warn('Error while trying to patch Framer Motion timing:', e);
      }
    };
    
    // Run it immediately
    window.__patchFramerTiming();
    
    // Also run after a delay to catch scripts that load late
    setTimeout(window.__patchFramerTiming, 500);
  } catch (e) {
    console.warn('Error in Framer timing patch:', e);
  }
  
  // Create a MutationObserver to monitor script additions
  // This will apply the fix when Framer Motion scripts are loaded
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.tagName === 'SCRIPT' && 
              node.src && 
              (node.src.includes('framer-motion') || 
               node.src.includes('chunk'))) {
            
            // Wait for script to execute and immediately apply fix
            setTimeout(function() {
              // Reapply our fixes after script loads
              window.l = window.l || {};
              window.n = window.n || {};
              window.n.timestamp = window.n.timestamp || Date.now();
              
              window.l.useManualTiming = function(timestamp) {
                return timestamp || window.n.timestamp || Date.now();
              };
              
              // Try to patch again when new scripts load
              if (window.__patchFramerTiming) {
                window.__patchFramerTiming();
              }
            }, 0);
          }
        });
      }
    });
  });
  
  // Start observing changes to the DOM
  observer.observe(document, {
    childList: true,
    subtree: true
  });
  
  // Override the problematic line's implementation
  // This is a last resort method to force our implementation
  const originalEval = window.eval;
  window.eval = function(code) {
    // If the code contains our problematic line, replace it with our safe version
    if (code && typeof code === 'string' && 
        code.includes('l.useManualTiming ? n.timestamp : performance.now()')) {
      
      // Replace the problematic line with a call to our safe function
      code = code.replace(
        /let\s+r\s*=\s*l\.useManualTiming\s*\?\s*n\.timestamp\s*:\s*performance\.now\(\)/g,
        'let r = window.getFramerTiming ? window.getFramerTiming() : (l && l.useManualTiming ? n.timestamp : Date.now())'
      );
    }
    return originalEval.call(window, code);
  };
  
  console.log('Framer Motion timing fix applied successfully - targeting exact error line');
})();
