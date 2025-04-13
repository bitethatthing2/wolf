/**
 * Pre-CSP Check
 * This script runs before any CSP is in effect and will check if there are CSP issues
 * that are causing Elfsight to fail, and will try to address them.
 */

(function() {
  // Function to dynamically modify or remove existing CSP meta tags
  function modifyCSPMetaTags() {
    // First, try to find and modify the CSP meta tag
    const cspMetaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    
    if (cspMetaTags.length > 0) {
      // Remove restrictive CSP meta tags
      cspMetaTags.forEach(tag => {
        console.log('[Pre-CSP Check] Removing restrictive CSP meta tag');
        tag.parentNode.removeChild(tag);
      });
    }
    
    // Add a new, permissive CSP meta tag
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';");
    
    // Insert at the beginning of the head for maximum effect
    const head = document.head;
    if (head.firstChild) {
      head.insertBefore(meta, head.firstChild);
    } else {
      head.appendChild(meta);
    }
    
    console.log('[Pre-CSP Check] Added permissive CSP meta tag for debugging');
  }
  
  // Always modify CSP tags for this debugging session
  modifyCSPMetaTags();
  
  // Set a flag to indicate we've modified the CSP
  sessionStorage.setItem('elfsightCSPModified', 'true');
  
  // Listen for CSP violations
  document.addEventListener('securitypolicyviolation', function(e) {
    console.warn('[Pre-CSP Check] CSP Violation:', e.blockedURI, 'Directive:', e.violatedDirective);
    
    // If this is the first CSP violation we've seen, add a permissive CSP meta tag
    if (!sessionStorage.getItem('elfsightCSPIssue')) {
      sessionStorage.setItem('elfsightCSPIssue', 'true');
      console.log('[Pre-CSP Check] First CSP violation detected, adding permissive CSP meta tag');
      addCSPMetaTag();
      
      // Force reload the page to apply the new CSP
      if (!sessionStorage.getItem('elfsightCSPReloaded')) {
        sessionStorage.setItem('elfsightCSPReloaded', 'true');
        window.location.reload();
      }
    }
  });
  
  // Check if this was the result of a reload due to CSP issues
  if (sessionStorage.getItem('elfsightCSPReloaded') === 'true') {
    console.log('[Pre-CSP Check] Page was reloaded due to CSP issues, CSP should now be more permissive');
    sessionStorage.removeItem('elfsightCSPReloaded');
  }
  
  console.log('[Pre-CSP Check] Initialized');
})();