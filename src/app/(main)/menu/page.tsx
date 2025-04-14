"use client";

import React, { useState, useRef, useEffect } from "react";
import { enhancedMenuData } from '@/lib/enhanced-menu-data';
import { UtensilsCrossed, Wine, Star, Leaf, Salad, XCircle, Flame, ShoppingCart, ChevronDown, Coffee, Beef, Sandwich, GlassWater, Glasses, Beer } from "lucide-react";
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, getMenuItemImagePath } from "@/lib/utils";

// CSS for highlight animation
const HighlightAnimationStyles = () => {
  return (
    <style jsx global>{`
      @keyframes pulse-highlight {
        0% {
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);
        }
        70% {
          box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        }
      }
      
      .highlight-section .highlight-section-target {
        animation: pulse-highlight 1s ease-in-out;
      }
      
      .dark .highlight-section .highlight-section-target {
        animation: pulse-highlight 1s ease-in-out;
      }
      
      @media (prefers-reduced-motion: reduce) {
        .highlight-section .highlight-section-target {
          animation: none;
        }
      }
    `}</style>
  );
};

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string | number;
  imagePath?: string;
  image?: string;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  spicy?: boolean;
  popular?: boolean;
}

interface MenuCategory {
  id?: string;
  title: string;
  icon?: React.ElementType;
  items: MenuItem[];
  story?: string;
}

interface MenuSectionProps {
  section: MenuCategory;
  isActive: boolean;
  onToggle: () => void;
  id: string;
}

