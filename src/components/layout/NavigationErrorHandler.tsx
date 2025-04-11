'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * NavigationErrorHandler component
 * 
 * This component intercepts and handles client-side navigation errors,
 * particularly the "Failed to fetch" errors that can occur during prefetching.
 * 
 * It implements a global error handler for navigation errors and provides
 * fallback navigation when prefetching fails.
 */
const NavigationErrorHandler = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Store the original fetch function
    const originalFetch = window.fetch;

    // Override the fetch function to handle navigation errors
    window.fetch = async function(input, init) {
      try {
        const response = await originalFetch(input, init);
        return response;
      } catch (error) {
        // Check if this is a navigation fetch error
        if (
          input && 
          typeof input === 'string' && 
          input.includes('/_next/data') &&
          error instanceof TypeError &&
          error.message === 'Failed to fetch'
        ) {
          console.warn('Navigation fetch error intercepted:', error);
          
          // Extract the target path from the fetch URL
          const url = new URL(input, window.location.origin);
          const buildId = url.pathname.split('/')[3];
          const targetPath = url.pathname
            .replace(`/_next/data/${buildId}`, '')
            .replace(/\.json$/, '');
          
          // Don't trigger a navigation if we're already on this page
          if (targetPath !== pathname) {
            console.log('Handling navigation error with fallback navigation to:', targetPath);
            
            // Use setTimeout to avoid immediate navigation which could cause a loop
            setTimeout(() => {
              router.push(targetPath);
            }, 100);
          }
        }
        
        // Re-throw the error to maintain original behavior for non-navigation errors
        throw error;
      }
    };

    // Clean up the override when the component unmounts
    return () => {
      window.fetch = originalFetch;
    };
  }, [router, pathname]);

  // Add a global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Check if this is a navigation error
      if (
        event.reason instanceof TypeError &&
        event.reason.message === 'Failed to fetch'
      ) {
        console.warn('Unhandled navigation error intercepted:', event.reason);
        // Prevent the error from bubbling up to the browser
        event.preventDefault();
      }
    };

    // Add the event listener
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Clean up
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default NavigationErrorHandler;
