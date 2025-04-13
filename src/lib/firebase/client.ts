import { initializeApp, getApps, FirebaseApp, getApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage, MessagePayload } from "firebase/messaging";

// **IMPORTANT**: Load Firebase config from Netlify environment variables
// All client-side env vars must use NEXT_PUBLIC_ prefix and should be configured in Netlify dashboard
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Helper function to check if device is iOS
export const isIOS = () => {
  // Check for navigator first for server-side rendering compatibility
  return typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Initialize Firebase app (client-side check)
let app: FirebaseApp;
if (typeof window !== 'undefined' && getApps().length === 0) {
  // Ensure all config values are present before initializing
  if (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
    // measurementId is optional
  ) {
    app = initializeApp(firebaseConfig);

    // Make Firebase config available to service worker
    if (window) {
      (window as any).firebaseConfig = firebaseConfig;
    }
  } else {
    console.error('Firebase config environment variables are missing. Push notifications will not work.');
  }
} else if (typeof window !== 'undefined') {
  app = getApp();
}

// Get messaging instance
const messaging = async () => {
  if (typeof window === 'undefined' || !app) {
    // Don't run on server or if app failed to initialize
    return null;
  }
  const supported = await isSupported();
  console.log("Is messaging supported:", supported);
  if (!supported) {
    console.log("Firebase messaging is not supported in this environment");
    return null;
  }
  return getMessaging(app);
};

// Track processed notification IDs to prevent duplicates
const processedNotifications = new Set<string>();

// For debugging and coordination with SW
const CLIENT_VERSION = '3.0.0'; // Updated version to match SW version

// Send Firebase config to Service Worker
export const sendConfigToServiceWorker = async (swRegistration: ServiceWorkerRegistration) => {
  try {
    // Only send necessary parts of config for security
    const swConfig = {
      messagingSenderId: firebaseConfig.messagingSenderId,
      projectId: firebaseConfig.projectId,
      apiKey: firebaseConfig.apiKey,
      appId: firebaseConfig.appId
    };

    console.log(`[Client v${CLIENT_VERSION}] Sending config to Service Worker`);
    swRegistration.active?.postMessage({
      type: 'CONFIG_FIREBASE',
      config: swConfig
    });

    return true;
  } catch (err) {
    console.error(`[Client v${CLIENT_VERSION}] Failed to send config to Service Worker:`, err);
    return false;
  }
};

// Fetch FCM token
export const fetchToken = async (swRegistration: ServiceWorkerRegistration | null) => {
  try {
    console.log(`[Client v${CLIENT_VERSION}] Attempting to fetch FCM token...`);
    const fcmMessaging = await messaging();
    
    if (!fcmMessaging) {
      console.log(`[Client v${CLIENT_VERSION}] FCM Messaging not available.`);
      return null;
    }
    
    if (!swRegistration) {
      console.log(`[Client v${CLIENT_VERSION}] No service worker registration provided, trying to get existing.`);
      
      // Try to get existing registration
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          if (registrations.length > 0) {
            // Use the first registration with active worker
            const activeReg = registrations.find(reg => reg.active);
            if (activeReg) {
              console.log(`[Client v${CLIENT_VERSION}] Found existing SW registration with scope:`, activeReg.scope);
              swRegistration = activeReg;
            }
          }
        } catch (e) {
          console.error(`[Client v${CLIENT_VERSION}] Error getting SW registrations:`, e);
        }
      }
      
      // If still no registration, try to register service worker
      if (!swRegistration && 'serviceWorker' in navigator) {
        try {
          swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
          console.log(`[Client v${CLIENT_VERSION}] Registered new service worker with scope:`, swRegistration.scope);
          
          // Wait for it to activate
          if (swRegistration.installing) {
            console.log(`[Client v${CLIENT_VERSION}] Waiting for service worker to activate...`);
            await new Promise<void>((resolve) => {
              if (!swRegistration) {
                resolve();
                return;
              }
              
              swRegistration.installing?.addEventListener('statechange', (e) => {
                if ((e.target as ServiceWorker).state === 'activated') {
                  console.log(`[Client v${CLIENT_VERSION}] Service worker activated`);
                  resolve();
                }
              });
            });
          }
        } catch (e) {
          console.error(`[Client v${CLIENT_VERSION}] Error registering service worker:`, e);
        }
      }
    }

    // If we have a service worker registration
    if (swRegistration) {
      console.log(`[Client v${CLIENT_VERSION}] Using service worker with scope:`, swRegistration.scope);
      
      // Send config to service worker
      await sendConfigToServiceWorker(swRegistration);
      
      // Only use the NEXT_PUBLIC_ prefixed env var which should be configured in Netlify dashboard
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY;

      console.log(`[Client v${CLIENT_VERSION}] Using VAPID key:`, vapidKey ? "[KEY_PRESENT]" : "[KEY_MISSING]");

      if (!vapidKey) {
        console.error('VAPID key (NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY) is missing in Netlify environment variables.');
        return null;
      }

      // Check if we're in a development environment with a self-signed certificate - might still be useful
      const isDevelopmentWithUntrustedCert =
        typeof window !== 'undefined' &&
        (window.location.protocol !== 'https:' ||
         (window.location.hostname === 'localhost' &&
          !window.isSecureContext));

      if (isDevelopmentWithUntrustedCert) {
        console.warn(`[Client v${CLIENT_VERSION}] Development environment with potentially untrusted certificate detected. FCM might not work reliably without a valid HTTPS setup (like mkcert or ngrok). Using test token for UI.`);
        return "test-token-for-ui-development";
      }

      console.log(`[Client v${CLIENT_VERSION}] Getting FCM token with options:`, {
        vapidKey: '[KEY_PRESENT]', // Already checked vapidKey exists
        serviceWorkerRegistration: swRegistration ? 'Present' : 'Missing'
      });

      const token = await getToken(fcmMessaging, {
        vapidKey: vapidKey,
        serviceWorkerRegistration: swRegistration, // Pass the existing registration
      });
      
      console.log(`[Client v${CLIENT_VERSION}] FCM token obtained:`, token ? token.substring(0, 10) + "..." : "null");
      return token;
    } else {
      console.error(`[Client v${CLIENT_VERSION}] No service worker registration available.`);
      return null;
    }
  } catch (err) {
    console.error(`[Client v${CLIENT_VERSION}] An error occurred while fetching the token:`, err);
    // Provide more specific error messages if possible
    if ((err as Error).message.includes("messaging/permission-blocked")) {
      console.error("Notification permission was denied by the user.");
    } else if ((err as Error).message.includes("messaging/unsupported-browser")) {
      console.error("This browser doesn't support Firebase Messaging.");
    }
    return null;
  }
};

