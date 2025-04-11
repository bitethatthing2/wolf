"use client";

import { useEffect } from 'react';

/**
 * Component to optimize images and icons across the site
 * This runs client-side optimizations for better performance
 */
export default function ImageOptimizer() {
  useEffect(() => {
    // Function to lazy load images that are out of view
    const lazyLoadImages = () => {
      const imgElements = document.querySelectorAll('img[data-src]');
      
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              observer.unobserve(img);
            }
          });
        }, { rootMargin: '200px 0px' });

        imgElements.forEach(img => observer.observe(img));
      } else {
        // Fallback for browsers that don't support IntersectionObserver
        imgElements.forEach(img => {
          const imgEl = img as HTMLImageElement;
          if (imgEl.dataset.src) {
            imgEl.src = imgEl.dataset.src;
            imgEl.removeAttribute('data-src');
          }
        });
      }
    };

    // Function to properly size all icons for consistency
    const normalizeIconSizes = () => {
      const iconElements = document.querySelectorAll('.lucide, svg[width="24"][height="24"]');
      
      iconElements.forEach(icon => {
        // Only adjust icons that don't have explicit size classes
        if (!icon.classList.contains('w-3') && 
            !icon.classList.contains('w-4') && 
            !icon.classList.contains('w-5') && 
            !icon.classList.contains('w-6')) {
          
          // Apply default size if none specified
          icon.classList.add('w-5', 'h-5');
          
          // Remove default dimensions if they exist
          if (icon.hasAttribute('width') && icon.getAttribute('width') === '24') {
            icon.removeAttribute('width');
          }
          if (icon.hasAttribute('height') && icon.getAttribute('height') === '24') {
            icon.removeAttribute('height');
          }
        }
      });
    };

    // Apply image optimizations
    lazyLoadImages();
    normalizeIconSizes();
    
    // Set up a mutation observer to handle dynamically added content
    const observer = new MutationObserver((mutations) => {
      let shouldOptimize = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any added nodes are relevant (images or might contain images)
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              if (element.tagName === 'IMG' || element.querySelectorAll('img').length > 0 ||
                  element.tagName === 'SVG' || element.querySelectorAll('svg').length > 0) {
                shouldOptimize = true;
                break;
              }
            }
          }
        }
      });
      
      if (shouldOptimize) {
        lazyLoadImages();
        normalizeIconSizes();
      }
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}