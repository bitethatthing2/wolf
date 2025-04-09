/**
 * Elfsight Widget Loader Fix
 * This script helps ensure Elfsight widgets load properly by providing
 * a more robust initialization process and error handling
 */

(function() {
  // Track initialization attempts
  let attempts = 0;
  const MAX_ATTEMPTS = 8; // Increased from 5 to 8
  
  // Check if Elfsight platform is loaded and initialized
  function checkElfsightPlatform() {
    if (attempts >= MAX_ATTEMPTS) {
      console.warn('Elfsight platform failed to initialize after multiple attempts');
      window.elfsightLoadFailed = true;
      
      // Fallback initialization attempt
      if (window.eapps && typeof window.eapps.initWidgetsFromBuffer === 'function') {
        try {
          window.eapps.initWidgetsFromBuffer();
          console.log('Attempted final fallback initialization');
        } catch (err) {
          // Silent catch
        }
      }
      
      return;
    }
    
    attempts++;
    
    // If platform is already initialized, mark as loaded
    if (window.eapps && window.eapps.Platform && window.eapps.Platform.initialized) {
      window.elfsightLoaded = true;
      console.log('Elfsight platform initialized successfully');
      return;
    }
    
    // Try to initialize from buffer if available
    if (window.eapps && window.eapps.initWidgetsFromBuffer) {
      try {
        window.eapps.initWidgetsFromBuffer();
      } catch (err) {
        console.warn('Error initializing Elfsight widgets from buffer:', err);
      }
    }
    
    // Schedule another check with increasing delay
    setTimeout(checkElfsightPlatform, 500 * (attempts + 1));
  }
  
  // Start checking once the page is loaded
  if (document.readyState === 'complete') {
    setTimeout(checkElfsightPlatform, 300); // Delay initial check to give platform.js time to load
  } else {
    window.addEventListener('load', function() {
      setTimeout(checkElfsightPlatform, 300);
    });
  }
  
  // Also handle the case where the script fails to load
  window.addEventListener('error', function(event) {
    if (event.target && event.target.src && event.target.src.includes('elfsight.com/platform/platform.js')) {
      window.elfsightLoadFailed = true;
      console.warn('Elfsight platform script failed to load');
    }
  }, true);
})();
