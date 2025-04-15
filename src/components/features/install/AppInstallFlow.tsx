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
  const [installStatus, setInstallStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (navigator as any).standalone === true;
      setIsInstalled(isStandalone);
      return isStandalone;
    };
    
    // Initialize
    detectDevice();
    checkIfInstalled();
    
    // Listen for app installation success
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallStatus("success");
      setInstallStep(2); // Jump to success step
      
      // Show success message for 3 seconds then reset
      setTimeout(() => {
        setInstallStatus("idle");
      }, 3000);
    };
    
    // Listen for PWA install prompt availability
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent default browser prompt
      e.preventDefault();
      // Store event for later use
      setDeferredPrompt(e);
      // Reset any previous error states
      setErrorMessage(null);
      setInstallStatus("idle");
    };
    
    // Listen for display mode changes (another way to detect installation)
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
      }
    };
    
    // Set up event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', handleDisplayModeChange);
    
    // Use the global PWA install handler if available
    if ((window as any).pwaInstallHandler) {
      setIsInstalled((window as any).pwaInstallHandler.isInstalled());
    }
    
    // Enhanced event listeners for installation flow
    window.addEventListener('appInstallAvailable', (e: any) => {
      setErrorMessage(null);
      console.log('Install prompt available for platform:', e.detail?.platform);
    });
    
    window.addEventListener('appInstallSucceeded', () => {
      handleAppInstalled();
    });
    
    window.addEventListener('appInstallDeclined', () => {
      setInstallStatus("idle");
      console.log('User declined installation');
    });
    
    window.addEventListener('swReady', (e: any) => {
      console.log(`Service worker ready (version: ${e.detail?.version})`);
      // Reset any previous error states since service worker is ready
      setErrorMessage(null);
      setInstallStatus("idle");
    });
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('appInstallAvailable', () => {});
      window.removeEventListener('appInstallSucceeded', () => {});
      window.removeEventListener('appInstallDeclined', () => {});
      window.removeEventListener('swReady', () => {});
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);
  
  const handleInstallClick = async () => {
    // Reset any previous error messages
    setErrorMessage(null);
    
    // If already installed, show message
    if (isInstalled) {
      setErrorMessage("App is already installed on your device!");
      return;
    }
    
    setInstallStatus("pending");
    
    // Try using the global pwaInstallHandler if available
    if ((window as any).pwaInstallHandler && deviceType === "android") {
      try {
        const success = await (window as any).pwaInstallHandler.promptInstall();
        if (success) {
          // Will be handled by the appInstallSucceeded event
          setInstallStatus("success");
          setDeferredPrompt(null);
        } else {
          // User declined installation
          setInstallStatus("idle");
        }
        return;
      } catch (error) {
        console.error("Install handler error:", error);
        // Fall back to direct prompt
      }
    }
    
    // Direct prompt fallback
    if (deviceType === "android" && deferredPrompt) {
      try {
        // Show the install prompt for Android
        deferredPrompt.prompt();
        
        // Set status to pending
        setInstallStatus("pending");
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          setInstallStatus("success");
          setInstallStep(2); // Move to success step
          setDeferredPrompt(null);
          
          // Reset success status after 3 seconds
          setTimeout(() => {
            setInstallStatus("idle");
          }, 3000);
        } else {
          // User declined installation
          setInstallStatus("idle");
        }
      } catch (error) {
        console.error("Installation error:", error);
        setInstallStatus("error");
        setErrorMessage("There was a problem with installation. Please try again.");
        
        // Reset error status after 5 seconds
        setTimeout(() => {
          setInstallStatus("idle");
          setErrorMessage(null);
        }, 5000);
      }
    } else if (deviceType === "ios") {
      // For iOS, show the installation steps
      setInstallStatus("idle");
      setInstallStep(1);
    } else if (deviceType === "desktop") {
      // For desktop, try to use the Chrome installation prompt
      if (deferredPrompt) {
        try {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          
          if (outcome === 'accepted') {
            setInstallStatus("success");
            setInstallStep(2);
            setDeferredPrompt(null);
          } else {
            setInstallStatus("idle");
          }
        } catch (error) {
          console.error("Desktop installation error:", error);
          setInstallStatus("error");
          setErrorMessage("There was a problem with installation. Please try again.");
        }
      } else {
        // No prompt available for desktop
        setInstallStatus("error");
        setErrorMessage("Installation not available in this browser. Please use Chrome, Edge, or Samsung Internet.");
      }
    } else {
      // Unknown device or unsupported browser
      setInstallStatus("error");
      setErrorMessage("Installation not supported on this device or browser.");
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
      return isDarkTheme ? "/app-install-ios-dark.png" : "/app-install-ios-light.png";
    } else if (deviceType === "android") {
      return isDarkTheme ? "/app-install-android-dark.png" : "/app-install-android-light.png";
    } 
    return ""; // Default empty for desktop (will use Lucide icon)
  };
  
  // Get the alt text for the installation icon
  const getInstallIconAlt = () => {
    return deviceType === "ios" ? "iOS Install" : "Android Install";
  };
  
  // Render different content based on device type, installation step, and status
  const renderContent = () => {
    // If the app is already installed, show success message
    if (isInstalled) {
      return (
        <div className="flex flex-col items-center w-full max-w-md gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-lg flex items-center gap-3 w-full">
            <div className="rounded-full bg-green-500 p-1.5 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm">Already Installed!</p>
              <p className="text-xs mt-1 text-green-700 dark:text-green-300">
                Side Hustle Bar is installed on your device.
              </p>
            </div>
          </div>
          
          {/* Notifications button when app is already installed */}
          <div 
            className={`${targetButtonStyle} cursor-pointer flex items-center justify-center gap-2 py-3 px-6`}
            onClick={handleNotificationsClick}
          >
            <div className="w-7 h-7 rounded-full bg-white dark:bg-black flex items-center justify-center mr-1">
              <Bell className="w-5 h-5 text-black dark:text-white" />
            </div>
            <span>Enable Notifications</span>
          </div>
        </div>
      );
    }
    
    // If there's an error message, show it
    if (errorMessage && installStatus === "error") {
      return (
        <div className="flex flex-col items-center w-full max-w-md gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg flex items-center gap-3 w-full">
            <div className="rounded-full bg-red-500 p-1.5 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm">Installation Failed</p>
              <p className="text-xs mt-1 text-red-700 dark:text-red-300">
                {errorMessage}
              </p>
            </div>
          </div>
          
          <Button 
            variant="default"
            className={targetButtonStyle}
            onClick={handleInstallClick}
          >
            Try Again
          </Button>
          
          {/* View detailed instructions fallback */}
          {deviceType === "android" || deviceType === "ios" ? (
            <div className="mt-2 text-center w-full">
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
    }
    
    // Normal installation flow based on steps
    if (installStep === 0) {
      return (
        <div className="flex flex-col items-center w-full max-w-md gap-4">
          {/* Installation button with platform-specific UI */}
          <Button 
            variant="default"
            className={targetButtonStyle}
            onClick={handleInstallClick}
            disabled={installStatus === "pending"}
          >
            {installStatus === "pending" ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Installing...</span>
              </div>
            ) : installStatus === "success" ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Installation Complete!</span>
              </div>
            ) : deviceType === "android" ? (
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
                <div className="w-7 h-7 rounded-full bg-white dark:bg-black flex items-center justify-center mr-1">
                  <Download className="w-2.5 h-2.5 text-black dark:text-white" />
                </div>
                Install App
              </>
            )}
          </Button>
          
          {/* Notifications button */}
          <div 
            className={`${targetButtonStyle} cursor-pointer flex items-center justify-center gap-2 py-3 px-6`}
            onClick={handleNotificationsClick}
          >
            <div className="w-7 h-7 rounded-full bg-white dark:bg-black flex items-center justify-center mr-1">
              <Bell className="w-5 h-5 text-black dark:text-white" />
            </div>
            <span>Enable Notifications</span>
          </div>
          
          {/* Platform-specific installation instructions link */}
          {deviceType === "android" || deviceType === "ios" ? (
            <div className="mt-4 text-center w-full">
              <a 
                href={deviceType === "ios" ? "/instructions/ios" : "/instructions/android"} 
                className={`inline-flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 text-white dark:text-black font-medium text-sm rounded-md border border-gray-600 dark:border-gray-300 shadow-md hover:shadow-lg transition-all duration-200 w-full max-w-md`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View detailed installation instructions
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
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
          
          {/* Enhanced iOS installation guide */}
          <div className="relative bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700 w-full">
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              Step 1
            </div>
            <Image 
              src={isDarkTheme ? "/ios-add-homescreen-screenshot.png" : "/ios-add-homescreen-screenshot.png"}
              alt="Tap the Share button"
              width={300}
              height={150}
              className="mx-auto rounded-md shadow-sm border border-gray-200 dark:border-gray-700"
              priority
            />
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-2 text-center">
              First, tap the Share button in Safari's toolbar
            </p>
          </div>
          
          <div className="relative bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700 w-full mt-2">
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              Step 2
            </div>
            <Image 
              src={isDarkTheme ? "/ios-share-button.png" : "/ios-share-button.png"}
              alt="Choose Add to Home Screen"
              width={300}
              height={150}
              className="mx-auto rounded-md shadow-sm border border-gray-200 dark:border-gray-700"
              priority
            />
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-2 text-center">
              Then, select "Add to Home Screen" from the options
            </p>
          </div>
          
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
    } else if (installStep === 2) {
      // Common success screen for all platforms
      return (
        <div className="flex flex-col items-center w-full max-w-md gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-lg flex items-center gap-3 w-full">
            <div className="rounded-full bg-green-500 p-1.5 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm">Installation Complete!</p>
              <p className="text-xs mt-1 text-green-700 dark:text-green-300">
                Side Hustle Bar has been added to your home screen.
              </p>
            </div>
          </div>
        
          <Image 
            src="/apple-touch-icon.png" 
            alt="App Icon"
            width={120}
            height={120}
            className="rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
            priority
          />
          
          <p className="text-center text-black dark:text-white text-sm">
            You can now access Side Hustle Bar directly from your home screen for a faster experience.
          </p>
          
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
          {/* Enhanced Android installation guide */}
          <div className="relative bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700 w-full">
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              Steps
            </div>
            
            <h4 className="text-blue-900 dark:text-blue-100 font-medium mb-2 text-center">
              Install Side Hustle Bar:
            </h4>
            
            <ol className="text-left text-sm space-y-3 list-decimal pl-5 text-blue-800 dark:text-blue-200">
              <li className="pb-2 border-b border-blue-100 dark:border-blue-700">
                <span className="font-medium">Tap the menu icon</span> (⋮) in Chrome's top right corner
                <div className="mt-1 flex justify-center">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg flex flex-col items-center border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl leading-none text-gray-700 dark:text-gray-300">⋮</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Menu</div>
                  </div>
                </div>
              </li>
              
              <li className="pb-2 border-b border-blue-100 dark:border-blue-700">
                <span className="font-medium">Select "Install app"</span> from the menu
                <div className="mt-1 bg-white dark:bg-gray-800 rounded-md p-2 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 py-1 px-2 rounded-md bg-blue-50 dark:bg-blue-900/20">
                    <div className="w-5 h-5 flex-shrink-0">
                      <Download className="w-full h-full text-gray-700 dark:text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Install app...</span>
                  </div>
                </div>
              </li>
              
              <li>
                <span className="font-medium">Tap "Install"</span> on the prompt that appears
                <div className="mt-1 bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 flex justify-center">
                  <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm pointer-events-none">
                    Install
                  </Button>
                </div>
              </li>
            </ol>
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
    }
    
    return null; // Default case
  };

  return (
    <div className="my-8 p-4 border border-border rounded-lg bg-card text-card-foreground shadow-sm w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Updated Heading */} 
      <h3 className="text-xl font-semibold mb-4 text-center text-black dark:text-white">
        Stay Connected with Side Hustle Bar
      </h3>
      
      {/* Updated Descriptive Paragraph with requested text change */}
      <p className="text-sm text-muted-foreground text-center mb-4">
        Install the app and join the pack! Enable notifications to stay connected and get the first word on events, specials, and exclusives.
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
