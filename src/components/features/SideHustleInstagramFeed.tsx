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
    <div className="animate-pulse text-gray-500">Loading Instagram feed...</div>
  </div>
);

// Development mode mock component
const DevelopmentMock = () => (
  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 mb-4 text-gray-400 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
        </svg>
      </div>
      
      <h3 className="mb-2 text-xl font-semibold">Instagram Feed</h3>
      
      <p className="mb-4 text-gray-500 dark:text-gray-400">
        This widget doesn't display in development mode due to CORS restrictions.
      </p>
      
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Will display correctly when deployed.</p>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-md">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="aspect-square bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          />
        ))}
      </div>
    </div>
  </div>
);

interface SideHustleInstagramFeedProps {
  widgetId: string;
  className?: string;
  title?: string;
}

/**
 * SideHustleInstagramFeed - A reliable Instagram feed component for Side Hustle Bar
 * Uses the official Elfsight widget in production and a mock in development
 */
export default function SideHustleInstagramFeed({
  widgetId,
  className = '',
  title = 'Follow Us on Instagram'
}: SideHustleInstagramFeedProps) {
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
    <section className={`instagram-feed-section ${className}`}>
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
