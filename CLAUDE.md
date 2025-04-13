# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build, Lint, and Test Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production and prepare for Netlify
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Code Style Guidelines
- **Imports**: Group imports by type (React, external libs, internal components, types)
- **Components**: Use functional components with TypeScript interfaces for props
- **TypeScript**: Use strict typing; avoid `any` type; define shared types in `src/types`
- **Naming**: PascalCase for components; camelCase for functions/variables; kebab-case for files
- **CSS**: Use Tailwind with `cn()` utility for conditional class merging
- **Context**: Create context providers with custom hooks (see `useLocation`)
- **Error Handling**: Use error boundaries and explicit error states in components
- **State Management**: Use React Context for global state; local state for component-specific logic
- **Icons**: Use Lucide React for icons; custom icons in `src/components/icons`
- **Theme**: Support both light and dark modes with `next-themes`

## Next.js Best Practices
- **Image Component**: Use the modern Next.js Image component with `fill` prop instead of the legacy `layout="fill"` and `objectFit` props
- **Navigation Error Handling**: The app includes custom error handling for Next.js navigation errors with retry logic
- **Polyfills**: Custom polyfills are available in `src/polyfills/index.js` and are automatically included
- **Error Boundaries**: Use the enhanced ErrorBoundary component for catching React rendering errors
- **Client Components**: All client-side components should be wrapped with the ClientComponentsWrapper

## Architecture Documentation
You can find detailed documentation for key systems in the `/docs/` folder:

- **Push Notification System**: `/docs/learnings/notification-system.md`
- **Next.js Error Handling**: `/docs/learnings/next-error-handling.md`
- **PWA Installation Flow**: `/docs/architecture/installation-flow.md`

## Supabase Security Recommendations
- **Update Supabase URL**: The project's Supabase URL should be set to `https://dzvvjgmnlcmgrsnyfqnw.supabase.co` in environment files
- **Enable Leaked Password Protection**: This should be enabled in the Supabase dashboard under Auth settings
- **Review OTP Expiry Time**: Set OTP (One-Time Password) expiry to less than an hour for security
- **Fix Function Search Path**: The `public.update_last_active` function needs its search_path parameter set to address the mutable search path security issue

## Memories

### April 12, 2025: Instagram Embedding Improvements

#### Instagram API Integration Fixes
- Fixed "route config was null" error by adding `captioned=false` parameter to embed URLs
- Implemented comprehensive error detection and recovery for Instagram embed issues
- Added multiple fallback mechanisms and retry logic for reliable embedding
- Enhanced user experience with direct Instagram links as backup options
- Improved script loading with better CORS support and timing adjustments
- Added progressive timeout system with increasing durations for better reliability

### April 12, 2025: Component Cleanup and Organization

#### Instagram Component Simplification
- Removed unused and redundant components related to Instagram embedding
- Consolidated the implementation to use `InstagramFeedSection` and `InstagramEmbed` only
- Removed dependency on `next-elfsight-widget` package
- Created documentation in `/docs/cleanup-instructions.md`
- Added utility script for component cleanup (`scripts/cleanup-unused-components.sh`)
- Updated all references to use the simplified component structure
- Fixed import paths in locations page

### April 12, 2025: Image and Icon Usage Mapping

#### Comprehensive Image Organization
- Created a complete mapping of all images and their usage locations in `/docs/image-usage-map.md`
- Established a consistent naming convention for images (`[location]-[purpose]-[theme?].[extension]`)
- Developed utility scripts for image analysis and renaming (`scripts/analyze-icon-usage.js` and `scripts/rename-images.js`)
- Categorized images by function (app icons, UI elements, food photos, etc.)
- Documented all notification icons in the `/only_these/` directory
- Created a plan for systematic image renaming with backward compatibility

#### Image Usage Patterns
- Identified all components that reference images and their usage patterns
- Mapped menu item images to their corresponding components
- Documented theme-dependent image switching (light/dark mode variations)
- Analyzed splash screen organization for iOS and Android devices
- Documented image organization for delivery service icons
- Mapped blog and event image usage

