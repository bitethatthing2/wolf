"use client";

import React, { Component, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw, HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Add TypeScript declaration for the global window.__wolfAppInit
declare global {
  interface Window {
    __wolfAppInit?: {
      errors: string[];
      [key: string]: any;
    };
  }
}

// Class-based error boundary (required for React error boundaries)
class ErrorBoundaryClass extends Component<
  { children: React.ReactNode, fallback: React.ReactNode },
  { hasError: boolean, error: Error | null }
> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Functional wrapper for the class-based error boundary
export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasNavigationError, setHasNavigationError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Listen for window unhandled errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('[ErrorBoundary] Unhandled error:', event);
      
      // Check if event has error property and it's a TypeError
      // Add proper type checking to avoid "undefined" errors
      if (
        event.error && 
        event.error instanceof TypeError && 
        event.error.message && 
        typeof event.error.message === 'string' &&
        (event.error.message.includes('fetch') || event.error.message.includes('network')) &&
        (
          (event.filename && typeof event.filename === 'string' && (
            event.filename.includes('navigation') || 
            event.filename.includes('fetch-server-response') ||
            event.filename.includes('router')
          )) || 
          // Also handle cases where filename might not be present
          (event.error.stack && typeof event.error.stack === 'string' && (
            event.error.stack.includes('navigation') ||
            event.error.stack.includes('fetch') ||
            event.error.stack.includes('router')
          ))
        )
      ) {
        console.log('[ErrorBoundary] Navigation error detected, activating recovery mode');
        setHasNavigationError(true);
        setErrorDetails(event.error.message);
        
        // Prevent default handling
        event.preventDefault();
      }
    };
    
    // Handle unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('[ErrorBoundary] Unhandled promise rejection:', event);
      
      // Safely handle the rejection reason with thorough type checking
      try {
        // Check if reason is an Error
        if (
          event.reason && 
          (event.reason instanceof Error || 
           (typeof event.reason === 'object' && event.reason !== null)) 
        ) {
          // Get the message safely
          const message = event.reason instanceof Error 
            ? event.reason.message 
            : (typeof event.reason.message === 'string' 
               ? event.reason.message 
               : typeof event.reason === 'string' 
                 ? event.reason 
                 : String(event.reason));
          
          // Check if it's a navigation-related error
          if (
            typeof message === 'string' && 
            (message.includes('fetch') || 
             message.includes('navigation') ||
             message.includes('failed to load') ||
             message.includes('network') ||
             message.includes('abort'))
          ) {
            console.log('[ErrorBoundary] Navigation promise rejection, activating recovery mode');
            setHasNavigationError(true);
            setErrorDetails(message);
            
            // Prevent default handling
            event.preventDefault();
          }
        }
      } catch (err) {
        console.error('[ErrorBoundary] Error while processing rejection:', err);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    // Clear error state when pathname changes successfully
    setHasNavigationError(false);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [pathname]);

  // Fix navigation errors with progressive approaches
  const handleFixNavigationError = async () => {
    try {
      // Log retry attempt
      console.log('[ErrorBoundary] Attempting to fix navigation error');
      
      // Clear any errors in our global app state
      if (typeof window !== 'undefined') {
        // Make sure __wolfAppInit exists
        if (!window.__wolfAppInit) {
          window.__wolfAppInit = { errors: [] };
        } 
        // Make sure errors array exists
        else if (!Array.isArray(window.__wolfAppInit.errors)) {
          window.__wolfAppInit.errors = [];
        }
        // Filter out navigation errors
        else {
          window.__wolfAppInit.errors = window.__wolfAppInit.errors.filter(
            err => typeof err === 'string' && 
                  !err.includes('navigation') && 
                  !err.includes('Failed to fetch')
          );
        }
      }
      
      // First try to refresh the router
      router.refresh();
      
      // Clear client-side cache by navigating to the current path again
      try {
        // Wait a moment before attempting navigation
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(pathname || '/');
      } catch (navError) {
        console.error('[ErrorBoundary] Navigation retry failed:', navError);
      }
      
      // If navigation still failing, check if caches need to be cleared
      if ('caches' in window) {
        try {
          // Clear next-data cache first as it's most likely to cause issues
          const cacheKeys = await window.caches.keys();
          const nextDataCaches = cacheKeys.filter(key => key.includes('next-data'));
          
          if (nextDataCaches.length > 0) {
            console.log('[ErrorBoundary] Clearing Next.js data caches:', nextDataCaches);
            await Promise.all(nextDataCaches.map(key => window.caches.delete(key)));
          }
        } catch (cacheError) {
          console.error('[ErrorBoundary] Error clearing caches:', cacheError);
        }
      }
      
      // If in production and service worker is causing issues, 
      // try to communicate with the service worker first before unregistering
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Wait a moment to see if navigation succeeded
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (hasNavigationError) {
          console.log('[ErrorBoundary] Still having issues, trying to communicate with service worker');
          
          try {
            // Send ping message to service worker
            navigator.serviceWorker.controller.postMessage({ 
              type: 'PING', 
              source: 'ErrorBoundary',
              url: pathname
            });
            
            // Wait for a response
            const messagePromise = new Promise<boolean>((resolve) => {
              const timeout = setTimeout(() => resolve(false), 2000);
              
              const messageHandler = (event: MessageEvent) => {
                if (event.data && event.data.type === 'PONG') {
                  clearTimeout(timeout);
                  navigator.serviceWorker.removeEventListener('message', messageHandler);
                  resolve(true);
                }
              };
              
              navigator.serviceWorker.addEventListener('message', messageHandler);
            });
            
            const gotResponse = await messagePromise;
            
            if (!gotResponse) {
              console.log('[ErrorBoundary] No response from service worker, unregistering...');
              
              // If no response, unregister service workers
              const registrations = await navigator.serviceWorker.getRegistrations();
              
              for (const registration of registrations) {
                await registration.unregister();
                console.log('[ErrorBoundary] Unregistered service worker:', registration.scope);
              }
            }
          } catch (swError) {
            console.error('[ErrorBoundary] Error communicating with service worker:', swError);
          }
          
          // Wait a moment before reloading
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log('[ErrorBoundary] Recovery attempted, reloading page');
          window.location.reload();
        }
      }
      
      setHasNavigationError(false);
    } catch (error) {
      console.error('[ErrorBoundary] Error while attempting recovery:', error);
      // Force a full page reload as last resort
      window.location.href = pathname || '/';
    }
  };
  
  // Completely reload the page
  const handleHardReload = () => {
    window.location.reload();
  };
  
  // Go back to home page
  const handleGoHome = () => {
    window.location.href = '/';
  };
  
  // Create fallback UI for the error boundary
  const fallbackUI = (
    <div className="fixed inset-0 flex items-center justify-center bg-white/95 dark:bg-black/95 z-50 p-4">
      <div className="max-w-md text-center p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-lg">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
          {hasNavigationError ? 'Navigation Error' : 'Something Went Wrong'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {hasNavigationError 
            ? 'We encountered an error while navigating. This could be due to a network issue or a problem with cached data.'
            : 'An unexpected error occurred while loading this page. We apologize for the inconvenience.'}
        </p>
        
        {errorDetails && (
          <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-left overflow-auto max-h-20">
            <code>{errorDetails}</code>
          </div>
        )}
        
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2 justify-center">
          <Button 
            variant="outline" 
            onClick={hasNavigationError ? handleFixNavigationError : handleHardReload}
            className="mb-2 sm:mb-0"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {hasNavigationError ? 'Retry Navigation' : 'Retry'}
          </Button>
          <Button 
            variant="default" 
            onClick={handleHardReload}
            className="mb-2 sm:mb-0"
          >
            Reload Page
          </Button>
          <Button 
            variant="secondary"
            onClick={handleGoHome}
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );

  // Render the error boundary with our custom fallback
  return (
    <ErrorBoundaryClass fallback={fallbackUI}>
      {hasNavigationError ? fallbackUI : children}
    </ErrorBoundaryClass>
  );
}