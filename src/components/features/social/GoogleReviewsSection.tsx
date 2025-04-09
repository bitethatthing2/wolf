"use client";

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import ElfsightWidget from '@/components/features/ElfsightWidget';

const GoogleReviewsSection: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // If not mounted yet, return null to avoid flash of unstyled content
  if (!mounted) return null;
  
  // Determine color scheme based on current theme
  const isDark = theme === 'dark';
  
  return (
    <>
      <section className={`py-12 sm:py-16 md:py-20 ${isDark ? 'bg-gray-950/90' : 'bg-white'} w-full relative overflow-hidden`}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute top-[25%] left-[10%] w-32 h-32 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'} blur-3xl`}></div>
          <div className={`absolute bottom-[20%] right-[15%] w-24 h-24 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'} blur-2xl`}></div>
        </div>
        
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className={`section-title text-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-black'} uppercase tracking-wider`}>Customer Reviews</h2>
            <div className="flex flex-row items-center justify-center gap-1 mb-4">
              {/* 5 stars in a row */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                <Star className="h-4 w-4 text-white" fill="white" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                <Star className="h-4 w-4 text-white" fill="white" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                <Star className="h-4 w-4 text-white" fill="white" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                <Star className="h-4 w-4 text-white" fill="white" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                <Star className="h-4 w-4 text-white" fill="white" />
              </div>
            </div>
            <p className={`text-center text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-2xl mx-auto`}>
              See what our satisfied customers have to say about their experience at Hustle Hard
            </p>
          </div>
          
          <div className={`w-full overflow-hidden rounded-xl ${isDark ? 'border border-white/10' : 'border border-black/10'} shadow-lg`}>
            <div className={`${isDark ? 'bg-gray-900/60' : 'bg-gray-50/70'} backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-lg`}>
              {/* Elfsight Google Reviews Widget */}
              <div className="min-h-[500px]"> {/* Ensure widget container has height */}
                <ElfsightWidget 
                  widgetId="f4fdffed-81de-4d5d-b688-2da302faebbe"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 md:mt-10 text-center">
            <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              Thank you for your feedback! It helps us improve and provide the best experience possible.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default GoogleReviewsSection;
