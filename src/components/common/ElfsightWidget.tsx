"use client";

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

// Add typings for global window object
declare global {
  interface Window {
    eapps?: {
      initWidget?: (options: { widgetElemId: string }) => void;
      initWidgetsFromBuffer?: () => void;
      AppsManager?: unknown; // Use unknown instead of any
      Platform?: { 
        initialized?: boolean;
      };
    };
    elfsightLoaded?: boolean;
    elfsightLoadFailed?: boolean;
  }
}

interface ElfsightWidgetProps {
  widgetId: string;
  className?: string;
  wrapperClassName?: string;
  fallbackMessage?: string;
}

/**
 * Reusable component for Elfsight widgets
 * Handles lazy loading and initialization check.
 * Assumes the main Elfsight platform script is loaded elsewhere (e.g., layout.tsx).
 * 
 * @param widgetId - The Elfsight widget ID (e.g., "f4fdffed-81de-4d5d-b688-2da302faebbe")
 * @param className - Optional className for the direct widget div (elfsight-app-...)
 * @param wrapperClassName - Optional className for the outer wrapper div
 * @param fallbackMessage - Optional message to display while loading
 */
const ElfsightWidget: React.FC<ElfsightWidgetProps> = ({
  widgetId,
  className = '',
  wrapperClassName = '',
  fallbackMessage = 'Loading widget...',
}) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);
  const elementClass = `elfsight-app-${widgetId}`; // Use class instead of ID for multiple widgets
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    isMounted.current = true;
    let timeoutId: NodeJS.Timeout | null = null;
    
    const checkPlatformAndInit = () => {
      if (!isMounted.current) return;

      // Check if Elfsight platform script has loaded
      if (window.eapps && window.eapps.Platform?.initialized) {
        if (widgetRef.current) {
          // Ensure the class is present
          if (!widgetRef.current.classList.contains(elementClass)) {
            widgetRef.current.classList.add(elementClass);
          }
          // Ensure lazy attribute is present
          if (!widgetRef.current.hasAttribute('data-elfsight-app-lazy')) {
            widgetRef.current.setAttribute('data-elfsight-app-lazy', '');
          }
          
          // Attempt to initialize if the platform thinks it has widgets in buffer
          if (window.eapps?.initWidgetsFromBuffer) {
            try {
              window.eapps.initWidgetsFromBuffer();
            } catch (err) {
              console.warn(`Elfsight: Error calling initWidgetsFromBuffer for ${widgetId}:`, err);
              // Don't set error here, initialization might still work via other means
            }
          }
          setIsReady(true); // Mark as ready to render the widget div
        } else {
          // Ref not ready, try again shortly
          timeoutId = setTimeout(checkPlatformAndInit, 100);
        }
      } else if (window.elfsightLoadFailed) {
          console.warn(`Elfsight: Platform script failed to load. Cannot initialize widget ${widgetId}.`);
          setHasError(true);
          setIsReady(true); // Mark as ready to show error
      } else {
        // Platform not ready, wait and check again
        timeoutId = setTimeout(checkPlatformAndInit, 250); 
      }
    };

    checkPlatformAndInit();

    // Clean up
    return () => {
      isMounted.current = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [widgetId, elementClass]);

  // Display fallback until the platform script is confirmed loaded/failed
  if (!isReady) {
    return (
      <div className={`elfsight-widget-placeholder ${wrapperClassName}`}>
        <div className="flex justify-center items-center p-8 min-h-[150px]">
          <div className="animate-pulse text-white/70">{fallbackMessage}</div>
        </div>
      </div>
    );
  }
  
  // Display error state if platform failed or widget init failed (though init check is basic)
  if (hasError) {
     return (
      <div className={`elfsight-widget-error ${wrapperClassName}`}>
        <div className="p-4 text-center text-red-400 border border-red-400/50 rounded-md min-h-[150px] flex flex-col justify-center items-center">
          <p>Error: Widget could not be loaded.</p>
          {/* Provide a fallback link specifically for Google Reviews, if applicable */}
          {widgetId === "f4fdffed-81de-4d5d-b688-2da302faebbe" && (
            <div className="mt-2">
              <a 
                href="https://g.page/r/CQFvIkYoqoS2EAE/review" // Replace with actual Google Review link if needed
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:text-blue-300 underline"
              >
                See our reviews on Google
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render the actual widget container div for Elfsight to populate
  return (
    <div className={`elfsight-widget-container ${wrapperClassName}`}>
      <div
        ref={widgetRef} 
        // Class is added dynamically in useEffect to ensure it has the ref
        className={cn("min-h-[150px]", className)} // Ensure minimum height
        data-elfsight-app-lazy // Added dynamically, but good to have as fallback
      />
    </div>
  );
};

export default ElfsightWidget;
