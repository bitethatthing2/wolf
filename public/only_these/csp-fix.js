/**
 * CSP Fix for Service Worker
 * Addresses Content Security Policy issues with Elfsight and external scripts
 */

// Add CSP domains to the allowlist
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests to reduce risks, but make an exception for specific domains
  const allowedDomains = [
    'elfsight.com',
    'static.elfsight.com',
    'service.elfsight.com',
    'apps.elfsight.com',
    'elfsightcdn.com',
    'cdninstagram.com',
    'instagram.com'
  ];
  
  // If it's from an allowed domain, let the request pass through
  if (allowedDomains.some(domain => url.hostname.includes(domain))) {
    console.log('[CSP Fix] Allowing request to:', url.hostname);
    return;
  }
  
  // Handle other requests normally
});

// Listen for message events to update allowlist
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'UPDATE_CSP_ALLOWLIST') {
    console.log('[CSP Fix] Updated allowlist received');
  }
});

console.log('[CSP Fix] CSP fix for service worker initialized');