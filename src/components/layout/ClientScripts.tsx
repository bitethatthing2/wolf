"use client";

import Script from "next/script";
import { useEffect } from "react";
import { applyFramerMotionFixes } from "@/lib/framer-motion-fix";

/**
 * ClientScripts component for loading critical, initialization, and third-party scripts
 * Organized by loading priority and purpose
 */
export default function ClientScripts() {
  // Apply Framer Motion fixes when the component mounts
  useEffect(() => {
    applyFramerMotionFixes();
    
    // Log application initialization for debugging
    const logInit = () => {
      if (typeof window !== 'undefined' && window.__wolfAppInit) {
        console.log('App initialization status:', {
          serviceWorker: window.__wolfAppInit.serviceWorkerRegistered ? 'Registered' : 'Not registered',
          pushNotifications: window.__wolfAppInit.pushNotificationsInitialized ? 'Initialized' : 'Not initialized',
          errors: window.__wolfAppInit.errors.length > 0 ? window.__wolfAppInit.errors : 'None'
        });
      }
    };
    
    // Check init status after app is fully loaded
    if (document.readyState === 'complete') {
      setTimeout(logInit, 2000);
    } else {
      window.addEventListener('load', () => setTimeout(logInit, 2000));
    }
  }, []);

  return (
    <>
      {/* Critical and high-priority scripts that should load very early */}
      <Script
        id="polyfill-init"
        strategy="beforeInteractive"
        src="/polyfill-init.js"
      />
      
      <Script 
        src="/navigation-error-fix.js"
        strategy="beforeInteractive"
        id="navigation-error-fix"
      />
      
      <Script
        id="require-polyfill"
        strategy="beforeInteractive"
        src="/require-polyfill.js"
      />
      
      <Script 
        src="/passive-events-fix.js"
        strategy="beforeInteractive"
        id="passive-events-fix"
      />
      
      {/* Service worker and PWA-related scripts */}
      <Script
        id="service-worker-init"
        strategy="afterInteractive"
        src="/service-worker-init.js"
      />
      
      <Script
        id="push-notification-init"
        strategy="afterInteractive"
        src="/push-notification-init.js"
      />
      
      <Script
        id="pwa-install-helper"
        strategy="afterInteractive"
        src="/pwa-install-helper.js"
      />
      
      {/* Performance and animation fixes */}
      <Script
        id="animation-frame-fix"
        strategy="afterInteractive"
        src="/animation-frame-fix.js"
      />
      
      <Script
        id="performance-timing-fix"
        strategy="afterInteractive"
        src="/performance-timing-fix.js"
      />
      
      <Script
        id="direct-animation-fix"
        strategy="afterInteractive"
        src="/direct-animation-fix.js"
      />
      
      {/* 3rd party integration scripts */}
      <Script
        src="/elfsight-fix.js"
        strategy="beforeInteractive"
        id="elfsight-fix-script"
      />
      
      <Script
        src="https://static.elfsight.com/platform/platform.js"
        strategy="lazyOnload"
        id="elfsight-platform-script"
        crossOrigin="anonymous"
        onError={(e) => {
          console.error('Error loading Elfsight platform script:', e);
          
          // Track this error in our global app state
          if (typeof window !== 'undefined' && window.__wolfAppInit) {
            window.__wolfAppInit.errors.push('Elfsight script loading error');
          }
        }}
        onLoad={() => {
          console.log('Elfsight platform script loaded successfully');
          
          // Try to initialize Elfsight if it's already in the DOM
          if (window.elfsight && typeof window.elfsight.reinit === 'function') {
            setTimeout(() => {
              try {
                window.elfsight.reinit();
              } catch (err) {
                console.error('Error initializing Elfsight after load:', err);
              }
            }, 1000);
          }
        }}
      />
      
      {/* Script for Firebase initialization if needed */}
      <Script id="firebase-env-init" strategy="afterInteractive">
        {`
          // Make the Firebase configuration available globally
          window.firebaseConfig = {
            apiKey: "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''}",
            authDomain: "${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || ''}",
            projectId: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''}",
            storageBucket: "${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || ''}",
            messagingSenderId: "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || ''}",
            appId: "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''}",
          };
          
          // Store environment variables for access in other scripts
          window.__ENV = window.__ENV || {};
          window.__ENV.NEXT_PUBLIC_FIREBASE_API_KEY = "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''}";
          window.__ENV.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''}";
          window.__ENV.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || ''}";
          window.__ENV.NEXT_PUBLIC_FIREBASE_APP_ID = "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''}";
        `}
      </Script>
      
      {/* Security and content policy scripts */}
      <Script id="referrer-policy" strategy="afterInteractive">
        {`
          const meta = document.createElement('meta');
          meta.name = 'referrer';
          meta.content = 'no-referrer-when-downgrade';
          document.head.appendChild(meta);
        `}
      </Script>
    </>
  );
}