### April 12, 2025: Project Structure Consolidation and Flow Analysis

#### Component Structure Improvements
- Renamed components to better reflect their actual functionality (ElfsightInstagramFeed → InstagramFeedSection)
- Analyzed Instagram implementation to understand the relationship between components
- Created documentation for project structure and component flow in /docs/project-structure-analysis.md
- Ensured proper interaction between Instagram, Reservation, and Review sections
- Identified opportunities for component consolidation
- Documented component relationships and dependencies for better maintainability

#### Push Notification System Enhancements
- Implemented platform-specific notification icons for Android and iOS
- Enhanced deduplication system using IndexedDB for better persistence
- Added content hash generation for duplicate notification prevention
- Improved iOS vs Android detection for optimal notification display
- Added platform-specific welcome notifications with tailored messaging
- Fixed service worker registration and initialization
- Implemented automatic token refresh on 6-day cycle (preventing token expiration)
- Added special handling for foreground notifications on iOS devices

### April 12, 2025: Reservation System Implementation

#### Booking System Features
- Added a comprehensive reservation system between Instagram and Google Reviews sections
- Implemented three booking types: table reservations, catering requests, and birthday/event bookings
- Created responsive form interfaces with input validation and theme compatibility
- Used Framer Motion for smooth transitions between form types
- Added contact information section for large group inquiries

### April 12, 2025: Next.js 15 Update with Notification and PWA Enhancements

#### Next.js 15 Compatibility
- Updated project to use Next.js 15.2.4 with App Router support
- Enhanced service worker registration for Next.js 15 compatibility
- Improved error handling for modern Next.js navigation patterns
- Maintained backward compatibility with existing notification system

#### Push Notification System Enhancements
- Fixed the token refresh mechanism to prevent expired tokens (6-day rotation cycle)
- Improved deduplication by implementing content hashing and IndexedDB persistence
- Added native iOS/Android tag support for better cross-platform notification handling
- Implemented token rotation and cleanup for old/expired tokens
- Enhanced the service worker's handling of push notifications
- Added platform-specific welcome notifications

#### Error Handling Improvements
- Fixed "Failed to fetch" TypeErrors during navigation with retry logic
- Resolved "missing required error components" error with proper polyfill initialization
- Enhanced error boundaries to properly catch and display client-side errors
- Added early script initialization for critical Next.js components
- Consolidated error handlers in service worker and client components

#### PWA Installation Improvements
- Enhanced Android installation guide with visual indicators and clear steps
- Improved iOS installation detection and instruction clarity
- Added welcome notification for new installations
- Created platform-specific installation prompts
- Added service worker initialization improvements

### April 11, 2025: Notification System and Error Handling Improvements

#### Push Notification System Enhancements
- Fixed the token refresh mechanism to prevent expired tokens (7-day rotation)
- Improved deduplication by implementing content hashing and IndexedDB persistence
- Added native iOS/Android tag support for better cross-platform notification handling
- Implemented token rotation and cleanup for old/expired tokens
- Enhanced the service worker's handling of push notifications

#### Next.js Error Handling
- Fixed "Failed to fetch" TypeErrors during navigation with retry logic
- Resolved "missing required error components" error with proper polyfill initialization
- Enhanced error boundaries to properly catch and display client-side errors
- Added early script initialization for critical Next.js components
- Consolidated error handlers in service worker and client components

#### Image Component Modernization  
- Updated legacy Next.js Image components to use modern syntax
- Replaced deprecated `layout="fill"` with `fill` prop
- Moved `objectFit="contain"` to className property as "object-contain"

#### PWA Installation Improvements
- Enhanced Android installation guide with visual indicators and clear steps
- Improved iOS installation detection and instruction clarity
- Added welcome notification for new installations
- Created platform-specific installation prompts
- Added service worker initialization improvements