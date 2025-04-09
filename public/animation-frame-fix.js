/**
 * Animation Frame Fix
 * This script specifically addresses issues with requestAnimationFrame and useManualTiming
 * that appear in the production environment.
 */

(function() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Direct fix for useManualTiming issues
    window.useManualTiming = window.useManualTiming || function(timestamp) {
      return timestamp || performance.now();
    };
    
    // Fix for animation frame timing issues
    const safeRequestAnimationFrame = function(callback) {
      try {
        return window.requestAnimationFrame(function(timestamp) {
          try {
            // Ensure we have a valid timestamp
            const safeTimestamp = (typeof timestamp === 'number' && !isNaN(timestamp)) 
              ? timestamp 
              : performance.now();
              
            // Call the callback with safe parameters
            callback(safeTimestamp);
          } catch (e) {
            console.warn('Error in animation frame callback:', e);
          }
        });
      } catch (e) {
        console.warn('Error requesting animation frame, using setTimeout fallback:', e);
        return setTimeout(function() {
          callback(performance.now());
        }, 16); // ~60fps
      }
    };
    
    // Only override if not already patched
    if (!window._animationFramePatched) {
      // Save original methods
      window._originalRAF = window.requestAnimationFrame;
      window._originalCAF = window.cancelAnimationFrame;
      
      // Override with safe versions
      window.requestAnimationFrame = safeRequestAnimationFrame;
      
      window.cancelAnimationFrame = function(id) {
        try {
          return window._originalCAF(id);
        } catch (e) {
          return clearTimeout(id);
        }
      };
      
      // Mark as patched
      window._animationFramePatched = true;
    }
    
    // Fix for specific issues in the code shown in the screenshot
    // This patches the exact pattern seen in the error
    const patchAnimationCode = function() {
      // Find all script elements that might contain animation code
      const scripts = document.querySelectorAll('script:not([src])');
      
      scripts.forEach(function(script) {
        if (script.textContent && script.textContent.includes('useManualTiming') && 
            script.textContent.includes('requestAnimationFrame')) {
          console.log('Found script with animation code, applying targeted patches');
          
          // We can't modify inline scripts directly, but we can add a patch right after them
          const patchScript = document.createElement('script');
          patchScript.textContent = `
            // Animation code patch
            (function() {
              if (typeof window.useManualTiming !== 'function') {
                window.useManualTiming = function(timestamp) {
                  return timestamp || performance.now();
                };
              }
              
              // Ensure all animation variables are properly initialized
              window._ensureAnimationVars = function() {
                window.n = window.n || {};
                window.n.timestamp = window.n.timestamp || performance.now();
                window.n.delta = window.n.delta || 0;
                window.n.isProcessing = window.n.isProcessing || false;
              };
              
              // Call the function to ensure variables
              window._ensureAnimationVars();
            })();
          `;
          
          // Insert the patch script after the problematic script
          script.parentNode.insertBefore(patchScript, script.nextSibling);
        }
      });
    };
    
    // Run the patch after a short delay to ensure all scripts are loaded
    setTimeout(patchAnimationCode, 1000);
    
    console.log('Applied animation frame fixes for production environment');
  });
})();
