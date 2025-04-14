"use client"

import { useState } from "react"
import type { MenuItem as MenuItemType } from "@/types"
import { MenuIcon } from "@/components/common/menu-icon"
import { cn } from "@/lib/utils"
import { Eye, Star, Leaf, Salad, XCircle, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import Image from "next/image"

interface MenuItemProps {
  item: MenuItemType;
  className?: string;
}

export function MenuItem({ item, className }: MenuItemProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className={cn("bg-black dark:bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow", className)}>
      <div className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {item.icon && (
                <MenuIcon 
                  icon={item.icon} 
                  size={20}
                  className="text-white dark:text-black flex-shrink-0" 
                />
              )}
              <h3 className="text-lg font-bold text-white dark:text-black uppercase">
                {item.name}
              </h3>
            </div>
            
            {item.description && (
              <p className="text-gray-300 dark:text-gray-700 text-sm mt-2">
                {item.description}
              </p>
            )}
            
            {item.options && item.options.length > 0 && (
              <ul className="mt-2 space-y-1">
                {item.options.map((option, index) => (
                  <li key={index} className="text-gray-300 dark:text-gray-700 text-sm flex items-center gap-1">
                    <span className="text-white dark:text-black">•</span> {option}
                  </li>
                ))}
              </ul>
            )}
            
            {item.note && (
              <p className="text-gray-400 dark:text-gray-600 text-sm italic mt-2">
                {item.note}
              </p>
            )}
          </div>
          
          {item.image && (
            <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={item.image}
                alt={item.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-1.5 flex-wrap">
            {item.popular && (
              <span className="bg-white text-black dark:bg-black dark:text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                <Star className="h-3 w-3" />
                <span>Popular</span>
              </span>
            )}
            {item.vegetarian && (
              <span className="bg-white text-black dark:bg-black dark:text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                <Leaf className="h-3 w-3" />
                <span>Vegetarian</span>
              </span>
            )}
            {item.vegan && (
              <span className="bg-white text-black dark:bg-black dark:text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                <Salad className="h-3 w-3" />
                <span>Vegan</span>
              </span>
            )}
            {item.glutenFree && (
              <span className="bg-white text-black dark:bg-black dark:text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                <span>Gluten-Free</span>
              </span>
            )}
            {item.spicy && (
              <span className="bg-white text-black dark:bg-black dark:text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                <Flame className="h-3 w-3" />
                <span>Spicy</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white dark:text-black whitespace-nowrap">
              {item.price}
            </span>
            <Button 
              variant="hustle" 
              size="sm"
              className="flex items-center justify-center gap-2"
              onClick={() => setOpen(true)}
            >
              <div className="w-5 h-5 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <Eye className="w-3 h-3 text-black dark:text-white" />
              </div>
              View
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white dark:bg-black text-black dark:text-white border-gray-200 dark:border-gray-800 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase">{item.name}</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">{item.description}</DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4">
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
              <div className="mt-2">
                <h4 className="font-medium mb-1">Options:</h4>
                <ul className="space-y-1">
                  {item.options.map((option, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      • {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {item.note && (
              <p className="text-sm italic text-gray-500">{item.note}</p>
            )}
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xl font-bold">{item.price}</span>
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
