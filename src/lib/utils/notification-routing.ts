'use client';

import { useRouter as useNextRouter, usePathname } from 'next/navigation';

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
 * Utility function to create platform-specific notification payloads
 * @param basePayload - The base notification payload
 * @param token - The FCM token
 * @returns Platform-specific payloads
 */
export function createPlatformPayloads(basePayload: {
  notification: { title: string; body: string; };
  data: { link: string; };
}, token: string) {
  return {
    android: {
      token,
      notification: basePayload.notification,
      data: basePayload.data,
      android: {
        notification: {
          icon: "notification_icon", // Custom icon name in Android resources
          color: "#000000", // Custom color for Android (changed to black)
          channelId: "default", // Android notification channel
          priority: "high" as const, // High priority for Android
          clickAction: "FLUTTER_NOTIFICATION_CLICK", // Standard action for handling clicks
        },
        priority: "high" as const,
      },
    },
    ios: {
      token,
      notification: basePayload.notification,
      data: basePayload.data,
      apns: {
        headers: {
          "apns-priority": "10", // High priority
        },
        payload: {
          aps: {
            alert: {
              title: basePayload.notification.title,
              body: basePayload.notification.body,
            },
            sound: "default",
            badge: 1,
            "mutable-content": 1,
            "content-available": 1,
            category: "NEW_MESSAGE", // iOS notification category
          },
        },
      },
    },
    web: {
      token,
      notification: basePayload.notification,
      data: basePayload.data,
      webpush: {
        notification: {
          icon: "/only_these/android-icon-96x96.png", // Web notification icon
          badge: "/only_these/android-icon-96x96.png", // Web notification badge
          vibrate: [100, 50, 100], // Vibration pattern
          actions: [
            {
              action: "open_url",
              title: "View",
            },
          ],
          requireInteraction: true, // Notification won't auto-dismiss
        },
        fcmOptions: {
          link: basePayload.data.link,
        },
      },
    }
  };
}
