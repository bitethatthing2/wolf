/* eslint-disable no-restricted-globals */

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

// Load Firebase scripts dynamically
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Basic Firebase app configuration with fallback values for development
// These will be updated by the client-side script via postMessage 
const firebaseConfig = {
  apiKey: "AIzaSyBF8nfh2gYZnRh1U6vgP-XMfP9KCu6TKBQ",
  projectId: "new1-f04b3",
  messagingSenderId: "1036893806199",
  appId: "1:1036893806199:web:5f6b3f8d18d30eda1bffcb",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Get the base URL for assets
const baseUrl = self.location.origin;

// Helper function to validate image URLs
function isValidImageUrl(url) {
  if (!url || url === 'undefined' || url === '') return false;
  
  // Allow relative URLs
  if (url.startsWith('/')) return true;
  
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

// Track processed notification IDs to prevent duplicates with enhanced persistence
let processedNotifications = new Set();

// Service worker version for debugging
const SW_VERSION = '2.2.0';
console.log(`[Firebase SW v${SW_VERSION}] Service Worker initializing...`);

// Load processed notifications from IndexedDB to persist across service worker restarts
async function loadProcessedNotifications() {
  try {
    const db = await openDatabase();
    const store = db.transaction('notifications', 'readonly').objectStore('notifications');
    const allItems = await store.getAll();
    
    processedNotifications = new Set(allItems.map(item => item.id));
    console.log(`[SW v${SW_VERSION}] Loaded ${processedNotifications.size} processed notifications from IndexedDB`);
  } catch (error) {
    console.error(`[SW v${SW_VERSION}] Error loading processed notifications:`, error);
    // Continue with empty set if loading fails
    processedNotifications = new Set();
  }
}

// Save a processed notification ID to IndexedDB
async function saveProcessedNotification(id) {
  try {
    const db = await openDatabase();
    const tx = db.transaction('notifications', 'readwrite');
    const store = tx.objectStore('notifications');
    
    // Add with expiration timestamp (24 hours)
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
    await store.put({ id, expiresAt });
    
    console.log(`[SW v${SW_VERSION}] Saved notification ${id} to IndexedDB`);
  } catch (error) {
    console.error(`[SW v${SW_VERSION}] Error saving processed notification:`, error);
  }
}

// Open IndexedDB for notification tracking
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NotificationsDB', 1);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      // Create object store with id as key
      if (!db.objectStoreNames.contains('notifications')) {
        const store = db.createObjectStore('notifications', { keyPath: 'id' });
        store.createIndex('expiresAt', 'expiresAt');
        console.log(`[SW v${SW_VERSION}] Created notifications object store`);
      }
    };
    
    request.onsuccess = event => resolve(event.target.result);
    request.onerror = event => {
      console.error(`[SW v${SW_VERSION}] IndexedDB error:`, event.target.error);
      reject(event.target.error);
    };
  });
}

// Clean up expired notification IDs
async function cleanupExpiredNotifications() {
  try {
    const db = await openDatabase();
    const tx = db.transaction('notifications', 'readwrite');
    const store = tx.objectStore('notifications');
    const index = store.index('expiresAt');
    
    const now = Date.now();
    const range = IDBKeyRange.upperBound(now);
    
    const request = index.openCursor(range);
    let deletedCount = 0;
    
    request.onsuccess = event => {
      const cursor = event.target.result;
      if (cursor) {
        // Delete expired notification
        store.delete(cursor.primaryKey);
        deletedCount++;
        cursor.continue();
      } else if (deletedCount > 0) {
        console.log(`[SW v${SW_VERSION}] Deleted ${deletedCount} expired notifications`);
      }
    };
  } catch (error) {
    console.error(`[SW v${SW_VERSION}] Error cleaning up expired notifications:`, error);
  }
}

// Load processed notifications on initialization
loadProcessedNotifications().then(() => {
  // Clean up expired notifications after loading
  cleanupExpiredNotifications();
});

// Set up a message handler to receive messages from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CONFIG_FIREBASE') {
    // Update Firebase config from client
    Object.assign(firebaseConfig, event.data.config);
    console.log(`[SW v${SW_VERSION}] Received updated Firebase config from client`);
  }
});

