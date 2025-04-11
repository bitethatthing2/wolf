/**
 * Enhanced Navigation Error Fix
 * 
 * This script provides comprehensive error handling for Next.js navigation,
 * addressing "Failed to fetch" errors and other common navigation issues.
 * It also provides coordination with service worker for smoother experience.
 */

(function() {
  // Make sure we have our app initialization object
  window.__wolfAppInit = window.__wolfAppInit || {
    errorComponentsInitialized: false,
    serviceWorkerRegistered: false,
    serviceWorkerRegistering: false,
    pushNotificationsInitialized: false,
    polyfillsLoaded: false,
    errors: []
  };

  // Define configurable options
  const config = {
    debugMode: false,
    retryCount: 3,
    retryDelay: 800,
    errorLogging: true,
    serviceWorkerCoordination: true,
    refreshOnFatalError: true
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
      (input.includes('/_next/data') || 
       input.includes('/api/') && init?.method === 'GET');
    
    // For non-navigation fetches, just use original fetch
    if (!isNavigationFetch) {
      return originalFetch(input, init);
    }
    
    // Add tracking header for service worker
    let adjustedInit = init || {};
    if (!adjustedInit.headers) {
      adjustedInit.headers = new Headers();
    } else if (!(adjustedInit.headers instanceof Headers)) {
      // Convert plain object to Headers
      const headers = new Headers();
      Object.entries(adjustedInit.headers).forEach(([key, value]) => {
        headers.append(key, value);
      });
      adjustedInit.headers = headers;
    }
    
    // Add custom header to help service worker identify navigation requests
    adjustedInit.headers.append('X-Next-Navigation', 'true');
    
    // For navigation fetches, add retry and error handling logic
    let retries = 0;
    let lastError = null;
    
    const makeRequest = async () => {
      try {
        const response = await originalFetch(input, adjustedInit);
        
        // If we got a response, clear any tracking for this URL
        if (isNavigationFetch) {
          navigationRequests.delete(input);
        }
        
        // Check for service worker errors
        if (response.headers.get('X-SW-Error')) {
          log('Service worker reported error:', response.headers.get('X-SW-Error'));
          
          // Track this in our app init object
          window.__wolfAppInit.errors.push(
            'SW error: ' + response.headers.get('X-SW-Error')
          );
        }
        
        return response;
      } catch (error) {
        lastError = error;
        
        // Retry for navigation fetches with fetch errors
        const isRetriableError = 
          error instanceof TypeError && 
          (error.message === 'Failed to fetch' || 
           error.message.includes('NetworkError') ||
           error.message.includes('network'));
        
        if (isNavigationFetch && isRetriableError) {
          // Log first retry attempt
          if (retries === 0) {
            log(`Navigation fetch error, retrying (${retries + 1}/${config.retryCount}):`, input, error.message);
          }
          
          // Track this request
          navigationRequests.set(input, {
            timestamp: Date.now(),
            retries: retries + 1,
            error: error.message
          });
          
          // Check service worker status
          if (retries === 1 && config.serviceWorkerCoordination) {
            try {
              // Try to wake up the service worker if it exists
              if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                log('Sending ping to service worker');
                navigator.serviceWorker.controller.postMessage({
                  type: 'PING',
                  url: input
                });
              }
            } catch (swError) {
              log('Error communicating with service worker', swError);
            }
          }
          
          // If we haven't reached retry limit, try again
          if (retries < config.retryCount) {
            retries++;
            
            // Increase delay with each retry
            const delay = config.retryDelay * retries;
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
            return makeRequest();
          }
        }
        
        // Check if we've exhausted retries for a navigation request
        if (isNavigationFetch && isRetriableError) {
          log('Creating fallback response for navigation request:', input);
          
          // Track this error more prominently
          window.__wolfAppInit.errors.push('Navigation error: ' + lastError.message);
          
          // Extract the path from the request URL
          let path = '/';
          try {
            const url = new URL(input, window.location.origin);
            if (input.includes('/_next/data')) {
              const parts = url.pathname.split('/');
              // Format: /_next/data/[buildId]/[path].json
              if (parts.length > 3) {
                path = '/' + parts.slice(4).join('/').replace(/\.json$/, '');
              }
            } else {
              path = url.pathname;
            }
          } catch (e) {
            log('Error parsing URL', e);
          }
          
          // Create a minimal valid response that Next.js can use
          return new Response(JSON.stringify({
            pageProps: {
              statusCode: 503,
              isNavigationError: true
            },
            __N_SSG: true
          }), {
            status: 200,
            headers: new Headers({ 
              'content-type': 'application/json',
              'X-Navigation-Error': 'Failed to fetch after retries' 
            })
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
    const isNavigationError = 
      event.reason instanceof TypeError && 
      (event.reason.message === 'Failed to fetch' ||
       event.reason.message.includes('NetworkError') ||
       event.reason.message.includes('network'));
    
    if (isNavigationError) {
      // Check if this is related to navigation
      const stack = event.reason.stack || '';
      if (stack.includes('_next/data') || 
          stack.includes('navigation') || 
          stack.includes('router')) {
        
        log('Intercepted unhandled navigation error', event.reason);
        
        // Record in global error tracking
        window.__wolfAppInit.errors.push('Unhandled navigation error: ' + event.reason.message);
        
        // Try to prevent the default error handling
        event.preventDefault();
        
        // Force a refresh if the UI is broken and refreshing is enabled
        if (config.refreshOnFatalError) {
          const hasNavigationError = 
            document.querySelector('.next-error') !== null ||
            document.body.innerHTML.includes('Internal Server Error');
          
          if (hasNavigationError) {
            log('Fatal navigation error detected, refreshing...');
            
            // Try clearing cache storage before reload
            if ('caches' in window) {
              caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                  if (cacheName.includes('next-data')) {
                    caches.delete(cacheName);
                  }
                });
                // Reload after cache clearing
                window.location.reload();
              }).catch(() => window.location.reload());
            } else {
              window.location.reload();
            }
          }
        }
      }
    }
  });
  
  // Intercept direct error events
  window.addEventListener('error', function(event) {
    const errorMessage = event.message || (event.error && event.error.message) || '';
    const isNavigationError = 
      errorMessage === 'Failed to fetch' ||
      errorMessage.includes('NetworkError') ||
      errorMessage.includes('network');
    
    if (isNavigationError) {
      const errorStack = (event.error && event.error.stack) || '';
      
      if (errorStack.includes('_next/data') || 
          errorStack.includes('navigation') ||
          errorStack.includes('router')) {
        
        log('Intercepted navigation error event', event);
        
        // Record in global error tracking
        window.__wolfAppInit.errors.push('Navigation error event: ' + errorMessage);
        
        // Try to prevent the default error handling
        event.preventDefault();
      }
    }
  });
  
  // Monitor navigation errors from Next.js core
  if (typeof window !== 'undefined') {
    // Override Next.js error handler
    const originalOnError = window.onError || function() {};
    window.onError = function(error) {
      // Check if this is a navigation error
      if (error && 
          (error.message === 'Failed to fetch' || 
           error.message?.includes('NetworkError') ||
           error.message?.includes('network'))) {
        
        log('Caught Next.js core error:', error);
        
        // Record the error
        window.__wolfAppInit.errors.push('Next.js error: ' + error.message);
        
        // Let the original handler run
        return originalOnError(error);
      }
      
      return originalOnError(error);
    };
  }
  
  // Listen for service worker messages
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'NAVIGATION_ERROR') {
        log('Received navigation error from service worker:', event.data);
        
        // Record in global error tracking
        window.__wolfAppInit.errors.push('SW navigation error: ' + event.data.message);
      }
    });
  }
  
  // Helper function to check if we're online
  const checkOnline = () => {
    return navigator.onLine !== false;
  };
  
  // Handle online/offline events
  window.addEventListener('online', () => {
    log('Browser is online');
    
    // Try to recover any failed navigation
    if (navigationRequests.size > 0) {
      log('Retrying failed navigation requests');
      
      // Reload the page to recover
      window.location.reload();
    }
  });
  
  window.addEventListener('offline', () => {
    log('Browser is offline');
  });
  
  log('Navigation error fix installed');
})();