// Setup foreground message handler
export const setupForegroundMessageHandler = async () => {
  console.log(`[Client v${CLIENT_VERSION}] Setting up foreground message handler`);
  const m = await messaging();
  if (!m) {
    console.log(`[Client v${CLIENT_VERSION}] Messaging not supported, skipping handler setup`);
    return null;
  }

  console.log(`[Client v${CLIENT_VERSION}] Successfully installed foreground message handler`);

  return onMessage(m, (payload: MessagePayload) => {
    console.log(`[Client v${CLIENT_VERSION}] Foreground message received:`, payload);

    if (!payload.data && !payload.notification) {
      console.log(`[Client v${CLIENT_VERSION}] Empty message payload, ignoring`);
      return;
    }

    // Use Notification API directly only if permission is granted
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      console.log(`[Client v${CLIENT_VERSION}] Notification permission not granted or Notification API unavailable, skipping foreground notification`);
      return;
    }

    // Extract notification ID to prevent duplicates
    const notificationTitle = payload.notification?.title || payload.data?.title || "";
    const notificationBody = payload.notification?.body || payload.data?.body || "";
    const contentHash = `${notificationTitle}:${notificationBody}`.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const notificationId = payload.messageId || payload.collapseKey || `${contentHash}_${Date.now().toString()}`;
    
    console.log(`[Client v${CLIENT_VERSION}] Notification ID: ${notificationId}`);

    // Skip if we've already processed this notification
    if (processedNotifications.has(notificationId)) {
      console.log(`[Client v${CLIENT_VERSION}] Skipping duplicate notification ${notificationId}`);
      return;
    }

    // Add to processed set
    processedNotifications.add(notificationId);
    console.log(`[Client v${CLIENT_VERSION}] Added notification ${notificationId} to processed set. Total: ${processedNotifications.size}`);

    // Keep the set small by removing older notifications
    if (processedNotifications.size > 20) {
      const oldestId = Array.from(processedNotifications)[0]; // Get first element
      processedNotifications.delete(oldestId);
      console.log(`[Client v${CLIENT_VERSION}] Removed oldest notification ${oldestId} from processed set`);
    }

    // Handle differently based on platform
    const deviceIsIOS = isIOS();
    console.log(`[Client v${CLIENT_VERSION}] Device is iOS: ${deviceIsIOS}`);
    
    // For non-iOS: Let service worker handle the notification 
    if (!deviceIsIOS) {
      console.log(`[Client v${CLIENT_VERSION}] Non-iOS device detected. Deferring to service worker.`);
      // The service worker will show the notification
      // This prevents duplicates by letting only one component handle it
      return;
    }
    
    // For iOS: Handle the notification here since SW might not work well on iOS
    console.log(`[Client v${CLIENT_VERSION}] iOS device detected. Client will handle notification.`);
    
    // Extract notification data
    const title = payload.notification?.title || payload.data?.title || "Side Hustle Bar";
    const body = payload.notification?.body || payload.data?.body || "";
    const link = payload.fcmOptions?.link || payload.data?.url || '/';
    const image = payload.data?.image || payload.notification?.image;
    
    // Cast to any to allow for custom notification properties
    const notificationOptions: any = {
      body,
      // Use the correct icon paths based on platform
      icon: `/only_these/ios/notification-icon-ios.png`,
      badge: `/only_these/notification-badge.png`,
      tag: notificationId, // Use tag to prevent duplicates
      data: { 
        url: link,
        notificationId,
        fromClient: true, // Flag to identify source
        clientVersion: CLIENT_VERSION
      },
      requireInteraction: false, // On iOS, don't require interaction
      silent: true, // Keep notifications silent on iOS
      renotify: false
    };

    if (image) {
      notificationOptions.image = image;
    }

    console.log(`[Client v${CLIENT_VERSION}] Creating foreground notification with options:`, notificationOptions);
    
    // Create and show the notification
    const notification = new Notification(title, notificationOptions);
    
    // Add click handler directly to the notification
    notification.onclick = function(event) {
      event.preventDefault();
      console.log(`[Client v${CLIENT_VERSION}] Notification clicked, navigating to:`, link);
      if (typeof window !== 'undefined') {
         window.open(link, '_blank');
      }
    };
  });
};

export { app, messaging };