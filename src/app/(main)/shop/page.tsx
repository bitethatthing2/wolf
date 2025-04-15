"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, ExternalLink, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import { useTheme } from 'next-themes';

// Printify integration placeholder
// In a real implementation, this would be fetched from the Printify API
const PRINTIFY_SHOP_URL = "https://sidehustlebar.printify.me/";

// Product categories
const CATEGORIES = [
  "All",
  "T-Shirts",
  "Hoodies & Sweatshirts",
  "Hats & Caps",
  "Drinkware",
  "Accessories"
];

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  printifyUrl: string;
}

const products: Product[] = [
  {
    id: "tshirt-classic",
    name: "Wolf Logo T-Shirt",
    description: "100% cotton t-shirt with our iconic logo. Available in black and white.",
    price: 25.00,
    image: "/img_placeholder_shop_default.jpg",
    category: "T-Shirts",
    printifyUrl: `${PRINTIFY_SHOP_URL}/products/wolf-logo-tshirt`
  },
  {
    id: "hoodie-premium",
    name: "Side Hustle Hoodie",
    description: "Comfortable cotton blend hoodie perfect for those chilly evenings.",
    price: 45.00,
    image: "/img_placeholder_shop_default.jpg",
    category: "Hoodies & Sweatshirts",
    printifyUrl: `${PRINTIFY_SHOP_URL}/products/side-hustle-hoodie`
  },
  {
    id: "hat-snapback",
    name: "Wolf Snapback",
    description: "Adjustable snapback hat with embroidered logo. One size fits most.",
    price: 22.00,
    image: "/img_placeholder_shop_default.jpg",
    category: "Hats & Caps",
    printifyUrl: `${PRINTIFY_SHOP_URL}/products/wolf-snapback`
  },
  {
    id: "tumbler-steel",
    name: "Stainless Steel Tumbler",
    description: "Double-walled insulated tumbler with our logo. Keeps drinks hot or cold.",
    price: 28.00,
    image: "/img_placeholder_shop_default.jpg",
    category: "Drinkware",
    printifyUrl: `${PRINTIFY_SHOP_URL}/products/stainless-steel-tumbler`
  },
  {
    id: "tote-bag",
    name: "Side Hustle Tote Bag",
    description: "Heavy-duty canvas tote with our logo. Perfect for shopping or beach days.",
    price: 15.00,
    image: "/img_placeholder_shop_default.jpg",
    category: "Accessories",
    printifyUrl: `${PRINTIFY_SHOP_URL}/products/side-hustle-tote`
  },
  {
    id: "coffee-mug",
    name: "Wolf Coffee Mug",
    description: "Ceramic coffee mug featuring our wolf logo. Microwave and dishwasher safe.",
    price: 18.00,
    image: "/img_placeholder_shop_default.jpg",
    category: "Drinkware",
    printifyUrl: `${PRINTIFY_SHOP_URL}/products/wolf-coffee-mug`
  }
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter products based on selected category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Side Hustle Merch"
        description="Take a piece of Side Hustle home with you"
      />

      <div className="container py-8 px-4 md:px-6">
        {/* Printify Integration Banner */}
        <div className="bg-gradient-to-r from-black/90 to-black/80 dark:from-gray-800/90 dark:to-gray-800/80 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Powered by Printify</h2>
              <p className="text-gray-200 text-sm md:text-base">
                All our merchandise is created on-demand and ships directly to you. Quality products with our custom designs.
              </p>
            </div>
            <Button 
              onClick={() => window.open(PRINTIFY_SHOP_URL, '_blank')}
              className="bg-white text-black hover:bg-gray-200 flex items-center gap-2 whitespace-nowrap"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Full Shop
            </Button>
          </div>
        </div>

        {/* Mobile Category Filter Button */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <span>Filter: {selectedCategory}</span>
            </div>
            {showFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {showFilters && (
            <div className="mt-2 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    selectedCategory === category 
                      ? 'bg-black text-white dark:bg-white dark:text-black font-medium' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowFilters(false);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Category Filter */}
          <div className="hidden md:block w-64 space-y-4">
            <h3 className="font-bold text-xl mb-4">Categories</h3>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
                    selectedCategory === category 
                      ? 'bg-black text-white dark:bg-white dark:text-black font-medium' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  variants={itemVariants}
                  className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors"></div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="font-bold text-lg text-black dark:text-white">
                          {product.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {product.category}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-black dark:text-white">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <Button 
                      className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center justify-center gap-2"
                      onClick={() => window.open(product.printifyUrl, '_blank')}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Shop Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}