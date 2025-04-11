/**
 * PWA Installation Helper
 * This script provides global PWA installation support and improves the installation experience
 */

// Store the install prompt event for later use
let pwaInstallPrompt;
let installButtonId = 'install-pwa-button'; // Default ID for install button

// Check if the app is already installed
const isAppInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator.standalone === true);
};

// Update UI based on installation status
const updateInstallUI = () => {
  const installButtons = document.querySelectorAll(`[data-pwa-install="true"], #${installButtonId}`);
  
  if (isAppInstalled()) {
    // Hide all install buttons if app is installed
    installButtons.forEach(button => {
      if (button) button.style.display = 'none';
    });
    
    // Dispatch a custom event that components can listen for
    window.dispatchEvent(new CustomEvent('pwaStatusChange', { 
      detail: { installed: true } 
    }));
  } else if (pwaInstallPrompt) {
    // Show install buttons if prompt is available
    installButtons.forEach(button => {
      if (button) {
        button.style.display = 'block';
        
        // Only add the event listener if it doesn't already have one
        if (!button.hasAttribute('data-pwa-listener')) {
          button.setAttribute('data-pwa-listener', 'true');
          button.addEventListener('click', triggerInstallPrompt);
        }
      }
    });
    
    // Dispatch event for components
    window.dispatchEvent(new CustomEvent('pwaStatusChange', { 
      detail: { installed: false, installable: true } 
    }));
  } else {
    // App is not installed but no prompt is available (iOS or other scenario)
    installButtons.forEach(button => {
      if (button && button.hasAttribute('data-show-ios') && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        button.style.display = 'block';
      } else if (button) {
        button.style.display = 'none';
      }
    });
    
    // Dispatch event for components
    window.dispatchEvent(new CustomEvent('pwaStatusChange', { 
      detail: { installed: false, installable: false } 
    }));
  }
};

// Trigger the installation prompt
const triggerInstallPrompt = (event) => {
  if (event) {
    event.preventDefault();
  }
  
  if (!pwaInstallPrompt) {
    console.log('No installation prompt available');
    return;
  }
  
  // Show the install prompt
  pwaInstallPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  pwaInstallPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA installation');
      
      // Track installation in analytics if available
      if (window.gtag) {
        window.gtag('event', 'pwa_install', {
          'event_category': 'engagement',
          'event_label': 'PWA Installation'
        });
      }
    } else {
      console.log('User dismissed the PWA installation');
    }
    
    // Clear the saved prompt as it can't be used again
    pwaInstallPrompt = null;
    
    // Update UI
    updateInstallUI();
  });
};

// Configure the installation helper
const configurePwaInstallHelper = (config = {}) => {
  if (config.buttonId) {
    installButtonId = config.buttonId;
  }
  
  // Update UI based on current state
  updateInstallUI();
};

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Don't prevent the default - this allows both our UI and the browser's UI
  // e.preventDefault();
  
  // Store the event for later use
  pwaInstallPrompt = e;
  
  // Update UI
  updateInstallUI();
});

// Listen for the appinstalled event
window.addEventListener('appinstalled', (evt) => {
  // Log that the app was installed
  console.log('PWA was installed');
  
  // Clear the prompt
  pwaInstallPrompt = null;
  
  // Update UI
  updateInstallUI();
});

// Listen for display mode changes
window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
  updateInstallUI();
});

// Initialize when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateInstallUI);
} else {
  updateInstallUI();
}

// Expose the API globally
window.pwaInstallHelper = {
  configure: configurePwaInstallHelper,
  triggerInstall: triggerInstallPrompt,
  isInstalled: isAppInstalled,
  updateUI: updateInstallUI
};
