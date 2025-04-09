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
              <Bell className="w-5 h-5 text-black dark:text-white" /> {/* Kept w-5 h-5 for Bell based on last change */}
            </div>
            {/* Replace img with text */}
            <span>Enable Notifications</span>
          </div>
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
            layout="intrinsic"
            priority
          />
          <Button 
            variant="default" 
            className={targetButtonStyle} 
            onClick={handleNextStep}
          >
            Next <ChevronRight className="ml-2" />
          </Button>
        </div>
      );
    } else if (installStep === 2 && deviceType === "ios") {
      return (
        <div className="flex flex-col items-center w-full max-w-md gap-4">
          <p className="text-center text-black dark:text-white">
            Success! You can now launch Hustle Hard from your home screen.
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

      {/* Render install/notification steps */} 
      {renderContent()}
    </div>
  );
};

export default AppInstallFlow;
