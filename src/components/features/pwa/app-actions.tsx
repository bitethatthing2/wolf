"use client";

import { useState, useEffect } from "react";
import { Download, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchToken } from "@/lib/firebase/client";
import { toast } from "@/hooks/use-toast";

export function AppActions() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [notificationStatus, setNotificationStatus] = useState<"default" | "granted" | "denied">("default");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if the app is installable
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setIsInstallable(true);
    };

    // Check notification permission status
    const checkNotificationPermission = () => {
      if (typeof Notification !== 'undefined') {
        setNotificationStatus(Notification.permission as "default" | "granted" | "denied");
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    checkNotificationPermission();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // If the app is already installed or not installable, provide instructions
      toast({
        title: "Installation Instructions",
        description: "To install this app, use your browser's 'Add to Home Screen' or 'Install' option from the menu.",
        variant: "default",
      });
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again, so clear it
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
    setIsLoading(true);
    
    try {
      // First, check if notifications are supported
      if (!("Notification" in window)) {
        toast({
          title: "Notifications Not Supported",
          description: "Your browser doesn't support push notifications.",
          variant: "destructive",
        });
        return;
      }

      // If permission is already granted, register for push
      if (Notification.permission === "granted") {
        await registerForPush();
        return;
      }

      // If permission is denied, inform the user they need to change browser settings
      if (Notification.permission === "denied") {
        toast({
          title: "Notifications Blocked",
          description: "You've blocked notifications. Please update your browser settings to enable them.",
          variant: "destructive",
        });
        return;
      }

      // Request permission
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission as "default" | "granted" | "denied");
      
      if (permission === "granted") {
        await registerForPush();
      } else {
        toast({
          title: "Notifications Declined",
          description: "You won't receive updates about new events and promotions.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error setting up notifications:", error);
      toast({
        title: "Notification Error",
        description: "There was a problem setting up notifications. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registerForPush = async () => {
    try {
      // Get service worker registration
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        // Get FCM token using the registration
        const token = await fetchToken(registration);
        
        if (token) {
          // Here you would typically send this token to your backend
          console.log("FCM Token:", token);
          
          // Show success message
          toast({
            title: "Notifications Enabled",
            description: "You'll now receive updates about new events and promotions!",
            variant: "default",
          });
          
          // Optional: Send a test notification
          // This could be done via your backend or directly here for testing
          setTimeout(() => {
            new Notification("Welcome to Side Hustle Bar!", {
              body: "Thanks for enabling notifications. You'll now receive updates about events and promotions.",
              icon: "/logo-main-dark.png"
            });
          }, 2000);
        } else {
          throw new Error("Failed to get notification token");
        }
      } else {
        throw new Error("Service workers not supported");
      }
    } catch (error) {
      console.error("Error registering for push:", error);
      throw error;
    }
  };

  // Check if the app is in standalone mode (installed)
  const isInStandaloneMode = () => {
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
        disabled={!isInstallable && isInStandaloneMode()}
      >
        <Download className="mr-2" />
        Install App
      </Button>
      <Button
        variant="hustle"
        size="lg"
        className="w-full justify-center"
        onClick={handleNotifications}
        disabled={isLoading || notificationStatus === "denied"}
      >
        <Bell className="mr-2" />
        {notificationStatus === "granted" 
          ? "Notifications Enabled" 
          : notificationStatus === "denied" 
            ? "Notifications Blocked" 
            : "Enable Notifications"}
      </Button>
    </div>
  );
}
