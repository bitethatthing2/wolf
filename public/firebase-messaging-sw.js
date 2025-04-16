// Import service worker fix for navigation preload
importScripts("./service-worker-fix.js");

// Self-registration for the service worker
self.addEventListener('install', function(event) {
  console.log('[firebase-messaging-sw.js] Service Worker installed');
  self.skipWaiting(); // Ensure the service worker activates immediately
});

// Handle service worker activation
self.addEventListener('activate', function(event) {
  console.log('[firebase-messaging-sw.js] Service Worker activated');
  event.waitUntil(self.clients.claim()); // Take control of all clients
});

// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

// Initialize Firebase with your config
// IMPORTANT: Keep this config hardcoded for the SW context, as it cannot access process.env
const firebaseConfig = {
  apiKey: "AIzaSyB0Nxf3pvW32KBc0D1o2-K6qIeKovhGWfg",
  authDomain: "new1-f04b3.firebaseapp.com",
  projectId: "new1-f04b3",
  storageBucket: "new1-f04b3.firebasestorage.app",
  messagingSenderId: "802463638703",
  appId: "1:802463638703:web:bd0bbdaf3407d784d5205a",
  measurementId: "G-3RZEW537LN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Get the base URL for assets
const baseUrl = self.location.origin;

// Helper function to validate image URLs
function isValidImageUrl(url) {
  if (!url || url === 'undefined' || url === '') return false;

  // Allow relative URLs starting with /
  if (url.startsWith('/')) return true;

  try {
    const parsed = new URL(url);
    // Allow http, https, and data protocols
    return ['https:', 'http:', 'data:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Track processed notification IDs to prevent duplicates
const processedNotifications = new Set();

// Service worker version - used for logging
const SW_VERSION = '2.3.1'; // Updated version for clarity

// Set a timeout for clearing the processed notifications set to avoid memory leaks
setTimeout(() => {
  processedNotifications.clear();
  console.log(`[SW v${SW_VERSION}] Cleared processed notifications set after timeout.`);
}, 1000 * 60 * 60); // Clear after 1 hour

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(`[SW v${SW_VERSION}] Received background message`, payload);

  // Extract notification ID to prevent duplicates
  const notificationId = payload.messageId || payload.collapseKey || `bg_${Date.now()}`;

  // Skip if we've already processed this notification
  if (processedNotifications.has(notificationId)) {
    console.log(`[SW v${SW_VERSION}] Skipping duplicate notification: ${notificationId}`);
    return;
  }

  // Check for iOS - This detection might be less reliable in SW context
  // const userAgent = self.navigator ? self.navigator.userAgent : '';
  // const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  // Simpler approach: Assume non-iOS for background handling robustness
  const isIOS = false;
  const isAndroid = self.navigator ? /Android/.test(self.navigator.userAgent) : false;
  console.log(`[SW v${SW_VERSION}] Device detection - Android: ${isAndroid}`);

  // Add to processed set
  processedNotifications.add(notificationId);
  console.log(`[SW v${SW_VERSION}] Added ${notificationId} to processed set. Total: ${processedNotifications.size}`);

  // Clear old notification IDs (keep set small)
  if (processedNotifications.size > 30) {
    const oldestId = processedNotifications.values().next().value;
    processedNotifications.delete(oldestId);
    console.log(`[SW v${SW_VERSION}] Removed oldest ID ${oldestId} from processed set.`);
  }

  // Extract notification data
  const title = payload.notification?.title || payload.data?.title || "New Notification";
  const body = payload.notification?.body || payload.data?.body || "You have a new message";
  const link = payload.fcmOptions?.link || payload.data?.link || '/';
  const image = payload.data?.image || payload.notification?.image;

  // --- ICON/BADGE PATHS --- 
  // IMPORTANT: Verify these paths match your actual assets in /public
  const defaultIcon = `${baseUrl}/icons/icon-192x192.png`; // Default icon
  const defaultBadge = `${baseUrl}/icons/badge-72x72.png`; // Default badge
  // Example using source project's paths (Update if needed!):
  const androidIcon = `${baseUrl}/only_these/android/android-launchericon-96-96.png`;
  const iosIcon = `${baseUrl}/only_these/ios/apple-icon-180x180.png`;
  const androidBadge = `${baseUrl}/only_these/android-icon-96x96.png`;
  // --- END ICON/BADGE PATHS --- 

  const notificationOptions = {
    body,
    icon: isAndroid ? androidIcon : (isIOS ? iosIcon : defaultIcon),
    badge: isAndroid ? androidBadge : defaultBadge,
    data: {
      url: link,
      ...payload.data,
      notificationId, // Store ID for click handler
      fromServiceWorker: true,
      swVersion: SW_VERSION
    },
    tag: notificationId, // Use tag to group/replace notifications
    renotify: false, // Don't vibrate/alert for updates to existing tag
    requireInteraction: !isIOS, // Keep notification until dismissed (not on iOS)
    silent: isIOS, // No sound/vibration on iOS
    actions: [
      {
        action: 'open_url', // Action identifier
        title: 'Open', // Text displayed on the button
        // icon: `${baseUrl}/icons/open-icon.png` // Optional action icon
      }
    ]
  };

  // Add image if valid
  if (isValidImageUrl(image)) {
    // @ts-ignore - TS definitions might lag behind NotificationOptions spec
    notificationOptions.image = image;
    console.log(`[SW v${SW_VERSION}] Adding image to notification:`, image);
  }

  console.log(`[SW v${SW_VERSION}] Showing notification:`, title, notificationOptions);

  // Show the notification
  const notificationPromise = self.registration.showNotification(title, notificationOptions);

  // Keep the service worker alive until the notification is shown
  return event.waitUntil(notificationPromise);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  const clickedNotification = event.notification;
  const action = event.action;

  console.log(`[SW v${SW_VERSION}] Notification clicked. Action: '${action}'`, clickedNotification);
  clickedNotification.close(); // Close the notification

  // Get the URL from notification data
  const url = clickedNotification.data?.url || '/';

  // Handle the 'open_url' action or a direct click on the notification body
  if (action === 'open_url' || !action) {
      console.log(`[SW v${SW_VERSION}] Handling click action: Opening URL: ${url}`);
      const promise = clients.matchAll({ type: "window", includeUncontrolled: true })
          .then((clientList) => {
              // Check if a window/tab with the target URL is already open
              for (const client of clientList) {
                  // Use includes check for more flexible matching (e.g., handles query params)
                  if (client.url.includes(url) && 'focus' in client) {
                      console.log(`[SW v${SW_VERSION}] Focusing existing window/tab for URL: ${client.url}`);
                      return client.focus();
                  }
              }
              // If no matching window found, open a new one
              if (clients.openWindow) {
                  console.log(`[SW v${SW_VERSION}] No existing window found. Opening new window for URL: ${url}`);
                  return clients.openWindow(url);
              }
          })
          .catch(err => {
              console.error(`[SW v${SW_VERSION}] Error handling notification click:`, err);
              // Fallback if matchAll or openWindow fails
              if (clients.openWindow) {
                  return clients.openWindow(url);
              }
          });
      event.waitUntil(promise);
  } else {
      console.log(`[SW v${SW_VERSION}] Unhandled action: ${action}`);
  }
});

// Optional: Listen for push subscription changes
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log(`[SW v${SW_VERSION}] Push subscription changed`, event);
  // Here you might re-subscribe the user and update the server
  // const newSubscription = event.newSubscription;
  // const oldSubscription = event.oldSubscription;
  // event.waitUntil( /* Resubscribe and update server logic */ );
});

console.log(`[SW v${SW_VERSION}] Service Worker script fully loaded and listeners attached.`);