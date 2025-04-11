'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ElfsightMock from './ElfsightMock';

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
  type?: 'instagram' | 'reviews' | 'other';
}

/**
 * ElfsightWidget - A wrapper around the official next-elfsight-widget package
 * This component maintains backward compatibility with existing code
 */
const ElfsightWidget = ({ 
  widgetId, 
  className = '',
  wrapperClassName = '',
  fallbackMessage = 'Loading widget...',
  type = 'other'
}: ElfsightWidgetProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Client-side only rendering
  useEffect(() => {
    setIsClient(true);
    
    // Simulate loading for a better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // Error handling
    const handleError = (event: ErrorEvent) => {
      if (event.message && (
        event.message.includes('Elfsight') || 
        event.message.includes('widget') ||
        (event.filename && (
          event.filename.includes('elfsight.com') ||
          event.filename.includes('elfsightcdn.com')
        ))
      )) {
        console.warn('Caught Elfsight-related error:', event.message);
        setHasError(true);
        event.preventDefault();
      }
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  // Check widget ID to determine widget type if not explicitly specified
  const widgetType = type !== 'other' ? type : 
    widgetId === '4118f1f5-d59f-496f-8439-e8e0232a0fef' ? 'instagram' :
    widgetId === 'f4fdffed-81de-4d5d-b688-2da302faebbe' ? 'reviews' : 
    'other';
  
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
  
  // If there's an error or we're in development, show the mock
  if (hasError || isDevelopment) {
    return (
      <ElfsightMock 
        widgetId={widgetId}
        className={className}
        wrapperClassName={wrapperClassName}
        type={widgetType}
      />
    );
  }
  
  // In production with no errors, use the official widget
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