const MenuSection: React.FC<MenuSectionProps> = ({ section, isActive, onToggle, id }) => {
  // Get the section icon component
  const SectionIcon = section.icon;
  
  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };
  
  return (
    <div 
      id={id} 
      className="mb-8 scroll-mt-24 transition-all duration-500 ease-in-out focus:outline-none"
      tabIndex={-1}
    >
      <div 
        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out highlight-section-target ${
          isActive 
            ? "bg-gray-100 dark:bg-gray-900 shadow-md" 
            : "bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-950"
        }`}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isActive ? "true" : "false"}
        aria-controls={`section-content-${id}`}
      >
        {SectionIcon && (
          <div className="w-12 h-12 rounded-full bg-white dark:bg-black flex-shrink-0 flex items-center justify-center border border-gray-200 dark:border-gray-800 shadow-sm">
            <SectionIcon className="w-6 h-6 text-black dark:text-white" />
          </div>
        )}
        <h2 className="text-xl font-bold text-black dark:text-white uppercase flex-1">
          {section.title}
        </h2>
        <div className={`w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} aria-hidden="true">
          <ChevronDown className="w-5 h-5 text-white dark:text-black" />
        </div>
      </div>
      
      {/* Collapsible content */}
      <div 
        id={`section-content-${id}`}
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isActive ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isActive ? "true" : "false"}
      >
        {section.story && (
          <p className="text-gray-600 dark:text-gray-400 mt-4 mb-2 text-sm italic px-4">{section.story}</p>
        )}
        
        <div className="grid grid-cols-1 gap-4 mt-4 px-1">
          {section.items?.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
    }
    return price.startsWith('$') ? price : `$${price}`;
  };

  // Use the utility function to get the image path
  const imagePath = item.image 
    ? getMenuItemImagePath(item.image)
    : item.imagePath 
      ? getMenuItemImagePath(item.imagePath)
      : getMenuItemImagePath(undefined);

  return (
    <div className="rounded-lg bg-black dark:bg-white text-white dark:text-black shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-4">
        {/* Header with name and price */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-lg font-bold uppercase leading-tight">{item.name}</h3>
          <span className="text-xl font-bold whitespace-nowrap ml-2">{formatPrice(item.price)}</span>
        </div>
        
        {/* Image and description row */}
        <div className="flex gap-4 mt-2">
          <div className="flex-1">
            <p className="text-gray-300 dark:text-gray-700 text-sm leading-relaxed line-clamp-5">{item.description}</p>
          </div>
          
          {/* Image thumbnail if available */}
          {imagePath && (
            <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 mt-1">
              <Image
                src={imagePath}
                alt={item.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          )}
        </div>
        
        {/* Dietary badges */}
        {(item.vegetarian || item.vegan || item.glutenFree || item.spicy || item.popular) && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-gray-700 dark:border-gray-300">
            {item.popular && (
              <Badge className="bg-white text-black dark:bg-black dark:text-white py-0.5 px-2 rounded-full">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span className="text-xs">Popular</span>
                </div>
              </Badge>
            )}
            {item.vegetarian && (
              <Badge className="bg-white text-black dark:bg-black dark:text-white py-0.5 px-2 rounded-full">
                <div className="flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  <span className="text-xs">Vegetarian</span>
                </div>
              </Badge>
            )}
            {item.vegan && (
              <Badge className="bg-white text-black dark:bg-black dark:text-white py-0.5 px-2 rounded-full">
                <div className="flex items-center gap-1">
                  <Salad className="h-3 w-3" />
                  <span className="text-xs">Vegan</span>
                </div>
              </Badge>
            )}
            {item.glutenFree && (
              <Badge className="bg-white text-black dark:bg-black dark:text-white py-0.5 px-2 rounded-full">
                <div className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  <span className="text-xs">Gluten-Free</span>
                </div>
              </Badge>
            )}
            {item.spicy && (
              <Badge className="bg-white text-black dark:bg-black dark:text-white py-0.5 px-2 rounded-full">
                <div className="flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  <span className="text-xs">Spicy</span>
                </div>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Custom Toggle Switch Component
const MenuToggle: React.FC<{
  activeTab: string;
  onChange: (tab: string) => void;
}> = ({ activeTab, onChange }) => {
  return (
    <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden mb-4 shadow-sm">
      <div className="flex h-14">
        {/* Food Tab */}
        <button
          onClick={() => onChange("food")}
          className={`relative flex items-center justify-center gap-2 w-1/2 h-full font-bold uppercase transition-all duration-300 ${
            activeTab === "food" 
              ? "bg-black dark:bg-white text-white dark:text-black" 
              : "bg-white dark:bg-black text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
          }`}
          aria-pressed={activeTab === "food" ? "true" : "false"}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            activeTab === "food" 
              ? "bg-white dark:bg-black" 
              : "bg-gray-100 dark:bg-gray-800"
          }`}>
            <UtensilsCrossed className={`w-4 h-4 ${
              activeTab === "food" 
                ? "text-black dark:text-white" 
                : "text-gray-600 dark:text-gray-400"
            }`} />
          </div>
          <span>Food</span>
        </button>
        
        {/* Drinks Tab */}
        <button
          onClick={() => onChange("drinks")}
          className={`relative flex items-center justify-center gap-2 w-1/2 h-full font-bold uppercase transition-all duration-300 ${
            activeTab === "drinks" 
              ? "bg-black dark:bg-white text-white dark:text-black" 
              : "bg-white dark:bg-black text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
          }`}
          aria-pressed={activeTab === "drinks" ? "true" : "false"}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            activeTab === "drinks" 
              ? "bg-white dark:bg-black" 
              : "bg-gray-100 dark:bg-gray-800"
          }`}>
            <Wine className={`w-4 h-4 ${
              activeTab === "drinks" 
                ? "text-black dark:text-white" 
                : "text-gray-600 dark:text-gray-400"
            }`} />
          </div>
          <span>Drinks</span>
        </button>
      </div>
    </div>
  );
};

// Category navigation component
const CategoryNav: React.FC<{
  categories: MenuCategory[];
  activeCategory: string | null;
  onSelectCategory: (id: string) => void;
}> = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div 
      className="flex space-x-2 overflow-x-auto py-2 px-1 scrollbar-hide -mx-1 md:mx-0 md:justify-center"
      role="navigation"
      aria-label="Food categories"
    >
      {categories.map((category) => {
        const CategoryIcon = category.icon || UtensilsCrossed;
        const sectionId = category.id || category.title.toLowerCase().replace(/\s+/g, '-');
        const isActive = activeCategory === sectionId;
        
        return (
          <button
            key={sectionId}
            className={`flex flex-col items-center min-w-[60px] p-2 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-black dark:bg-white text-white dark:text-black' 
                : 'bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
            onClick={() => onSelectCategory(sectionId)}
            aria-pressed={isActive ? "true" : "false"}
            aria-controls={sectionId}
            aria-label={`Show ${category.title} section`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isActive 
                ? 'bg-white dark:bg-black' 
                : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              <CategoryIcon className={`w-5 h-5 ${
                isActive
                  ? 'text-black dark:text-white' 
                  : 'text-gray-700 dark:text-gray-300'
              }`} aria-hidden="true" />
            </div>
            <span className="text-xs font-medium mt-1 truncate max-w-[70px] text-center">
              {category.title.split(' ')[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<string>("food");
  const [activeSections, setActiveSections] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  
  // Get the current menu data based on the active tab
  const currentMenuData = activeTab === "food" ? enhancedMenuData.food : enhancedMenuData.drinks;
  
  // Initialize the first section as active if none are active
  useEffect(() => {
    if (currentMenuData.length > 0 && Object.keys(activeSections).length === 0) {
      const firstSectionId = currentMenuData[0].id || currentMenuData[0].title.toLowerCase().replace(/\s+/g, '-');
      setActiveSections({ [firstSectionId]: true });
      setActiveCategory(firstSectionId);
    }
  }, [currentMenuData, activeSections]);
  
  // Toggle a section's expanded state
  const toggleSection = (sectionId: string) => {
    if (isScrolling) return;
    
    // Get current expanded state before toggling
    const isCurrentlyExpanded = !!activeSections[sectionId];
    
    // Update UI state first for immediate visual feedback
    setActiveCategory(sectionId);
    
    setActiveSections(prev => {
      // Create a new object with all sections closed
      const newState: Record<string, boolean> = {};
      
      // Toggle the clicked section
      newState[sectionId] = !prev[sectionId];
      
      return newState;
    });
    
    // If we're closing the section, we don't need to scroll
    if (isCurrentlyExpanded) return;
    
    // Small delay to allow state update before scrolling
    setTimeout(() => {
      smoothScrollToElement(sectionId);
    }, 50);
  };
  
  // Calculate the height of fixed elements to offset scrolling
  const getScrollOffset = () => {
    // Height of the sticky navigation + some padding
    return 120; // Adjust this value based on your actual header height
  };
  
  // Smooth scroll to element with proper offset
  const smoothScrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    setIsScrolling(true);
    
    // Get element's position accounting for the navigation header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - getScrollOffset();
    
    // Add highlight animation to the target section
    element.classList.add('highlight-section');
    
    // Smooth scroll with native API
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Remove scrolling flag and highlight after animation completes
    setTimeout(() => {
      setIsScrolling(false);
      element.classList.remove('highlight-section');
    }, 1000); // Slightly longer than scroll animation to ensure it completes
  };
  
  // Select a category from the navigation
  const handleSelectCategory = (sectionId: string) => {
    if (isScrolling) return;
    
    // Visual feedback - update state immediately
    setActiveCategory(sectionId);
    
    // Open the selected section and close others
    setActiveSections(prev => {
      const newState: Record<string, boolean> = {};
      // If section is already open, keep it open
      newState[sectionId] = true;
      return newState;
    });
    
    // Add a small delay before scrolling to ensure section expands first
    setTimeout(() => {
      smoothScrollToElement(sectionId);
    }, 50);
    
    // Set focus on the section for accessibility
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      setTimeout(() => {
        sectionElement.setAttribute('tabindex', '-1');
        sectionElement.focus({ preventScroll: true });
      }, 1000);
    }
  };
  
  // Setup IntersectionObserver to track visible sections while scrolling
  useEffect(() => {
    // Cleanup any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Don't setup if we're actively scrolling programmatically
    if (isScrolling) return;
    
    // Create options with threshold to determine when a section is in view
    const options = {
      root: null, // viewport
      rootMargin: '-120px 0px -20% 0px', // Adjust based on header height
      threshold: 0.1 // Trigger when 10% of the target is visible
    };
    
    // Create the observer
    observerRef.current = new IntersectionObserver((entries) => {
      // Skip if we're programmatically scrolling
      if (isScrolling) return;
      
      // Find the first visible section
      const visibleEntry = entries.find(entry => entry.isIntersecting);
      
      if (visibleEntry) {
        const sectionId = visibleEntry.target.id;
        
        // Only update if this isn't already the active category
        if (sectionId !== activeCategory) {
          setActiveCategory(sectionId);
          
          // Skip auto-expanding during scroll detection
          // This prevents jarring UI changes when scrolling naturally
        }
      }
    }, options);
    
    // Observe all section elements
    const sectionElements = document.querySelectorAll('[id].mb-8.scroll-mt-24');
    sectionElements.forEach(element => {
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    });
    
    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeTab, isScrolling, activeCategory]);
  
  // Reset active sections when changing tabs
  useEffect(() => {
    setActiveSections({});
    setActiveCategory(null);
    
    // Reset scroll position when changing tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Include our highlight animation styles */}
      <HighlightAnimationStyles />
      
      <div className="container py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-1 text-black dark:text-white">Our Menu</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Fresh, delicious, made just for you</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Custom Toggle Switch */}
          <MenuToggle 
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setActiveSections({});
            }}
          />
          
          {/* Sticky Category Navigation */}
          <div className="sticky top-0 z-20 pt-4 pb-2 bg-white dark:bg-black shadow-sm">
            <CategoryNav 
              categories={currentMenuData}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />
          </div>
          
          {/* Menu Content */}
          <div className="mt-4 space-y-4" ref={sectionsRef}>
            {currentMenuData.map((section: MenuCategory) => {
              const sectionId = section.id || section.title.toLowerCase().replace(/\s+/g, '-');
              return (
                <MenuSection 
                  key={sectionId}
                  id={sectionId}
                  section={section}
                  isActive={!!activeSections[sectionId]}
                  onToggle={() => toggleSection(sectionId)}
                />
              );
            })}
            
            {/* Order Button */}
            <div className="sticky bottom-6 flex justify-center mt-6 z-10">
              <Button 
                className="shadow-lg"
                size="lg"
                variant="hustle"
                onClick={() => window.location.href = '/order'}
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <ShoppingCart className="w-3.5 h-3.5 text-black" />
                </div>
                Order Online
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}