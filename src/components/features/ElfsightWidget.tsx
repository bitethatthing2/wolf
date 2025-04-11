'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the official ElfsightWidget with no SSR
const OfficialElfsightWidget = dynamic(
  () => import('next-elfsight-widget').then(mod => mod.ElfsightWidget),
  { ssr: false }
);

interface ElfsightWidgetProps {
  widgetId: string;
  className?: string;
  wrapperClassName?: string;
  fallbackMessage?: string;
}

/**
 * ElfsightWidget - A wrapper around the official next-elfsight-widget package
 * This component maintains backward compatibility with existing code
 */
const ElfsightWidget = ({ 
  widgetId, 
  className = '',
  wrapperClassName = '',
  fallbackMessage = 'Loading widget...'
}: ElfsightWidgetProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Client-side only rendering
  useEffect(() => {
    setIsClient(true);
    
    // Simulate loading for a better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // If not mounted yet, show loading message
  if (!isClient || isLoading) {
    return (
      <div className={`elfsight-loading ${wrapperClassName}`}>
        <div className="flex justify-center items-center p-8 text-gray-500">
          <div className="animate-pulse">{fallbackMessage}</div>
        </div>
      </div>
    );
  }
  
  // Check if we're in development mode
  const isDevelopment = 
    typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' || 
     window.location.hostname.includes('.local'));
  
  // In development, show a mock to avoid CORS errors
  if (isDevelopment) {
    return (
      <div className={`elfsight-mock ${wrapperClassName}`}>
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 mb-4 text-gray-400 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h3 className="mb-2 text-lg font-semibold">Elfsight Widget</h3>
            
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              This widget doesn't display in development mode due to CORS restrictions.
            </p>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Widget ID: {widgetId}</p>
              <p className="mt-1">Will display correctly when deployed.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // In production, use the official widget
  return (
    <div className={wrapperClassName}>
      <OfficialElfsightWidget 
        widgetId={widgetId}
        lazy="in-viewport"
        className={className}
      />
    </div>
  );
};

export default ElfsightWidget;
