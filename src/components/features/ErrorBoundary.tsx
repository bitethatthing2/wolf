"use client";

import React, { Component, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw, HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      
      // Check if it's a fetch error during navigation
      if (
        event.error instanceof TypeError && 
        (event.error.message.includes('fetch') || event.error.message.includes('network')) &&
        (event.filename?.includes('navigation') || 
         event.filename?.includes('fetch-server-response') ||
         event.filename?.includes('router'))
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
      
      if (
        event.reason instanceof Error && 
        (event.reason.message.includes('fetch') || 
         event.reason.message.includes('navigation') ||
         event.reason.message.includes('failed to load'))
      ) {
        console.log('[ErrorBoundary] Navigation promise rejection, activating recovery mode');
        setHasNavigationError(true);
        setErrorDetails(event.reason.message);
        
        // Prevent default handling
        event.preventDefault();
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
      
      // If in production and service worker is causing issues, 
      // unregister service workers as a last resort
      if ('serviceWorker' in navigator) {
        // Wait a moment to see if navigation succeeded
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (hasNavigationError) {
          console.log('[ErrorBoundary] Still having issues, unregistering service workers...');
          const registrations = await navigator.serviceWorker.getRegistrations();
          
          for (const registration of registrations) {
            await registration.unregister();
            console.log('[ErrorBoundary] Unregistered service worker:', registration.scope);
          }
          
          // Wait a moment before reloading
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log('[ErrorBoundary] All service workers unregistered, reloading page');
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