'use client';

import React from 'react';
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
            This widget doesn't display in development mode due to CORS restrictions.
          </p>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Widget ID: {widgetId}</p>
            <p className="mt-1">Will display correctly when deployed.</p>
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

export default ElfsightMock;