"use client";

import { useEffect, useRef, useState } from "react";
// Adjust the import path based on your actual firebase setup location
import { fetchToken, setupForegroundMessageHandler, isIOS } from "@/lib/firebase/firebase"; 
import { toast } from "sonner";

// For debugging version mismatches
const HOOK_VERSION = '3.0.0'; // Updated version for new project

// --- Function to save token to backend --- 
async function saveTokenToBackend(token: string) {
  console.log(`[useFcmToken v${HOOK_VERSION}] Attempting to save token to backend...`);
  try {
    const response = await fetch('/api/save-fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`[useFcmToken v${HOOK_VERSION}] Token saved successfully:`, result);
    toast.success("Notification token registered.");
    return true;

  } catch (error) {
    console.error(`[useFcmToken v${HOOK_VERSION}] Error saving token to backend:`, error);
    toast.error(`Failed to save notification token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}
// --- End Function to save token --- 

async function getNotificationPermissionAndToken() {
  console.log(`[useFcmToken v${HOOK_VERSION}] Starting permission and token fetch process`);
  
  if (typeof window === 'undefined' || !("Notification" in window)) {
    console.info(`[useFcmToken v${HOOK_VERSION}] Notifications not supported or not in browser environment.`);
    return { token: null, isDevelopmentMode: false };
  }

  console.log(`[useFcmToken v${HOOK_VERSION}] Current permission: ${Notification.permission}`);
  
  if (Notification.permission === "granted") {
    console.log(`[useFcmToken v${HOOK_VERSION}] Permission already granted, fetching token...`);
    const token = await fetchToken();
    const isDevelopmentMode = token === "test-token-for-ui-development";
    console.log(`[useFcmToken v${HOOK_VERSION}] Token fetched (${token ? token.substring(0,10)+'...' : 'null'}), isDevelopmentMode: ${isDevelopmentMode}`);
    return { token, isDevelopmentMode };
  }

  if (Notification.permission !== "denied") {
    console.log(`[useFcmToken v${HOOK_VERSION}] Requesting permission...`);
    const permission = await Notification.requestPermission();
    console.log(`[useFcmToken v${HOOK_VERSION}] Permission result: ${permission}`);
    
    if (permission === "granted") {
      console.log(`[useFcmToken v${HOOK_VERSION}] Permission granted, fetching token...`);
      const token = await fetchToken();
      const isDevelopmentMode = token === "test-token-for-ui-development";
      console.log(`[useFcmToken v${HOOK_VERSION}] Token fetched (${token ? token.substring(0,10)+'...' : 'null'}), isDevelopmentMode: ${isDevelopmentMode}`);
      return { token, isDevelopmentMode };
    }
  }

  console.log(`[useFcmToken v${HOOK_VERSION}] Permission not granted or denied.`);
  return { token: null, isDevelopmentMode: false };
}

const useFcmToken = () => {
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  const retryLoadToken = useRef(0);
  const isLoading = useRef(false);
  const messageHandlerRef = useRef<(() => void) | null>(null); // Corrected type

  const loadToken = async () => {
    if (isLoading.current || (typeof window !== 'undefined' && Notification.permission === 'denied')) {
      console.log(`[useFcmToken v${HOOK_VERSION}] Skipping token load (loading: ${isLoading.current}, permission: ${typeof window !== 'undefined' ? Notification.permission : 'N/A'})`);
      return;
    }

    console.log(`[useFcmToken v${HOOK_VERSION}] Starting token load...`);
    isLoading.current = true;
    setNotificationPermissionStatus(typeof window !== 'undefined' ? Notification.permission : null);

    try {
      const { token: fetchedToken, isDevelopmentMode: devMode } = await getNotificationPermissionAndToken();
      setNotificationPermissionStatus(typeof window !== 'undefined' ? Notification.permission : null);

      if (fetchedToken) {
        console.log(`[useFcmToken v${HOOK_VERSION}] Token obtained: ${fetchedToken.substring(0, 10)}...`);
        setToken(fetchedToken);
        setIsDevelopmentMode(devMode);
        retryLoadToken.current = 0; // Reset retries on success

        // --- Save token to backend --- 
        await saveTokenToBackend(fetchedToken);
        // --- End Save token --- 

        if (devMode) {
          toast.info(
            "Using development mode for notifications. Expected locally.",
            { duration: 6000 }
          );
        }
      } else if (typeof window !== 'undefined' && Notification.permission !== 'denied') { 
        // Retry if no token and permission isn't denied
        if (retryLoadToken.current < 3) {
          retryLoadToken.current += 1;
          console.log(`[useFcmToken v${HOOK_VERSION}] Retrying token fetch, attempt ${retryLoadToken.current}/3`);
          // Add a small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * retryLoadToken.current)); 
          // No await here, let it run async without blocking current flow unnecessarily after delay
          loadToken(); 
        } else {
          console.log(`[useFcmToken v${HOOK_VERSION}] Max retries reached, giving up.`);
          toast.error("Unable to initialize notifications after retries.");
        }
      } else {
         console.log(`[useFcmToken v${HOOK_VERSION}] Token fetch failed or permission denied.`);
         if(typeof window !== 'undefined' && Notification.permission === 'denied') {
           toast.warning("Notification permission denied.");
         }
      }
    } catch (error) {
      console.error(`[useFcmToken v${HOOK_VERSION}] Error during token load:`, error);
      toast.error(`Error getting notification token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    // Initialize permission status on mount
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermissionStatus(Notification.permission);
      const deviceIsIOS = isIOS();
      console.log(`[useFcmToken v${HOOK_VERSION}] Hook mounted. iOS: ${deviceIsIOS}, Permission: ${Notification.permission}`);
      // Automatically request for non-iOS if permission is default
      if (!deviceIsIOS && Notification.permission === 'default') {
         console.log(`[useFcmToken v${HOOK_VERSION}] Non-iOS device with default permission, requesting...`);
         loadToken();
      } else if (Notification.permission === 'granted') {
         console.log(`[useFcmToken v${HOOK_VERSION}] Permission already granted, fetching token...`);
         loadToken(); // Fetch token if already granted
      }
    } else {
      console.log(`[useFcmToken v${HOOK_VERSION}] Notifications not supported.`);
    }
  }, []);

  useEffect(() => {
    const setupListener = async () => {
      if (!token || messageHandlerRef.current) { // Prevent setting up multiple times
        console.log(`[useFcmToken v${HOOK_VERSION}] Skipping message handler setup (token: ${!!token}, handler exists: ${!!messageHandlerRef.current})`);
        return;
      }

      console.log(`[useFcmToken v${HOOK_VERSION}] Setting up foreground message handler...`);
      try {
        const unsubscribe = await setupForegroundMessageHandler();
        if (unsubscribe) {
          console.log(`[useFcmToken v${HOOK_VERSION}] Foreground message handler set up successfully.`);
          messageHandlerRef.current = unsubscribe;
        } else {
          console.error(`[useFcmToken v${HOOK_VERSION}] Failed to set up foreground message handler (returned null/undefined).`);
        }
      } catch (error) {
          console.error(`[useFcmToken v${HOOK_VERSION}] Error setting up foreground message handler:`, error);
      }
    };

    setupListener();

    return () => {
      if (messageHandlerRef.current) {
        console.log(`[useFcmToken v${HOOK_VERSION}] Cleaning up foreground message handler.`);
        messageHandlerRef.current();
        messageHandlerRef.current = null; // Clear ref on cleanup
      }
    };
  }, [token]);

  // Explicit function to request permission (useful for iOS or manual triggers)
  const requestNotificationPermission = async () => {
    console.log(`[useFcmToken v${HOOK_VERSION}] User initiated notification permission request`);
    await loadToken(); // This will trigger the permission request if needed
  };

  return { 
    token, 
    notificationPermissionStatus, 
    isDevelopmentMode,
    requestNotificationPermission, // Expose function to trigger manually
    isLoading: isLoading.current // Expose loading state (read-only)
  };
};

export default useFcmToken;
