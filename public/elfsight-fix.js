/**
 * Elfsight Widget Loader Fix (Enhanced Version)
 * This script ensures Elfsight widgets load properly by providing
 * a more robust initialization process and error handling
 * 
 * Version: 2.1.0
 */

(function() {
  // Track initialization attempts and script status
  let attempts = 0;
  const MAX_ATTEMPTS = 10;
  let isInitializing = false;
  
  // Store Elfsight status globally
  window.elfsightStatus = {
    initialized: false,
    scriptLoaded: false,
    attempts: 0,
    errors: []
  };
  
  // Add necessary meta tags for Elfsight to function properly
  function addMetaTags() {
    // Add referrer meta tag if not present
    if (!document.querySelector('meta[name="referrer"]')) {
      const metaReferrer = document.createElement('meta');
      metaReferrer.name = 'referrer';
      metaReferrer.content = 'no-referrer-when-downgrade';
      document.head.appendChild(metaReferrer);
      console.log('[Elfsight Fix] Added referrer meta tag');
    }
    
    // Add necessary viewport meta tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
      const metaViewport = document.createElement('meta');
      metaViewport.name = 'viewport';
      metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(metaViewport);
      console.log('[Elfsight Fix] Added viewport meta tag');
    }
  }
  
  // Fix iframe security issues by patching any iframes created by Elfsight
  function patchElfsightIframes() {
    // Monitor for iframe additions from Elfsight
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach(node => {
            // Check if the added node is an iframe and is from Elfsight
            if (node.tagName === 'IFRAME' && 
               (node.className.includes('elfsight') || 
                node.src && node.src.includes('elfsight.com'))) {
              // Add proper security attributes
              if (!node.hasAttribute('crossorigin')) {
                node.setAttribute('crossorigin', 'anonymous');
              }
              
              // Fix CORS issues with sandbox attribute
              let sandbox = node.getAttribute('sandbox') || '';
              if (!sandbox.includes('allow-scripts')) {
                sandbox += ' allow-scripts allow-same-origin allow-popups';
                node.setAttribute('sandbox', sandbox.trim());
              }
              
              console.log('[Elfsight Fix] Patched Elfsight iframe for better compatibility');
            }
          });
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Check if Elfsight platform is loaded and initialized
  function checkElfsightPlatform() {
    if (isInitializing) return;
    isInitializing = true;
    
    window.elfsightStatus.attempts = ++attempts;
    
    if (attempts >= MAX_ATTEMPTS) {
      console.warn('[Elfsight Fix] Platform failed to initialize after multiple attempts');
      window.elfsightStatus.initialized = false;
      
      // Fallback initialization attempt for both eapps and newer elfsight namespaces
      try {
        if (window.eapps && typeof window.eapps.initWidgetsFromBuffer === 'function') {
          window.eapps.initWidgetsFromBuffer();
        }
        
        if (window.elfsight && typeof window.elfsight.reinit === 'function') {
          window.elfsight.reinit();
        }
        
        console.log('[Elfsight Fix] Attempted final fallback initialization');
      } catch (err) {
        window.elfsightStatus.errors.push(err.message);
        console.error('[Elfsight Fix] Final initialization error:', err);
      }
      
      isInitializing = false;
      return;
    }
    
    console.log(`[Elfsight Fix] Checking platform initialization (attempt ${attempts}/${MAX_ATTEMPTS})`);
    
    // Check both newer and older Elfsight API structures
    let isInitialized = false;
    
    // Check newer API
    if (window.elfsight && typeof window.elfsight.reinit === 'function') {
      try {
        window.elfsight.reinit();
        isInitialized = true;
        console.log('[Elfsight Fix] Successfully initialized with new API');
      } catch (err) {
        console.warn('[Elfsight Fix] Error with new API, falling back to legacy API:', err);
        window.elfsightStatus.errors.push('New API: ' + err.message);
      }
    }
    
    // Also check legacy API if needed
    if (!isInitialized && window.eapps) {
      if (window.eapps.Platform && window.eapps.Platform.initialized) {
        isInitialized = true;
        console.log('[Elfsight Fix] Platform already initialized (legacy API)');
      } else if (typeof window.eapps.initWidgetsFromBuffer === 'function') {
        try {
          window.eapps.initWidgetsFromBuffer();
          isInitialized = true;
          console.log('[Elfsight Fix] Successfully initialized with legacy API');
        } catch (err) {
          console.warn('[Elfsight Fix] Error initializing with legacy API:', err);
          window.elfsightStatus.errors.push('Legacy API: ' + err.message);
        }
      }
    }
    
    // Update status and schedule next check if needed
    window.elfsightStatus.initialized = isInitialized;
    isInitializing = false;
    
    if (!isInitialized) {
      // Schedule another check with exponential backoff
      const delay = Math.min(1000 * Math.pow(1.5, attempts - 1), 10000); // Cap at 10 seconds
      setTimeout(checkElfsightPlatform, delay);
    } else {
      // If initialized, set up iframe patching
      patchElfsightIframes();
    }
  }
  
  // Main initialization function
  function initialize() {
    console.log('[Elfsight Fix] Starting initialization...');
    addMetaTags();
    
    // Check if the Elfsight platform script exists
    const scriptExists = document.querySelector('script[src*="static.elfsight.com/platform/platform.js"]');
    window.elfsightStatus.scriptLoaded = !!scriptExists;
    
    // If script doesn't exist, wait for it to be added
    if (!scriptExists) {
      console.log('[Elfsight Fix] Platform script not yet loaded, waiting...');
      
      // Watch for the script being added
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes) {
            for (const node of mutation.addedNodes) {
              if (node.nodeName === 'SCRIPT' && 
                  node.src && 
                  node.src.includes('static.elfsight.com/platform/platform.js')) {
                // Script found, mark as loaded
                window.elfsightStatus.scriptLoaded = true;
                console.log('[Elfsight Fix] Platform script detected, will initialize');
                observer.disconnect();
                
                // Schedule initialization check
                setTimeout(checkElfsightPlatform, 1000);
                return;
              }
            }
          }
        }
      });
      
      // Start observing
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      
      // Set a maximum wait time
      setTimeout(() => {
        observer.disconnect();
        
        // If script still not found, try initialization anyway
        if (!window.elfsightStatus.scriptLoaded) {
          console.warn('[Elfsight Fix] Platform script not found after timeout, attempting initialization anyway');
          checkElfsightPlatform();
        }
      }, 10000);
    } else {
      // Script already exists, proceed with initialization
      console.log('[Elfsight Fix] Platform script already loaded, initializing...');
      setTimeout(checkElfsightPlatform, 1000);
    }
  }
  
  // Handle script errors
  window.addEventListener('error', function(event) {
    if (event.target && event.target.src && event.target.src.includes('elfsight.com')) {
      console.warn('[Elfsight Fix] Platform script error:', event);
      window.elfsightStatus.errors.push('Script load error: ' + (event.message || 'Unknown error'));
    }
  }, true);
  
  // Start initialization once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
