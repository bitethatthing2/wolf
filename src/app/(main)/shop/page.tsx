"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: "tshirt-classic",
    name: "Classic Logo T-Shirt",
    description: "100% cotton t-shirt with our iconic logo. Available in black and white.",
    price: 25.00,
    image: "/img_placeholder_shop_default.jpg",
    category: "Apparel"
  },
  {
    id: "hoodie-premium",
    name: "Premium Hustle Hoodie",
    description: "Comfortable cotton blend hoodie perfect for those chilly evenings.",
    price: 45.00,
    image: "/img_placeholder_shop_default.jpg",
    category: "Apparel"
  },
  {
    id: "coffee-blend",
    name: "Signature Coffee Blend",
    description: "Our house-roasted coffee blend, perfect for your morning hustle.",
    price: 18.00,
    image: "/img_placeholder_shop_default.jpg",
    category: "Coffee & Tea"
  },
  {
    id: "tumbler-steel",
    name: "Stainless Steel Tumbler",
    description: "Double-walled insulated tumbler with our logo. Keeps drinks hot or cold.",
    price: 28.00,
    image: "/img_placeholder_shop_default.jpg",
    category: "Accessories"
  },
  {
    id: "hat-snapback",
    name: "Side Hustle Snapback",
    description: "Adjustable snapback hat with embroidered logo. One size fits most.",
    price: 22.00,
    image: "/img_placeholder_shop_default.jpg",
    category: "Apparel"
  },
  {
    id: "tote-bag",
    name: "Canvas Tote Bag",
    description: "Heavy-duty canvas tote with our logo. Perfect for shopping or beach days.",
    price: 15.00,
    image: "/img_placeholder_shop_default.jpg",
    category: "Accessories"
  }
];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black dark:text-white">Shop</h1>
          <p className="text-gray-600 dark:text-gray-400">Take a piece of Side Hustle home with you</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-black dark:bg-white rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
              {product.image && (
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <h2 className="text-xl font-bold text-white dark:text-black uppercase">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-400 dark:text-gray-600">
                  {product.category}
                </p>
                <p className="text-gray-400 dark:text-gray-600 mt-2">
                  {product.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-white dark:text-black">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button 
                    className="bg-white text-black dark:bg-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center justify-center gap-2"
                  >
                    <div className="w-5 h-5 rounded-full bg-black dark:bg-white flex items-center justify-center">
                      <ShoppingBag className="w-3 h-3 text-white dark:text-black" />
                    </div>
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}