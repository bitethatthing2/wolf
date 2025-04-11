/**
 * Service Worker Registration for Side Hustle Bar
 * This script registers the service worker for PWA functionality
 */

// Check if we're in development mode
const isDevelopment = 
  typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' || 
   window.location.hostname.includes('.local'));

// Only register the service worker in production
if ('serviceWorker' in navigator && !isDevelopment) {
  window.addEventListener('load', function() {
    // Register the service worker
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Check if there's an update available
        registration.addEventListener('updatefound', function() {
          // A new service worker is being installed
          const installingWorker = registration.installing;
          
          installingWorker.addEventListener('statechange', function() {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show update notification
              if (confirm('New version of Side Hustle Bar is available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(function(error) {
        console.error('Service Worker registration failed:', error);
      });
      
    // Handle service worker updates
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
} else if (isDevelopment && 'serviceWorker' in navigator) {
  // In development, log a message instead of trying to register
  console.log('%c🛠️ Service Worker disabled in development mode', 'background: #222; color: #bada55; padding: 2px 4px; border-radius: 2px;');
  console.log('Service workers require HTTPS or localhost with special configuration.');
  console.log('For local development, you can:');
  console.log('1. Test in production');
  console.log('2. Use Chrome with --unsafely-treat-insecure-origin-as-secure flag');
  console.log('3. Configure a local HTTPS server');
}

// Add to home screen functionality
let deferredPrompt;
const addToHomeBtn = document.getElementById('add-to-home');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show the add to home screen button if available
  if (addToHomeBtn) {
    addToHomeBtn.style.display = 'block';
    
    addToHomeBtn.addEventListener('click', () => {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        
        // Clear the saved prompt
        deferredPrompt = null;
        
        // Hide the button
        addToHomeBtn.style.display = 'none';
      });
    });
  }
});
