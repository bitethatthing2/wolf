/**
 * Enhanced Navigation Error Fix
 * 
 * This script provides comprehensive error handling for Next.js navigation,
 * addressing "Failed to fetch" errors and other common navigation issues.
 */

(function() {
  // Define configurable options
  const config = {
    debugMode: false,
    retryCount: 2,
    retryDelay: 1000,
    errorLogging: true
  };

  // Utility function for logging
  const log = (msg, ...args) => {
    if (config.debugMode || config.errorLogging) {
      console.log(`[NavigationFix] ${msg}`, ...args);
    }
  };
  
  // Track ongoing navigation requests
  const navigationRequests = new Map();
  
  // Store the original fetch function
  const originalFetch = window.fetch;
  
  // Enhanced fetch function with retry logic for navigation
  window.fetch = async function(input, init) {
    // Check if this is a navigation fetch
    const isNavigationFetch = 
      input && 
      typeof input === 'string' && 
      input.includes('/_next/data');
    
    // For non-navigation fetches, just use original fetch
    if (!isNavigationFetch) {
      return originalFetch(input, init);
    }
    
    // For navigation fetches, add retry and error handling logic
    let retries = 0;
    let lastError = null;
    
    const makeRequest = async () => {
      try {
        const response = await originalFetch(input, init);
        
        // If we got a response, clear any tracking for this URL
        if (isNavigationFetch) {
          navigationRequests.delete(input);
        }
        
        return response;
      } catch (error) {
        lastError = error;
        
        // Only retry navigation fetches with "Failed to fetch" errors
        if (
          isNavigationFetch && 
          error instanceof TypeError && 
          error.message === 'Failed to fetch'
        ) {
          // Log to console but not too verbose
          if (retries === 0) {
            log(`Navigation fetch error, retrying (${retries + 1}/${config.retryCount}):`, input);
          }
          
          // Track this request
          navigationRequests.set(input, {
            timestamp: Date.now(),
            retries: retries + 1
          });
          
          // If we haven't reached retry limit, try again
          if (retries < config.retryCount) {
            retries++;
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, config.retryDelay));
            return makeRequest();
          }
        }
        
        // Check if we've exhausted retries for a navigation request
        if (isNavigationFetch && 
            lastError instanceof TypeError && 
            lastError.message === 'Failed to fetch') {
          
          log('Creating fallback response for navigation request:', input);
          
          // Extract the path from the request URL
          let path = '/';
          try {
            const url = new URL(input);
            const parts = url.pathname.split('/');
            // Format: /_next/data/[buildId]/[path].json
            if (parts.length > 3) {
              path = '/' + parts.slice(4).join('/').replace(/\.json$/, '');
            }
          } catch (e) {
            log('Error parsing URL', e);
          }
          
          // Create a minimal valid response that Next.js can use
          return new Response(JSON.stringify({
            pageProps: {},
            __N_SSG: true,
            __N_REDIRECT: path
          }), {
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' })
          });
        }
        
        // For other errors or non-navigation fetches, just throw
        throw lastError;
      }
    };
    
    return makeRequest();
  };
  
  // Intercept unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason instanceof TypeError && 
        event.reason.message === 'Failed to fetch') {
      
      // Check if this is related to navigation
      const stack = event.reason.stack || '';
      if (stack.includes('_next/data') || stack.includes('navigation')) {
        log('Intercepted unhandled navigation error', event.reason);
        event.preventDefault();
        
        // Force a refresh if the UI is broken
        const hasNavigationError = document.querySelector('.next-error') !== null;
        if (hasNavigationError) {
          log('Navigation error detected, refreshing...');
          window.location.reload();
        }
      }
    }
  });
  
  // Intercept direct error events
  window.addEventListener('error', function(event) {
    const errorMessage = event.message || (event.error && event.error.message) || '';
    
    if (errorMessage === 'Failed to fetch') {
      const errorStack = (event.error && event.error.stack) || '';
      
      if (errorStack.includes('_next/data') || errorStack.includes('navigation')) {
        log('Intercepted navigation error event', event);
        event.preventDefault();
      }
    }
  });
  
  log('Navigation error fix installed');
})();
