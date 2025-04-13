import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Coffee, Pizza, Cake, Beef, Wine, Sandwich, IceCream, Award, Flame, Sparkles, ChevronDown, X } from "lucide-react";
import { MexicanFoodIcons } from "../icons/MexicanFoodIcons";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn, getMenuItemImagePath } from "@/lib/utils";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string | number;
  popular?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  spicy?: boolean;
  glutenFree?: boolean;
  image?: string;
  dietary?: string[];
  isChefSpecial?: boolean;
}

interface MenuCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  story?: string;
  items: MenuItem[];
}

const getIngredientHighlight = (itemName: string, description: string = "") => {
  const lowerName = itemName.toLowerCase();
  const lowerDesc = description.toLowerCase();
  
  if (lowerName.includes("taco") || lowerDesc.includes("tortilla") || lowerName.includes("burrito")) 
    return "Hand-pressed tortillas";
  if (lowerName.includes("fries") || lowerName.includes("tots")) 
    return "Crispy perfection";
  if (lowerName.includes("guac") || lowerDesc.includes("avocado")) 
    return "Premium ingredients";
  if (lowerName.includes("salsa") || lowerDesc.includes("sauce")) 
    return "House-made recipe";
  if (lowerName.includes("beef") || lowerDesc.includes("steak") || lowerDesc.includes("meat")) 
    return "Premium quality";
  if (lowerName.includes("cocktail") || lowerDesc.includes("spirits")) 
    return "Craft mixology";
  if (lowerName.includes("coffee") || lowerDesc.includes("espresso")) 
    return "Locally roasted";
  
  return "Chef's selection";
};

