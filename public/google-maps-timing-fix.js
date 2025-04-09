/**
 * Google Maps Timing Fix
 * This script fixes the useManualTiming error that occurs in Google Maps embeds
 * in production environments, especially on Safari and iOS devices.
 */

(function() {
  // Prevent multiple executions
  if (window.__googleMapsTimingFixApplied) {
    return;
  }
  window.__googleMapsTimingFixApplied = true;

  // Store original methods without overriding them yet
  const originalPerformanceNow = window.performance && typeof window.performance.now === 'function' 
    ? window.performance.now.bind(window.performance) 
    : null;
  
  const originalRAF = window.requestAnimationFrame;
  const originalCAF = window.cancelAnimationFrame;

  // Create a backup timing mechanism that doesn't use performance.now
  const timingOffset = Date.now();
  let lastTimestamp = 0;

  // Safe performance.now implementation that doesn't cause recursion
  const getTimestamp = function() {
    // Use Date.now with offset for consistent timing
    return Date.now() - timingOffset;
  };

  // Only patch if we're not already patched by another script
  if (window.performance && !window.__performanceNowPatched) {
    try {
      window.__performanceNowPatched = true;
      
      // Replace performance.now with our safe version
      window.performance.now = function() {
        if (originalPerformanceNow) {
          try {
            return originalPerformanceNow();
          } catch (e) {
            // Fall back to our timestamp if original fails
            return getTimestamp();
          }
        }
        return getTimestamp();
      };
    } catch (e) {
      console.warn('Could not patch performance.now', e);
    }
  }

  // Create a safe requestAnimationFrame implementation
  const safeRequestAnimationFrame = function(callback) {
    try {
      // Try to use the original first
      if (originalRAF) {
        return originalRAF.call(window, function(timestamp) {
          // If timestamp is invalid, generate our own
          if (isNaN(timestamp) || timestamp === undefined) {
            timestamp = getTimestamp();
          }
          
          // Ensure timestamp is always increasing
          if (timestamp < lastTimestamp) {
            timestamp = lastTimestamp + (1000/60); // Approximately 16.67ms
          }
          
          lastTimestamp = timestamp;
          callback(timestamp);
        });
      }
    } catch (e) {
      console.warn('Error using original requestAnimationFrame, using fallback', e);
    }
    
    // Fallback to setTimeout
    return window.setTimeout(function() {
      const timestamp = getTimestamp();
      lastTimestamp = timestamp;
      callback(timestamp);
    }, 1000/60);
  };

  // Create a safe cancelAnimationFrame
  const safeCancelAnimationFrame = function(id) {
    try {
      if (originalCAF) {
        return originalCAF.call(window, id);
      }
    } catch (e) {
      console.warn('Error using original cancelAnimationFrame, using fallback', e);
    }
    
    // Fallback to clearTimeout
    return window.clearTimeout(id);
  };

  // Only patch if not already patched
  if (!window.__animationFramePatched) {
    try {
      window.__animationFramePatched = true;
      window.requestAnimationFrame = safeRequestAnimationFrame;
      window.cancelAnimationFrame = safeCancelAnimationFrame;
    } catch (e) {
      console.warn('Could not patch animation frame methods', e);
    }
  }

  // Patch useManualTiming error directly
  // This specifically targets the error in Google Maps
  const patchUseManualTiming = function() {
    try {
      // Check for Google Maps API
      if (window.google && window.google.maps) {
        // If the internal _useManualTiming property exists, ensure it's properly set
        if ('_useManualTiming' in window.google.maps) {
          window.google.maps._useManualTiming = false;
        }
        
        // Patch the internal timing function if it exists
        if (typeof window.google.maps.internal === 'object' && 
            'useManualTiming' in window.google.maps.internal) {
          window.google.maps.internal.useManualTiming = false;
        }
      }
    } catch (e) {
      console.warn('Error patching useManualTiming', e);
    }
  };

  // Run the patch when Google Maps API loads
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(patchUseManualTiming, 0);
  } else {
    window.addEventListener('load', function() {
      setTimeout(patchUseManualTiming, 0);
    });
  }

  // Also try to patch when Google Maps script loads
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.tagName === 'SCRIPT' && 
              node.src && 
              node.src.indexOf('maps.googleapis.com') !== -1) {
            // Wait for script to load and execute
            setTimeout(patchUseManualTiming, 500);
          }
        });
      }
    });
  });

  // Start observing
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Fix iframe loading issues
  const fixIframeLoading = function() {
    const iframes = document.querySelectorAll('iframe[src*="google.com/maps"]');
    
    iframes.forEach(function(iframe) {
      // Add sandbox attribute with necessary permissions
      if (!iframe.hasAttribute('sandbox')) {
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
      }
      
      // Ensure proper referrer policy
      if (!iframe.hasAttribute('referrerpolicy')) {
        iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      }
    });
  };

  // Fix iframes when DOM is ready and after any potential dynamic insertions
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fixIframeLoading, 0);
  } else {
    window.addEventListener('DOMContentLoaded', fixIframeLoading);
  }
  
  // Also run periodically to catch dynamically added iframes
  setInterval(fixIframeLoading, 2000);

  console.log('Google Maps timing fix applied safely');
})();
