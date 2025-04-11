"use client";

import Script from "next/script";
import { useEffect } from "react";
import { applyFramerMotionFixes } from "@/lib/framer-motion-fix";

export default function ClientScripts() {
  // Apply Framer Motion fixes when the component mounts
  useEffect(() => {
    // Apply the fixes when the component mounts
    applyFramerMotionFixes();
  }, []);

  return (
    <>
      {/* Polyfill Initialization - highest priority to fix errors */}
      <Script
        id="polyfill-init"
        strategy="beforeInteractive"
        src="/polyfill-init.js"
      />
      
      {/* Navigation Error Fix - highest priority */}
      <Script 
        src="/navigation-error-fix.js"
        strategy="beforeInteractive"
        id="navigation-error-fix"
      />
      
      {/* Polyfill for require - needed for certain libraries */}
      <Script
        id="require-polyfill"
        strategy="beforeInteractive"
        src="/require-polyfill.js"
      />
      
      {/* Add Passive Event Listeners Fix - high priority */}
      <Script 
        src="/passive-events-fix.js"
        strategy="beforeInteractive"
        id="passive-events-fix"
      />
      
      {/* Animation and performance fixes */}
      <Script
        id="animation-frame-fix"
        strategy="afterInteractive"
        src="/animation-frame-fix.js"
      />
      
      {/* PWA installation helper */}
      <Script
        id="pwa-install-helper"
        strategy="afterInteractive"
        src="/pwa-install-helper.js"
      />
      
      {/* Service worker init - only in production */}
      {process.env.NODE_ENV === 'production' && (
        <Script
          id="service-worker-init"
          strategy="afterInteractive"
          src="/service-worker-init.js"
        />
      )}
      
      {/* Instagram Widget Script - required for Instagram integration */}
      <Script
        src="https://static.elfsight.com/platform/platform.js"
        strategy="lazyOnload"
        id="elfsight-platform-script"
        crossOrigin="anonymous"
      />
      
      {/* Meta tag for referrer policy to help with CORS */}
      <Script id="referrer-policy">
        {`
          const meta = document.createElement('meta');
          meta.name = 'referrer';
          meta.content = 'no-referrer-when-downgrade';
          document.head.appendChild(meta);
        `}
      </Script>
      
      {/* Next.js error component initialization - critical fix */}
      <Script id="nextjs-error-component-init" strategy="beforeInteractive">
        {`
          // Ensure required error components exist to prevent "missing required error components" error
          window.onRecoverableError = window.onRecoverableError || function(error) {
            console.warn('[Init] Recoverable error:', error);
          };
          
          window.onCaughtError = window.onCaughtError || function(error) {
            console.error('[Init] Caught error:', error);
          };
          
          window.callServer = window.callServer || async function() {
            return Promise.resolve(null);
          };
          
          window.shouldRenderRootLevelErrorOverlay = false;
          
          // Initialize server data if not present
          window.initialServerDataBuffer = window.initialServerDataBuffer || [];
          window.initialServerDataWriter = window.initialServerDataWriter || function() {};
          window.initialServerDataLoaded = window.initialServerDataLoaded || true;
          window.initialServerDataFlushed = window.initialServerDataFlushed || true;
          
          // Track initialization
          window.__NEXT_INIT_TIMESTAMP = Date.now();
        `}
      </Script>
    </>
  );
}
