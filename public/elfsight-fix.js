/**
 * Elfsight Widget Fix for NextJS
 * This script helps ensure Elfsight widgets load properly on client-side navigation
 * and addresses Content Security Policy issues
 */

(function() {
  // Create a global variable to track CSP issues
  window.elfsightCSPIssue = false;

  // Capture CSP errors related to Elfsight
  window.addEventListener('securitypolicyviolation', function(e) {
    if (e.blockedURI && (
      e.blockedURI.includes('elfsight.com') || 
      e.blockedURI.includes('static.elfsight.com')
    )) {
      console.warn('Elfsight CSP violation detected:', e.blockedURI);
      window.elfsightCSPIssue = true;
      sessionStorage.setItem('elfsightCSPIssue', 'true');
      
      // Try to fix by adding CSP meta tag dynamically
      if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', 'Content-Security-Policy');
        meta.setAttribute('content', "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.elfsight.com https://static.elfsight.com https://*.google.com https://*.gstatic.com https://www.instagram.com; connect-src 'self' https://*.elfsight.com https://static.elfsight.com https://*.instagram.com;");
        document.head.appendChild(meta);
      }
    }
  });

  // Wait for DOM ready
  if (document.readyState !== 'loading') {
    initFix();
  } else {
    document.addEventListener('DOMContentLoaded', initFix);
  }

  function initFix() {
    // Check if we have a stored CSP issue
    if (sessionStorage.getItem('elfsightCSPIssue') === 'true') {
      window.elfsightCSPIssue = true;
    }

    // Listen for route changes
    let lastPathname = window.location.pathname;
    
    // Check if we need to reinitialize Elfsight
    function checkRoute() {
      const currentPathname = window.location.pathname;
      
      // If route changed and Elfsight is on page
      if (lastPathname !== currentPathname && 
          document.querySelector('[class*="elfsight-app-"]')) {
        reinitializeElfsight();
      }
      
      lastPathname = currentPathname;
    }
    
    // Re-initialize Elfsight on route changes
    setInterval(checkRoute, 500);

    // Function to reinitialize Elfsight
    function reinitializeElfsight() {
      // Clear old instances first
      document.querySelectorAll('[class^="eapps-"]').forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });

      // Try to use native reinitialize first
      if (window.eapps && typeof window.eapps.reinitializeAll === 'function') {
        try {
          window.eapps.reinitializeAll();
          return;
        } catch (e) {
          console.warn('Native Elfsight reinitialize failed:', e);
        }
      }

      // Fall back to manual reload
      const existingScript = document.querySelector('script[src*="static.elfsight.com/platform/platform.js"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add script with nonce if available
      const elfsightScript = document.createElement('script');
      elfsightScript.src = 'https://static.elfsight.com/platform/platform.js';
      elfsightScript.defer = true;
      
      // Try to use existing nonce if available
      const nonceScript = document.querySelector('script[nonce]');
      if (nonceScript && nonceScript.nonce) {
        elfsightScript.nonce = nonceScript.nonce;
      }
      
      document.body.appendChild(elfsightScript);
    }
    
    // Add CSP bypass
    document.addEventListener('elfsight-app-ready', function() {
      console.log('Elfsight app ready');
    });
    
    // Initialize when Elfsight loads
    window.addEventListener('eapps.sdk.inited', function() {
      console.log('Elfsight SDK initialized');
    });
  }
})();