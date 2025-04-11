'use client';

import React, { useEffect, useState } from 'react';
import { Instagram, Star, ExternalLink } from 'lucide-react';

interface ElfsightMockProps {
  widgetId: string;
  className?: string;
  wrapperClassName?: string;
  type?: 'instagram' | 'reviews' | 'other';
}

/**
 * ElfsightMock - A placeholder component for Elfsight widgets in development
 * This prevents CORS errors during local development while still showing something useful
 */
const ElfsightMock: React.FC<ElfsightMockProps> = ({
  widgetId,
  className = '',
  wrapperClassName = '',
  type = 'instagram'
}) => {
  const [envVariables, setEnvVariables] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Collect environment variables related to Elfsight
    const env: Record<string, string> = {};
    
    // Check process.env (Next.js)
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_ID) {
        env['NEXT_PUBLIC_INSTAGRAM_WIDGET_ID'] = process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_ID;
      }
      if (process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_WIDGET_ID) {
        env['NEXT_PUBLIC_GOOGLE_REVIEWS_WIDGET_ID'] = process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_WIDGET_ID;
      }
      if (process.env.NEXT_PUBLIC_ELFSIGHT_CORS_PROXY_ENABLED) {
        env['NEXT_PUBLIC_ELFSIGHT_CORS_PROXY_ENABLED'] = process.env.NEXT_PUBLIC_ELFSIGHT_CORS_PROXY_ENABLED;
      }
    }
    
    // Check window.__ENV (custom environment)
    if (typeof window !== 'undefined' && window.__ENV) {
      if (window.__ENV.INSTAGRAM_WIDGET_ID) {
        env['window.__ENV.INSTAGRAM_WIDGET_ID'] = window.__ENV.INSTAGRAM_WIDGET_ID;
      }
      if (window.__ENV.GOOGLE_REVIEWS_WIDGET_ID) {
        env['window.__ENV.GOOGLE_REVIEWS_WIDGET_ID'] = window.__ENV.GOOGLE_REVIEWS_WIDGET_ID;
      }
      if (window.__ENV.ELFSIGHT_CORS_PROXY_ENABLED) {
        env['window.__ENV.ELFSIGHT_CORS_PROXY_ENABLED'] = window.__ENV.ELFSIGHT_CORS_PROXY_ENABLED;
      }
    }
    
    setEnvVariables(env);
  }, []);

  // Choose icon based on type
  const IconComponent = type === 'instagram'
    ? Instagram
    : type === 'reviews'
      ? Star
      : ExternalLink;

  // Choose title based on type
  const title = type === 'instagram'
    ? 'Instagram Feed'
    : type === 'reviews'
      ? 'Google Reviews'
      : 'Elfsight Widget';

  return (
    <div className={`elfsight-mock ${wrapperClassName}`}>
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 mb-4 text-gray-400 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <IconComponent className="h-6 w-6" />
          </div>
          
          <h3 className="mb-2 text-lg font-semibold">{title}</h3>
          
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Widget Diagnostic Information
          </p>
          
          <div className="text-sm text-left w-full max-w-md mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto">
            <p className="font-mono">Current Widget ID: <span className="text-blue-600 dark:text-blue-400">{widgetId}</span></p>
            
            <p className="mt-2 font-semibold">Environment Variables:</p>
            {Object.keys(envVariables).length > 0 ? (
              <ul className="mt-1 pl-4 list-disc space-y-1">
                {Object.entries(envVariables).map(([key, value]) => (
                  <li key={key} className="font-mono text-xs">
                    {key}: <span className="text-green-600 dark:text-green-400">{value}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-500">No environment variables found</p>
            )}
            
            <p className="mt-2 font-semibold">Host Information:</p>
            <p className="font-mono text-xs">
              {typeof window !== 'undefined' ? window.location.hostname : 'Server-side rendering'}
            </p>
            
            <p className="mt-2 font-semibold">Correct Widget IDs:</p>
            <ul className="mt-1 pl-4 list-disc">
              <li className="font-mono text-xs">
                Instagram: <span className="text-green-600 dark:text-green-400">4118f1f5-d59f-496f-8439-e8e0232a0fef</span>
              </li>
              <li className="font-mono text-xs">
                Google Reviews: <span className="text-green-600 dark:text-green-400">f4fdffed-81de-488-2da302faebbe</span>
              </li>
            </ul>
          </div>

          {type === 'instagram' && (
            <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-md">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="aspect-square bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          )}

          {type === 'reviews' && (
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
          )}
        </div>
      </div>
    </div>
  );
};

// Define global types
declare global {
  interface Window {
    __ENV?: {
      INSTAGRAM_WIDGET_ID?: string;
      GOOGLE_REVIEWS_WIDGET_ID?: string;
      ELFSIGHT_CORS_PROXY_ENABLED?: string;
      [key: string]: string | undefined;
    };
  }
}

export default ElfsightMock;