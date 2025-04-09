/**
 * Enhanced require polyfill for browser
 * This intercepts require() calls and provides targeted implementations
 * to prevent "require is not defined" errors from animation libraries
 */
(function() {
  if (typeof window !== 'undefined' && typeof window.require === 'undefined') {
    // Create a simple module cache
    const moduleCache = {};
    
    // Define specific module implementations
    moduleCache['@emotion/is-prop-valid'] = function(prop) {
      // A simplified version that passes common props
      // This avoids errors while still providing basic functionality
      if (!prop) return false;
      
      // Common SVG and HTML attributes that should pass validation
      const validProps = [
        'id', 'className', 'style', 'width', 'height', 'viewBox', 'fill', 'stroke',
        'strokeWidth', 'src', 'alt', 'href', 'target', 'rel', 'disabled', 'type',
        'value', 'checked', 'selected', 'onChange', 'onClick', 'onMouseEnter',
        'onMouseLeave', 'onFocus', 'onBlur', 'animate', 'variants', 'initial',
        'exit', 'transition', 'whileHover', 'whileTap', 'whileFocus', 'whileDrag'
      ];
      
      // Accept data-* attributes
      if (prop.startsWith('data-')) return true;
      
      // Accept aria-* attributes
      if (prop.startsWith('aria-')) return true;
      
      // Check against our list
      return validProps.includes(prop);
    };
    
    // Define our require implementation
    window.require = function(moduleName) {
      console.log('Browser require() polyfill called for:', moduleName);
      
      // Return cached implementation if available
      if (moduleCache[moduleName]) {
        return moduleCache[moduleName];
      }
      
      // For @emotion/is-prop-valid specifically
      if (moduleName === '@emotion/is-prop-valid') {
        return function(prop) { return true; }; // Accept all props as valid
      }
      
      // Return empty objects for unknown modules
      return {};
    };
    
    console.log('Enhanced browser require() polyfill installed');
  }
})();
