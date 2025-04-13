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
  if (!imagePath) return "";
  
  // If image path starts with @, it's a reference to an image in the public directory
  if (imagePath.startsWith('@')) {
    // Remove the @ prefix
    return `/${imagePath.substring(1)}`;
  }
  
  // For paths that already include a full URL or start with a slash
  if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // For paths referencing old images/menu/ folder format, convert to new menu-item-* format
  if (imagePath.includes('/images/menu/')) {
    // Extract the filename without the extension
    const parts = imagePath.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    
    // Use the new naming convention
    return `/menu-item-${filename}.png`;
  }
  
  // For simple filenames without path info, assume they're in the public directory
  if (!imagePath.includes('/')) {
    // If it has an extension, keep it, otherwise assume png
    if (imagePath.includes('.')) {
      return `/${imagePath}`;
    } else {
      return `/menu-item-${imagePath}.png`;
    }
  }
  
  // Default fallback - return the path as is
  return imagePath;
}
