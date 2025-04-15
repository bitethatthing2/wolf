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
    <div className={cn("w-full mb-8", className)}>
      <div className="flex items-center gap-0">
        {/* Accent bar */}
        <div className="w-2 h-14 sm:h-16 rounded-l-xl bg-white dark:bg-black/80 mr-4" />
        {/* Section header card */}
        <div className="flex items-center flex-1 rounded-xl shadow-md border border-white/10 dark:border-black/10 bg-white/5 dark:bg-black/10 py-4 px-6 gap-4">
          {icon && (
            <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center border border-gray-200 dark:border-gray-800">
              <MenuIcon 
                icon={icon} 
                size={24}
                className="text-black dark:text-white flex-shrink-0" 
              />
            </div>
          )}
          <h3 className="text-xl sm:text-2xl font-extrabold text-black dark:text-white uppercase tracking-wide flex-1">
            {title}
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="group relative bg-black/60 dark:bg-white/60 backdrop-blur-xl rounded-2xl overflow-hidden p-0 shadow-2xl border-4 border-white dark:border-black transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] hover:ring-2 hover:ring-white/30 dark:hover:ring-black/30 mb-8 focus-within:scale-[1.03] focus-within:shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] focus-within:ring-2 focus-within:ring-white/30 dark:focus-within:ring-black/30 outline-none"
            tabIndex={0}
          >
            {/* Glass effect overlay */}
            <div className="absolute inset-0 pointer-events-none z-0 bg-white/10 dark:bg-black/10 backdrop-blur-xl border-t border-white/30 dark:border-black/20" />
            <button
              className="relative z-10 w-full flex items-center justify-between px-6 py-5 sm:py-6 transition-colors rounded-2xl focus:outline-none group-hover:bg-white/10 dark:group-hover:bg-black/10"
              aria-expanded="false"
            >
              <div className="flex items-center gap-4">
                {item.icon && (
                  <MenuIcon 
                    icon={item.icon} 
                    size={24}
                    className="text-white dark:text-black flex-shrink-0" 
                  />
                )}
                <span className="text-lg sm:text-xl font-bold text-white dark:text-black uppercase tracking-wide">
                  {item.name}
                </span>
              </div>
              <span className="ml-6 flex items-center justify-center">
                <svg className="w-7 h-7 text-white dark:text-black transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </span>
            </button>
            {/* Dropdown content would go here, if applicable */}
          </div>
        ))}
      </div>
    </div>
  )
}
