# Push Notification System Documentation

This document provides an overview of the push notification system implemented in the Side Hustle Bar web application.

## Recent Updates (April 11, 2025)

1. **Added Missing Service Worker** - Created `sw.js` to properly handle push notifications
2. **Fixed Service Worker Registration** - Enabled registration in all environments, not just production
3. **Updated Supabase Connection** - Connected to the correct Supabase project URL
4. **Improved Documentation** - Added comprehensive documentation for the notification system
5. **Enhanced Installation Flow** - Updated AppInstallFlow component to register service worker

### Service Worker Structure

The application uses a multi-layered service worker approach:

1. **sw.js** - The main service worker that handles:
   - Service worker registration
   - Caching strategy for offline support
   - Import of Firebase Messaging service worker
   - Navigation preload for performance

2. **firebase-messaging-sw.js** - Handles Firebase Cloud Messaging:
   - Push notification reception
   - Background message processing
   - Notification display with deduplication

3. **service-worker-init.js** - Initializes service worker registration
   - Used as a script in the page's HTML
   - Registers the service worker
   - Sets up update handling

4. **service-worker-fix.js** - Provides fixes for service worker:
   - Navigation preload enhancements
   - Error handling improvements

## System Overview

The notification system uses Firebase Cloud Messaging (FCM) for delivering push notifications across iOS, Android, and web platforms. It leverages Supabase for token storage and management, with a focus on reliability, performance, and cross-platform consistency.

## Key Components

### 1. Token Management (`useFcmToken.ts`)
   - Manages FCM token acquisition, storage, and refreshing
   - Implements automatic token rotation every 7 days to prevent expiration
   - Features:
     - Graceful degradation when notifications aren't supported
     - Platform detection (iOS/Android/Web) for optimized handling
     - Retry logic with exponential backoff (3 attempts)
     - Comprehensive error reporting
     - Foreground message handling setup

### 2. Notification Management (`useFcmNotifications.ts`)
   - Handles user-facing notification registration and preferences
   - Features:
     - Welcome notification for new subscribers
     - Permission flow management
     - Service worker registration and validation
     - User preference persistence
     - Visual feedback via toast messages

### 3. Subscription Storage (`notification-service.ts`)
   - Manages token persistence in Supabase's `notification_subscriptions` table
   - Features:
     - Duplicate prevention with upsert pattern
     - Device metadata collection (platform, user agent)
     - Last active timestamp tracking
     - Automatic cleanup of old/inactive tokens (older than 90 days)
     - Platform-specific subscription filtering

### 4. Service Worker (`firebase-messaging-sw.js`)
   - Handles background message reception and display
   - Features:
     - Advanced deduplication using multiple methods:
       - Message ID tracking
       - Collapse Key validation
       - Content hash generation (title+body)
       - IndexedDB persistence across service worker restarts
     - Platform-specific notification styling and behavior
     - Optimized notification interaction handling
     - Intelligent client window management on notification click

### 5. Sending Architecture (`notifications/send/route.ts`)
   - Server-side API for sending notifications
   - Features:
     - Platform-specific payload formatting
     - Batch processing by device type (iOS/Android/Web)
     - Multicast sending for efficiency (up to 500 tokens per request)
     - Comprehensive error handling and reporting
     - Development mode support with simulated responses

## Technical Implementation Details

### 1. Token Refresh Mechanism
```javascript
// Set up token refresh interval
const tokenRefreshInterval = setInterval(() => {
  if (Notification.permission === "granted") {
    console.log(`[useFcmToken v${HOOK_VERSION}] Refreshing FCM token on schedule`);
    loadToken();
  }
}, TOKEN_REFRESH_INTERVAL);
```

### 2. Advanced Deduplication
```javascript
// Extract notification ID to prevent duplicates
const notificationTitle = payload.notification?.title || payload.data?.title || "";
const notificationBody = payload.notification?.body || payload.data?.body || "";
const contentHash = `${notificationTitle}:${notificationBody}`.split('').reduce((a, b) => {
  a = ((a << 5) - a) + b.charCodeAt(0);
  return a & a;
}, 0);

const notificationId = payload.messageId || payload.collapseKey || 
                      `${contentHash}_${Date.now().toString()}`;
```

### 3. Platform-Specific Processing
```javascript
// Categorize tokens by platform
for (const subscription of subscriptions) {
  const deviceToken = subscription.endpoint;
  const userAgent = subscription.user_agent?.toLowerCase() || '';
  
  // Determine platform based on user agent
  let devicePlatform = "web"; // Default to web
  if (userAgent.includes("android")) {
    devicePlatform = "android";
    androidTokens.push(deviceToken);
  } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
    devicePlatform = "ios";
    iosTokens.push(deviceToken);
  } else {
    webTokens.push(deviceToken);
  }
  
  platformMap.set(deviceToken, devicePlatform);
}
```

## Platform-Specific Optimizations

### iOS Optimizations
- Uses iOS-specific APNS headers:
  - `apns-priority: 10` for high priority
  - `apns-collapse-id` for deduplication
  - `thread-id` for notification grouping
- iOS-specific display adaptations:
  - Silent notifications to prevent sound duplication
  - Optimized icon sizes for iOS display requirements
  - Adjusted interaction requirements for iOS UX patterns

### Android Optimizations
- Uses Android-specific FCM features:
  - `tag` for notification grouping and replacement
  - `priority: high` for timely delivery
  - `directBootOk: true` for delivery during direct boot mode
  - `visibility: 'public'` for lock screen display
- Android-specific display adaptations:
  - Higher resolution icons
  - Notification action buttons
  - Rich notification features (images where supported)

### Web Optimizations
- Optimized for browsers:
  - `tag` for notification deduplication
  - `TTL` headers for proper caching
  - Silent options for better user experience
  - `requireInteraction: true` for important messages

## Data Storage Schema

The notification subscription data is stored in Supabase with the following structure:

```sql
CREATE TABLE notification_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-level security policies
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;
```

## Future Enhancements

Potential improvements for the notification system:

1. **Segmentation and Categories**
   - Implement topic-based subscriptions
   - Separate marketing vs. transactional notifications
   - Allow user preference granularity

2. **A/B Testing Framework**
   - Test different notification content and timing
   - Measure engagement differences
   - Optimize notification strategy

3. **Analytics Integration**
   - Track open rates and engagement metrics
   - Analyze delivery success by platform
   - Measure notification impact on user retention

4. **Advanced Scheduling**
   - Implement scheduled/delayed notifications
   - Add time-zone aware delivery
   - Support recurring notification patterns

5. **Rich Notification Enhancements**
   - Add support for rich media (images, videos)
   - Implement action buttons for direct engagement
   - Create notification templates for consistency