import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMenuItemImagePath } from "@/lib/utils";

// Types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  imagePath?: string;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  spicy?: boolean;
  popular?: boolean;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
  story?: string;
}

interface RestaurantMenuProps {
  menuData?: {
    food: MenuCategory[];
    drinks: MenuCategory[];
  };
  sections?: MenuCategory[];
  activeCategory?: string | null;
  searchQuery?: string;
  activeFilters?: string[];
  onCategoryChange?: (category: string | null) => void;
  sectionStories?: Record<string, string>;
}

export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({ 
  menuData, 
  sections, 
  activeCategory,
  searchQuery = "",
  activeFilters = [],
  onCategoryChange,
  sectionStories = {} 
}) => {
  const [activeTab, setActiveTab] = useState<"food" | "drinks">("food");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>("");
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  
  // Initialize collapsed state
  React.useEffect(() => {
    if (menuData) {
      const menuSections = menuData[activeTab];
      const initialCollapsedState: Record<string, boolean> = {};
      menuSections.forEach((section, index) => {
        // If activeCategory is set, expand that category and collapse others
        if (activeCategory) {
          initialCollapsedState[section.title] = section.title !== activeCategory;
        } else {
          // Default behavior: keep first section expanded, collapse others
        initialCollapsedState[section.title] = index !== 0;
        }
      });
      setCollapsedSections(initialCollapsedState);
    } else if (sections) {
      const initialCollapsedState: Record<string, boolean> = {};
      sections.forEach((section, index) => {
        // If activeCategory is set, expand that category and collapse others
        if (activeCategory) {
          initialCollapsedState[section.title] = section.title !== activeCategory;
        } else {
          // Default behavior: keep first section expanded, collapse others
        initialCollapsedState[section.title] = index !== 0;
        }
      });
      setCollapsedSections(initialCollapsedState);
    }
  }, [activeTab, menuData, sections, activeCategory]);
  
  // Toggle section collapse
  const toggleSection = (sectionTitle: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };
  
  // Toggle item expansion
  const toggleItemExpand = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  // Handle image click for preview
  const handleImageClick = (image: string | undefined, name: string) => {
    if (!image) return;
    // Convert image paths if they use the old format
    let imagePath = image;
    if (imagePath.includes('/images/menu/')) {
      const filename = imagePath.split('/').pop()?.split('.')[0];
      imagePath = `/${filename}.png`;
    }
    setSelectedImage(imagePath);
    setSelectedItemName(name);
    setShowImageModal(true);
  };

  // Filter menu items based on search query and active filters
  const filterMenuItems = (item: MenuItem): boolean => {
    // Search query filter
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(query);
      const descMatch = item.description.toLowerCase().includes(query);
      
      if (!nameMatch && !descMatch) {
        return false;
      }
    }
    
    // Dietary filters
    if (activeFilters.length > 0) {
      const hasAllFilters = activeFilters.every(filter => {
        switch (filter) {
          case "vegetarian":
            return !!item.vegetarian;
          case "vegan":
            return !!item.vegan;
          case "glutenFree":
            return !!item.glutenFree;
          case "spicy":
            return !!item.spicy;
          case "popular":
            return !!item.popular;
          default:
            return true;
        }
      });
      
      if (!hasAllFilters) {
        return false;
      }
    }
    
    return true;
  };

  // Filter and process sections
  const processedSections = (allSections: MenuCategory[]): MenuCategory[] => {
    // If no search or filters, just handle activeCategory
    if (!searchQuery && activeFilters.length === 0) {
      return activeCategory 
        ? allSections.filter(section => {
            return section.title === activeCategory || 
                   section.title.includes(activeCategory) ||
                   (activeCategory === "MARGARITAS" && 
                    (section.title.includes("MARGARITA") || 
                     section.items.some(item => 
                       item.name.toUpperCase().includes("MARGARITA") || 
                       (item.description || "").toUpperCase().includes("MARGARITA")
                     )
                    )
                   );
          })
        : allSections;
    }
    
    // Apply search and filters
    return allSections.map(section => {
      // Filter items in this section
      const filteredItems = section.items.filter(filterMenuItems);
      
      // Return section with filtered items
      return {
        ...section,
        items: filteredItems
      };
    }).filter(section => section.items.length > 0); // Only keep sections with matching items
  };

  // Get active sections, filtered by activeCategory, search, and filters
  const allSections = menuData ? menuData[activeTab] : sections || [];
  const activeSections = processedSections(allSections);

  // Check if there are no results after filtering
  const noResults = activeSections.length === 0 && (searchQuery || activeFilters.length > 0);

  return (
    <div className="w-full">
      {/* Show a message if no sections match the filter */}
      {activeSections.length === 0 && activeCategory && !searchQuery && activeFilters.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No categories match your selection.</p>
          {onCategoryChange && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => onCategoryChange(null)}
            >
              Show All Categories
            </Button>
          )}
        </div>
      )}
      
      {/* Show a message if no results after search/filter */}
      {noResults && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No menu items match your search or filters.</p>
          <Button 
            variant="outline" 
            className="mt-4"
                onClick={() => {
              // This will be handled by the parent component
              if (onCategoryChange) onCategoryChange(null);
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
      
      {/* Categories */}
      <div className="space-y-6 pb-8">
        {activeSections.map((category) => (
          <MenuCategorySection 
            key={category.title} 
            category={{
              ...category,
              story: sectionStories[category.title as keyof typeof sectionStories]
            }}
            isCollapsed={!!collapsedSections[category.title]}
            onToggleCollapse={() => toggleSection(category.title)}
            onImageClick={handleImageClick}
            expandedItems={expandedItems}
            onToggleExpand={toggleItemExpand}
          />
        ))}
      </div>
      
      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl w-full bg-black border border-white/20 rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-3 sm:p-4 border-b border-white/20 flex items-center justify-between">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">{selectedItemName}</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
                aria-label="Close image"
                title="Close image"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <div className="relative w-full aspect-square sm:aspect-video md:aspect-[4/3] lg:aspect-square">
              <Image
                src={selectedImage}
                alt={selectedItemName}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 500px, 800px"
              />
            </div>
            <div className="p-3 sm:p-4 border-t border-white/20 flex justify-end">
              <Button 
                variant="outline"
                onClick={() => setShowImageModal(false)}
                className="text-xs sm:text-sm h-8 sm:h-10 bg-white text-black hover:bg-white/90 hover:text-black"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Menu Category Section Component
interface MenuCategorySectionProps {
  category: MenuCategory & { story?: string };
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onImageClick: (image: string | undefined, name: string) => void;
  expandedItems: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
}

const MenuCategorySection: React.FC<MenuCategorySectionProps> = ({ 
  category, 
  isCollapsed,
  onToggleCollapse,
  onImageClick,
  expandedItems,
  onToggleExpand
}) => {
  return (
    <div id={`section-${category.title}`} className="border border-border rounded-lg overflow-hidden">
      {/* Category Header */}
      <div 
        className={cn(
          "px-4 py-3 flex justify-between items-center cursor-pointer",
          "bg-white text-black dark:bg-black dark:text-white",
          isCollapsed ? "border-b-0" : "border-b border-border"
        )}
        onClick={onToggleCollapse}
      >
        <h2 className="text-lg font-bold">{category.title}</h2>
        <div className="w-6 h-6 flex items-center justify-center">
          <div className={cn(
            "w-4 h-0.5 bg-current transition-transform",
            isCollapsed ? "" : "rotate-90"
          )}></div>
          <div className="w-4 h-0.5 bg-current absolute"></div>
        </div>
      </div>
      
      {/* Category Story (if available) */}
      {!isCollapsed && category.story && (
        <div className="px-4 py-3 bg-gray-100 text-black dark:bg-gray-900 dark:text-white text-sm italic border-b border-border">
          {category.story}
        </div>
      )}
      
      {/* Menu Items */}
      {!isCollapsed && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {category.items.map((item) => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              isExpanded={!!expandedItems[item.id]}
              onToggleExpand={() => onToggleExpand(item.id)}
              onImageClick={onImageClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Menu Item Card Component
interface MenuItemCardProps {
  item: MenuItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onImageClick: (image: string | undefined, name: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  isExpanded,
  onToggleExpand,
  onImageClick
}) => {
  // Process image path
  const imagePath = item.imagePath ? getMenuItemImagePath(item.imagePath) : undefined;
  
  return (
    <div 
      className={cn(
        "border border-border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md",
        "bg-white text-black dark:bg-black dark:text-white"
      )}
    >
      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-1">
              <h3 className="text-base font-bold">{item.name}</h3>
              <div className="flex gap-1 ml-2 mt-0.5">
                {item.vegetarian && (
                  <span 
                    title="Vegetarian" 
                    className="inline-block w-4 h-4 rounded-full bg-green-500 border border-green-600"
                  ></span>
                )}
                {item.vegan && (
                  <span 
                    title="Vegan" 
                    className="inline-block w-4 h-4 rounded-full bg-green-600 border border-green-700"
                  ></span>
                )}
                {item.glutenFree && (
                  <span 
                    title="Gluten-Free" 
                    className="inline-block w-4 h-4 rounded-full bg-amber-400 border border-amber-500"
                  ></span>
                )}
                {item.spicy && (
                  <span 
                    title="Spicy" 
                    className="inline-block w-4 h-4 rounded-full bg-red-500 border border-red-600"
                  ></span>
                )}
                {item.popular && (
                  <span 
                    title="Popular" 
                    className="inline-block w-4 h-4 rounded-full bg-purple-500 border border-purple-600"
                  ></span>
                )}
              </div>
            </div>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">{item.description}</p>
          </div>
          <div className="ml-4 text-right">
            <div className="font-bold">{item.price}</div>
            
            {/* Image thumbnail if available */}
            {imagePath && (
              <div 
                className="mt-2 w-16 h-16 rounded-md overflow-hidden cursor-pointer relative border border-border"
                onClick={() => onImageClick(imagePath, item.name)}
              >
                <Image
                  src={imagePath}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Expanded content - could include ingredients, allergens, etc. */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <strong>Dietary Info:</strong> {[
                item.vegetarian ? 'Vegetarian' : null,
                item.vegan ? 'Vegan' : null,
                item.glutenFree ? 'Gluten-Free' : null,
                item.spicy ? 'Spicy' : null,
                item.popular ? 'Popular' : null
              ].filter(Boolean).join(', ') || 'No special dietary information'}
            </p>
          </div>
        )}
        
        {/* Expand/collapse button */}
        <button
          onClick={onToggleExpand}
          className="mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white underline"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      </div>
    </div>
  );
}