// Set a timeout for clearing the processed notifications set to avoid memory leaks
setTimeout(() => {
  processedNotifications.clear();
  console.log(`[SW v${SW_VERSION}] Cleared processed notifications set after timeout`);
}, 1000 * 60 * 60); // Clear after 1 hour

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(`[SW v${SW_VERSION}] Received background message`, payload);
  
  // Extract notification ID to prevent duplicates
  // Use a combination of messageId, collapseKey, and title/body hash for better deduplication
  const notificationTitle = payload.notification?.title || payload.data?.title || "";
  const notificationBody = payload.notification?.body || payload.data?.body || "";
  const contentHash = `${notificationTitle}:${notificationBody}`.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const notificationId = payload.messageId || payload.collapseKey || 
                         `${contentHash}_${Date.now().toString()}`;
  
  // Skip if we've already processed this notification
  if (processedNotifications.has(notificationId)) {
    console.log(`[SW v${SW_VERSION}] Skipping duplicate notification ${notificationId}`);
    return;
  }
  
  // Check for iOS - handle differently based on device
  const userAgent = self.navigator ? self.navigator.userAgent : '';
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  console.log(`[SW v${SW_VERSION}] Device detection - iOS: ${isIOS}, Android: ${isAndroid}, UA: ${userAgent.substring(0, 50)}...`);
  
  // Add to processed set and persist to IndexedDB
  processedNotifications.add(notificationId);
  saveProcessedNotification(notificationId);
  console.log(`[SW v${SW_VERSION}] Added notification ${notificationId} to processed set. Total: ${processedNotifications.size}`);
  
  // Check for duplicate content in recent notifications (last 5 minutes)
  if (payload.data?.deduplicationKey) {
    const deduplicationKey = payload.data.deduplicationKey;
    if (processedNotifications.has(deduplicationKey)) {
      console.log(`[SW v${SW_VERSION}] Skipping notification with duplicate content key ${deduplicationKey}`);
      return;
    }
    processedNotifications.add(deduplicationKey);
    saveProcessedNotification(deduplicationKey);
  }
  
  // Extract notification data for display
  const displayTitle = payload.notification?.title || payload.data?.title || "Side Hustle Bar Update";
  const displayBody = payload.notification?.body || payload.data?.body || "Check out what's new!";
  const displayLink = payload.fcmOptions?.link || payload.data?.url || '/';
  const displayImage = payload.data?.image || payload.notification?.image;
  
  // Use the correct icon paths
  const notificationOptions = {
    body: displayBody,
    // Use larger icon for Android and apple icon for others
    icon: isAndroid ? 
      `${baseUrl}/icons/icons/icon-192x192.png` : 
      `${baseUrl}/icons/icons/icon-192x192.png`,
    // Use larger badge icon for better visibility in status bar
    badge: `${baseUrl}/icons/icons/icon-72x72.png`,
    data: { 
      url: displayLink,
      ...payload.data,
      // Store notification ID to prevent duplicates later
      notificationId,
      fromServiceWorker: true, // Flag to identify source
      swVersion: SW_VERSION
    },
    // Use notification ID as tag to prevent duplicate system notifications
    tag: notificationId,
    renotify: false,
    requireInteraction: !isIOS,
    silent: isIOS, // Keep notifications silent on iOS
    actions: [
      {
        action: 'open',
        title: 'View',
        icon: `${baseUrl}/icons/icons/icon-72x72.png`
      }
    ]
  };

  // Add image if valid
  if (isValidImageUrl(displayImage)) {
    notificationOptions.image = displayImage;
    console.log(`[SW v${SW_VERSION}] Adding image to notification:`, displayImage);
  }

  console.log(`[SW v${SW_VERSION}] Creating notification with options:`, notificationOptions);
  return self.registration.showNotification(displayTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log(`[SW v${SW_VERSION}] Notification clicked`, event);
  event.notification.close();
  
  // Get the URL from the notification data
  const url = event.notification.data?.url || '/';
  console.log(`[SW v${SW_VERSION}] Notification click - opening URL: ${url}`);
  
  // Handle action clicks
  if (event.action === 'open') {
    console.log(`[SW v${SW_VERSION}] Open action clicked`);
  }
  
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Try to focus an existing window with matching URL if found
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            console.log(`[SW v${SW_VERSION}] Focusing existing window with URL: ${url}`);
            return client.focus();
          }
        }
        
        // If no matching window, find any available window and navigate
        for (const client of clientList) {
          if ('focus' in client && 'navigate' in client) {
            console.log(`[SW v${SW_VERSION}] Navigating existing window to: ${url}`);
            return client.focus().then(() => client.navigate(url));
          }
        }
        
        // Otherwise open a new window
        if (clients.openWindow) {
          console.log(`[SW v${SW_VERSION}] Opening new window with URL: ${url}`);
          return clients.openWindow(url);
        }
      })
      .catch(err => {
        console.error(`[SW v${SW_VERSION}] Error handling notification click:`, err);
      })
  );
});

// Add explicit push event listener to prevent browser from showing its own notification
self.addEventListener('push', (event) => {
  console.log(`[SW v${SW_VERSION}] Push event received but letting Firebase handle it`);
  // Let Firebase's onBackgroundMessage handle it
  // This prevents the browser from showing its own notification
});
