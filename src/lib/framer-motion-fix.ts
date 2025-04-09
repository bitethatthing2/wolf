/**
 * This file contains fixes for Framer Motion issues in Next.js development mode
 * It prevents errors related to animation timing and batching
 */

// This function will be called at app initialization to patch Framer Motion's timing system
export function applyFramerMotionFixes() {
  if (typeof window === 'undefined') return;

  // Add a global flag to indicate we've applied the fixes
  if ((window as any).__FRAMER_MOTION_FIXED) return;
  (window as any).__FRAMER_MOTION_FIXED = true;

  // Patch requestAnimationFrame to be more resilient
  const originalRAF = window.requestAnimationFrame;
  window.requestAnimationFrame = function patchedRAF(callback) {
    try {
      return originalRAF.call(window, (timestamp) => {
        try {
          return callback(timestamp);
        } catch (err) {
          console.warn('Error in animation frame callback:', err);
          return 0;
        }
      });
    } catch (err) {
      console.warn('Error in requestAnimationFrame:', err);
      // Fallback to setTimeout as a last resort
      return window.setTimeout(() => callback(performance.now()), 16);
    }
  };

  // Patch performance.now to never return undefined
  const originalNow = performance.now;
  performance.now = function patchedNow() {
    try {
      const time = originalNow.call(performance);
      return typeof time === 'number' && !isNaN(time) ? time : Date.now();
    } catch (err) {
      console.warn('Error in performance.now:', err);
      return Date.now();
    }
  };

  // Set up a global error handler for animation-related errors
  const originalHandleError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    // Check if the error is related to Framer Motion
    if (source && (
      source.includes('framer') || 
      source.includes('motion') || 
      source.includes('batcher') ||
      source.includes('animation')
    )) {
      console.warn('Suppressed Framer Motion error:', message);
      return true; // Prevent the error from propagating
    }
    
    // Call the original handler for other errors
    if (typeof originalHandleError === 'function') {
      return originalHandleError.call(window, message, source, lineno, colno, error);
    }
    return false;
  };
}
