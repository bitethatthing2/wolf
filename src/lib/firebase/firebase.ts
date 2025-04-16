import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage, MessagePayload } from "firebase/messaging";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Helper function to check if device is iOS
export const isIOS = () => {
  // Ensure navigator is available (client-side check)
  return typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Initialize Firebase app (check if already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Get messaging instance (asynchronously checks for support)
const messaging = async () => {
  // Check if running in a browser environment where messaging is supported
  const supported = typeof window !== 'undefined' && await isSupported();
  if (!supported) {
    console.log("Firebase messaging is not supported in this environment.");
    return null;
  }
  return getMessaging(app);
};

// Track processed notification IDs to prevent duplicate foreground displays
const processedNotifications = new Set<string>();

// For debugging and coordination with SW
const CLIENT_VERSION = '2.0.1'; // Updated version for clarity

// Fetch FCM token
export const fetchToken = async () => {
  try {
    console.log(`[Client v${CLIENT_VERSION}] Attempting to fetch FCM token...`);
    const fcmMessaging = await messaging();
    if (!fcmMessaging) {
      console.log(`[Client v${CLIENT_VERSION}] Messaging instance not available.`);
      return null;
    }

    console.log(`[Client v${CLIENT_VERSION}] Messaging initialized, fetching token...`);

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY;
    console.log(`[Client v${CLIENT_VERSION}] Using VAPID key:`, vapidKey ? "Key exists" : "Key missing");

    if (!vapidKey) {
      console.error(`[Client v${CLIENT_VERSION}] Error: NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY is missing in environment variables.`);
      return null; // Cannot get token without VAPID key
    }

    // Check if we're in a development environment (e.g., localhost without HTTPS)
    // Note: Secure context is needed for Service Workers and Push API
    const isDevelopmentWithUntrustedCert =
      typeof window !== 'undefined' &&
      window.location.protocol !== 'https:' &&
      window.location.hostname === 'localhost'; // Simplified check

    if (isDevelopmentWithUntrustedCert) {
      console.warn(`[Client v${CLIENT_VERSION}] Development environment detected (localhost without HTTPS). Using placeholder token for UI. Push notifications require HTTPS or specific localhost configurations.`);
      return "test-token-for-ui-development"; // Placeholder for local testing
    }

    // Manage Service Worker registration
    let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
    if ('serviceWorker' in navigator) {
      try {
        // Unregister potentially conflicting service workers (optional, can be aggressive)
        // console.log('[Client] Checking for existing service workers...');
        // const registrations = await navigator.serviceWorker.getRegistrations();
        // if (registrations.length > 0) {
        //   console.log(`[Client] Found ${registrations.length} existing SW(s), unregistering...`);
        //   for (const registration of registrations) {
        //     await registration.unregister();
        //   }
        // }

        // Register the Firebase messaging service worker
        console.log(`[Client v${CLIENT_VERSION}] Registering service worker: /firebase-messaging-sw.js`);
        serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/' // Register at the root scope
        });
        console.log(`[Client v${CLIENT_VERSION}] Service worker registered with scope:`, serviceWorkerRegistration.scope);

        // Wait for the service worker to become active
        await navigator.serviceWorker.ready;
        console.log(`[Client v${CLIENT_VERSION}] Service worker is ready and active.`);

      } catch (error) {
        console.error(`[Client v${CLIENT_VERSION}] Error managing service worker:`, error);
        // Proceed without SW registration if it fails? Or return null?
        // Depending on requirements, you might want to handle this failure.
      }
    }

    // Get token with VAPID key and active service worker registration
    const tokenOptions: { vapidKey: string; serviceWorkerRegistration?: ServiceWorkerRegistration } = {
      vapidKey: vapidKey,
    };
    if (serviceWorkerRegistration) {
      tokenOptions.serviceWorkerRegistration = serviceWorkerRegistration;
    }

    // Add a small delay to ensure SW registration completes (heuristic)
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log(`[Client v${CLIENT_VERSION}] Getting FCM token with options:`, {
      vapidKey: '[KEY_PRESENT]', // Don't log the actual key
      serviceWorker: serviceWorkerRegistration ? 'Present' : 'Missing or Failed Registration'
    });

    const token = await getToken(fcmMessaging, tokenOptions);
    console.log(`[Client v${CLIENT_VERSION}] FCM token obtained:`, token ? token.substring(0, 10) + "..." : "null or empty");
    return token;

  } catch (err) {
    console.error(`[Client v${CLIENT_VERSION}] An error occurred while fetching the token:`, err);
    return null;
  }
};

