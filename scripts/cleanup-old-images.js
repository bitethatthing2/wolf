// scripts/cleanup-old-images.js
const fs = require('fs');
const path = require('path');

// Define base directory relative to the script location
const projectRoot = path.join(__dirname, '..');

// --- IMPORTANT: Copy the EXACT renameMap from rename-images.js here ---
const renameMap = {
    // App Icons and Installation Images
    '/public/wolf_girl.png': '/public/homepage-chef-icon.png',
    '/public/apple_icon_install_white.png': '/public/app-install-ios-dark.png',
    '/public/ios_pwa_install-black.png': '/public/app-install-ios-light.png',
    '/public/android-installation-guide-white.png.png': '/public/app-install-android-dark.png', // Note potential double .png
    '/public/android_installation_guide-black.png': '/public/app-install-android-light.png',
    '/public/share-ios.png': '/public/ios-share-button.png',
    '/public/ios-add-homescreen.png': '/public/ios-add-homescreen-screenshot.png',

    // Navigation & UI Icons
    '/public/wolf-icon-black.png': '/public/logo-main-light.png',
    '/public/wolf-icon-white.png': '/public/logo-main-dark.png',
    '/public/wolf-light-white.png': '/public/logo-footer-dark.png',
    '/public/main-menu-icon-black.png': '/public/nav-menu-light.png',
    '/public/main-menu-icon-white.png': '/public/nav-menu-dark.png',
    '/public/nav-bar-sidehustle-white.png': '/public/nav-header-dark.png',
    '/public/nav-bar-sidehustle-dark.png': '/public/nav-header-light.png',

    // Food & Menu Images
    '/public/loaded_frys.png': '/public/menu-item-loaded-fries.png',
    '/public/loaded_nacho.png': '/public/menu-item-loaded-nachos.png',
    '/public/flautas_potatoes.png': '/public/menu-item-flautas-potatoes.png',
    '/public/basket_fry.png': '/public/menu-item-basket-fries.png',
    '/public/basket_tots.png': '/public/menu-item-basket-tots.png',
    '/public/chips_guac.png': '/public/menu-item-chips-guac.png',

    // Blog Images
    '/public/flour-tortillas-at-home-blog-image.png': '/public/blog-flour-tortillas.png',
    '/public/guacamole-blog-image.png': '/public/blog-guacamole.png',
    '/public/make-elote-at-home-blog-image.png': '/public/blog-make-elote.png',
    '/public/perfect-salsa-verde-blog.png': '/public/blog-salsa-verde.png',
    '/public/secrets-mexican-chef-blog.png': '/public/blog-secrets-chef.png',
    '/public/tacos-barria-blog-image.png': '/public/blog-tacos-birria.png', // Corrected typo from Barria -> Birria based on convention

    // Third-party Logos
    '/public/darkdoordash_icon.png': '/public/logo-doordash-dark.png',
    '/public/doordash_icon-light.png': '/public/logo-doordash-light.png',
    '/public/postmates-black-icon.png': '/public/logo-postmates-dark.png',
    '/public/postmates-icon-white.png': '/public/logo-postmates-light.png',
    '/public/uber eats.png': '/public/logo-uber-eats-light.png', // Assuming light based on name
    '/public/uber_eats-dark.png': '/public/logo-uber-eats-dark.png',
    '/public/google_maps_icon_white.png': '/public/logo-google-maps-dark.png',
    '/public/google-maps-icon.png': '/public/logo-google-maps-light.png',
    '/public/apple_maps_icon_white.png': '/public/logo-apple-maps-dark.png',
    '/public/apple-maps-icon.png': '/public/logo-apple-maps-light.png',

    // Social Icons (Assuming these are meant to be SVGs based on other assets)
    '/src/assets/icons/social_icon_facebook.svg': '/src/assets/icons/social-facebook.svg',
    '/src/assets/icons/social_icon_instagram.svg': '/src/assets/icons/social-instagram.svg',
    '/src/assets/icons/social_icon_google.svg': '/src/assets/icons/social-google.svg',

    // Placeholder Images (Keep originals unless explicitly replaced)
    // '/public/img_placeholder_event_default.jpg': '/public/placeholder-event.jpg', // Example - keep original if not mapped
    // '/public/img_placeholder_shop_default.jpg': '/public/placeholder-shop.jpg', // Example - keep original if not mapped
    // '/public/img_placeholder_blog_default.jpg': '/public/placeholder-blog.jpg', // Example - keep original if not mapped

    // Specific Use Case Images
    '/public/app_icon_large.png': '/public/app-icon-marketing.png', // Needs verification

    // Potential Duplicates/Typos/Old paths (Verify these)
    '/public/only_these/logos/menu_icon.png': '/public/icons/pwa-menu-add-to-home.png', // Example - needs path confirmation
    '/public/only_these/logos/welcome_to_pack.png': '/public/icons/pwa-welcome.png', // Example - needs path confirmation
    '/public/icons/splash_screens/icon.png': '/public/icons/pwa-splash-icon.png', // Example - needs verification if used elsewhere

    // Shop Images (Assuming paths are relative to public)
    '/public/images/shop/classic-tshirt.jpg': '/public/images/shop/product-tshirt-classic.jpg',
    '/public/images/shop/coffee-blend.jpg': '/public/images/shop/product-coffee-blend.jpg',
    '/public/images/shop/premium-hoodie.jpg': '/public/images/shop/product-hoodie-premium.jpg',
    '/public/images/shop/steel-tumbler.jpg': '/public/images/shop/product-tumbler-steel.jpg'
};
// --- End of renameMap ---

console.log('🧹 Starting cleanup of old image files...');

let deletedCount = 0;
let skippedCount = 0;
let errorCount = 0;

Object.keys(renameMap).forEach(oldRelativePath => {
    // Trim leading slash if present, as path.join handles it
    const cleanedOldPath = oldRelativePath.startsWith('/') ? oldRelativePath.substring(1) : oldRelativePath;
    const fullPath = path.join(projectRoot, cleanedOldPath);

    try {
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`✅ Deleted: ${oldRelativePath}`);
            deletedCount++;
        } else {
            // console.log(`🟡 Skipped (already gone): ${oldRelativePath}`); // Optional: uncomment for more verbose logging
            skippedCount++;
        }
    } catch (error) {
        console.error(`❌ Error deleting ${oldRelativePath}: ${error.message}`);
        errorCount++;
    }
});

console.log(`\n🧼 Cleanup finished.`);
console.log(`   ${deletedCount} files deleted.`);
console.log(`   ${skippedCount} files skipped (did not exist).`);
if (errorCount > 0) {
    console.log(`   ${errorCount} errors encountered.`);
}
