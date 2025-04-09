/**
 * Passive Event Listener Fix
 * This script patches addEventListener to make touchstart/touchmove listeners passive by default
 * to improve scrolling performance and eliminate browser warnings
 */

(function() {
  if (typeof window === 'undefined' || !window.EventTarget) return;
  
  // Store the original addEventListener
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  
  // Override addEventListener to make touch events passive by default
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    // Touch events that should be passive by default
    const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
    
    // If it's a touch event and options doesn't explicitly set passive to false
    if (passiveEvents.includes(type)) {
      // Convert options to an object if it's a boolean or undefined
      if (options === undefined || options === false || options === true) {
        options = {
          capture: !!options,
          passive: true
        };
      } 
      // If options is an object but doesn't specify passive, make it passive
      else if (typeof options === 'object' && options.passive === undefined) {
        options.passive = true;
      }
    }
    
    // Call the original method with potentially modified options
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  console.log('Passive event listener fix applied');
})();
