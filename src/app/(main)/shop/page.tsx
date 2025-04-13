"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/common/PageHeader';
import { ShoppingBag, Tag, ExternalLink, Search, X, Filter, Heart, ChevronDown, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  shopUrl?: string;
  rating?: number;
  inStock?: boolean;
  badges?: string[];
  featured?: boolean;
}

const products: Product[] = [
  {
    id: "tshirt-classic",
    name: "Classic Logo T-Shirt",
    description: "100% cotton t-shirt with our iconic logo. Available in black and white.",
    price: 25.00,
    image: "/assets/images/img_placeholder_shop_default.jpg",
    category: "Apparel",
    shopUrl: "https://shop.sidehustlebar.com/products/classic-tshirt",
    rating: 4.8,
    inStock: true,
    badges: ["New", "Bestseller"],
    featured: true
  },
  {
    id: "hoodie-premium",
    name: "Premium Hustle Hoodie",
    description: "Comfortable cotton blend hoodie perfect for those chilly evenings.",
    price: 45.00,
    image: "/assets/images/img_placeholder_shop_default.jpg",
    category: "Apparel",
    shopUrl: "https://shop.sidehustlebar.com/products/premium-hoodie",
    rating: 4.7,
    inStock: true
  },
  {
    id: "coffee-blend",
    name: "Signature Coffee Blend",
    description: "Our house-roasted coffee blend, perfect for your morning hustle.",
    price: 18.00,
    image: "/assets/images/img_placeholder_shop_default.jpg",
    category: "Coffee & Tea",
    shopUrl: "https://shop.sidehustlebar.com/products/coffee-blend",
    rating: 4.9,
    inStock: true,
    badges: ["Top Rated"],
    featured: true
  },
  {
    id: "tumbler-steel",
    name: "Stainless Steel Tumbler",
    description: "Double-walled insulated tumbler with our logo. Keeps drinks hot or cold.",
    price: 28.00,
    image: "/assets/images/img_placeholder_shop_default.jpg",
    category: "Accessories",
    shopUrl: "https://shop.sidehustlebar.com/products/steel-tumbler",
    rating: 4.6,
    inStock: true
  },
  {
    id: "gift-card",
    name: "Side Hustle Gift Card",
    description: "The perfect gift for the coffee and food lover in your life. Available in various denominations.",
    price: 25.00,
    image: "/assets/images/img_placeholder_shop_default.jpg",
    category: "Gift Cards",
    shopUrl: "https://shop.sidehustlebar.com/products/gift-card",
    rating: 5.0,
    inStock: true
  },
  {
    id: "beanie-winter",
    name: "Winter Beanie",
    description: "Stay warm with our stylish embroidered beanie. One size fits most.",
    price: 22.00,
    image: "/assets/images/img_placeholder_shop_default.jpg",
    category: "Apparel",
    shopUrl: "https://shop.sidehustlebar.com/products/winter-beanie",
    rating: 4.5,
    inStock: true
  },
  {
    id: "tea-sampler",
    name: "Loose Leaf Tea Sampler",
    description: "Four of our custom tea blends in one beautiful gift box.",
    price: 32.00,
    image: "/assets/images/img_placeholder_shop_default.jpg",
    category: "Coffee & Tea",
    shopUrl: "https://shop.sidehustlebar.com/products/tea-sampler",
    rating: 4.7,
    inStock: false
  },
  {
    id: "wall-print",
    name: "Limited Edition Art Print",
    description: "Featuring artwork from our seasonal menu designs. Numbered and signed by the artist.",
    price: 35.00,
    image: "/assets/images/img_placeholder_shop_default.jpg",
    category: "Home",
    shopUrl: "https://shop.sidehustlebar.com/products/art-print",
    rating: 4.9,
    inStock: true,
    badges: ["Limited Edition"]
  }
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Get all unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));
  
  // Filter products based on category and search
  useEffect(() => {
    let filtered = products;
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery]);
  
  // Toggle wishlist item
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };
  
  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };
  
  // Toggle product details
  const toggleProductDetails = (productId: string) => {
    setExpandedProduct(prev => prev === productId ? null : productId);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.07
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Shop Our Merch" 
        description="Take a piece of Side Hustle home with you" 
      />
      
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-6">
        <Button 
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>
      
      <div className="mt-8 flex flex-col md:flex-row gap-8">
        {/* Filters & Categories */}
        <AnimatePresence>
          {(showFilters || typeof window !== 'undefined' && window.innerWidth >= 768) && (
            <motion.div 
              initial={{height: 0, opacity: 0}}
              animate={{height: 'auto', opacity: 1}}
              exit={{height: 0, opacity: 0}}
              transition={{duration: 0.3}}
              className="md:w-1/4 lg:w-1/5 overflow-hidden"
            >
              <div className="bg-white dark:bg-black rounded-xl border border-border shadow-sm p-5 mb-6">
                <h2 className="text-xl font-bold mb-4">Search</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Find products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 py-6 rounded-xl bg-gray-100 dark:bg-gray-900 border-none text-base"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      aria-label="Clear search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="bg-white dark:bg-black rounded-xl border border-border shadow-sm p-5">
                <h2 className="text-xl font-bold mb-4">Categories</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === null 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                {(selectedCategory || searchQuery) && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button 
                      variant="ghost" 
                      className="w-full text-primary"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl p-5">
                  <h3 className="font-bold mb-2">Members Get More</h3>
                  <p className="text-sm mb-4">Join our loyalty program for exclusive discounts and early access to limited edition merch.</p>
                  <Button 
                    variant="outline" 
                    className="w-full bg-white text-primary hover:bg-white/90 border-none"
                  >
                    Join Now
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Product Grid */}
        <div className="flex-1">
          {/* Filter Results Info */}
          {(selectedCategory || searchQuery) && (
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                {selectedCategory && <span> in <span className="font-semibold">{selectedCategory}</span></span>}
                {searchQuery && <span> for "<span className="font-semibold">{searchQuery}</span>"</span>}
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary"
                onClick={resetFilters}
              >
                Clear
              </Button>
            </div>
          )}
          
          {/* Featured Products */}
          {!selectedCategory && !searchQuery && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
              <div className="grid grid-cols-1 gap-6">
                {products.filter(product => product.featured).map(product => (
                  <motion.div
                    key={product.id}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="bg-white dark:bg-black rounded-xl overflow-hidden border border-border transition-all hover:shadow-lg"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-48 md:h-auto md:w-2/5">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent md:bg-gradient-to-t" />
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Featured
                        </div>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center transition-colors hover:bg-white dark:hover:bg-black"
                          aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart 
                            className={`h-4 w-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
                          />
                        </button>
                      </div>
                      
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h2 className="text-2xl font-bold">{product.name}</h2>
                          <span className="font-bold text-xl text-primary">${product.price.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{product.rating}</span>
                          </div>
                          {product.badges && product.badges.map(badge => (
                            <span 
                              key={badge} 
                              className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                        
                        <p className="text-muted-foreground mb-6">{product.description}</p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <span className={`text-sm ${product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                          
                          <Button 
                            variant="hustle" 
                            className="group/btn flex items-center gap-2"
                            onClick={() => window.open(product.shopUrl, '_blank')}
                            disabled={!product.inStock}
                          >
                            <ShoppingBag className="h-4 w-4" />
                            <span>Shop Now</span>
                            <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Main Product Grid */}
          <div className="mb-6">
            {!selectedCategory && !searchQuery && (
              <h2 className="text-2xl font-bold mb-6">All Products</h2>
            )}
            
            {filteredProducts.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.div
            key={product.id} 
                    variants={itemVariants}
                    className="group bg-white dark:bg-black rounded-xl border border-border overflow-hidden transition-all hover:shadow-md"
          >
                    <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center transition-colors hover:bg-white dark:hover:bg-black"
                        aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart 
                          className={`h-4 w-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
                        />
                      </button>
                      
                      {product.badges && product.badges.length > 0 && (
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {product.badges.map(badge => (
                            <span 
                              key={badge} 
                              className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full shadow-sm"
                            >
                              {badge}
                            </span>
                          ))}
              </div>
                      )}
            </div>
            
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-1">
                        <h2 className="text-lg font-bold tracking-tight">{product.name}</h2>
                <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
              </div>
              
                      <div className="flex items-center gap-1 text-sm mb-3">
                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                        <span>{product.rating}</span>
                        <span className="text-muted-foreground">• {product.category}</span>
                      </div>
                      
                      <div className="relative">
                        <p 
                          className={`text-sm text-muted-foreground mb-6 ${
                            expandedProduct === product.id 
                              ? '' 
                              : 'line-clamp-2'
                          }`}
                        >
                          {product.description}
                        </p>
                        
                        {product.description.length > 120 && (
                          <button 
                            onClick={() => toggleProductDetails(product.id)}
                            className="text-xs font-medium text-primary hover:underline focus:outline-none mb-2 inline-flex items-center"
                          >
                            {expandedProduct === product.id ? 'Show less' : 'Read more'}
                            <ChevronDown 
                              className={`ml-1 h-3 w-3 transition-transform ${
                                expandedProduct === product.id ? 'rotate-180' : ''
                              }`} 
                            />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className={`text-xs ${product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        
                        <Button 
                          variant="hustle" 
                          size="sm"
                          className="group/btn flex items-center gap-1"
                          onClick={() => window.open(product.shopUrl, '_blank')}
                          disabled={!product.inStock}
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Shop</span>
                          <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  onClick={resetFilters} 
                  className="mt-4"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Custom Orders Card */}
          <div className="mt-12 rounded-xl border border-border bg-primary/5 p-8 text-center">
            <h3 className="text-2xl font-semibold mb-2">Custom Orders</h3>
            <p className="mb-6 text-muted-foreground">Looking for custom merchandise for your event or business? Contact us for bulk orders and custom designs.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="hustle">
                Contact Us
              </Button>
              <Button variant="outline">
                View Catalog
              </Button>
            </div>
          </div>
      </div>
      </div>
    </div>
  );
}