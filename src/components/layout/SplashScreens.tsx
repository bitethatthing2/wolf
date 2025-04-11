"use client";

import { useEffect, useState } from "react";

/**
 * SplashScreens component
 * 
 * This component adds the necessary meta tags for both iOS and Android splash screens
 * using the splash screen images from the /icons/splash_screens directory
 */
export default function SplashScreens() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add apple-touch-icon link for iOS
    const touchIconLink = document.createElement('link');
    touchIconLink.rel = 'apple-touch-icon';
    touchIconLink.href = '/icons/splash_screens/icon.png';
    document.head.appendChild(touchIconLink);
    
    // Add Android PWA meta tags
    const androidMetaTags = [
      // Theme color
      {
        name: 'theme-color',
        content: '#000000'
      },
      // Add to home screen
      {
        name: 'mobile-web-app-capable',
        content: 'yes'
      },
      // Orientation
      {
        name: 'screen-orientation',
        content: 'portrait'
      }
    ];
    
    // Add Android meta tags
    androidMetaTags.forEach(metaData => {
      const meta = document.createElement('meta');
      meta.name = metaData.name;
      meta.content = metaData.content;
      document.head.appendChild(meta);
    });
    
    // Add splash screen links for iOS
    const splashScreenLinks = [
      // iPhone Splash Screens
      {
        href: '/icons/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png',
        media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png',
        media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/iPhone_11__iPhone_XR_portrait.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/iPhone_11__iPhone_XR_landscape.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
      },
      
      // iPad Splash Screens
      {
        href: '/icons/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/10.2__iPad_portrait.png',
        media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/10.2__iPad_landscape.png',
        media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
      }
    ];
    
    // Add all splash screen links for iOS
    splashScreenLinks.forEach(linkData => {
      const link = document.createElement('link');
      link.rel = 'apple-touch-startup-image';
      link.href = linkData.href;
      link.media = linkData.media;
      document.head.appendChild(link);
    });
    
    // Add Android splash screen configuration
    // This uses the same images but with different meta tags
    const androidSplashScreenScript = document.createElement('script');
    androidSplashScreenScript.type = 'text/javascript';
    androidSplashScreenScript.textContent = `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
            // Set splash screen for Android
            if (window.matchMedia('(orientation: portrait)').matches) {
              // Portrait mode
              document.documentElement.style.setProperty(
                '--pwa-splash-image', 
                'url("/icons/splash_screens/icon.png")'
              );
            } else {
              // Landscape mode
              document.documentElement.style.setProperty(
                '--pwa-splash-image', 
                'url("/icons/splash_screens/icon.png")'
              );
            }
            
            // Add splash screen styles
            const style = document.createElement('style');
            style.textContent = \`
              @media screen and (orientation: portrait) {
                body::before {
                  content: '';
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background-color: #000000;
                  background-image: var(--pwa-splash-image);
                  background-position: center;
                  background-repeat: no-repeat;
                  background-size: contain;
                  z-index: 9999;
                  transition: opacity 0.5s ease-out;
                  opacity: 1;
                }
                
                body.app-loaded::before {
                  opacity: 0;
                  pointer-events: none;
                }
              }
            \`;
            document.head.appendChild(style);
            
            // Remove splash screen after app is loaded
            setTimeout(() => {
              document.body.classList.add('app-loaded');
            }, 2000);
          }
        });
      }
    `;
    document.head.appendChild(androidSplashScreenScript);
    
    // Cleanup function to remove links when component unmounts
    return () => {
      document.querySelectorAll('link[rel="apple-touch-startup-image"]').forEach(el => el.remove());
      document.querySelectorAll('link[rel="apple-touch-icon"]').forEach(el => el.remove());
      document.querySelectorAll('script[id="android-splash-screen"]').forEach(el => el.remove());
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}
