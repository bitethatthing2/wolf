'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * NavigationErrorHandler component
 * 
 * This component works with navigation-error-fix.js and service-worker-fix.js
 * to provide better error handling for Next.js navigation errors.
 * 
 * It coordinates with the global error handlers and provides
 * a UI for when navigation errors are detected.
 */
const NavigationErrorHandler = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retrying, setRetrying] = useState(false);

  // Track navigation errors from fetch interception
  useEffect(() => {
    // Reset error state on path change
    setHasError(false);
    setErrorMessage('');
    setRetrying(false);

    // Wait for the navigation-error-fix.js script to load
    // If our script is loaded, we don't need to override fetch here
    if (typeof window !== 'undefined' && !window.__wolfAppInit) {
      // Create a placeholder until the script loads
      window.__wolfAppInit = {
        errorComponentsInitialized: false,
        serviceWorkerRegistered: false,
        serviceWorkerRegistering: false,
        pushNotificationsInitialized: false,
        polyfillsLoaded: false,
        errors: []
      };
    }

    // Function to detect navigation errors in the global app state
    const checkForErrors = () => {
      if (typeof window === 'undefined') return;
      
      const hasAppErrors = window.__wolfAppInit && 
                           window.__wolfAppInit.errors && 
                           window.__wolfAppInit.errors.length > 0;
      
      // Extract navigation errors from the global state
      if (hasAppErrors) {
        const navigationErrors = window.__wolfAppInit.errors.filter(
          (err: string) => 
            err.includes('navigation') || 
            err.includes('Failed to fetch') ||
            err.includes('NetworkError')
        );
        
        if (navigationErrors.length > 0) {
          console.log('[NavigationErrorHandler] Detected navigation errors:', navigationErrors);
          setHasError(true);
          setErrorMessage(navigationErrors[0]);
        }
      }
    };
    
    // Check for errors every 2 seconds
    const timer = setInterval(checkForErrors, 2000);
    
    // Define handlers for navigation errors
    const handleUnhandledError = (event: ErrorEvent) => {
      if (event.message && (
          event.message.includes('navigation') ||
          event.message.includes('Failed to fetch') ||
          event.message.includes('NetworkError')
        )
      ) {
        console.warn('[NavigationErrorHandler] Caught unhandled error:', event.message);
        
        // Record error in global state
        if (window.__wolfAppInit) {
          window.__wolfAppInit.errors.push(`Navigation error: ${event.message}`);
        }
        
        setHasError(true);
        setErrorMessage(event.message);
        
        // Try to prevent the default behavior
        event.preventDefault();
      }
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = event.reason?.message || 'Unknown error';
      if (message && (
          message.includes('navigation') ||
          message.includes('Failed to fetch') ||
          message.includes('NetworkError')
        )
      ) {
        console.warn('[NavigationErrorHandler] Caught unhandled rejection:', message);
        
        // Record error in global state
        if (window.__wolfAppInit) {
          window.__wolfAppInit.errors.push(`Navigation rejection: ${message}`);
        }
        
        setHasError(true);
        setErrorMessage(message);
        
        // Try to prevent the default behavior
        event.preventDefault();
      }
    };

    // Add event listeners
    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Listen for messages from service worker
    if (navigator.serviceWorker) {
      const handleServiceWorkerMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'NAVIGATION_ERROR') {
          console.warn('[NavigationErrorHandler] Received navigation error from service worker:', event.data);
          setHasError(true);
          setErrorMessage(event.data.message || 'Error in service worker');
          
          // Record error in global state
          if (window.__wolfAppInit) {
            window.__wolfAppInit.errors.push(`SW navigation error: ${event.data.message}`);
          }
        }
      };
      
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
      
      // Clean up
      return () => {
        clearInterval(timer);
        window.removeEventListener('error', handleUnhandledError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      };
    }
    
    // Clean up
    return () => {
      clearInterval(timer);
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [pathname]);

  // Function to retry navigation
  const handleRetry = () => {
    setRetrying(true);
    
    // Clear errors in the global state
    if (window.__wolfAppInit && window.__wolfAppInit.errors) {
      window.__wolfAppInit.errors = window.__wolfAppInit.errors.filter(
        err => !err.includes('navigation') && !err.includes('Failed to fetch')
      );
    }
    
    // Try to refresh the page after a brief delay
    setTimeout(() => {
      try {
        // Use a hard refresh if really necessary
        if (hasError) {
          window.location.reload();
        } else {
          // Otherwise, just use the router to refresh current route
          router.refresh();
        }
      } catch (error) {
        console.error('[NavigationErrorHandler] Error during retry:', error);
        // Fallback to hard refresh
        window.location.reload();
      }
    }, 500);
  };
  
  // Function to go to home page
  const handleGoHome = () => {
    // Clear errors in the global state
    if (window.__wolfAppInit && window.__wolfAppInit.errors) {
      window.__wolfAppInit.errors = window.__wolfAppInit.errors.filter(
        err => !err.includes('navigation') && !err.includes('Failed to fetch')
      );
    }
    
    setHasError(false);
    router.push('/');
  };
  
  // Don't render anything if there's no error
  if (!hasError) return null;
  
  // Render error UI
  return (
    <div 
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
          Navigation Error
        </h2>
        
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We encountered a problem loading this page. This might be due to a network issue or temporary service disruption.
        </p>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded text-sm">
            {errorMessage}
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleGoHome}
            className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:underline"
            disabled={retrying}
          >
            Go Home
          </button>
          
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {retrying ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationErrorHandler;
