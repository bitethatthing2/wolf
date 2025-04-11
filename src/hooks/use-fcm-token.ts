"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

// Import Firebase functions from your existing implementation
import { fetchToken, setupForegroundMessageHandler, isIOS } from "@/lib/firebase/client";

// Hook version for debugging
const HOOK_VERSION = '1.1.0';

// Token refresh interval (7 days in milliseconds)
const TOKEN_REFRESH_INTERVAL = 7 * 24 * 60 * 60 * 1000;

/**
 * Hook to manage FCM token for push notifications
 * @returns Object containing notification permission status, token, and loading state
 */
export const useFcmToken = () => {
  const [notificationPermissionStatus, setNotificationPermissionStatus] = 
    useState<NotificationPermission | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  const retryLoadToken = useRef(0);
  const isLoading = useRef(false);
  const messageHandlerRef = useRef<any>(null);
  const { toast } = useToast();

  // Function to get notification permission and FCM token
  const getNotificationPermissionAndToken = async () => {
    console.log(`[useFcmToken v${HOOK_VERSION}] Starting permission and token fetch process`);
    
    // Check if Notifications are supported in the browser
    if (!("Notification" in window)) {
      console.info(`[useFcmToken v${HOOK_VERSION}] This browser does not support desktop notification`);
      return { token: null, isDevelopmentMode: false };
    }

    // Log current permission state
    console.log(`[useFcmToken v${HOOK_VERSION}] Current notification permission: ${Notification.permission}`);
    
    // Check if permission is already granted
    if (Notification.permission === "granted") {
      console.log(`[useFcmToken v${HOOK_VERSION}] Notification permission already granted`);
      const token = await fetchToken(null);
      
      // Check if we're using a development token
      const isDevelopmentMode = token === "test-token-for-ui-development";
      console.log(`[useFcmToken v${HOOK_VERSION}] Token fetched, isDevelopmentMode: ${isDevelopmentMode}`);
      
      return { token, isDevelopmentMode };
    }

    // If permission is not denied, request permission from the user
    if (Notification.permission !== "denied") {
      console.log(`[useFcmToken v${HOOK_VERSION}] Requesting notification permission...`);
      const permission = await Notification.requestPermission();
      console.log(`[useFcmToken v${HOOK_VERSION}] Permission request result: ${permission}`);
      
      if (permission === "granted") {
        console.log(`[useFcmToken v${HOOK_VERSION}] Notification permission granted, fetching token...`);
        const token = await fetchToken(null);
        
        // Check if we're using a development token
        const isDevelopmentMode = token === "test-token-for-ui-development";
        console.log(`[useFcmToken v${HOOK_VERSION}] Token fetched, isDevelopmentMode: ${isDevelopmentMode}`);
        
        return { token, isDevelopmentMode };
      }
    }

    console.log(`[useFcmToken v${HOOK_VERSION}] Notification permission not granted.`);
    return { token: null, isDevelopmentMode: false };
  };

  // Function to load FCM token
  const loadToken = async () => {
    // Prevent multiple fetches if already in progress
    if (isLoading.current) {
      console.log(`[useFcmToken v${HOOK_VERSION}] Token load already in progress, skipping...`);
      return;
    }

    console.log(`[useFcmToken v${HOOK_VERSION}] Starting token load process...`);
    isLoading.current = true;
    const { token, isDevelopmentMode } = await getNotificationPermissionAndToken();

    // Handle permission denied
    if (Notification.permission === "denied") {
      console.log(`[useFcmToken v${HOOK_VERSION}] Permission denied, stopping token fetch`);
      setNotificationPermissionStatus("denied");
      isLoading.current = false;
      return;
    }

    // Retry fetching token if necessary (up to 3 times)
    if (!token) {
      if (retryLoadToken.current >= 3) {
        console.log(`[useFcmToken v${HOOK_VERSION}] Max retries reached, giving up`);
        toast({
          title: "Notification Error",
          description: "Unable to initialize notifications",
          variant: "destructive"
        });
        isLoading.current = false;
        return;
      }

      retryLoadToken.current += 1;
      console.log(`[useFcmToken v${HOOK_VERSION}] Retrying token fetch, attempt ${retryLoadToken.current}/3`);
      isLoading.current = false;
      await loadToken();
      return;
    }

    // Set token and status
    console.log(`[useFcmToken v${HOOK_VERSION}] Token obtained: ${token.substring(0, 10)}...`);
    setToken(token);
    setIsDevelopmentMode(isDevelopmentMode);
    setNotificationPermissionStatus("granted");
    
    // Set up foreground message handler if not already set
    if (!messageHandlerRef.current) {
      console.log(`[useFcmToken v${HOOK_VERSION}] Setting up foreground message handler`);
      messageHandlerRef.current = setupForegroundMessageHandler();
    }
    
    isLoading.current = false;
  };

  // Request permission and get token
  const requestPermission = async () => {
    if (isLoading.current) return;
    
    console.log(`[useFcmToken v${HOOK_VERSION}] Requesting permission manually...`);
    await loadToken();
  };

  // Check if notifications are supported on iOS
  const checkIOSSupport = () => {
    if (isIOS() && "Notification" in window && Notification.permission === "default") {
      console.log(`[useFcmToken v${HOOK_VERSION}] iOS detected, showing special instructions`);
      toast({
        title: "Enable Notifications on iOS",
        description: "For iOS devices, you'll need to add this app to your home screen first.",
        duration: 5000
      });
    }
  };

  // Initialize on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    console.log(`[useFcmToken v${HOOK_VERSION}] Hook initialized`);
    
    // Set initial permission status
    if ("Notification" in window) {
      setNotificationPermissionStatus(Notification.permission as NotificationPermission);
    } else {
      console.log(`[useFcmToken v${HOOK_VERSION}] Notifications not supported in this browser`);
    }
    
    // Check for iOS-specific instructions
    checkIOSSupport();
    
    // Load token if permission is already granted
    if (Notification.permission === "granted") {
      loadToken();
    }
    
    // Set up token refresh interval
    const tokenRefreshInterval = setInterval(() => {
      if (Notification.permission === "granted") {
        console.log(`[useFcmToken v${HOOK_VERSION}] Refreshing FCM token on schedule`);
        loadToken();
      }
    }, TOKEN_REFRESH_INTERVAL);
    
    // Clean up on unmount
    return () => {
      // Clear token refresh interval
      clearInterval(tokenRefreshInterval);
      
      // Clean up message handler
      if (messageHandlerRef.current && typeof messageHandlerRef.current === "function") {
        console.log(`[useFcmToken v${HOOK_VERSION}] Cleaning up message handler`);
        messageHandlerRef.current();
        messageHandlerRef.current = null;
      }
    };
  }, []);

  return {
    notificationPermissionStatus,
    token,
    isDevelopmentMode,
    isLoading: isLoading.current,
    requestPermission,
  };
};

export default useFcmToken;
