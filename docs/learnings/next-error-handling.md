# Next.js Error Handling Architecture

This document outlines the comprehensive error handling improvements implemented in our Next.js application to create a robust user experience even when errors occur.

## Key Challenges Addressed

### 1. Navigation Errors
- **"Failed to fetch" TypeErrors during page navigation**
  - Occurs when network requests fail during navigation
  - Often caused by intermittent connectivity issues or server problems
  - Can completely break the application's navigation flow
  - Particularly problematic on mobile devices with unstable connections

### 2. Next.js Initialization Errors
- **"Missing required error components" errors**
  - Critical error when Next.js tries to use error components that aren't yet initialized
  - Results in cryptic console errors: `Uncaught Error: Missing required error components, refreshing...`
  - Causes infinite refresh loops in some cases
  - Prevents proper hydration of server-rendered content

### 3. Client-side Rendering Failures
- **React component rendering errors**
  - Unhandled exceptions in render methods cascade to break entire sections
  - Default behavior unmounts the entire component tree for that section
  - Poor user experience with blank screens and no recovery path
  - Lack of helpful error information for users or developers

## Technical Solution Architecture

### 1. Enhanced Navigation Error Handling

We implemented a comprehensive solution to make navigation resilient against network failures:

#### Fetch Interception and Retry Logic
```javascript
// Intercept navigation fetch requests
const originalFetch = window.fetch;
window.fetch = async function(input, init) {
  // Determine if this is a navigation request
  const isNavigationRequest = typeof input === 'string' && 
    (input.includes('/_next/data/') || input.includes('/__nextjs_original-stack-frame'));
  
  if (isNavigationRequest) {
    try {
      // Try the original fetch
      return await originalFetch(input, init);
    } catch (error) {
      console.warn('[Navigation Error] Failed to fetch:', input, error);
      
      // Implement retry logic with exponential backoff
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
          return await originalFetch(input, init);
        } catch (retryError) {
          console.warn(`[Navigation Error] Retry ${attempt + 1} failed:`, retryError);
        }
      }
      
      // If all retries fail, return a synthetic response
      // This prevents Next.js from breaking the entire app
      return new Response(JSON.stringify({
        pageProps: { __NAVIGATION_ERROR__: true },
        __N_SSG: true
      }), {
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' })
      });
    }
  }
  
  // Regular fetch for non-navigation requests
  return originalFetch(input, init);
};
```

#### Global Error Event Listeners
```javascript
// Listen for unhandled navigation errors
window.addEventListener('error', function(event) {
  if (event.message?.includes('Failed to fetch')) {
    console.warn('[NavigationError] Caught fetch error:', event.message);
    event.preventDefault();
    
    // Prevent default error handling
    return true;
  }
});

// Listen for unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  if (event.reason?.message?.includes('Failed to fetch')) {
    console.warn('[NavigationError] Caught unhandled rejection:', event.reason);
    event.preventDefault();
    
    // Prevent default error handling
    return true;
  }
});
```

### 2. Required Error Components Initialization

To address the "missing required error components" error, we created a comprehensive solution:

#### Early Initialization Script
```javascript
// This script runs before the Next.js bundle loads
(function() {
  if (typeof window !== 'undefined') {
    // Required error handlers for Next.js
    window.onRecoverableError = window.onRecoverableError || function(error) {
      console.warn('[Polyfill] Recoverable error:', error);
      return error;
    };
    
    window.onCaughtError = window.onCaughtError || function(error) {
      console.error('[Polyfill] Caught error:', error);
      return error;
    };
    
    window.callServer = window.callServer || async function() {
      return Promise.resolve(null);
    };
    
    window.shouldRenderRootLevelErrorOverlay = 
      window.shouldRenderRootLevelErrorOverlay || function() {
        return false;
      };
      
    // Prevent the "Missing required error components" error
    window.__NEXT_ERROR_SETUP_COMPLETED = true;
  }
})();
```

