# Side Hustle Bar PWA Implementation Guide

This document provides an overview of the Progressive Web App (PWA) implementation for Side Hustle Bar, detailing the architecture, components, and best practices used.

## Service Worker Architecture

The PWA implementation uses a standardized service worker approach with `sw.js` as the main file:

### 1. Main Service Worker (`sw.js`)

- **Primary Role**: Handles caching, offline functionality, and coordinates with Firebase
- **Version**: 3.0.0
- **Cache Name**: side-hustle-cache-v3
- **Features**:
  - Network-first strategy for navigation requests
  - Cache-first strategy for static assets
  - Offline fallback page
  - Coordination with Firebase for push notifications
  - CSP fix integration for Elfsight
  - Advanced cache management
  - Internal state tracking with initialization status
  - Event management and message routing

### 2. Firebase Messaging Service Worker (`firebase-messaging-sw.js`)

- **Primary Role**: Manages push notifications
- **Version**: 3.0.0
- **Features**:
  - Push notification reception and display
  - Notification deduplication via IndexedDB
  - Platform-specific notification handling (iOS/Android)
  - Notification click handling
  - Coordination with main service worker

### 3. Service Worker Initialization (`service-worker-init.js`)

- **Primary Role**: Standardizes service worker registration and handling
- **Version**: 3.0.0
- **Features**:
  - Consolidated registration approach that always uses `sw.js`
  - Unregisters legacy service workers for clean migration
  - Update detection and notification
  - Comprehensive error handling
  - Development mode detection
  - Automatic upgrade from older service worker versions

## Installation Flow

The app installation experience is managed by the `AppInstallFlow` component with platform-specific implementations:

### iOS Installation Flow

1. User clicks "Install on iOS" button
2. Component displays a step-by-step guide:
   - Show Safari share button location
   - Instruct user to select "Add to Home Screen"
   - Confirm successful installation

### Android Installation Flow

1. User clicks "Install on Android" button
2. For supported browsers:
   - Trigger native installation prompt
   - Handle user choice (accept/decline)
   - Confirm successful installation
3. For unsupported browsers:
   - Show manual installation instructions
   - Guide through Chrome menu options

### Desktop Installation Flow

- Limited support based on browser capabilities
- Uses Chrome's installation API when available

## Notification System

Push notifications are managed through Firebase Cloud Messaging (FCM):

1. **Registration Process**:
   - Request browser permission
   - Register with FCM to get token
   - Store token in Supabase
   - Send welcome notification

2. **Notification Display**:
   - Background notifications handled by service worker
   - Foreground notifications displayed as browser notifications
   - Platform-specific styling (iOS/Android)
   - Deduplication to prevent duplicate notifications

3. **User Preference Management**:
   - Enable/disable through NotificationManager component
   - Multiple UI variants (default, compact, inline)
   - Clear success/error feedback

## Asset Organization

### Icon Structure

```
/public/icons/
  ├── android/
  │   └── notification-icon-android.png
  ├── ios/
  │   ├── apple-touch-icon.png
  │   └── icon-180x180.png
  ├── pwa/
  │   ├── icon-192x192.png
  │   └── icon-512x512.png
```

### Notification Icons

```
/public/only_these/
  ├── notification-badge.png
  ├── android/
  │   └── notification-icon-android.png
  └── ios/
      └── notification-icon-ios.png
```

## Best Practices Implemented

1. **Service Worker Management**:
   - Skip waiting for immediate activation
   - Controlled updates with user notification
   - Background update checks
   - Proper error handling

2. **Caching Strategies**:
   - Navigation requests: Network-first with offline fallback
   - Static assets: Cache-first with background updates
   - External domains: Network-only to prevent CORS issues

3. **Offline Support**:
   - Custom offline page with proper styling
   - Essential assets precached for offline access
   - Fallback mechanisms for failed requests

4. **Cross-Platform Compatibility**:
   - iOS-specific workarounds for PWA limitations
   - Android native installation support
   - Responsive installation UI for all devices
   - Platform detection for optimal experience

5. **Performance Optimization**:
   - Selective precaching of critical assets
   - Optimized icon sizes and formats
   - Deferred non-critical service worker registration
   - Minimized main thread blocking

## Troubleshooting

### Common Issues

1. **Service Worker Not Registering**:
   - Check if using HTTPS or localhost
   - Verify browser support for service workers
   - Check for console errors during registration

2. **Push Notifications Not Working**:
   - Verify Notification permission is granted
   - Check Firebase configuration
   - Ensure proper service worker registration
   - Verify token is stored in Supabase

3. **Installation Prompt Not Showing**:
   - Verify the app meets installability criteria
   - Check if already installed
   - Ensure manifest is properly configured
   - Use Chrome DevTools Application tab to debug

### Debugging Tools

- Chrome DevTools > Application > Service Workers
- Chrome DevTools > Application > Manifest
- localStorage item "sidehustle-theme" for theme preference
- IndexedDB > NotificationsDB for notification tracking

## Future Enhancements

1. **Periodic Background Sync**:
   - Implement for content updates when offline
   - Schedule sync events for optimal timing

2. **Advanced Caching**:
   - Implement stale-while-revalidate for API responses
   - Add cache partitioning for user-specific content

3. **Improved Offline Experience**:
   - Custom offline pages per section
   - Offline menu browsing with images
   - Offline order queue for submission when online

4. **Web Push Improvements**:
   - Add notification categories
   - Implement notification action buttons
   - Support rich media notifications