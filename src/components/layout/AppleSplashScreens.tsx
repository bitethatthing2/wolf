"use client";

import { useEffect, useState } from "react";

/**
 * AppleSplashScreens component
 * 
 * This component adds the necessary meta tags for iOS splash screens
 * using the splash screen images from the /icons/splash_screens directory
 */
export default function AppleSplashScreens() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add apple-touch-icon link
    const touchIconLink = document.createElement('link');
    touchIconLink.rel = 'apple-touch-icon';
    touchIconLink.href = '/icons/splash_screens/icon.png';
    document.head.appendChild(touchIconLink);
    
    // Add iPhone splash screen links
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
      {
        href: '/icons/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png',
        media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png',
        media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png',
        media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png',
        media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png',
        media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png',
        media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png',
        media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png',
        media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/iPhone_16_Pro_portrait.png',
        media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/iPhone_16_Pro_landscape.png',
        media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/iPhone_16_Pro_Max_portrait.png',
        media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/iPhone_16_Pro_Max_landscape.png',
        media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
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
      },
      {
        href: '/icons/splash_screens/10.5__iPad_Air_portrait.png',
        media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/10.5__iPad_Air_landscape.png',
        media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/10.9__iPad_Air_portrait.png',
        media: '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/10.9__iPad_Air_landscape.png',
        media: '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/12.9__iPad_Pro_portrait.png',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/12.9__iPad_Pro_landscape.png',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/11__iPad_Pro_M4_portrait.png',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/11__iPad_Pro_M4_landscape.png',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/13__iPad_Pro_M4_portrait.png',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/13__iPad_Pro_M4_landscape.png',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
      },
      {
        href: '/icons/splash_screens/8.3__iPad_Mini_portrait.png',
        media: '(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        href: '/icons/splash_screens/8.3__iPad_Mini_landscape.png',
        media: '(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
      }
    ];
    
    // Add all splash screen links
    splashScreenLinks.forEach(linkData => {
      const link = document.createElement('link');
      link.rel = 'apple-touch-startup-image';
      link.href = linkData.href;
      link.media = linkData.media;
      document.head.appendChild(link);
    });
    
    // Cleanup function to remove links when component unmounts
    return () => {
      document.querySelectorAll('link[rel="apple-touch-startup-image"]').forEach(el => el.remove());
      document.querySelectorAll('link[rel="apple-touch-icon"]').forEach(el => el.remove());
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}
