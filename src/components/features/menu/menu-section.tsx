"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MenuIcon } from "@/components/common/menu-icon"
import type { MenuSection as MenuSectionType, MenuItem as MenuItemType } from "@/types"
import { Eye, Star, Leaf, Salad, XCircle, Flame, ShoppingCart } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

interface MenuSectionProps {
  section: MenuSectionType;
  className?: string;
}

export function MenuFeaturedCard({ item, section, className }: { item: MenuItemType; section: MenuSectionType; className?: string }) {
  const [open, setOpen] = useState(false)
  
  return (
    <div className={cn("bg-black dark:bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow", className)}>
      {item.image && (
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={item.image}
            alt={item.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      )}
      <div className="p-3 sm:p-4">
        <h2 className="text-lg sm:text-xl font-bold text-white dark:text-black uppercase">
          {item.name}
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-700">
          {section.title}
        </p>
        <p className="text-sm text-gray-300 dark:text-gray-700 mt-2 line-clamp-2">
          {item.description}
        </p>
        <div className="mt-3 sm:mt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-white dark:text-black">
            {typeof item.price === 'number' 
              ? `$${item.price.toFixed(2)}` 
              : item.price && item.price.startsWith('$') 
                ? item.price 
                : item.price ? `$${item.price}` : ''}
          </span>
          <Button 
            variant="hustle"
            size="sm"
            className="flex items-center justify-center gap-2 py-1.5 sm:py-2"
            onClick={() => setOpen(true)}
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white dark:bg-black flex items-center justify-center">
              <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-black dark:text-white" />
            </div>
            <span className="text-sm">View Item</span>
          </Button>
        </div>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white dark:bg-black text-black dark:text-white border-gray-200 dark:border-gray-800 max-w-md mx-2 sm:mx-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold uppercase">{item.name}</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3 sm:gap-4">
            {item.image && (
              <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            )}
            
            {item.options && item.options.length > 0 && (
              <div className="mt-1 sm:mt-2">
                <h4 className="font-medium mb-1 text-sm sm:text-base">Options:</h4>
                <ul className="space-y-1">
                  {item.options.map((option, index) => (
                    <li key={index} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      • {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {item.note && (
              <p className="text-xs sm:text-sm italic text-gray-500">{item.note}</p>
            )}
            
            <div className="flex justify-between items-center mt-1 sm:mt-2">
              <span className="text-lg sm:text-xl font-bold">
                {typeof item.price === 'number' 
                  ? `$${item.price.toFixed(2)}` 
                  : item.price && item.price.startsWith('$') 
                    ? item.price 
                    : item.price ? `$${item.price}` : ''}
              </span>
              <div className="flex gap-1">
                {item.popular && (
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
                {item.spicy && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    Spicy
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <DialogClose asChild>
            <Button 
              className="w-full mt-2"
              variant="hustle"
            >
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function MenuSection({ section, className }: MenuSectionProps) {
  const { title, items = [], icon } = section;
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center mb-3 sm:mb-4 gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center border border-gray-200 dark:border-gray-800">
            <MenuIcon 
              icon={icon} 
              size={20}
              className="text-black dark:text-white flex-shrink-0" 
            />
          </div>
        )}
        <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white uppercase border-b border-gray-200 dark:border-gray-800 pb-2 flex-1">
          {title}
        </h3>
      </div>
      
      {section.story && (
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm italic">{section.story}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-black dark:bg-white rounded-lg overflow-hidden p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {item.icon && (
                    <MenuIcon 
                      icon={item.icon} 
                      size={20}
                      className="text-white dark:text-black flex-shrink-0" 
                    />
                  )}
                  <h3 className="text-base sm:text-lg font-bold text-white dark:text-black uppercase truncate">
                    {item.name}
                  </h3>
                </div>
                
                {item.description && (
                  <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-700 mt-2">
                    {item.description}
                  </p>
                )}
              </div>
              
              <span className="text-base sm:text-xl font-bold text-white dark:text-black whitespace-nowrap">
                {typeof item.price === 'number' 
                  ? `$${item.price.toFixed(2)}` 
                  : item.price && item.price.startsWith('$') 
                    ? item.price 
                    : item.price ? `$${item.price}` : ''}
              </span>
            </div>
            
            {item.options && item.options.length > 0 && (
              <div className="mt-2 sm:mt-3">
                <ul className="space-y-1">
                  {item.options.map((option, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-gray-300 dark:text-gray-700 flex items-center gap-1">
                      <span className="text-white dark:text-black">•</span> {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {item.note && (
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-600 italic mt-2">
                {item.note}
              </p>
            )}
            
            <div className="mt-2 sm:mt-3 flex justify-between items-center">
              <div className="flex flex-wrap items-center gap-1">
                {item.popular && (
                  <span className="bg-white text-black dark:bg-black dark:text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                    Popular
                  </span>
                )}
                {item.vegetarian && (
                  <span className="bg-white text-black dark:bg-black dark:text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                    Vegetarian
                  </span>
                )}
                {item.vegan && (
                  <span className="bg-white text-black dark:bg-black dark:text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                    Vegan
                  </span>
                )}
                {item.glutenFree && (
                  <span className="bg-white text-black dark:bg-black dark:text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                    Gluten-Free
                  </span>
                )}
                {item.spicy && (
                  <span className="bg-white text-black dark:bg-black dark:text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                    Spicy
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
