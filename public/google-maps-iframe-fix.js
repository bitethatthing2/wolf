/**
 * Google Maps Iframe Security Fix
 * This script ensures proper loading of Google Maps iframes
 * by handling security-related issues and CSP problems
 */

(function() {
  // Only run once
  if (window.__googleMapsIframeSecurityFixApplied) {
    return;
  }
  window.__googleMapsIframeSecurityFixApplied = true;
  
  console.log('Google Maps iframe security fix running...');
  
  // Function to fix insecure iframe issues
  function fixInsecureIframes() {
    // Find all iframes on the page
    const iframes = document.querySelectorAll('iframe');
    
    iframes.forEach(iframe => {
      const src = iframe.getAttribute('src');
      
      // Only process Google Maps iframes
      if (src && src.includes('google.com/maps')) {
        // Ensure URL uses HTTPS
        if (src.startsWith('http:')) {
          const newSrc = src.replace('http:', 'https:');
          iframe.setAttribute('src', newSrc);
        }
        
        // Add security attributes
        iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        
        // Remove loading="lazy" attribute as it can cause issues in Safari < 16.4
        if (iframe.hasAttribute('loading')) {
          iframe.removeAttribute('loading');
        }
        
        // Remove sandbox attribute as it's too restrictive for Google Maps
        if (iframe.hasAttribute('sandbox')) {
          iframe.removeAttribute('sandbox');
        }
        
        // Ensure the iframe has all necessary permissions
        const permissions = "accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; geolocation; microphone; camera; display-capture; fullscreen; magnetometer; payment; publickey-credentials-get; screen-wake-lock; serial; usb; xr-spatial-tracking";
        iframe.setAttribute('allow', permissions);
        
        // Add a title if missing (for accessibility)
        if (!iframe.hasAttribute('title')) {
          iframe.setAttribute('title', 'Google Maps');
        }
        
        // Remove allowFullScreen attribute since it's included in the allow permissions
        if (iframe.hasAttribute('allowFullScreen')) {
          iframe.removeAttribute('allowFullScreen');
        }
      }
    });
  }

  // Fix iframes on initial load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fixInsecureIframes, 0);
  } else {
    document.addEventListener('DOMContentLoaded', fixInsecureIframes);
  }
  
  // Also fix iframes when they're dynamically added
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        setTimeout(fixInsecureIframes, 0);
      }
    });
  });
  
  // Start observing the document
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  // Also fix iframes when the window loads (for iframes loaded after DOMContentLoaded)
  window.addEventListener('load', fixInsecureIframes);
  
  console.log('Google Maps iframe security fix applied successfully');
})();
