"use client"

import { useState } from "react"
import type { MenuItem as MenuItemType } from "@/types"
import { MenuIcon } from "@/components/common/menu-icon"
import { cn } from "@/lib/utils"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
    <div className={cn("p-3 mb-3 bg-black dark:bg-white rounded-lg", className)}>
      <div className="grid grid-cols-[auto_1fr_auto] gap-2">
        {item.icon && (
          <div className="pt-1">
            <MenuIcon 
              icon={item.icon} 
              size={18}
              className="text-white dark:text-black flex-shrink-0" 
            />
          </div>
        )}
        <div className="overflow-hidden">
          <h3 className="text-base font-bold text-white dark:text-black uppercase">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-gray-400 dark:text-gray-600 text-xs mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
          {item.options && item.options.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {item.options.map((option, index) => (
                <li key={index} className="text-gray-400 dark:text-gray-600 text-xs">
                  • {option}
                </li>
              ))}
            </ul>
          )}
          {item.note && (
            <p className="text-gray-500 dark:text-gray-500 text-xs italic mt-1">
              {item.note}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="bg-white text-black dark:bg-black dark:text-white px-2 py-0.5 rounded-full text-sm font-bold whitespace-nowrap">
            {item.price}
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {item.popular && (
              <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Popular
              </span>
            )}
            {item.spicy && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Spicy
              </span>
            )}
            <Button 
              variant="outline" 
              size="sm"
              className="mt-2 bg-white dark:bg-black text-black dark:text-white border-0 hover:bg-gray-100 dark:hover:bg-gray-900"
              onClick={() => setOpen(true)}
            >
              <div className="rounded-full w-6 h-6 mr-1.5 flex items-center justify-center bg-white dark:bg-black">
                <Eye className="h-3.5 w-3.5 text-black dark:text-white" />
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
                  className="object-cover"
                  unoptimized
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