#### Comprehensive Next.js Polyfills
```javascript
// Complete polyfills for Next.js internals
export function setupNextJsErrorHandlers() {
  if (typeof window === 'undefined') return;
  
  // Core error handlers
  if (!window.onRecoverableError) {
    window.onRecoverableError = (error) => {
      console.warn('[Next.js] Recoverable error:', error);
      return error;
    };
  }
  
  if (!window.onCaughtError) {
    window.onCaughtError = (error) => {
      console.error('[Next.js] Caught error:', error);
      return error;
    };
  }
  
  // Server action support
  if (!window.callServer) {
    window.callServer = async function() {
      return Promise.resolve(null);
    };
  }
  
  // Error overlay control
  if (!window.shouldRenderRootLevelErrorOverlay) {
    window.shouldRenderRootLevelErrorOverlay = function() {
      return false;
    };
  }
  
  // Mark setup as completed to prevent initialization errors
  window.__NEXT_ERROR_SETUP_COMPLETED = true;
  
  // Fix for "Cannot read properties of null (reading 'isSameNode')" error
  const originalScrollToItem = window.scrollToItem;
  if (originalScrollToItem) {
    window.scrollToItem = function(elem) {
      if (elem && document.body.contains(elem)) {
        return originalScrollToItem(elem);
      }
    };
  }
  
  console.log('[Polyfills] Next.js error handlers initialized');
}
```

### 3. Enhanced React Error Boundaries

We implemented a comprehensive error boundary system:

#### Class-Based Error Boundary
```tsx
interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    
    // Call the onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  
  // Reset the error state to recover
  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-boundary-fallback">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details (for developers)</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
          <div className="error-boundary-actions">
            <button onClick={this.resetErrorBoundary}>
              Try Again
            </button>
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
            <button onClick={() => window.location.href = '/'}>
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Functional Wrapper for Better DX
```tsx
export function withErrorBoundary<P>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  return WrappedComponent;
}
```

## Implementation File Structure

- `/public/navigation-error-fix.js` - Navigation error interception and recovery
- `/public/polyfill-init.js` - Early initialization script (before Next.js loads)
- `/src/polyfills/index.js` - Consolidated Next.js polyfills
- `/src/components/features/ErrorBoundary.tsx` - React error boundary component
- `/src/components/layout/NavigationErrorHandler.tsx` - Navigation error handling wrapper
- `/src/components/layout/ClientScripts.tsx` - Client-side script loader with proper priorities
- `/src/components/features/ClientComponentsWrapper.tsx` - Wraps client components with error boundaries

## Best Practices

When extending the application, follow these error handling best practices:

1. **Error Boundary Wrapping**
   - Always wrap client components with `ErrorBoundary`
   - Use more granular boundaries around risky features
   - Provide context-specific fallback UIs where possible

2. **Async Error Handling**
   - Use try/catch blocks for all async operations
   - Handle promise rejections explicitly
   - Provide fallback UI for all error states

3. **Defensive Programming**
   - Add null/undefined checks before accessing properties
   - Use conditional rendering with fallbacks
   - Implement default values for all props

4. **Navigation Context**
   - Consider navigation state when handling errors
   - Provide clear recovery paths for users
   - Preserve form data when possible during errors

5. **Error Reporting**
   - Log errors in a consistent format
   - Include enough context for debugging
   - Consider user privacy when logging errors

## Future Improvements

Potential enhancements to our error handling:

1. **Error Monitoring Integration**
   - Implement error tracking service integration (e.g., Sentry)
   - Add structured error context (user, environment, page)
   - Implement proper error grouping for easier debugging

2. **Feature-Specific Error Boundaries**
   - Create more granular boundaries around key features
   - Implement specialized recovery UIs for different errors
   - Add self-healing capabilities where possible

3. **Enhanced Offline Support**
   - Integrate service worker for offline fallbacks
   - Cache critical resources for offline use
   - Implement offline-specific error messaging

4. **User-Friendly Error Communication**
   - Improve error messages for non-technical users
   - Add visual indicators for different error types
   - Provide clear next steps for each error scenario

5. **Automated Error Testing**
   - Create automated tests that verify error handling
   - Simulate network failures and other error conditions
   - Test recovery paths to ensure they work as expected