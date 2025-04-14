"use client";

import React, { useState } from "react";
import { enhancedMenuData } from '@/lib/enhanced-menu-data';
import { UtensilsCrossed, Wine } from "lucide-react";
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, getMenuItemImagePath } from "@/lib/utils";

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
}

const MenuSection: React.FC<MenuSectionProps> = ({ section }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white uppercase border-b border-gray-200 dark:border-gray-800 pb-2">
        {section.title}
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {section.items?.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
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
    <div className="flex gap-4 p-4 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white">{item.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
          </div>
          <span className="text-xl font-bold text-black dark:text-white">{formatPrice(item.price)}</span>
        </div>
        
        {/* Dietary badges */}
        {(item.vegetarian || item.vegan || item.glutenFree || item.spicy || item.popular) && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.popular && (
              <Badge variant="outline" className="bg-black text-white dark:bg-white dark:text-black">
                Popular
              </Badge>
            )}
            {item.vegetarian && (
              <Badge variant="outline" className="bg-green-600 text-white border-green-600">
                Vegetarian
              </Badge>
            )}
            {item.vegan && (
              <Badge variant="outline" className="bg-green-700 text-white border-green-700">
                Vegan
              </Badge>
            )}
            {item.glutenFree && (
              <Badge variant="outline" className="bg-amber-500 text-white border-amber-500">
                Gluten-Free
              </Badge>
            )}
            {item.spicy && (
              <Badge variant="outline" className="bg-red-600 text-white border-red-600">
                Spicy
              </Badge>
            )}
          </div>
        )}
      </div>
      
      {/* Image thumbnail if available */}
      {imagePath && (
        <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 dark:border-gray-800">
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
  );
};

// Custom Toggle Switch Component
const MenuToggle: React.FC<{
  activeTab: string;
  onChange: (tab: string) => void;
}> = ({ activeTab, onChange }) => {
  return (
    <div className="bg-black dark:bg-white rounded-lg overflow-hidden mb-8">
      <div className="relative flex h-14">
        {/* Background highlight for active tab */}
        <div 
          className={`absolute top-0 h-full w-1/2 bg-gray-900 dark:bg-gray-100 transition-transform duration-300 ease-in-out ${
            activeTab === "drinks" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        
        {/* Food Tab */}
        <button
          onClick={() => onChange("food")}
          className={`relative z-10 flex items-center justify-center gap-2 w-1/2 h-full font-bold uppercase transition-colors ${
            activeTab === "food" 
              ? "text-white dark:text-black" 
              : "text-gray-400 dark:text-gray-500 hover:text-gray-200 dark:hover:text-gray-700"
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span>Food</span>
        </button>
        
        {/* Drinks Tab */}
        <button
          onClick={() => onChange("drinks")}
          className={`relative z-10 flex items-center justify-center gap-2 w-1/2 h-full font-bold uppercase transition-colors ${
            activeTab === "drinks" 
              ? "text-white dark:text-black" 
              : "text-gray-400 dark:text-gray-500 hover:text-gray-200 dark:hover:text-gray-700"
          }`}
        >
          <Wine className="w-5 h-5" />
          <span>Drinks</span>
        </button>
      </div>
    </div>
  );
};

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<string>("food");

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black dark:text-white">Our Menu</h1>
          <p className="text-gray-600 dark:text-gray-400">Fresh, delicious, made just for you</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Custom Toggle Switch */}
          <MenuToggle 
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          
          {/* Menu Content */}
          <div className="space-y-12">
            {/* Food Menu */}
            {activeTab === "food" && (
              <div className="space-y-12">
                {enhancedMenuData.food.map((section: MenuCategory) => (
                  <MenuSection key={section.title} section={section} />
                ))}
              </div>
            )}
            
            {/* Drinks Menu */}
            {activeTab === "drinks" && (
              <div className="space-y-12">
                {enhancedMenuData.drinks.map((section: MenuCategory) => (
                  <MenuSection key={section.title} section={section} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}