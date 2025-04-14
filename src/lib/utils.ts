import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Processes menu item image paths
 * Handles various path formats and fallbacks for menu item images
 */
export function getMenuItemImagePath(imagePath: string | undefined): string {
  // Default placeholder image that exists in the project
  const placeholderImage = "/assets/images/img_placeholder_event_default.jpg";
  
  if (!imagePath) return placeholderImage;
  
  // If image path starts with @, it's a reference to an image in the public directory
  if (imagePath.startsWith('@')) {
    // Remove the @ prefix
    return `/${imagePath.substring(1)}`;
  }
  
  // For paths that already include /assets/foodmenu/, use them directly
  if (imagePath.includes('/assets/foodmenu/')) {
    return imagePath;
  }
  
  // For paths that already include a full URL or start with a slash
  if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
    // Check if the path is for a menu item in the old format
    if (imagePath.includes('/images/menu/')) {
      // Extract the filename without the extension
      const parts = imagePath.split('/');
      const filename = parts[parts.length - 1].split('.')[0];
      
      // Use the new naming convention
      return `/assets/foodmenu/${filename}.png`;
    }
    
    // For menu-item- prefixed paths, convert to the new format
    if (imagePath.includes('menu-item-')) {
      const filename = imagePath.replace('/menu-item-', '').replace('.png', '');
      return `/assets/foodmenu/${filename}.png`;
    }
    
    // For other paths, return as is
    return imagePath;
  }
  
  // For simple filenames without path info, assume they're in the foodmenu directory
  if (!imagePath.includes('/')) {
    return `/assets/foodmenu/${imagePath}`;
  }
  
  // Default fallback - return the placeholder
  return placeholderImage;
}