// Setup foreground message handler
export const setupForegroundMessageHandler = async () => {
  console.log(`[Client v${CLIENT_VERSION}] Setting up foreground message handler...`);
  const m = await messaging();
  if (!m) {
    console.log(`[Client v${CLIENT_VERSION}] Messaging not supported or instance unavailable, skipping handler setup.`);
    return null; // Return null if messaging is not available
  }

  const unsubscribe = onMessage(m, (payload: MessagePayload) => {
    console.log(`[Client v${CLIENT_VERSION}] Foreground message received:`, payload);

    // Basic validation of payload
    if (!payload.messageId && !payload.notification && !payload.data) {
        console.log(`[Client v${CLIENT_VERSION}] Received empty or malformed message payload.`);
        return;
    }

    // Check notification permission again (user might revoke it)
    if (typeof window !== 'undefined' && Notification.permission !== 'granted') {
      console.log(`[Client v${CLIENT_VERSION}] Notification permission not granted, skipping foreground display.`);
      return;
    }

    // Use messageId or generate a unique ID for duplicate tracking
    const notificationId = payload.messageId || `fg_${Date.now()}`;
    console.log(`[Client v${CLIENT_VERSION}] Processing notification ID: ${notificationId}`);

    // Skip if already processed recently
    if (processedNotifications.has(notificationId)) {
      console.log(`[Client v${CLIENT_VERSION}] Skipping duplicate foreground notification: ${notificationId}`);
      return;
    }

    // Add to processed set and manage its size
    processedNotifications.add(notificationId);
    console.log(`[Client v${CLIENT_VERSION}] Added ${notificationId} to processed set. Size: ${processedNotifications.size}`);
    // Simple cleanup: Remove the oldest entry if the set grows too large
    if (processedNotifications.size > 30) {
        const oldestId = processedNotifications.values().next().value;
        // Ensure oldestId is defined before attempting deletion
        if (oldestId !== undefined) {
            processedNotifications.delete(oldestId);
        }
        console.log(`[Client v${CLIENT_VERSION}] Removed oldest ID ${oldestId ?? 'N/A'} from processed set.`);
    }

    const deviceIsIOS = isIOS();
    console.log(`[Client v${CLIENT_VERSION}] Device is iOS: ${deviceIsIOS}`);

    // On non-iOS, the Service Worker should handle the display.
    // The foreground handler here might just update UI or log, but not show a duplicate notification.
    if (!deviceIsIOS) {
      console.log(`[Client v${CLIENT_VERSION}] Non-iOS device: Foreground message received. Service worker should handle display.`);
      // Optionally, you could trigger a UI update here instead of showing a notification
      // e.g., show a toast notification using a library like react-toastify or sonner
      // Example: toast.info(payload.notification?.title || 'New message');
      return;
    }

    // On iOS, where SW background execution is less reliable, the foreground handler *must* display the notification.
    console.log(`[Client v${CLIENT_VERSION}] iOS device: Client will display foreground notification.`);

    // Extract notification details (handle potential missing fields)
    const title = payload.notification?.title || payload.data?.title || "New Notification";
    const body = payload.notification?.body || payload.data?.body || "";
    // Ensure icon/badge paths are correct for your project structure
    // IMPORTANT: Update these paths to match your actual asset locations in /public
    const icon = payload.data?.icon || '/icons/icon-192x192.png'; // Example path
    const badge = payload.data?.badge || '/icons/badge-72x72.png'; // Example path
    const image = payload.data?.image || payload.notification?.image;
    const link = payload.fcmOptions?.link || payload.data?.link || '/';

    const notificationOptions: NotificationOptions & { [key: string]: any } = {
      body,
      icon,
      badge,
      tag: notificationId, // Use tag to prevent duplicates if user quickly refocuses
      data: { 
          url: link, 
          ...payload.data // Include any custom data
      }
    };
    if (isValidImageUrl(image)) {
      notificationOptions.image = image;
    }

    console.log(`[Client v${CLIENT_VERSION}] Showing iOS foreground notification:`, title, notificationOptions);

    // Display the notification using the browser's Notification API
    const notification = new Notification(title, notificationOptions);

    // Handle click event for the notification
    notification.onclick = (event) => {
      event.preventDefault(); // Prevent default browser action
      console.log(`[Client v${CLIENT_VERSION}] iOS foreground notification clicked. URL: ${link}`);
      // Attempt to focus existing window or open a new one
      if (typeof window !== 'undefined') {
          window.open(link, '_blank'); // Simple approach: open in new tab
      }
      notification.close();
    };
  });

  console.log(`[Client v${CLIENT_VERSION}] Foreground message handler setup complete.`);
  return unsubscribe; // Return the unsubscribe function for cleanup
};

// Helper to check if a URL is valid (basic check)
function isValidImageUrl(url: string | undefined): url is string {
    if (!url) return false;
    try {
        const parsedUrl = new URL(url, window.location.origin); // Use base URL context
        return ['http:', 'https:', 'data:'].includes(parsedUrl.protocol);
    } catch (e) {
        return false;
    }
}

export { app, messaging }; // Export initialized app and messaging getter
