/**
 * Elfsight Platform Fix
 * This script intercepts Elfsight platform script requests and proxies them through our API
 * to avoid Content Security Policy (CSP) issues
 */

(function() {
  // Function to proxy Elfsight requests through our API
  function proxyElfsightRequest(originalUrl) {
    // Convert the original URL to one that goes through our proxy
    return `/api/proxy/elfsight?url=${encodeURIComponent(originalUrl)}`;
  }

  // Intercept script element creation to handle Elfsight scripts
  const originalCreateElement = document.createElement;
  
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    // Only intercept script elements
    if (tagName.toLowerCase() === 'script') {
      // Override the src property setter
      const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src').set;
      
      Object.defineProperty(element, 'src', {
        set: function(url) {
          // Check if url is a string and contains Elfsight domains
          if (url && typeof url === 'string' && (
              url.indexOf('elfsight.com') !== -1 || 
              url.indexOf('static.elfsight.com') !== -1
            )) {
            console.log('Proxying Elfsight script:', url);
            originalSrcSetter.call(this, proxyElfsightRequest(url));
          } else {
            originalSrcSetter.call(this, url);
          }
        },
        get: Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src').get
      });
    }
    
    return element;
  };

  // Patch XMLHttpRequest to proxy Elfsight requests
  const originalXHROpen = XMLHttpRequest.prototype.open;
  
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    if (url && typeof url === 'string' && (
        url.indexOf('elfsight.com') !== -1 || 
        url.indexOf('elfsightcdn.com') !== -1
      )) {
      console.log('Proxying Elfsight XHR request:', url);
      url = proxyElfsightRequest(url);
    }
    
    return originalXHROpen.call(this, method, url, async, user, password);
  };

  // Patch fetch to proxy Elfsight requests
  const originalFetch = window.fetch;
  
  window.fetch = function(url, options) {
    if (url && typeof url === 'string' && (
        url.indexOf('elfsight.com') !== -1 || 
        url.indexOf('elfsightcdn.com') !== -1
      )) {
      console.log('Proxying Elfsight fetch request:', url);
      url = proxyElfsightRequest(url);
    }
    
    return originalFetch.call(this, url, options);
  };

  // Monitor for CSP violations related to Elfsight
  document.addEventListener('securitypolicyviolation', function(e) {
    if (e.blockedURI && typeof e.blockedURI === 'string' && (
        e.blockedURI.indexOf('elfsight.com') !== -1 || 
        e.blockedURI.indexOf('elfsightcdn.com') !== -1
      )) {
      console.warn('CSP violation for Elfsight resource:', e.blockedURI);
    }
  });

  console.log('[Elfsight Platform Fix] Initialized with proxy support');
})();