interface MenuItemCardProps {
  item: MenuItem;
  onImageClick: (image: string | undefined, name: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onImageClick, isExpanded, onToggleExpand }) => {
  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
    }
    return price.startsWith('$') ? price : `$${price}`;
  };

  // Process the image path
  let imagePath = null;
  if (item.image) {
    // Handle @ prefix paths
    if (item.image.startsWith('@')) {
      imagePath = `/${item.image.substring(1)}`;
    } 
    // Handle /images/menu/ paths
    else if (item.image.includes('/images/menu/')) {
      const filename = item.image.split('/').pop()?.split('.')[0];
      imagePath = `/${filename}.png`;
    }
    // Handle direct paths
    else {
      imagePath = item.image.startsWith('/') ? item.image : `/${item.image}`;
    }
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border hover:border-primary hover:shadow-md transition-all duration-300 bg-black p-3 sm:p-4 lg:p-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Content */}
        <div className="flex-1" onClick={onToggleExpand}>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-base sm:text-lg text-white pr-2">{item.name}</h3>
            <span className="font-bold text-base sm:text-lg text-white whitespace-nowrap">{formatPrice(item.price)}</span>
          </div>
          
          {/* Craftsmanship Badge */}
          <div className="mt-2 mb-2.5">
            <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md text-black text-xs sm:text-sm">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              {getIngredientHighlight(item.name, item.description)}
            </span>
          </div>
          
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {item.description}
          </p>
          
          {/* Tags */}
          {(item.popular || item.vegetarian || item.vegan || item.spicy || item.glutenFree || item.dietary) && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {item.popular && (
                <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-xs font-medium text-black">
                  Popular
                </span>
              )}
              {item.vegetarian && (
                <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-xs font-medium text-black">
                  Vegetarian
                </span>
              )}
              {item.vegan && (
                <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-xs font-medium text-black">
                  Vegan
                </span>
              )}
              {item.spicy && (
                <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-xs font-medium text-black">
                  Spicy
                </span>
              )}
              {item.glutenFree && (
                <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-xs font-medium text-black">
                  Gluten-Free
                </span>
              )}
              {item.dietary?.map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-full bg-gray-800/80 px-2 py-0.5 text-xs font-medium text-white">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Extra details when expanded */}
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-gray-800"
            >
              <div className="flex items-start gap-2 sm:gap-3 mb-3 p-2 bg-white rounded-lg">
                {Math.random() > 0.5 ? (
                  <>
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-black mt-0.5 flex-shrink-0" />
                    <p className="text-black text-xs sm:text-sm">
                      <span className="text-black font-medium">Chef's Special:</span> This dish showcases Ms. Hustle's signature preparation method, perfected over years in professional kitchens.
                    </p>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-black mt-0.5 flex-shrink-0" />
                    <p className="text-black text-xs sm:text-sm">
                      <span className="text-black font-medium">Local Favorite:</span> One of our most requested items, with regulars coming back specifically for this dish.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Image */}
        {imagePath && (
          <div 
            className="relative w-full h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex-shrink-0 rounded-lg overflow-hidden border border-border shadow-lg cursor-pointer mt-2 sm:mt-0"
            onClick={() => onImageClick(imagePath, item.name)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-medium">View Dish</span>
            </div>
            <Image
              src={imagePath}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 128px, 144px"
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface MenuCategoryProps {
  category: MenuCategory;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onImageClick: (image: string | undefined, name: string) => void;
  expandedItems: Record<string, boolean>;
  onToggleExpand: (itemId: string) => void;
}

const MenuCategorySection: React.FC<MenuCategoryProps> = ({ 
  category, 
  isCollapsed, 
  onToggleCollapse, 
  onImageClick,
  expandedItems,
  onToggleExpand
}) => {
  // Get theme for this category - simplified to black and white
  const getCategoryTheme = (title: string): string => {
    return "border-white/20 bg-black";
  };

  return (
    <div id={`section-${category.title}`} className="mb-6 rounded-xl overflow-hidden shadow-lg">
      {/* Section Header */}
      <button 
        onClick={onToggleCollapse}
        className={cn(
          "w-full flex items-start justify-between p-4 sm:p-5 lg:p-6 text-left transition-colors duration-300",
          getCategoryTheme(category.title),
          "hover:bg-opacity-90 active:bg-opacity-70"
        )}
      >
        <div className="flex flex-1">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
              {category.title}
            </h2>
            {category.story && (
              <p className="text-gray-400 text-xs sm:text-sm italic mt-1 pr-4 sm:pr-6 line-clamp-2 sm:line-clamp-none">
                {category.story}
              </p>
            )}
            {/* Add sauce call-to-action */}
            {category.title.includes("SAUCE") && (
              <p className="text-white text-xs sm:text-sm font-medium mt-1 pr-4 sm:pr-6">
                Try our house-made sauces with any dish to add a unique burst of flavor!
              </p>
            )}
            {/* Add meat pricing notice */}
            {category.title.includes("MEAT") && (
              <p className="text-white text-xs sm:text-sm font-medium mt-1 pr-4 sm:pr-6">
                Add any premium meat to your dish for just $2.00 each!
              </p>
            )}
          </div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 sm:w-5 sm:h-5 text-white transform transition-transform duration-300 ${
            !isCollapsed ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      {/* Collapsible Content */}
      {!isCollapsed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-black p-3 sm:p-4 lg:p-6"
        >
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
            {category.items.map((item) => (
              <MenuItemCard 
                key={item.id || item.name} 
                item={item} 
                onImageClick={onImageClick}
                isExpanded={!!expandedItems[`${category.title}-${item.name}`]}
                onToggleExpand={() => onToggleExpand(`${category.title}-${item.name}`)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface RestaurantMenuProps {
  menuData?: {
    food: MenuCategory[];
    drinks: MenuCategory[];
  };
  sections?: MenuCategory[];
  activeCategory?: string | null;
  searchQuery?: string;
  onCategoryChange?: (category: string | null) => void;
  sectionStories?: Record<string, string>;
}

export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({ 
  menuData, 
  sections, 
  activeCategory,
  searchQuery,
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

  // Get active sections, filtered by activeCategory if provided
  const allSections = menuData ? menuData[activeTab] : sections || [];
  const activeSections = activeCategory 
    ? allSections.filter(section => {
        // Match exact title or containing words for more flexibility
        return section.title === activeCategory || 
               section.title.includes(activeCategory) ||
               // Special case for "MARGARITAS" to match sections with margarita in the title
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

  return (
    <div className="w-full">
      {/* Remove the category navigation text menu - we'll rely on the icon menu from the parent component */}
      
      {/* Show a message if no sections match the filter */}
      {activeSections.length === 0 && activeCategory && (
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