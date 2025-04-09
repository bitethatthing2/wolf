"use client";

import Script from "next/script";

export default function ClientScripts() {
  return (
    <>
      {/* Add Passive Event Listeners Fix - highest priority */}
      <Script 
        src="/passive-events-fix.js"
        strategy="beforeInteractive"
        id="passive-events-fix"
      />
      {/* Add Framer Motion Timing Fix - highest priority */}
      {/* <Script 
        src="/framer-timing-fix.js"
        strategy="beforeInteractive"
        id="framer-timing-fix"
      /> */}
      {/* Add Require Polyfill - highest priority to prevent animation errors */}
      {/* <Script 
        src="/require-polyfill.js"
        strategy="beforeInteractive"
        id="require-polyfill"
      /> */}
      {/* Add Direct Animation Fix Script - highest priority */}
      {/* <Script 
        src="/direct-animation-fix.js"
        strategy="beforeInteractive"
      /> */}
      {/* Add Animation Frame Fix Script */}
      {/* <Script 
        src="/animation-frame-fix.js"
        strategy="beforeInteractive"
      /> */}
      {/* Add Performance Timing Fix Script */}
      {/* <Script 
        src="/performance-timing-fix.js"
        strategy="beforeInteractive"
      /> */}
      {/* Add Google Maps Iframe Fix Script */}
      {/* <Script 
        src="/google-maps-iframe-fix.js"
        strategy="beforeInteractive"
        id="google-maps-iframe-fix"
      /> */}
      {/* Add Elfsight Fix Script */}
      {/* <Script 
        src="/elfsight-fix.js"
        strategy="beforeInteractive"
      /> */}
      {/* Add Elfsight Platform Fix Script */}
      {/* <Script 
        src="/elfsight-platform-fix.js"
        strategy="beforeInteractive"
      /> */}
      
      {/* REMOVED Google Maps Fix Scripts - they were causing conflicts */}
      
      {/* Elfsight Platform Script - load at root level for proper initialization */}
      <Script
        src="https://static.elfsight.com/platform/platform.js"
        strategy="beforeInteractive"
        id="elfsight-platform-script"
        onLoad={() => {
          // Mark as loaded in the global scope
          if (typeof window !== 'undefined') {
            (window as any).elfsightScriptLoaded = true;
          }
        }}
      />

      {/* Include Google Reviews platform script */}
      <Script
        src="https://widgets.sociablekit.com/google-reviews/widget.js"
        strategy="lazyOnload"
        async
      />
      
      {/* Add Service Worker Initialization */}
      {/* <Script 
        src="/service-worker-init.js"
        strategy="afterInteractive"
      /> */}
      {/* Add PWA Installation Helper */}
      {/* <Script 
        src="/pwa-install-helper.js"
        strategy="afterInteractive"
      /> */}
    </>
  );
}
