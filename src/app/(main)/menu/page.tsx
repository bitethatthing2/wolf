"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { RestaurantMenu } from "@/components/features/restaurant-menu";
import { 
  Martini, UtensilsCrossed, Beer, Wine, Coffee, Sparkles, 
  Beef, Pizza, Sandwich, Flame, IceCream, Soup, Salad
} from "lucide-react";
import { MexicanFoodIcons } from "@/components/icons/MexicanFoodIcons";

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<string>("food");
  const [scrolledPast, setScrolledPast] = useState(false);
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [drinkCategory, setDrinkCategory] = useState<string | null>(null);
  const [foodCategory, setFoodCategory] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error('Failed to fetch menu data');
        }
        const data = await response.json();
        setMenuData(data);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setDrinkCategory(null); // Reset drink category when switching tabs
    setFoodCategory(null);  // Reset food category when switching tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle drink category selection
  const handleDrinkCategorySelect = (category: string) => {
    setDrinkCategory(category === drinkCategory ? null : category);
    
    // Scroll to the section after a brief delay to allow for rendering
    setTimeout(() => {
      const section = document.getElementById(`section-${category}`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle food category selection
  const handleFoodCategorySelect = (category: string) => {
    setFoodCategory(category === foodCategory ? null : category);
    
    // Scroll to the section after a brief delay to allow for rendering
    setTimeout(() => {
      const section = document.getElementById(`section-${category}`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle scroll events to detect when user scrolls past the header
  useEffect(() => {
    const checkScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        setScrolledPast(headerBottom < 0);
      }
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  return (
    <div className="relative min-h-[800px] bg-background pb-20 flex justify-center">
      <Tabs
        defaultValue="food"
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full max-w-4xl"
      >
        {/* Header with tabs */}
        <div
          ref={headerRef}
          className={cn(
            "sticky top-0 z-30 flex w-full border-b bg-background/95 px-4 py-4 backdrop-blur transition-all duration-200",
            {
              "shadow-md": scrolledPast,
            }
          )}
        >
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">Our Menu</h1>

            {/* Custom Tab navigation */}
            <div className="flex items-center">
              <div className="relative flex rounded-full bg-black w-[170px] h-10 p-[3px]">
                {/* Active background pill */}
                <div 
                  className={cn(
                    "absolute inset-y-[3px] w-[50%] rounded-full bg-white transition-all duration-300",
                    activeTab === "food" ? "left-[3px]" : "left-[calc(50%_-_1.5px)]"
                  )}
                ></div>
                
                {/* Buttons */}
                <button 
                  className={cn(
                    "flex items-center justify-center rounded-full text-xs font-medium w-1/2 transition-all duration-300 z-10",
                    activeTab === "food" 
                      ? "text-black" 
                      : "text-white hover:text-gray-200"
                  )}
                  onClick={() => handleTabChange("food")}
                  aria-label="Show food menu"
                >
                  <UtensilsCrossed className="mr-1.5 w-3.5 h-3.5" />
                  Food
                </button>
                <button 
                  className={cn(
                    "flex items-center justify-center rounded-full text-xs font-medium w-1/2 transition-all duration-300 z-10",
                    activeTab === "drinks" 
                      ? "text-black" 
                      : "text-white hover:text-gray-200"
                  )}
                  onClick={() => handleTabChange("drinks")}
                  aria-label="Show drinks menu"
                >
                  <Martini className="mr-1.5 w-3.5 h-3.5" />
                  Drinks
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Food Category Quick Navigation - only visible when Food tab is active */}
        {activeTab === "food" && !loading && (
          <div className="sticky top-[72px] z-20 bg-background/95 backdrop-blur border-b px-4 py-2.5 transition-all">
            <div className="flex items-center justify-between overflow-x-auto pb-1 snap-x snap-mandatory no-scrollbar">
              <button
                onClick={() => handleFoodCategorySelect('SMALL BITES')}
                className={cn(
                  "flex flex-col items-center px-4 py-1.5 rounded-lg transition-all",
                  foodCategory === 'SMALL BITES' 
                    ? "bg-white text-black" 
                    : "hover:bg-white/10"
                )}
              >
                <div className="w-5 h-5 mb-1">
                  {React.createElement(MexicanFoodIcons.starters, { className: "w-5 h-5" })}
                </div>
                <span className="text-xs whitespace-nowrap">Starters</span>
              </button>
              
              <button
                onClick={() => handleFoodCategorySelect('TACOS')}
                className={cn(
                  "flex flex-col items-center px-4 py-1.5 rounded-lg transition-all",
                  foodCategory === 'TACOS' 
                    ? "bg-white text-black" 
                    : "hover:bg-white/10"
                )}
              >
                <div className="w-5 h-5 mb-1">
                  {React.createElement(MexicanFoodIcons.taco, { className: "w-5 h-5" })}
                </div>
                <span className="text-xs whitespace-nowrap">Tacos</span>
              </button>
              
              <button
                onClick={() => handleFoodCategorySelect('MAIN')}
                className={cn(
                  "flex flex-col items-center px-4 py-1.5 rounded-lg transition-all",
                  foodCategory === 'MAIN' 
                    ? "bg-white text-black" 
                    : "hover:bg-white/10"
                )}
              >
                <Beef className="w-5 h-5 mb-1" />
                <span className="text-xs whitespace-nowrap">Main</span>
              </button>
              
              <button
                onClick={() => handleFoodCategorySelect('PIZZA')}
                className={cn(
                  "flex flex-col items-center px-4 py-1.5 rounded-lg transition-all",
                  foodCategory === 'PIZZA' 
                    ? "bg-white text-black" 
                    : "hover:bg-white/10"
                )}
              >
                <Pizza className="w-5 h-5 mb-1" />
                <span className="text-xs whitespace-nowrap">Pizza</span>
              </button>
              
              <button
                onClick={() => handleFoodCategorySelect('BURRITO')}
                className={cn(
                  "flex flex-col items-center px-4 py-1.5 rounded-lg transition-all",
                  foodCategory === 'BURRITO' 
                    ? "bg-white text-black" 
                    : "hover:bg-white/10"
                )}
              >
                <div className="w-5 h-5 mb-1">
                  {React.createElement(MexicanFoodIcons.burrito, { className: "w-5 h-5" })}
                </div>
                <span className="text-xs whitespace-nowrap">Burritos</span>
              </button>
              
              <button
                onClick={() => handleFoodCategorySelect('DESSERT')}
                className={cn(
                  "flex flex-col items-center px-4 py-1.5 rounded-lg transition-all",
                  foodCategory === 'DESSERT' 
                    ? "bg-white text-black" 
                    : "hover:bg-white/10"
                )}
              >
                <IceCream className="w-5 h-5 mb-1" />
                <span className="text-xs whitespace-nowrap">Desserts</span>
              </button>
            </div>
          </div>
        )}

        {/* Drink Category Quick Navigation - only visible when Drinks tab is active */}
        {activeTab === "drinks" && !loading && (
          <div className="sticky top-[72px] z-20 bg-background/95 backdrop-blur border-b px-4 py-2.5 transition-all">
            <div className="flex items-center justify-between overflow-x-auto pb-1 snap-x snap-mandatory no-scrollbar">
              <button
                onClick={() => handleDrinkCategorySelect('HOUSE FAVORITES')}
                className={cn(
                  "flex flex-col items-center px-4 py-1.5 rounded-lg transition-all",
                  drinkCategory === 'HOUSE FAVORITES' 
                    ? "bg-white text-black" 
                    : "hover:bg-white/10"
                )}
              >
                <Sparkles className="w-5 h-5 mb-1" />
                <span className="text-xs whitespace-nowrap">Favorites</span>
              </button>
              
              <button
                onClick={() => handleDrinkCategorySelect('MARTINIS')}
                className={cn(
                  "flex flex-col items-center px-4 py-1.5 rounded-lg transition-all",
                  drinkCategory === 'MARTINIS' 
                    ? "bg-white text-black" 
                    : "hover:bg-white/10"
                )}
              >
                <Martini className="w-5 h-5 mb-1" />
                <span className="text-xs whitespace-nowrap">Martinis</span>
              </button>
              
              <button
                onClick={() => handleDrinkCategorySelect('BEER')}
                className={cn(
                  "flex flex-col items-center px-4 py-1.5 rounded-lg transition-all",
                  drinkCategory === 'BEER' 
                    ? "bg-white text-black" 
                    : "hover:bg-white/10"
                )}
              >
                <Beer className="w-5 h-5 mb-1" />
                <span className="text-xs whitespace-nowrap">Beer</span>
              </button>
              
              <button
                onClick={() => handleDrinkCategorySelect('WINE')}
                className={cn(
                  "flex flex-col items-center px-4 py-1.5 rounded-lg transition-all",
                  drinkCategory === 'WINE' 
                    ? "bg-white text-black" 
                    : "hover:bg-white/10"
                )}
              >
                <Wine className="w-5 h-5 mb-1" />
                <span className="text-xs whitespace-nowrap">Wine</span>
              </button>
              
              <button
                onClick={() => handleDrinkCategorySelect('COFFEE')}
                className={cn(
                  "flex flex-col items-center px-4 py-1.5 rounded-lg transition-all",
                  drinkCategory === 'COFFEE' 
                    ? "bg-white text-black" 
                    : "hover:bg-white/10"
                )}
              >
                <Coffee className="w-5 h-5 mb-1" />
                <span className="text-xs whitespace-nowrap">Coffee</span>
              </button>
              
              <button
                onClick={() => handleDrinkCategorySelect('MARGARITAS')}
                className={cn(
                  "flex flex-col items-center px-4 py-1.5 rounded-lg transition-all",
                  drinkCategory === 'MARGARITAS' 
                    ? "bg-white text-black" 
                    : "hover:bg-white/10"
                )}
              >
                <div className="w-5 h-5 mb-1">
                  {React.createElement(MexicanFoodIcons.margarita, { className: "w-5 h-5" })}
                </div>
                <span className="text-xs whitespace-nowrap">Margaritas</span>
              </button>
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="px-4 py-6">
          <div className="w-full">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <TabsContent value="food" className="mt-0">
                  <RestaurantMenu 
                    sections={menuData?.food}
                    activeCategory={foodCategory}
                    onCategoryChange={setFoodCategory}
                  />
                </TabsContent>
                <TabsContent value="drinks" className="mt-0">
                  <RestaurantMenu 
                    sections={menuData?.drinks}
                    activeCategory={drinkCategory}
                    onCategoryChange={setDrinkCategory}
                  />
                </TabsContent>
              </>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}