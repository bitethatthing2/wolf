# Image Usage Map

This document provides a comprehensive mapping of all images and icons used in the Side Hustle Bar website, organized by category and usage location. Use this guide to understand where each image is referenced before making changes.

## Naming Convention

All images should follow this naming pattern:
`[location]-[purpose]-[theme?].[extension]`

Examples:
- `homepage-chef-photo-dark.png` - Chef photo used on homepage, dark theme
- `menu-item-loaded-fries.jpg` - Food image for loaded fries menu item
- `notification-icon-android.png` - Notification icon for Android

## App Icons and Installation Images

| Current Filename | Used In | Purpose | Proposed New Name |
|------------------|---------|---------|-------------------|
| `/wolf_girl.png` | Homepage (page.tsx) | Chef profile icon | `homepage-chef-icon.png` |
| `/apple_icon_install_white.png` | AppInstallFlow.tsx | iOS installation icon (dark theme) | `app-install-ios-dark.png` |
| `/ios_pwa_install-black.png` | AppInstallFlow.tsx | iOS installation icon (light theme) | `app-install-ios-light.png` |
| `/android-installation-guide-white.png.png` | AppInstallFlow.tsx | Android installation icon (dark theme) | `app-install-android-dark.png` |
| `/android_installation_guide-black.png` | AppInstallFlow.tsx | Android installation icon (light theme) | `app-install-android-light.png` |
| `/share-ios.png` | iOS instructions | iOS share button screenshot | `ios-share-button.png` |
| `/ios-add-homescreen.png` | iOS instructions | iOS add to homescreen screenshot | `ios-add-homescreen-screenshot.png` |

## Navigation & UI Icons

| Current Filename | Used In | Purpose | Proposed New Name |
|------------------|---------|---------|-------------------|
| `/wolf-icon-black.png` | Various | Main logo (light theme) | `logo-main-light.png` |
| `/wolf-icon-white.png` | Various | Main logo (dark theme) | `logo-main-dark.png` | 
| `/wolf-light-white.png` | Footer | Footer logo (dark theme) | `logo-footer-dark.png` |
| `/main-menu-icon-black.png` | Mobile navigation | Menu hamburger icon (light theme) | `nav-menu-light.png` |
| `/main-menu-icon-white.png` | Mobile navigation | Menu hamburger icon (dark theme) | `nav-menu-dark.png` |
| `/nav-bar-sidehustle-white.png` | Header | Navigation header (dark theme) | `nav-header-dark.png` |
| `/nav-bar-sidehustle-dark.png` | Header | Navigation header (light theme) | `nav-header-light.png` |

## Food & Menu Images

| Current Filename | Used In | Purpose | Proposed New Name |
|------------------|---------|---------|-------------------|
| `/loaded_frys.png` | Menu items | Loaded fries image | `menu-item-loaded-fries.png` |
| `/loaded_nacho.png` | Menu items | Loaded nachos image | `menu-item-loaded-nachos.png` |
| `/flautas_potatoes.png` | Menu items | Flautas with potatoes image | `menu-item-flautas-potatoes.png` |
| `/basket_fry.png` | Menu items | Basket of fries image | `menu-item-basket-fries.png` |
| `/basket_tots.png` | Menu items | Basket of tater tots image | `menu-item-basket-tots.png` |
| `/chips_guac.png` | Menu items | Chips and guacamole image | `menu-item-chips-guac.png` |

## Blog Images

| Current Filename | Used In | Purpose | Proposed New Name |
|------------------|---------|---------|-------------------|
| `/flour-tortillas-at-home-blog-image.png` | Chef blog | Tortilla blog post image | `blog-flour-tortillas.png` |
| `/guacamole-blog-image.png` | Chef blog | Guacamole blog post image | `blog-guacamole.png` |
| `/make-elote-at-home-blog-image.png` | Chef blog | Elote blog post image | `blog-make-elote.png` |
| `/perfect-salsa-verde-blog.png` | Chef blog | Salsa verde blog post image | `blog-salsa-verde.png` |
| `/secrets-mexican-chef-blog.png` | Chef blog | Mexican chef secrets blog image | `blog-mexican-chef-secrets.png` |
| `/tacos-barria-blog-image.png` | Chef blog | Tacos birria blog post image | `blog-tacos-birria.png` |

## Event Images

| Current Filename | Used In | Purpose | Proposed New Name |
|------------------|---------|---------|-------------------|
| `/hustle_jam_event.png` | Events page | Hustle Jam event image | `event-hustle-jam.png` |
| `/img_placeholder_event_default.jpg` | Events page | Default event image placeholder | `event-placeholder-default.jpg` |

## Delivery Service Icons

| Current Filename | Used In | Purpose | Proposed New Name |
|------------------|---------|---------|-------------------|
| `/darkdoordash_icon.png` | Order page | DoorDash icon (dark theme) | `delivery-doordash-dark.png` |
| `/doordash_icon-light.png` | Order page | DoorDash icon (light theme) | `delivery-doordash-light.png` |
| `/postmates-black-icon.png` | Order page | Postmates icon (light theme) | `delivery-postmates-light.png` |
| `/postmates-icon-white.png` | Order page | Postmates icon (dark theme) | `delivery-postmates-dark.png` |
| `/uber eats.png` | Order page | UberEats icon (light theme) | `delivery-ubereats-light.png` |
| `/uber_eats-dark.png` | Order page | UberEats icon (dark theme) | `delivery-ubereats-dark.png` |

## Notification Icons

| Current Filename | Used In | Purpose | Proposed New Name |
|------------------|---------|---------|-------------------|
| `/only_these/android/android-launchericon-96-96.png` | Firebase SW | Android notification icon | `notification-icon-android.png` |
| `/only_these/ios/apple-icon-180x180.png` | Firebase SW | iOS notification icon | `notification-icon-ios.png` |
| `/only_these/android-icon-96x96.png` | Firebase SW | General notification badge | `notification-badge.png` |
| `/enable-notifications-dark.png` | Notification UI | Enable notifications button (dark) | `notification-enable-dark.png` |
| `/enable-notifications-light-screen.png` | Notification UI | Enable notifications button (light) | `notification-enable-light.png` |

## Splash Screens

The `/icons/splash_screens/` directory contains numerous device-specific splash screen images for iOS and Android. These are referenced in the `SplashScreens.tsx` component and should be kept in their dedicated directory with the current naming convention.

## SVG Icons

Most UI icons (menu item icons, navigation controls, action buttons) use Lucide React's built-in SVG icons, which are referenced in:
- `src/components/common/menu-icon.tsx`
- Various UI components

## Menu Items and Food Icons

Food items are not directly associated with image files but use symbolic icons via the Lucide icon library. The mapping is defined in:
- `src/lib/menu-icons.ts` - Creates icon definitions
- `src/components/common/menu-icon.tsx` - Maps icon names to Lucide components

## Special UI Components

The `menu-item.tsx` component dynamically loads images based on the `item.image` property from the menu data.

## Recommendation

1. Rename all image files according to the proposed naming convention
2. Update all references in the codebase
3. Consider creating a dedicated icons module for consistent usage
4. Add comments near image references indicating their purpose