# Side Hustle Bar PWA Implementation

This document provides an overview of the service worker architecture used in the Side Hustle Bar PWA.

## Service Worker Architecture

The PWA implementation uses a consolidated service worker approach with `sw.js` as the primary service worker file:

### 1. Main Service Worker (`sw.js`)

- **Primary Role**: Handles caching, offline functionality, and coordinates with Firebase
- **Version**: 3.0.0
- **Cache Name**: side-hustle-cache-v3
- **Key Features**:
  - Network-first strategy for navigation requests
  - Cache-first strategy for static assets
  - Offline fallback page
  - Coordination with Firebase for push notifications
  - CSP fix integration for Elfsight
  - Advanced cache management

### 2. Firebase Messaging Service Worker (`firebase-messaging-sw.js`)

- **Primary Role**: Manages push notifications
- **Version**: 3.0.0
- **Key Features**:
  - Push notification reception and display
  - Notification deduplication via IndexedDB
  - Platform-specific notification handling (iOS/Android)
  - Notification click handling

## Registration

The service worker registration is handled by two key files:

### 1. Service Worker Initializer (`service-worker-init.js`)

- **Primary Role**: Standardizes service worker registration and handling
- **Features**:
  - Ensures only one service worker is registered
  - Unregisters legacy service workers
  - Sends configuration to active service worker
  - Handles updates with user notifications
  - Provides a consistent interface for components

### 2. Push Notification Initializer (`push-notification-init.js`)

- **Primary Role**: Initializes Firebase Cloud Messaging
- **Features**:
  - Waits for service worker registration
  - Configures Firebase for push notifications
  - Manages notification permissions
  - Reports initialization status

## Important Notes

1. **Do Not Use `service-worker.js`**: This file has been deprecated in favor of `sw.js`. All references should be updated.

2. **Service Worker Registration**: Always use `service-worker-init.js` for registration, which will ensure proper initialization and configuration.

3. **Firebase Configuration**: The Firebase configuration is sent to the service worker via `postMessage` to ensure it's available for push notifications.

4. **Caching Strategy**: The service worker uses a network-first strategy for navigation requests and a cache-first strategy for static assets.

5. **Debugging**: Service worker logs include version information (`[Service Worker v3.0.0]`) for easier debugging.

## Troubleshooting

If you experience service worker issues:

1. Check the browser console for service worker logs
2. Verify service worker registration in DevTools > Application > Service Workers
3. Check for registration errors in the console
4. Try unregistering the service worker and reloading the page

## Future Improvements

- Add build-time version injection for better tracking
- Implement workbox for more advanced caching strategies
- Add better analytics for service worker lifecycle events
- Support for periodic background sync (when available)