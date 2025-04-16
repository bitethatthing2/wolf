"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { setupForegroundMessageHandler } from '@/lib/firebase/client';
import { 
  registerForPushNotifications, 
  unregisterFromPushNotifications 
} from '@/lib/supabase/notification-service';
import { getSupabaseClient } from '@/lib/supabase/client';

/**
 * Hook to manage Firebase Cloud Messaging (FCM) notifications
 * @returns Object containing notification state and functions
 */
export const useFcmNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const { toast } = useToast();

  // Check if notifications are supported and permission is granted
  const checkNotificationStatus = useCallback(async () => {
    if (typeof window === 'undefined') return false;
    
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }
    
    // Check if permission is granted
    const permissionStatus = Notification.permission;
    const isEnabled = permissionStatus === 'granted';
    setNotificationsEnabled(isEnabled);
    
    return isEnabled;
  }, []);

  // Get the service worker registration
  const getServiceWorkerRegistration = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }
    
    try {
      // Get all registrations
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      // Find the main service worker registration
      const mainRegistration = registrations.find(reg => 
        reg.active && reg.scope.includes(window.location.origin)
      );
      
      if (mainRegistration) {
        console.log('Found service worker registration with scope:', mainRegistration.scope);
        setServiceWorkerRegistration(mainRegistration);
        return mainRegistration;
      } else {
        console.log('No service worker registration found');
        return null;
      }
    } catch (error) {
      console.error('Error getting service worker registration:', error);
      return null;
    }
  }, []);

  // Register for push notifications
  const registerForNotifications = useCallback(async () => {
    setIsRegistering(true);
    
    try {
      // Initialize Supabase client when needed
      const supabase = getSupabaseClient();

      // Check if notifications are supported
      if (!('Notification' in window)) {
        toast({
          title: "Notifications Not Supported",
          description: "Your browser does not support notifications.",
          variant: "destructive",
        });
        setIsRegistering(false);
        return false;
      }
      
      // Request permission if not granted
      let permission = Notification.permission;
      if (permission !== 'granted') {
        console.log('Requesting notification permission');
        permission = await Notification.requestPermission();
      }
      
      if (permission !== 'granted') {
        toast({
          title: "Permission Denied",
          description: "You need to allow notification permission to receive updates.",
          variant: "destructive",
        });
        setIsRegistering(false);
        return false;
      }
      
      // Get service worker registration if not already available
      const swReg = serviceWorkerRegistration || await getServiceWorkerRegistration();
      
      if (!swReg) {
        toast({
          title: "Service Worker Error",
          description: "Could not find service worker registration. Try refreshing the page.",
          variant: "destructive",
        });
        setIsRegistering(false);
        return false;
      }
      
      // Register for push notifications
      const token = await registerForPushNotifications(swReg, supabase);
      
      if (!token) {
        toast({
          title: "Registration Failed",
          description: "Could not register for push notifications. Please try again later.",
          variant: "destructive",
        });
        setIsRegistering(false);
        return false;
      }
      
      // Set the token and notification status
      setFcmToken(token);
      setNotificationsEnabled(true);

      // Log the FCM token to the console for debugging
      console.log('[FCM] Push notifications enabled, FCM token:', token);

      toast({
        title: "Notifications Enabled",
        description: "You will now receive notifications from Side Hustle Bar.",
      });
      
      // Setup foreground message handler
      setupForegroundMessageHandler();
      
      setIsRegistering(false);
      return true;
    } catch (error) {
      console.error('Error registering for notifications:', error);
      toast({
        title: "Registration Error",
        description: "An error occurred while registering for notifications.",
        variant: "destructive",
      });
      setIsRegistering(false);
      return false;
    }
  }, [serviceWorkerRegistration, getServiceWorkerRegistration, toast]);

  // Unregister from push notifications
  const unregisterFromNotifications = useCallback(async () => {
    // Initialize Supabase client when needed
    const supabase = getSupabaseClient();

    if (!fcmToken) {
      console.log('No FCM token to unregister');
      return false;
    }
    
    try {
      const success = await unregisterFromPushNotifications(fcmToken, supabase);
      
      if (success) {
        setFcmToken(null);
        setNotificationsEnabled(false);
        
        toast({
          title: "Notifications Disabled",
          description: "You will no longer receive notifications from Side Hustle Bar.",
        });
        
        return true;
      } else {
        toast({
          title: "Unregister Failed",
          description: "Could not disable notifications. Please try again later.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error unregistering from notifications:', error);
      toast({
        title: "Unregister Error",
        description: "An error occurred while disabling notifications.",
        variant: "destructive",
      });
      return false;
    }
  }, [fcmToken, toast]);

  // Initialize the hook
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const init = async () => {
      // Check notification status
      await checkNotificationStatus();
      
      // Get service worker registration
      await getServiceWorkerRegistration();
      
      // Setup foreground message handler if notifications are enabled
      if (notificationsEnabled) {
        setupForegroundMessageHandler();
        
        // Send a welcome notification if needed
        // We can use localStorage to make sure this only happens once per device
        const hasShownWelcome = localStorage.getItem('sidehustle_welcome_shown');
        if (!hasShownWelcome && 'Notification' in window) {
          localStorage.setItem('sidehustle_welcome_shown', 'true');
          
          // Get user agent info to customize welcome message
          const userAgent = navigator.userAgent;
          const isIOS = /iPad|iPhone|iPod/.test(userAgent);
          const isAndroid = /Android/.test(userAgent);
          
          // Custom welcome message based on platform
          let welcomeMessage = 'You\'ll now receive updates about our latest events and specials.';
          if (isIOS) {
            welcomeMessage = 'Thanks for enabling notifications on your iOS device!';
          } else if (isAndroid) {
            welcomeMessage = 'Thanks for joining the Side Hustle pack! You\'ll get updates on events and specials.';
          }
          
          // Small delay to not overwhelm the user
          setTimeout(() => {
            try {
              new Notification('Welcome to Side Hustle Bar!', {
                body: welcomeMessage,
                icon: '/logo-main-dark.png',
                badge: '/icons/splash_screens/icon.png',
                silent: false,
                tag: 'welcome-notification'
              });
            } catch (error) {
              console.error('Error showing welcome notification:', error);
            }
          }, 2000);
        }
      }
    };
    
    init();
  }, [checkNotificationStatus, getServiceWorkerRegistration, notificationsEnabled]);

  return {
    fcmToken,
    notificationsEnabled,
    isRegistering,
    registerForNotifications,
    unregisterFromNotifications,
    checkNotificationStatus,
  };
};

export default useFcmNotifications;
