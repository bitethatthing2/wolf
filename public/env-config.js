/**
 * Environment Configuration Script
 * This script loads environment variables from Netlify into the client-side JavaScript
 * environment for use by the push notification system and other components.
 */

(function() {
  // Create window.__ENV object to store environment variables
  window.__ENV = window.__ENV || {};
  
  // Parse environment variables from Netlify
  function parseNetlifyEnv() {
    try {
      // Check if we're running on Netlify by looking for the NETLIFY env var
      // in the document or meta tags
      
      // Try to find env vars in meta tags (Netlify injects these at build time)
      const envMeta = document.querySelector('meta[name="env-config"]');
      if (envMeta && envMeta.content) {
        try {
          // Decode and parse the content
          const envConfig = JSON.parse(atob(envMeta.content));
          console.log('[ENV Config] Loaded environment variables from meta tag');
          return envConfig;
        } catch (e) {
          console.warn('[ENV Config] Error parsing meta tag env config:', e);
        }
      }
      
      // Fallback: hardcoded values for development only
      // In production, these should come from Netlify environment variables
      return {
        NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyBF8nfh2gYZnRh1U6vgP-XMfP9KCu6TKBQ",
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: "new1-f04b3",
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "1036893806199",
        NEXT_PUBLIC_FIREBASE_APP_ID: "1:1036893806199:web:5f6b3f8d18d30eda1bffcb",
        NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY: "BPAbU0G8rhAKE7ay5RepQ7N3V_CsdCKvmflQm0FncBbx4CHL0IfmGvdbdYUN90Vjn50JB7T9jzj268KhYJ34ikU",
        INSTAGRAM_WIDGET_ID: "4118f1f5-d59f-496f-8439-e8e0232a0fef", // Instagram feed widget ID
        GOOGLE_REVIEWS_WIDGET_ID: "f4fdffed-81de-4-b688-2da302faebbe", // Google reviews widget ID
        ELFSIGHT_CORS_PROXY_ENABLED: "true" // Enable CORS proxy by default
      };
    } catch (err) {
      console.error('[ENV Config] Error loading environment variables:', err);
      return {};
    }
  }
  
  // Load environment variables
  const envVars = parseNetlifyEnv();
  
  // Copy to window.__ENV
  Object.assign(window.__ENV, envVars);
  
  // Create alias for backward compatibility
  window.env = window.__ENV;
  
  console.log('[ENV Config] Loaded configuration variables');
})();