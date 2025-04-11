'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import the official Elfsight widget with no SSR
const ElfsightWidget = dynamic(
  () => import('next-elfsight-widget').then(mod => mod.ElfsightWidget),
  { ssr: false }
);

// Simple loading component
const LoadingWidget = () => (
  <div className="w-full p-6 flex justify-center items-center">
    <div className="animate-pulse text-gray-500">Loading Google Reviews...</div>
  </div>
);

// Development mode mock component
const DevelopmentMock = () => (
  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 mb-4 text-gray-400 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
        </svg>
      </div>
      
      <h3 className="mb-2 text-xl font-semibold">Google Reviews</h3>
      
      <p className="mb-4 text-gray-500 dark:text-gray-400">
        This widget doesn't display in development mode due to CORS restrictions.
      </p>
      
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Will display correctly when deployed.</p>
      </div>
      
      <div className="mt-4 space-y-3 w-full max-w-md">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-1"></div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full mr-1"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface SideHustleGoogleReviewsProps {
  widgetId: string;
  className?: string;
  title?: string;
}

/**
 * SideHustleGoogleReviews - A reliable Google Reviews component for Side Hustle Bar
 * Uses the official Elfsight widget in production and a mock in development
 */
export default function SideHustleGoogleReviews({
  widgetId,
  className = '',
  title = 'Customer Reviews'
}: SideHustleGoogleReviewsProps) {
  const [isClient, setIsClient] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    
    // Check if we're in development mode
    const host = window.location.hostname;
    setIsDevelopment(
      host === 'localhost' || 
      host === '127.0.0.1' || 
      host.includes('.local')
    );
    
    // Simulate loading for a better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`google-reviews-section ${className}`}>
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      
      {/* Show loading state on initial render */}
      {(!isClient || isLoading) && <LoadingWidget />}
      
      {/* Show mock in development mode */}
      {isClient && !isLoading && isDevelopment && <DevelopmentMock />}
      
      {/* Show real widget in production */}
      {isClient && !isLoading && !isDevelopment && (
        <ElfsightWidget 
          widgetId={widgetId} 
          lazy="in-viewport"
          className="w-full rounded-lg overflow-hidden" 
        />
      )}
    </section>
  );
}
