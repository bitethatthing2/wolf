"use client";

import { useState, useEffect } from "react";
import { Download, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import useFcmToken from "@/hooks/useFcmToken";

export function AppActions() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const { 
    token: fcmToken, 
    notificationPermissionStatus, 
    requestNotificationPermission, 
  } = useFcmToken();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Installation Instructions",
        description: "To install this app, use your browser's 'Add to Home Screen' or 'Install' option from the menu.",
        variant: "default",
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    
    if (outcome === 'accepted') {
      toast({
        title: "App Installed",
        description: "Thank you for installing our app!",
        variant: "default",
      });
      setIsInstallable(false);
    } else {
      toast({
        title: "Installation Declined",
        description: "You can install the app later from the browser menu if you change your mind.",
        variant: "default",
      });
    }
  };

  const handleNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      await requestNotificationPermission();
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast({
        title: "Notification Error",
        description: "An unexpected error occurred while setting up notifications.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const isInStandaloneMode = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true;
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <Button
        variant="hustle"
        size="lg"
        className="w-full justify-center"
        onClick={handleInstall}
        disabled={!isInstallable || isInStandaloneMode()}
      >
        <Download className="mr-2 h-5 w-5" />
        {isInStandaloneMode() ? "App Installed" : "Install App"}
      </Button>
      <Button
        variant="hustle"
        size="lg"
        className="w-full justify-center"
        onClick={handleNotifications}
        disabled={isLoadingNotifications || notificationPermissionStatus === "denied" || (notificationPermissionStatus === "granted" && !!fcmToken) }
      >
        <Bell className="mr-2 h-5 w-5" />
        {notificationPermissionStatus === "granted" 
          ? (fcmToken ? "Notifications Enabled" : "Enabling...") 
          : notificationPermissionStatus === "denied" 
            ? "Notifications Blocked" 
            : "Enable Notifications"}
      </Button>
    </div>
  );
}
