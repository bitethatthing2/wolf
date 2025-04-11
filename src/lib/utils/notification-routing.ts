'use client';

import { useRouter as useNextRouter, usePathname } from 'next/navigation';

// Define BasePayload interface locally instead of importing from @/types
interface BasePayload {
  notification: {
    title: string;
    body: string;
    [key: string]: any;
  };
  data?: {
    [key: string]: string;
  };
  [key: string]: any;
}

/**
 * Custom router utility for handling navigation and notification routing
 */
export function useRouter() {
  const router = useNextRouter();
  const pathname = usePathname();

  /**
   * Navigate to a specific route
   * @param path - The path to navigate to
   * @param options - Navigation options
   */
  const navigate = (path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };

  /**
   * Handle a notification click by navigating to the appropriate route
   * @param notification - The notification object
   */
  const handleNotificationClick = (notification: {
    data?: { link?: string; url?: string; };
    fcmOptions?: { link?: string; };
  }) => {
    // Extract link from various possible locations
    const link = notification.data?.link ||
                notification.data?.url ||
                notification.fcmOptions?.link ||
                '/';

    // Navigate to the link
    navigate(link);
  };

  /**
   * Check if the current route matches a specific path
   * @param path - The path to check
   */
  const isActive = (path: string) => {
    return pathname === path;
  };

  return {
    navigate,
    handleNotificationClick,
    isActive,
    pathname,
    back: router.back,
    forward: router.forward,
  };
}

/**
 * Utility function to handle notification routing in service workers
 * @param notification - The notification object
 * @returns The URL to navigate to
 */
export function getNotificationUrl(notification: {
  data?: { link?: string; url?: string; };
  fcmOptions?: { link?: string; };
}): string {
  // Extract link from various possible locations
  return notification.data?.link ||
         notification.data?.url ||
         notification.fcmOptions?.link ||
         '/';
}

/**
 * Creates platform-specific notification payloads
 * @param basePayload The base notification payload
 * @param token The FCM token
 * @returns Object containing Android, iOS, and Web specific payloads
 */
export function createPlatformPayloads(basePayload: BasePayload, token?: string) {
  // Common payload properties
  const notification = basePayload.notification;
  const data = basePayload.data || {};
  
  // Generate a deduplication key based on content hash and timestamp
  // This helps prevent duplicate notifications across platforms
  const timestamp = Date.now();
  const contentStr = `${notification?.title || ''}:${notification?.body || ''}:${data.link || ''}`;
  const contentHash = contentStr.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const deduplicationKey = `dedup_${contentHash}_${Math.floor(timestamp / (5 * 60 * 1000))}`; // 5-minute window
  
  // Add title and body to data for service worker access
  if (notification) {
    data.title = notification.title;
    data.body = notification.body;
    data.deduplicationKey = deduplicationKey;
    data.timestamp = timestamp.toString();
  }
  
  // Android specific payload
  const androidPayload = {
    ...basePayload,
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        defaultSound: true,
        channelId: 'default',
        priority: 'high',
        visibility: 'public',
        tag: deduplicationKey, // Use tag for Android notification grouping/deduplication
        icon: '@drawable/android_notification_drawer', // Reference to the Android notification drawer icon
        ...notification
      },
      // Add direct boot notification support for Android
      directBootOk: true
    },
    data
  };
  
  // iOS specific payload with enhanced settings
  const iosPayload = {
    ...basePayload,
    apns: {
      payload: {
        aps: {
          alert: {
            title: notification?.title,
            body: notification?.body,
          },
          sound: 'default',
          badge: 1,
          'content-available': 1,
          'mutable-content': 1,
          'thread-id': deduplicationKey // Thread ID for iOS notification grouping
        }
      },
      headers: {
        'apns-priority': '10', // High priority
        'apns-collapse-id': deduplicationKey // Collapse ID for iOS notification deduplication
      },
      fcmOptions: {
        imageUrl: data.image
      }
    },
    data
  };
  
  // Web specific payload with enhanced settings
  const webPayload = {
    ...basePayload,
    webpush: {
      notification: {
        ...notification,
        icon: '/icons/splash_screens/icon.png',
        badge: '/icons/splash_screens/icon.png',
        vibrate: [100, 50, 100],
        requireInteraction: true,
        tag: deduplicationKey, // Tag for web notification deduplication
        renotify: false // Don't notify again if using same tag
      },
      fcmOptions: {
        link: data.link || '/'
      },
      headers: {
        TTL: '86400' // 24 hours TTL for web push
      }
    },
    data
  };
  
  // Add token if provided
  if (token) {
    // Use type assertion to add token property
    (androidPayload as any).token = token;
    (iosPayload as any).token = token;
    (webPayload as any).token = token;
  }
  
  return {
    android: androidPayload,
    ios: iosPayload,
    web: webPayload
  };
}

/**
 * Determines device platform from user agent string
 * @param userAgent The user agent string
 * @returns The platform: 'ios', 'android', or 'web'
 */
export function getPlatformFromUserAgent(userAgent: string): 'ios' | 'android' | 'web' {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    return 'ios';
  }
  
  if (ua.includes('android')) {
    return 'android';
  }
  
  return 'web';
}
