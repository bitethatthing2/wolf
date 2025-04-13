'use client';

import { useState, useEffect } from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import Script from 'next/script';

// Elfsight widget ID
const ELFSIGHT_WIDGET_ID = "4118f1f5-d59f-496f-8439-e8e0232a0fef";

// Loading placeholder component
const InstagramLoadingPlaceholder = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="min-h-[550px] flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 animate-pulse mb-4"></div>
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Loading Instagram feed...
      </p>
    </div>
  );
};

// Error fallback component
const InstagramErrorFallback = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`min-h-[450px] flex flex-col items-center justify-center rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <Instagram className={`h-10 w-10 mb-4 ${isDark ? 'text-white/60' : 'text-black/60'}`} />
      <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
        Instagram Feed Error
      </h3>
      <p className={`text-center mb-4 max-w-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        There was a problem loading our Instagram feed.
      </p>
      <a 
        href="https://www.instagram.com/sidehustle_bar/" 
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'}`}
      >
        <span>View on Instagram</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
};

/**
 * InstagramFeedSection - Component for displaying the Instagram feed using Elfsight widget
 */
const InstagramFeedSection: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Only set mounted to true in the client
    setMounted(true);
    
    // Set up error boundary for Elfsight-related errors
    const handleError = (event: ErrorEvent) => {
      if (event.message && (
        event.message.includes('elfsight') ||
        (event.filename && event.filename.includes('elfsight.com'))
      )) {
        console.warn('Caught Elfsight-related error:', event.message);
        setHasError(true);
        event.preventDefault();
        return true;
      }
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  // If not mounted yet, return null to avoid flash of unstyled content
  if (!mounted) return null;
  
  // Determine color scheme based on current theme
  const isDark = theme === 'dark';
  
  return (
    <section className={`py-12 sm:py-16 md:py-20 ${isDark ? 'bg-gray-950/90' : 'bg-white'} w-full relative overflow-hidden`}>
      {/* Load Elfsight script with nonce for CSP */}
      <Script
        src="https://static.elfsight.com/platform/platform.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setHasError(true)}
      />
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className={`absolute top-[15%] right-[5%] w-32 h-32 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'} blur-3xl`}></div>
        <div className={`absolute bottom-[10%] left-[8%] w-24 h-24 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'} blur-2xl`}></div>
      </div>
      
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className={`section-title text-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-black'} uppercase tracking-wider`}>Follow The Hustle</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 mb-2 sm:mb-0 flex-shrink-0">
              <Instagram className="h-4 w-4 text-white" />
            </div>
            <p className={`text-center sm:text-left text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Tag us <a href="https://www.instagram.com/sidehustle_bar" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-white' : 'text-black'} font-medium hover:underline`}>@sidehustle_bar</a> or use <span className={`${isDark ? 'text-white' : 'text-black'} font-medium`}>#SidehustleBar</span> for a chance to be featured!
            </p>
          </div>
        </div>
        
        <div className={`w-full overflow-hidden rounded-xl ${isDark ? 'border border-white/10' : 'border border-black/10'} shadow-lg`}>
          <div className={`${isDark ? 'bg-gray-900/60' : 'bg-gray-50/70'} backdrop-blur-md p-2 sm:p-6 md:p-8 rounded-lg`}>
            <div className="min-h-[550px] pt-2 sm:pt-0 flex justify-center w-full overflow-hidden">
              {hasError ? (
                <InstagramErrorFallback />
              ) : !scriptLoaded ? (
                <InstagramLoadingPlaceholder />
              ) : (
                <div className="w-full max-w-full mx-auto">
                  {/* Elfsight Instagram Feed Widget */}
                  <div className={`elfsight-app-${ELFSIGHT_WIDGET_ID}`} data-elfsight-app-lazy></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeedSection;