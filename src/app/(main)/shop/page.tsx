// Enforces global design system: navy bg, card/panel uses glassmorphism, text uses text-foreground, strict button/icon rules, no hardcoded colors
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

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card/80 backdrop-blur-lg border border-border shadow-xl rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Shop" />
      <div className="container py-12">
        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap gap-3">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="bg-card/80 text-card-foreground border border-border rounded-xl font-semibold px-6 py-2 shadow-md backdrop-blur-lg"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="flex flex-col h-full"
              whileHover={{ scale: 1.03 }}
            >
              <GlassCard className="flex flex-col h-full p-0">
                <div className="relative w-full h-56 bg-muted rounded-t-2xl overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-2xl"
                    priority={true}
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-card-foreground mb-1">{product.name}</h3>
                  <p className="text-muted-foreground mb-2">{product.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-card-foreground">${product.price.toFixed(2)}</span>
                    <Button asChild className="ml-2 bg-background text-foreground border border-border rounded-full px-4 py-2 font-semibold flex items-center gap-2 shadow-sm">
                      <a href={product.printifyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        {/* Icon circle styling strictly follows memory rules */}
                        <span className="flex items-center justify-center rounded-full w-8 h-8 bg-white dark:bg-black border border-black dark:border-none mr-2">
                          <ShoppingBag className="w-5 h-5 text-black dark:text-white" />
                        </span>
                        Buy
                      </a>
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}