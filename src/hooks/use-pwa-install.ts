"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Hook to manage PWA installation
 * @returns Object containing installation state and functions
 */
export const usePwaInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(false);
  const { toast } = useToast();

  // Check if already installed as PWA
  const checkIfInstalled = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);
    return isStandalone;
  }, []);

  // Check if iOS device
  const checkIfIOS = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                       !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    return isIOSDevice;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Don't prevent default - this was causing the banner not to show in some cases
      // Only prevent default if we want to completely control the installation flow
      // e.preventDefault();
      
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      console.log('PWA is installable - beforeinstallprompt event captured');
    };

    // Handle appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setIsInstallable(false);
      
      toast({
        title: "App Installed",
        description: "Hustle Hard has been successfully installed on your device!",
        duration: 5000,
      });
      
      console.log('PWA was installed successfully');
      
      // Track installation in analytics if needed
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_install', {
          'event_category': 'engagement',
          'event_label': 'PWA Installation'
        });
      }
    };

    // Check for display-mode changes (useful for when user installs without our prompt)
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        console.log('Display mode changed to standalone - PWA is now installed');
      }
    };
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');

    // Initial checks
    checkIfInstalled();
    checkIfIOS();

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    // Clean up event listeners
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, [toast, checkIfInstalled, checkIfIOS]);

  // Function to prompt installation
  const promptInstall = async (): Promise<boolean> => {
    if (!installPrompt) {
      console.log('No installation prompt available');
      return false;
    }

    try {
      // Show the install prompt
      await installPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA installation');
        setInstallPrompt(null);
        setIsInstallable(false);
        return true;
      } else {
        console.log('User dismissed the PWA installation');
        setInstallDismissed(true);
        return false;
      }
    } catch (error) {
      console.error('Error during installation prompt:', error);
      return false;
    }
  };

  // Reset the dismissed state (to potentially show the prompt again)
  const resetInstallDismissed = () => {
    setInstallDismissed(false);
  };

  return {
    isInstallable,
    isInstalled,
    isIOS,
    installDismissed,
    promptInstall,
    resetInstallDismissed,
    checkIfInstalled, // Expose this for components to recheck status
  };
};

export default usePwaInstall;
