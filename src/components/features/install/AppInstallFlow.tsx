"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, ChevronRight, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import AndroidLogoIcon from "@/components/icons/AndroidLogoIcon";
import AppleLogoIcon from "@/components/icons/AppleLogoIcon";

type DeviceType = "ios" | "android" | "desktop" | "unknown";

const AppInstallFlow = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>("unknown");
  const [installStep, setInstallStep] = useState<number>(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { theme, resolvedTheme } = useTheme();
  
  // Determine if we're in dark mode
  const isDarkTheme = theme === "dark" || resolvedTheme === "dark";
  
  useEffect(() => {
    // Device detection
    const detectDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
        setDeviceType("ios");
      } else if (/android/i.test(userAgent)) {
        setDeviceType("android");
      } else {
        setDeviceType("desktop");
      }
    };
    
    detectDevice();
    
    // For PWA install prompt on Android
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    });
    
    // Register service worker for notifications
    if ('serviceWorker' in navigator) {
      // Check if we're in a secure context or localhost
      const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
      
      // Only register in production (HTTPS) or if explicitly enabled in development
      if (window.location.protocol === 'https:' || 
          isLocalhost || 
          process.env.NODE_ENV === 'production') {
        
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
          .then(registration => {
            console.log('Service Worker registered successfully with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
            
            // Log more detailed error for localhost issues
            if (isLocalhost) {
              console.info('Note: For local development, you can:\n1. Use HTTPS with a local certificate\n2. Test in production\n3. Use Chrome with --unsafely-treat-insecure-origin-as-secure flag');
            }
          });
      } else {
        console.log('Service Worker registration skipped - requires HTTPS except on localhost');
      }
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);
  
  const handleInstallClick = async () => {
    if (deviceType === "android" && deferredPrompt) {
      // Show the install prompt for Android
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setInstallStep(0); // Reset or move to notification step
        setDeferredPrompt(null);
      }
    } else if (deviceType === "ios") {
      // For iOS, show the installation steps
      setInstallStep(1);
    } else {
      // Desktop or unknown device
      alert("You can install this app on mobile devices for the best experience.");
    }
  };
  
  const handleNextStep = () => {
    setInstallStep(installStep + 1);
  };
  
  const handleNotificationsClick = () => {
    // This would trigger the browser's notification permission request
    if (Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };
  
  // Reset to beginning
  const handleReset = () => {
    setInstallStep(0);
  };
  
  // Define the target button style
  const targetButtonStyle = "flex items-center justify-center gap-2 py-3 px-6 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-bold text-base rounded-md w-full max-w-md"; 
  
  // Get the appropriate installation icon based on device type and theme
  const getInstallIcon = () => {
    if (deviceType === "ios") {
      return isDarkTheme ? "/apple_icon_install_white.png" : "/ios_pwa_install-black.png";
    } else if (deviceType === "android") {
      return isDarkTheme ? "/android-installation-guide-white.png.png" : "/android_installation_guide-black.png";
    } 
    return ""; // Default empty for desktop (will use Lucide icon)
  };
  
  // Get the alt text for the installation icon
  const getInstallIconAlt = () => {
    return deviceType === "ios" ? "iOS Install" : "Android Install";
  };
  
  // Render different content based on device type and installation step
  const renderContent = () => {
    if (installStep === 0) {
      return (
        <div className="flex flex-col items-center w-full max-w-md gap-4">
          {deviceType === "ios" || deviceType === "android" ? (
            <Button 
              variant="default"
              className={targetButtonStyle}
              onClick={handleInstallClick}
            >
              {deviceType === "android" ? (
                <div className="flex items-center justify-center w-full">
                  <div className="flex items-center justify-center gap-3">
                    <div className="rounded-full w-8 h-8 flex items-center justify-center overflow-hidden bg-white dark:bg-black"> 
                      <AndroidLogoIcon 
                        className="w-5 h-5 text-black dark:text-white"
                      />
                    </div>
                    <span>Install on Android</span>
                  </div>
                </div>
              ) : deviceType === "ios" ? (
                <div className="flex items-center justify-center w-full">
                  <div className="rounded-full w-8 h-8 flex items-center justify-center overflow-hidden bg-white dark:bg-black mr-2"> 
                    <AppleLogoIcon 
                      className="w-5 h-5 text-black dark:text-white"
                    />
                  </div>
                  <span>Install on iOS</span>
                </div>
              ) : (
                <>
                  {/* Theme-aware icon: white bg/black icon on light, black bg/white icon on dark */}
                  <div className="w-7 h-7 rounded-full bg-white dark:bg-black flex items-center justify-center mr-1">
                    <Download className="w-2.5 h-2.5 text-black dark:text-white" />
                  </div>
                  Install App
                </>
              )}
            </Button>
          ) : (
            <Button 
              variant="default"
              className={targetButtonStyle}
              onClick={handleInstallClick}
            >
              {/* Theme-aware icon: white bg/black icon on light, black bg/white icon on dark */}
              <div className="w-7 h-7 rounded-full bg-white dark:bg-black flex items-center justify-center mr-1">
                <Download className="w-2.5 h-2.5 text-black dark:text-white" />
              </div>
              Install App
            </Button>
          )}
          {/* Apply consistent styling to the Notifications button container and add Bell icon */}
          <div 
            className={`${targetButtonStyle} cursor-pointer flex items-center justify-center gap-2 py-3 px-6`}
            onClick={handleNotificationsClick}
          >
            {/* Theme-aware icon: white bg/black icon on light, black bg/white icon on dark */}
            <div className="w-7 h-7 rounded-full bg-white dark:bg-black flex items-center justify-center mr-1">
              <Bell className="w-5 h-5 text-black dark:text-white" />
            </div>
            {/* Replace img with text */}
            <span>Enable Notifications</span>
          </div>
          
          {/* Add helpful "View Installation Instructions" link */}
          {deviceType === "android" || deviceType === "ios" ? (
            <div className="mt-2 text-center">
              <a 
                href={deviceType === "ios" ? "/instructions/ios" : "/instructions/android"} 
                className="text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white underline underline-offset-2"
              >
                View detailed installation instructions
              </a>
            </div>
          ) : null}
        </div>
      );
    } else if (installStep === 1 && deviceType === "ios") {
      return (
        <div className="flex flex-col items-center w-full max-w-md gap-4">
          <p className="text-center text-black dark:text-white">
            Tap the Share button below, then choose 'Add to Home Screen'.
          </p>
          <Image 
            src={isDarkTheme ? "/ios_add_to_homescreen_dark.png" : "/ios_add_to_homescreen_light.png"}
            alt="Add to Home Screen Instructions"
            width={300}
            height={150}
            priority
          />
          <Button 
            variant="default" 
            className={targetButtonStyle} 
            onClick={handleNextStep}
          >
            Next <ChevronRight className="ml-2" />
          </Button>
          
          <a 
            href="/instructions/ios" 
            className="text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white underline underline-offset-2"
          >
            View full instructions
          </a>
        </div>
      );
    } else if (installStep === 2 && deviceType === "ios") {
      return (
        <div className="flex flex-col items-center w-full max-w-md gap-4">
          <p className="text-center text-black dark:text-white">
            Success! You can now launch Side Hustle Bar from your home screen.
          </p>
          <Image 
            src="/app_icon_large.png" 
            alt="App Icon"
            width={120}
            height={120}
            priority
          />
          <Button 
            variant="default" 
            className={targetButtonStyle} 
            onClick={handleReset}
          >
            Done
          </Button>
        </div>
      );
    } else if (installStep === 1 && deviceType === "android") {
      return (
        <div className="flex flex-col items-center w-full max-w-md gap-4">
          <div className="text-center text-black dark:text-white space-y-3">
            <p className="font-medium">Install Side Hustle Bar:</p>
            <ol className="text-left text-sm space-y-2 list-decimal pl-5">
              <li>Tap the menu icon (⋮) in Chrome's top right corner</li>
              <li>Select "Install app" from the menu</li>
              <li>Tap "Install" on the prompt that appears</li>
            </ol>
          </div>
          
          <div className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-center">
            <div className="flex flex-col items-center space-y-1">
              <div className="text-2xl">⋮</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Menu</div>
            </div>
          </div>
          
          <Button 
            variant="default" 
            className={targetButtonStyle} 
            onClick={handleNextStep}
          >
            Next <ChevronRight className="ml-2" />
          </Button>
          
          <a 
            href="/instructions/android" 
            className="text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white underline underline-offset-2"
          >
            View full instructions
          </a>
        </div>
      );
    } else if (installStep === 2 && deviceType === "android") {
      return (
        <div className="flex flex-col items-center w-full max-w-md gap-4">
          <p className="text-center text-black dark:text-white">
            Success! You can now launch Side Hustle Bar from your home screen.
          </p>
          <Image 
            src="/app_icon_large.png" 
            alt="App Icon"
            width={120}
            height={120}
            priority
          />
          <Button 
            variant="default" 
            className={targetButtonStyle} 
            onClick={handleReset}
          >
            Done
          </Button>
        </div>
      );
    }
    return null; // Default case
  };

  return (
    <div className="my-8 p-4 border border-border rounded-lg bg-card text-card-foreground shadow-sm w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Updated Heading */} 
      <h3 className="text-xl font-semibold mb-4 text-center text-black dark:text-white">
        Stay Connected with Side Hustle Bar
      </h3>
      
      {/* Updated Descriptive Paragraph */}
      <p className="text-sm text-muted-foreground text-center mb-4">
        Install the Side Hustle Bar app and stay plugged into the action! Enable notifications to join our pack and get the first word on events, specials, and exclusives.
      </p>
      
      {/* Added benefit points */}
      <div className="w-full mb-6">
        <h4 className="text-md font-medium mb-2 text-center text-black dark:text-white">Why install the app?</h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <li className="flex items-start gap-2">
            <div className="rounded-full w-5 h-5 flex-shrink-0 bg-black dark:bg-white flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-white dark:text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300">Works offline - no internet needed</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full w-5 h-5 flex-shrink-0 bg-black dark:bg-white flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-white dark:text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300">Faster loading - like a native app</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full w-5 h-5 flex-shrink-0 bg-black dark:bg-white flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-white dark:text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300">Home screen icon for easy access</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full w-5 h-5 flex-shrink-0 bg-black dark:bg-white flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-white dark:text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300">Get event & special offer notifications</span>
          </li>
        </ul>
      </div>

      {/* Render install/notification steps */} 
      {renderContent()}
    </div>
  );
};

export default AppInstallFlow;
