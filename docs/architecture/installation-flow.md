# Installation Flow Architecture

This document details the Progressive Web App (PWA) installation flow implemented in our application, with a focus on providing a seamless experience across iOS and Android platforms.

## System Overview

The installation flow is designed to detect the user's platform (iOS/Android/Desktop), guide them through the appropriate installation steps, and confirm successful installation. It features platform-specific instructions with visual aids.

## Key Components

### 1. Installation Detection (`use-pwa-install.ts`)

The installation detection system monitors the user's device and detects:
- Whether the app is already installed (running in standalone mode)
- When installation has been completed
- Platform-specific installation capabilities
- Support for "Add to Home Screen" functionality

```typescript
// Core detection logic for installed state
const [isInstalled, setIsInstalled] = useState<boolean>(false);

// Check if app is in standalone mode (already installed)
useEffect(() => {
  if (typeof window !== 'undefined') {
    // iOS & Android PWA detection
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    setIsInstalled(isStandalone);
    
    // Listen for changes in display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }
}, []);
```

### 2. Platform-Specific Flows

#### Android Installation Flow (`android/page.tsx`)
- Detects Chrome browser on Android
- Provides visual step-by-step guide with screenshots
- Offers multiple installation options:
  1. Browser prompt (via the banner)
  2. Menu option installation
  3. Address bar installation

#### iOS Installation Flow (`ios/page.tsx`)
- Detects Safari browser on iOS
- Shows detailed instructions with Safari-specific guidance
- Includes visual aids for the share button and "Add to Home Screen" option
- Provides troubleshooting tips for common iOS installation issues

### 3. Installation Prompt System (`AppInstallFlow.tsx`)

The installation prompt system provides contextual guidance based on the user's platform:

```typescript
const renderInstallPrompt = () => {
  if (isAndroid) {
    return (
      <div className="install-prompt android">
        <h3>Install our app for a better experience</h3>
        <p>Tap the install banner or menu option to add Side Hustle Bar to your home screen.</p>
        <div className="buttons">
          <Button onClick={() => router.push('/instructions/android')}>
            How to Install
          </Button>
          <Button variant="outline" onClick={() => setDismissed(true)}>
            Not Now
          </Button>
        </div>
      </div>
    );
  }
  
  if (isIOS) {
    return (
      <div className="install-prompt ios">
        <h3>Add to Home Screen</h3>
        <p>Install our app for the best experience: tap the share button then "Add to Home Screen"</p>
        <div className="buttons">
          <Button onClick={() => router.push('/instructions/ios')}>
            View Instructions
          </Button>
          <Button variant="outline" onClick={() => setDismissed(true)}>
            Later
          </Button>
        </div>
      </div>
    );
  }
  
  return null;
};
```

### 4. Post-Installation Experience

After installation, the system provides:
- Welcome notification to confirm successful installation
- Introduction to key features
- Offline capability indicators

## Technical Implementation

### 1. WebManifest Configuration

The web manifest (`/public/manifest.json`) is configured for optimal installation across platforms:

```json
{
  "name": "Side Hustle Bar",
  "short_name": "Side Hustle",
  "description": "Order food and drinks, check events",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#121212",
  "theme_color": "#FF9800",
  "icons": [
    {
      "src": "/icons/icon-48x48.png",
      "sizes": "48x48",
      "type": "image/png"
    },
    // Additional icon sizes...
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/menu-mobile.png",
      "sizes": "350x750",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/events-mobile.png",
      "sizes": "350x750",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "id": "/?source=pwa",
  "orientation": "portrait",
  "categories": ["food", "lifestyle", "entertainment"]
}
```

### 2. Service Worker Integration

The installation process leverages service workers for:
- Offline functionality after installation
- Welcome notification delivery
- Installation event detection

```javascript
// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(
      function(registration) {
        console.log('Service Worker registered successfully');
        
        // Handle install event
        if (registration.installing) {
          registration.installing.addEventListener('statechange', function() {
            if (this.state === 'activated') {
              // Installation completed, show welcome message
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Installation Complete', {
                  body: 'Side Hustle Bar has been added to your home screen.',
                  icon: '/wolf-icon-white.png'
                });
              }
            }
          });
        }
      },
      function(err) {
        console.error('Service Worker registration failed:', err);
      }
    );
  });
}
```

### 3. Installation Helper Scripts

The `/public/pwa-install-helper.js` script provides additional functionality for installation flows:

```javascript
// Check if the user came from an installed PWA instance
function checkInstalledReferrer() {
  if (document.referrer.startsWith('android-app://') || 
      document.referrer.includes('standalone=true')) {
    localStorage.setItem('app_installed', 'true');
    return true;
  }
  return false;
}

// Track installation success
window.addEventListener('appinstalled', (event) => {
  localStorage.setItem('app_installed', 'true');
  
  // Track successful installation
  if (typeof gtag === 'function') {
    gtag('event', 'pwa_install', {
      'event_category': 'engagement',
      'event_label': navigator.userAgent
    });
  }
  
  console.log('PWA installation successful');
});
```

## Platform-Specific Optimizations

### Android Optimizations
- Chrome install banner trigger optimization
- Custom install button implementation
- Address bar installation icon visibility improvements
- Theme-color meta tag for Android status bar customization

### iOS Optimizations
- Safari-specific meta tags:
  - `apple-mobile-web-app-capable`
  - `apple-mobile-web-app-status-bar-style`
- iOS splash screen images
- Special handling for iOS PWA limitations (e.g., data persistence)
- Share sheet integration for iOS Add to Home Screen

## User Experience Considerations

- Non-intrusive installation prompts
- Clear visual indicators for the installation process
- Seamless transition between browser and installed app
- Consistent branding across installation flows
- Platform-appropriate language and UI elements

## Future Enhancements

1. **Enhanced Installation Analytics**
   - Track conversion rates from prompts to installations
   - Analyze platform-specific installation patterns
   - A/B test different installation prompts

2. **Desktop PWA Improvements**
   - Optimize for desktop Chrome, Edge, and other browsers
   - Implement sidebar installation widget for desktop
   - Add desktop-specific installation instructions

3. **Installation Incentives**
   - Offer rewards for installing the PWA
   - Exclusive features for installed app users
   - Re-engagement campaigns for users who dismissed installation

4. **Advanced Platform Detection**
   - More granular device and OS version detection
   - Browser-specific installation flows (Chrome, Samsung Internet, etc.)
   - Tailored instructions for specific Android device manufacturers