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

## Memories

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