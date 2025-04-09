/**
 * Performance Timing Fix
 * This script addresses issues with requestAnimationFrame and performance.now() timing
 * that can occur in service workers and certain browser environments.
 */

(function() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Fix for performance.now() issues
    const originalPerformanceNow = performance.now;
    
    // Override performance.now() to handle potential timing issues
    performance.now = function() {
      try {
        return originalPerformanceNow.call(performance);
      } catch (e) {
        console.warn('Error in performance.now(), using fallback', e);
        return Date.now();
      }
    };
    
    // Fix for requestAnimationFrame issues
    const originalRAF = window.requestAnimationFrame;
    const originalCAF = window.cancelAnimationFrame;
    
    // Create a more robust requestAnimationFrame implementation
    window.requestAnimationFrame = function(callback) {
      try {
        return originalRAF.call(window, function(timestamp) {
          try {
            callback(timestamp);
          } catch (e) {
            console.warn('Error in requestAnimationFrame callback', e);
          }
        });
      } catch (e) {
        console.warn('Error in requestAnimationFrame, using setTimeout fallback', e);
        return window.setTimeout(function() {
          callback(performance.now());
        }, 16); // ~60fps
      }
    };
    
    // Update cancelAnimationFrame to work with our implementation
    window.cancelAnimationFrame = function(id) {
      try {
        return originalCAF.call(window, id);
      } catch (e) {
        console.warn('Error in cancelAnimationFrame, using clearTimeout fallback', e);
        return window.clearTimeout(id);
      }
    };
    
    // Fix for useManualTiming issues in service workers
    if (typeof window.useManualTiming === 'function') {
      const originalUseManualTiming = window.useManualTiming;
      window.useManualTiming = function(timestamp) {
        try {
          return originalUseManualTiming.call(window, timestamp);
        } catch (e) {
          console.warn('Error in useManualTiming, using fallback', e);
          return timestamp || performance.now();
        }
      };
    }
    
    console.log('Applied performance timing fixes for production environment');
  });
})();
