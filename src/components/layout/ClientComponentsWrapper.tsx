'use client';

import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import client components with ssr: false
const ClientErrorBoundary = dynamic(() => import("@/components/features/ErrorBoundary"), {
  ssr: false
});

const ClientSideComponents = dynamic(() => import("@/components/features/ClientSideComponents"), {
  ssr: false
});

// Import our navigation error handler
const NavigationErrorHandler = dynamic(() => import("@/components/layout/NavigationErrorHandler"), {
  ssr: false
});

interface ClientComponentsWrapperProps {
  children: ReactNode;
}

/**
 * Client Components Wrapper
 * 
 * This component serves as a client-side wrapper for components that need to be
 * dynamically imported with ssr: false. In Next.js App Router, you cannot use
 * dynamic imports with ssr: false directly in Server Components (like layouts).
 * 
 * This wrapper is marked with 'use client' directive so it can safely use
 * dynamic imports with ssr: false.
 * 
 * It also handles Next.js hydration issues and ensures server data is properly
 * initialized to prevent common errors.
 */
export default function ClientComponentsWrapper({ children }: ClientComponentsWrapperProps) {
  const [initialized, setInitialized] = useState(false);
  
  // Initialize Next.js server data structures to prevent errors
  useEffect(() => {
    // Handle potential issues with Next.js server data buffers
    const initializeServerData = () => {
      // Ensure required global objects exist to prevent errors
      if (typeof window !== 'undefined') {
        // Patch Router if needed
        try {
          // Ensure AppRouter exists
          if (typeof (window as any).__next !== 'undefined' && 
              !(window as any).__next.router) {
            console.log('[ClientWrapper] Initializing missing AppRouter');
            (window as any).__next.router = {
              state: { tree: window.location.pathname },
              pathname: window.location.pathname,
              route: window.location.pathname,
              query: {},
              asPath: window.location.pathname,
              push: (url: string) => { window.location.href = url; return Promise.resolve(true); },
              replace: (url: string) => { window.location.href = url; return Promise.resolve(true); }
            };
          }
          
          // Ensure server data structures exist
          if (typeof (window as any).initialServerDataBuffer === 'undefined') {
            (window as any).initialServerDataBuffer = [];
          }
          
          if (typeof (window as any).initialServerDataWriter === 'undefined') {
            (window as any).initialServerDataWriter = () => {};
          }
          
          if (typeof (window as any).initialServerDataLoaded === 'undefined') {
            (window as any).initialServerDataLoaded = true;
          }
          
          if (typeof (window as any).initialServerDataFlushed === 'undefined') {
            (window as any).initialServerDataFlushed = true;
          }
          
          // Provide fallback implementations for error handlers
          if (typeof (window as any).onRecoverableError === 'undefined') {
            (window as any).onRecoverableError = (err: Error) => {
              console.warn('[ClientWrapper] Recoverable error:', err);
            };
          }
          
          if (typeof (window as any).onCaughtError === 'undefined') {
            (window as any).onCaughtError = (err: Error) => {
              console.error('[ClientWrapper] Caught error:', err);
            };
          }
        } catch (err) {
          console.warn('[ClientWrapper] Error during initialization:', err);
        }
      }
      
      setInitialized(true);
    };
    
    initializeServerData();
    
    // One-time check for existing errors
    const hasErrors = document.querySelector('.next-error');
    if (hasErrors) {
      console.warn('[ClientWrapper] Found existing Next.js error UI, refreshing page to recover');
      // Add a small delay before reloading to avoid infinite refresh loops
      setTimeout(() => window.location.reload(), 500);
    }
  }, []);
  
  // Use initialized state to prevent rendering before initialization
  if (!initialized && typeof window !== 'undefined') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <ClientErrorBoundary>
      {children}
      <ClientSideComponents />
      <NavigationErrorHandler />
    </ClientErrorBoundary>
  );
}
