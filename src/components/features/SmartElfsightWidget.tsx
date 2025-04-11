'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ElfsightMock from './ElfsightMock';

// Dynamically import the real ElfsightWidget with no SSR
const ElfsightWidget = dynamic(() => import('./ElfsightWidget'), { ssr: false });

interface SmartElfsightWidgetProps {
  widgetId: string;
  className?: string;
  wrapperClassName?: string;
  fallbackMessage?: string;
  type?: 'instagram' | 'reviews' | 'other';
  mockInDevelopment?: boolean;
}

/**
 * SmartElfsightWidget - Intelligently chooses between the real Elfsight widget
 * and a mock component based on the environment (development vs production)
 */
const SmartElfsightWidget = ({
  widgetId,
  className = '',
  wrapperClassName = '',
  fallbackMessage = 'Loading widget...',
  type = 'instagram',
  mockInDevelopment = true
}: SmartElfsightWidgetProps) => {
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const host = window.location.hostname;
    setIsDevelopment(
      host === 'localhost' || 
      host === '127.0.0.1' || 
      host.includes('.local')
    );
  }, []);
  
  // Server-side or initial render - return a simple loading state
  if (!isClient) {
    return (
      <div className={`elfsight-loading ${wrapperClassName}`}>
        <div className="flex justify-center items-center p-8 text-gray-500">
          <div className="animate-pulse">{fallbackMessage}</div>
        </div>
      </div>
    );
  }
  
  // In development, show the mock if requested
  if (isDevelopment && mockInDevelopment) {
    return (
      <ElfsightMock 
        widgetId={widgetId}
        className={className}
        wrapperClassName={wrapperClassName}
        type={type}
      />
    );
  }
  
  // In production or if mock is disabled, use the real widget
  return (
    <ElfsightWidget
      widgetId={widgetId}
      className={className}
      wrapperClassName={wrapperClassName}
      fallbackMessage={fallbackMessage}
    />
  );
};

export default SmartElfsightWidget;
