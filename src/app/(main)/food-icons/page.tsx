import React from 'react';
import MexicanFoodIconsDemo from '@/components/icons/MexicanFoodIconsDemo';

export default function FoodIconsPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Custom Food Icons Gallery</h1>
      <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto">
        These custom SVG icons have been specifically designed for our Mexican restaurant menu 
        to provide a better visual experience than generic icons.
      </p>
      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <MexicanFoodIconsDemo />
      </div>
    </div>
  );
} 