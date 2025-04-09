"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";

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
  
  // Common button style based on theme
  const getButtonClassName = (isSecondary = false) => {
    return `h-16 text-lg font-semibold ${
      isSecondary ? "" : "w-full"
    } ${
      isDarkTheme ? "bg-primary text-primary-foreground" : "bg-black text-white hover:bg-black/90"
    } ${deviceType === "android" || deviceType === "ios" ? "py-3" : ""}`;
  };
  
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
        <div className="flex flex-col w-full max-w-md gap-4">
          {deviceType === "ios" || deviceType === "android" ? (
            <Button 
              variant="default"
              className={getButtonClassName()}
              onClick={handleInstallClick}
            >
              {deviceType === "android" ? (
                <div className="flex items-center justify-center w-full">
                  <div className="flex items-center justify-center gap-3">
                    <div className="rounded-full w-10 h-10 flex items-center justify-center overflow-hidden">
                      {isDarkTheme ? (
                        <Image 
                          src="/android-installation-guide-white.png.png"
                          alt="Android Install"
                          width={48}
                          height={48}
                          className="w-12 h-12"
                          priority
                        />
                      ) : (
                        <Image 
                          src="/android_installation_guide-black.png"
                          alt="Android Install"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                          priority
                        />
                      )}
                    </div>
                    <span>Install on Android</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  {isDarkTheme ? (
                    // Larger white Apple icon in dark mode
                    <div className="relative mr-4 w-10 h-10">
                      <Image 
                        src="/apple_icon_install_white.png"
                        alt="iOS Install"
                        width={40}
                        height={40}
                        priority
                      />
                    </div>
                  ) : (
                    // Larger black Apple icon in light mode
                    <div className="relative mr-4 w-10 h-10">
                      <Image 
                        src="/ios_pwa_install-black.png"
                        alt="iOS Install"
                        width={40}
                        height={40}
                        priority
                      />
                    </div>
                  )}
                  <span>Install on iOS</span>
                </div>
              )}
            </Button>
          ) : (
            <Button 
              variant="default"
              className={getButtonClassName()}
              onClick={handleInstallClick}
            >
              <Download className="mr-2" />
              Install App
            </Button>
          )}
          <Button 
            variant="default"
            className={getButtonClassName()}
            onClick={handleNotificationsClick}
          >
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center justify-center gap-3">
                <div className="rounded-full w-10 h-10 flex items-center justify-center overflow-hidden">
                  {isDarkTheme ? (
                    <Image 
                      src="/enable-notifications-dark.png"
                      alt="Enable Notifications"
                      width={36}
                      height={36}
                      className="w-9 h-9"
                      priority
                    />
                  ) : (
                    <Image 
                      src="/enable-notifications-light-screen.png"
                      alt="Enable Notifications"
                      width={36}
                      height={36}
                      className="w-9 h-9"
                      priority
                    />
                  )}
                </div>
                <span>Enable Notifications</span>
              </div>
            </div>
          </Button>
        </div>
      );
    } else if (installStep === 1 && deviceType === "ios") {
      return (
        <div className={`flex flex-col w-full max-w-md items-center text-center gap-4 p-6 border rounded-lg ${isDarkTheme ? 'border-white/10 bg-black/70' : 'border-black/10 bg-white/70'} backdrop-blur-sm`}>
          <h3 className="text-xl font-bold">Step 1: Tap the Share Button</h3>
          <p className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Tap the Share button at the bottom of your screen</p>
          <div className="relative w-full h-64 my-4">
            <Image 
              src="/share-ios.png" 
              alt="iOS Share Button" 
              fill
              style={{objectFit: "contain"}}
              className="rounded-lg"
              priority
            />
          </div>
          <Button 
            variant="default"
            className={getButtonClassName()}
            onClick={handleNextStep}
          >
            Next Step <ChevronRight className="ml-2" />
          </Button>
        </div>
      );
    } else if (installStep === 2 && deviceType === "ios") {
      return (
        <div className={`flex flex-col w-full max-w-md items-center text-center gap-4 p-6 border rounded-lg ${isDarkTheme ? 'border-white/10 bg-black/70' : 'border-black/10 bg-white/70'} backdrop-blur-sm`}>
          <h3 className="text-xl font-bold">Step 2: Add to Home Screen</h3>
          <p className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Tap "Add to Home Screen" option</p>
          <div className="relative w-full h-64 my-4">
            <Image 
              src="/ios-add-homescreen.png" 
              alt="Add to Home Screen" 
              fill
              style={{objectFit: "contain"}}
              className="rounded-lg"
              priority
            />
          </div>
          <Button 
            variant="default"
            className={getButtonClassName()}
            onClick={handleNextStep}
          >
            Next Step <ChevronRight className="ml-2" />
          </Button>
        </div>
      );
    } else if (installStep === 3) {
      return (
        <div className={`flex flex-col w-full max-w-md items-center text-center gap-4 p-6 border rounded-lg ${isDarkTheme ? 'border-white/10 bg-black/70' : 'border-black/10 bg-white/70'} backdrop-blur-sm`}>
          <h3 className="text-xl font-bold">Final Step: Enable Notifications</h3>
          <p className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Once the app is installed, tap "Enable Notifications" to stay updated</p>
          <Button 
            variant="default"
            className={getButtonClassName()}
            onClick={handleNotificationsClick}
          >
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center justify-center gap-3">
                <div className="rounded-full w-10 h-10 flex items-center justify-center overflow-hidden">
                  {isDarkTheme ? (
                    <Image 
                      src="/enable-notifications-dark.png"
                      alt="Enable Notifications"
                      width={36}
                      height={36}
                      className="w-9 h-9"
                      priority
                    />
                  ) : (
                    <Image 
                      src="/enable-notifications-light-screen.png"
                      alt="Enable Notifications"
                      width={36}
                      height={36}
                      className="w-9 h-9"
                      priority
                    />
                  )}
                </div>
                <span>Enable Notifications</span>
              </div>
            </div>
          </Button>
          <button 
            className={`text-sm underline mt-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}
            onClick={handleReset}
          >
            Back to beginning
          </button>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="w-full flex justify-center my-6">
      {renderContent()}
    </div>
  );
};

export default AppInstallFlow;
