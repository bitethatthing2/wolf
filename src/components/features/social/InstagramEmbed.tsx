'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import styles from './InstagramEmbed.module.css';

interface InstagramEmbedProps {
  username?: string;
  className?: string;
}

/**
 * InstagramEmbed - A direct Instagram embed component that uses Instagram's official embed script
 * rather than a third-party widget like Elfsight.
 */
const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ 
  username = 'sidehustle_bar',
  className = '' 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Function to load and process Instagram embeds
    const loadInstagramEmbed = () => {
      // Skip if script is already loaded
      if (document.getElementById('instagram-embed-script')) {
        if (window.instgrm) {
          try {
            // Re-process with a clean retry approach
            const processEmbed = () => {
              try {
                window.instgrm?.Embeds.process();
                setIsLoaded(true);
                console.log('Instagram embed processed successfully');
              } catch (error) {
                console.warn('Error during embed processing, will retry once:', error);
                // Single retry after a short delay
                setTimeout(() => {
                  try {
                    window.instgrm?.Embeds.process();
                    setIsLoaded(true);
                    console.log('Instagram embed processed successfully on retry');
                  } catch (retryError) {
                    console.error('Instagram embed processing failed after retry:', retryError);
                    setHasError(true);
                  }
                }, 1000);
              }
            };
            
            processEmbed();
          } catch (error) {
            console.error('Error accessing Instagram embed API:', error);
            setHasError(true);
          }
        } else {
          console.warn('Instagram embed script loaded but instgrm object not found');
          // Try reloading the script as a recovery mechanism
          const existingScript = document.getElementById('instagram-embed-script');
          if (existingScript) {
            existingScript.remove();
            setTimeout(() => loadInstagramEmbed(), 500);
            
            // Don't set error yet - give the recovery a chance
            return;
          }
        }
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.id = 'instagram-embed-script';
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous'; // Add CORS support
      
      // Set up load and error handlers
      script.onload = () => {
        if (window.instgrm) {
          try {
            // Process after a short delay for consistent behavior
            // Increased delay for better reliability
            setTimeout(() => {
              try {
                window.instgrm?.Embeds.process();
                setIsLoaded(true);
                console.log('Instagram embed initially processed');
              } catch (error) {
                console.warn('Initial process failed, retrying once:', error);
                // Additional retry with longer delay
                setTimeout(() => {
                  try {
                    window.instgrm?.Embeds.process();
                    setIsLoaded(true);
                    console.log('Instagram embed processed on delayed retry');
                  } catch (retryError) {
                    console.error('Instagram embed processing failed after retry:', retryError);
                    setHasError(true);
                  }
                }, 1500);
              }
            }, 500);
          } catch (error) {
            console.error('Error processing Instagram embeds:', error);
            setHasError(true);
          }
        } else {
          console.warn('Instagram embed script loaded but instgrm object not found');
          // Wait a bit longer to see if instgrm object appears with delay
          setTimeout(() => {
            if (window.instgrm) {
              try {
                window.instgrm?.Embeds.process();
                setIsLoaded(true);
              } catch (error) {
                setHasError(true);
              }
            } else {
              setHasError(true);
            }
          }, 1000);
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load Instagram embed script');
        setHasError(true);
      };
      
      // Add script to document
      document.body.appendChild(script);
      scriptRef.current = script;
    };

    // Global error handler
    const handleError = (event: Event | string) => {
      // Check if it's an Event object (likely a script load error)
      if (typeof event === 'object' && event instanceof Event) {
        console.error('Instagram script loading error:', event);

        // Assign to a new const after type guard for better type tracking
        const safeEvent = event;

        // Attempt recovery if it was a script load error
        // Compare against the script element referenced by scriptRef
        if (safeEvent.target === scriptRef.current) {
          console.info('Script load error detected, attempting recovery...');
          const existingScript = document.getElementById('instagram-embed-script');
          if (existingScript) {
            existingScript.remove();
            // Increased delay slightly for reliability
            setTimeout(() => loadInstagramEmbed(), 800);
            
            // Don't set error yet - give the recovery a chance
            // Use the type-narrowed safeEvent
            // Check for preventDefault existence as it's optional on Event base type
            if (safeEvent.preventDefault) { 
              safeEvent.preventDefault(); 
            }
            return; // Recovery attempted, exit handler
          }
        }
        // If it was an Event but not recoverable script error, log specific message if possible
        // Check if it's an ErrorEvent before accessing message
        if (safeEvent instanceof ErrorEvent && safeEvent.message) {
          console.warn(`Non-recoverable Instagram Event error: ${safeEvent.message}`);
        }

      } else {
        // Handle string errors or other types
        console.error('Instagram script loading error (non-event):', event);
      }

      // Set error state only if error was not handled by recovery logic
      console.warn('Setting error state due to unhandled/non-recoverable error.');
      setHasError(true);
    };

    // Add error listener
    window.addEventListener('error', handleError);
    
    // Load Instagram embed
    loadInstagramEmbed();
    
    // Progressive fallback system with multiple checks
    // First quick check
    const quickCheckTimer = setTimeout(() => {
      if (!isLoaded) {
        const embedPlaceholder = containerRef.current?.querySelector('.instagram-media');
        const embedLoaded = containerRef.current?.querySelector('.instagram-media-rendered');
        
        if (!embedLoaded && embedPlaceholder) {
          console.log('Instagram embed not loaded yet after initial check, will retry processing');
          
          // Try processing again
          if (window.instgrm) {
            try {
              window.instgrm?.Embeds.process();
            } catch (error) {
              console.warn('Error during quick check retry:', error);
            }
          }
        }
      }
    }, 2000);
    
    // Final timeout check - more lenient timeout of 8 seconds
    const finalTimer = setTimeout(() => {
      if (!isLoaded) {
        const embedPlaceholder = containerRef.current?.querySelector('.instagram-media');
        const embedLoaded = containerRef.current?.querySelector('.instagram-media-rendered');
        
        if (!embedLoaded && embedPlaceholder) {
          console.warn('Instagram embed failed to load within final timeout');
          setHasError(true);
        }
      }
    }, 8000);
    
    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      clearTimeout(quickCheckTimer);
      clearTimeout(finalTimer);
    };
  }, [isLoaded]);

  // Generate the embed code with the correct username
  const generateEmbed = () => {
    // Instagram requires a post URL for newer API versions, but we can use a profile URL with a specific format
    // Adding a captioned=false parameter to avoid the "route config was null" error
    const permalinkUrl = `https://www.instagram.com/${username}/?utm_source=ig_embed&utm_campaign=loading&captioned=false`;
    
    const mediaClassName = `${styles.instagramMedia} ${isDark ? styles.instagramMediaDark : styles.instagramMediaLight}`;

    return (
      <blockquote 
        className={`instagram-media ${mediaClassName}`}
        data-instgrm-permalink={permalinkUrl}
        data-instgrm-version="14" 
        data-instgrm-captioned={false}
      >
        <div className={styles.contentPadding}>
          <a 
            href={permalinkUrl}
            className={`${styles.profileLink} ${isDark ? styles.profileLinkDark : styles.profileLinkLight}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.profileContainer}>
              <div className={`${styles.profileImagePlaceholder} ${isDark ? styles.profileImagePlaceholderDark : styles.profileImagePlaceholderLight}`}></div>
              <div className={styles.profileInfo}>
                <div className={`${styles.profileInfoBar} ${isDark ? styles.profileInfoBarDark : styles.profileInfoBarLight}`}></div>
                <div className={`${styles.profileInfoBarSmall} ${isDark ? styles.profileInfoBarDark : styles.profileInfoBarLight}`}></div>
              </div>
            </div>
            <div className={styles.paddingVertical}></div>
            <div className={styles.logoContainer}>
              <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g transform="translate(-511.000000, -20.000000)" fill={isDark ? "#FFFFFF" : "#000000"}>
                    <g>
                      <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <div className={styles.paddingTop}>
              <div className={`${styles.viewProfileText} ${isDark ? styles.viewProfileTextDark : styles.viewProfileTextLight}`}>
                View this profile on Instagram
              </div>
            </div>
            <div className={styles.paddingVerticalLarge}></div>
            <div className={styles.iconRow}>
              <div className={styles.iconContainer}>
                <div className={`${styles.iconDot} ${isDark ? styles.iconDark : styles.iconLight}`}></div>
                <div className={`${styles.iconLine} ${isDark ? styles.iconDark : styles.iconLight}`}></div>
                <div className={`${styles.iconDotOffset} ${isDark ? styles.iconDark : styles.iconLight}`}></div>
              </div>
              <div className={styles.iconContainerRight}>
                <div className={`${styles.iconCircle} ${isDark ? styles.iconDark : styles.iconLight}`}></div>
                <div className={`${styles.iconTriangle} ${isDark ? styles.iconTriangleDark : styles.iconTriangleLight}`}></div>
              </div>
              <div className={styles.autoMargin}>
                <div className={`${styles.iconTopTriangle} ${isDark ? styles.iconTopTriangleDark : styles.iconTopTriangleLight}`}></div>
                <div className={`${styles.iconRect} ${isDark ? styles.iconDark : styles.iconLight}`}></div>
                <div className={`${styles.iconLeftTriangle} ${isDark ? styles.iconLeftTriangleDark : styles.iconLeftTriangleLight}`}></div>
              </div>
            </div>
            <div className={styles.captionContainer}>
              <div className={`${styles.captionLine} ${isDark ? styles.iconDark : styles.iconLight}`}></div>
              <div className={`${styles.captionLineSmall} ${isDark ? styles.iconDark : styles.iconLight}`}></div>
            </div>
          </a>
          <p className={styles.footerText}>
            <a 
              href={permalinkUrl}
              className={styles.footerLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              SIDE HUSTLE BAR
            </a> (@
            <a 
              href={permalinkUrl}
              className={styles.footerLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {username}
            </a>) • Instagram photos and videos
          </p>
        </div>
      </blockquote>
    );
  };

  // Loading placeholder
  if (!isLoaded && !hasError) {
    return (
      <div className={`instagram-embed-loading ${className} min-h-[350px] sm:min-h-[450px] md:min-h-[540px] flex flex-col items-center justify-center rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} p-4 sm:p-6`}>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 animate-pulse mb-4 flex items-center justify-center">
          <Instagram className="h-6 w-6 text-white" />
        </div>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading Instagram feed...
        </p>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className={`instagram-embed-error ${className} min-h-[300px] sm:min-h-[350px] md:min-h-[450px] flex flex-col items-center justify-center rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} p-4 sm:p-6`}>
        <Instagram className={`h-8 sm:h-10 w-8 sm:w-10 mb-3 sm:mb-4 ${isDark ? 'text-white/60' : 'text-black/60'}`} />
        <h3 className={`text-base sm:text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
          Instagram Feed Error
        </h3>
        <p className={`text-center mb-3 sm:mb-4 max-w-xs text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          There was a problem loading our Instagram feed.
        </p>
        <a 
          href={`https://www.instagram.com/${username}/`}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'}`}
        >
          <span>View on Instagram</span>
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
        </a>
      </div>
    );
  }

  // Normal render with embed
  return (
    <div 
      ref={containerRef} 
      className={`instagram-embed ${className} max-w-[540px] sm:max-w-[440px] md:max-w-[540px] overflow-hidden mx-auto w-full`}
    >
      {/* Direct fallback button for users to view on Instagram if embed is frustrating */}
      <div className="w-full text-center mb-2">
        <a 
          href={`https://www.instagram.com/${username}/`}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
        >
          <Instagram className="h-3 w-3" />
          <span>View on Instagram</span>
        </a>
      </div>

      <div className="instagram-wrapper w-full h-auto aspect-auto relative">
        {/* The actual Instagram embed */}
        {generateEmbed()}
        
        {/* Invisible overlay to catch and handle Instagram embed errors */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none opacity-0" 
          onClick={(e) => {
            e.preventDefault();
            window.open(`https://www.instagram.com/${username}/`, '_blank');
          }}
        />
        
        {/* Fallback for users with JavaScript disabled */}
        <noscript>
          <iframe 
            src={`https://www.instagram.com/${username}/embed?captioned=false`}
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            allowTransparency={true}
            style={{ minHeight: '540px', aspectRatio: '1', maxHeight: '540px' }}
          ></iframe>
        </noscript>
      </div>
      
      {/* Loading indicator that disappears once loaded */}
      {!isLoaded && (
        <div className="w-full pt-2 text-center animate-pulse">
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Loading feed...</span>
        </div>
      )}
    </div>
  );
};

// Add TypeScript declaration for the Instagram global
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export default InstagramEmbed;