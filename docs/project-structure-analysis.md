# Project Structure Analysis

## Instagram Embedding Implementation

The project currently has multiple approaches to embedding Instagram content, which creates some complexity and potential confusion.

### Current Components

1. **ElfsightInstagramFeed.tsx**
   - Used on the homepage
   - Despite the name, uses our own custom InstagramEmbed component
   - Does NOT use Elfsight widget

2. **InstagramEmbed.tsx**
   - Our custom implementation
   - Uses Instagram's official embed script
   - Handles dark/light mode
   - Has proper error states

3. **SideHustleInstagramFeed.tsx**
   - Uses Elfsight widget in production
   - Uses a mock in development
   - Not currently used on homepage

4. **ElfsightWidget.tsx**
   - A wrapper around the official next-elfsight-widget package
   - Provides error handling

5. **SmartElfsightWidget.tsx**
   - Intelligently chooses between real Elfsight and mock
   - Not directly used in the Instagram feed

6. **ElfsightMock.tsx**
   - A placeholder for Elfsight widgets in development

### Component Relationships

```
Homepage --> ElfsightInstagramFeed --> InstagramEmbed
                                       (Direct Instagram embed)

[Unused] --> SideHustleInstagramFeed --> Official Elfsight widget or mock

[Reusable] --> SmartElfsightWidget --> ElfsightWidget --> Official widget or ElfsightMock
```

### Recommendation

To streamline the implementation:

1. **Rename components to clarify their purpose**
   - Rename "ElfsightInstagramFeed" to "InstagramFeedSection" since it doesn't use Elfsight
   - Keep "SideHustleInstagramFeed" as an alternative implementation if needed

2. **Consolidate implementation**
   - Choose one approach (custom or Elfsight) for consistency
   - Remove unused components

## Push Notification System

The push notification system has been successfully implemented with the following features:

- Platform-specific notification handling (iOS vs Android)
- Proper icons stored in `/public/only_these/` directory
- IndexedDB for notification persistence
- Automatic Firebase config sharing with service worker
- Welcome notifications with platform-specific messaging

## Homepage Component Flow

The homepage now has a clear, logical flow of components:

1. Header section with location switcher
2. Main promotional content
3. App installation flow
4. Map and directions based on selected location
5. Instagram feed section
6. Reservation section (with table, catering, and event booking options)
7. Google reviews section

This structure provides a natural progression from brand introduction to social proof and action items.

## Contact Information

Contact information has been updated throughout the site:

- Phone: (503) 391-9123
- Email: info@sidehustlebar.com

These appear in the reservation section and footer.

## Next Steps

1. Decide on a single Instagram embedding approach
2. Rename components to better reflect their functionality
3. Remove any unused components
4. Update documentation with the final implementation details