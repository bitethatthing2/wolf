'use client';

import { useEffect, useRef, useState } from 'react';

interface ElfsightWidgetProps {
  widgetId: string;
  className?: string;
  wrapperClassName?: string;
  fallbackMessage?: string;
}

// Create a module-level variable to track script loading across all instances
// This avoids issues with React's rendering cycle
let globalScriptLoaded = false;

const ElfsightWidget = ({ 
  widgetId, 
  className = '',
  wrapperClassName = '',
  fallbackMessage = ''
}: ElfsightWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetClass = `elfsight-app-${widgetId}`;
  const [isReady, setIsReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;
  
  // Use a separate effect for script loading to avoid render cycle interference
  useEffect(() => {
    // Function to load the Elfsight script safely
    const loadElfsightScript = () => {
      // If script is already loaded globally, just mark this component as ready
      if (globalScriptLoaded) {
        setIsReady(true);
        return;
      }
      
      // Check if the script already exists in the document
      const existingScript = document.querySelector('script[src="https://static.elfsight.com/platform/platform.js"]');
      
      if (existingScript) {
        // Script exists, mark as loaded
        globalScriptLoaded = true;
        setIsReady(true);
        return;
      }
      
      // Add a meta tag for referrer policy to help with CORS
      try {
        const metaReferrer = document.createElement('meta');
        metaReferrer.name = 'referrer';
        metaReferrer.content = 'no-referrer-when-downgrade';
        
        // Only add if it doesn't already exist
        if (!document.querySelector('meta[name="referrer"]')) {
          document.head.appendChild(metaReferrer);
        }
        
        // Create and append the script
        const script = document.createElement('script');
        script.src = "https://static.elfsight.com/platform/platform.js";
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";
        
        // Set up onload handler before appending to avoid race conditions
        script.onload = () => {
          globalScriptLoaded = true;
          setIsReady(true);
        };
        
        script.onerror = (error) => {
          console.error("Failed to load Elfsight script:", error);
          // Still mark as ready to avoid blocking the UI
          setIsReady(true);
        };
        
        // Append the script to the document
        document.body.appendChild(script);
      } catch (error) {
        console.error("Error setting up Elfsight:", error);
        // Still mark as ready to avoid blocking the UI
        setIsReady(true);
      }
    };
    
    // Load the script after a short delay to ensure React has completed rendering
    const timer = setTimeout(() => {
      loadElfsightScript();
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  // Use another effect to initialize the widget once the script is loaded
  useEffect(() => {
    if (!isReady) return;
    
    // Initialize Elfsight widget
    let initTimer: NodeJS.Timeout | null = null;
    let cleanupTimer: NodeJS.Timeout | null = null;
    
    const initWidget = () => {
      // Check for both newer and older Elfsight API
      if (window.elfsight && typeof window.elfsight.reinit === 'function') {
        try {
          window.elfsight.reinit();
          if (initTimer) clearInterval(initTimer);
          
          // Monitor for specific widget errors
          const errorHandler = (event: ErrorEvent) => {
            if (event.message && 
                (event.message.includes("WIDGET_NOT_FOUND") || 
                 event.message.includes("can`t be initialized"))) {
              console.warn(`Widget ID "${widgetId}" not found or cannot be initialized. Please verify your widget ID.`);
              // Prevent default error behavior to avoid error in the console
              event.preventDefault();
            }
          };
          
          // Add error handler for a short time to catch initialization errors
          window.addEventListener('error', errorHandler);
          setTimeout(() => {
            window.removeEventListener('error', errorHandler);
          }, 5000);
          
        } catch (error) {
          console.error("Error initializing Elfsight widget:", error);
          setRetryCount(prev => prev + 1);
          
          // After max retries, stop trying
          if (retryCount >= maxRetries && initTimer) {
            clearInterval(initTimer);
          }
        }
      } else if (window.eapps && typeof window.eapps.initWidgetsFromBuffer === 'function') {
        // Fallback to legacy API
        try {
          window.eapps.initWidgetsFromBuffer();
          if (initTimer) clearInterval(initTimer);
        } catch (error) {
          console.error("Error initializing Elfsight widget with legacy API:", error);
          setRetryCount(prev => prev + 1);
        }
      }
    };
    
    // Try to initialize immediately
    initWidget();
    
    // Also set up a polling mechanism in case the first attempt fails
    initTimer = setInterval(initWidget, 1000);
    
    // Clear the interval after 10 seconds to prevent infinite polling
    cleanupTimer = setTimeout(() => {
      if (initTimer) {
        clearInterval(initTimer);
      }
    }, 10000);
    
    return () => {
      if (initTimer) clearInterval(initTimer);
      if (cleanupTimer) clearTimeout(cleanupTimer);
    };
  }, [isReady, widgetId]);

  return (
    <div className={wrapperClassName}>
      {/* This hidden div is necessary for the widget to initialize properly */}
      <div className="hidden" aria-hidden="true">
        <div className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-50 rounded-lg dark:bg-gray-800 dark:text-yellow-300">
          <p>⚠️ Instagram feed may not display correctly on localhost due to CORS restrictions.</p>
          <p className="mt-1">This will work correctly when deployed to your production site.</p>
        </div>
      </div>
      {!isReady && fallbackMessage && (
        <div className="text-center py-4">{fallbackMessage}</div>
      )}
      <div 
        ref={containerRef} 
        className={`${widgetClass} ${className}`}
        data-elfsight-app-lazy
      ></div>
    </div>
  );
};

// Add TypeScript declaration for the Elfsight globals
declare global {
  interface Window {
    elfsight?: {
      reinit: () => void;
    };
    eapps?: {
      initWidgetsFromBuffer: () => void;
      Platform?: {
        initialized: boolean;
      };
      AppsManager?: any;
    };
  }
}

export default ElfsightWidget;
