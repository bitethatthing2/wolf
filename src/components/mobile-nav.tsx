"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"; 
import { useTheme } from "next-themes"
import { 
  Home,
  UtensilsCrossed,
  MapPin,
  Calendar,
  ShoppingBag,
  ShoppingCart,
  ChefHat,
  Info,
  Mail
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const [isMounted, setIsMounted] = useState(false); 
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const menuIconSrc = resolvedTheme === 'dark' 
    ? '/main-menu-icon-white.png' 
    : '/main-menu-icon-black.png'

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="default" 
          size="icon" 
          className="md:hidden"
        >
          {/* Update placeholder size */}
          {!isMounted && <div className="h-8 w-8" />}
          {isMounted && (
            <Image 
              key={menuIconSrc} // Add key for smooth transitions if src changes
              src={menuIconSrc} 
              alt="Menu"
              width={24} // Logical size (can keep or increase, visual is controlled by className)
              height={24} // Logical size
              // Increase visual size again
              className="h-8 w-8" 
            />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6">
            <SheetTitle>
              <Button 
                variant="default" 
                className="w-full"
                asChild
              >
                <Link href="/" onClick={() => setOpen(false)}>
                  Hustle Hard
                </Link>
              </Button>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-2 p-6">
            <Button 
              variant="default" 
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/" onClick={() => setOpen(false)}>
                <div className={`w-6 h-6 rounded-full ${resolvedTheme === 'dark' ? 'bg-white' : 'bg-black'} flex items-center justify-center mr-2`}>
                  <Home className={`h-4 w-4 ${resolvedTheme === 'dark' ? 'text-black' : 'text-white'}`} />
                </div>
                Home
              </Link>
            </Button>
            <Button 
              variant="default" 
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/menu" onClick={() => setOpen(false)}>
                <div className={`w-6 h-6 rounded-full ${resolvedTheme === 'dark' ? 'bg-white' : 'bg-black'} flex items-center justify-center mr-2`}>
                  <UtensilsCrossed className={`h-4 w-4 ${resolvedTheme === 'dark' ? 'text-black' : 'text-white'}`} />
                </div>
                Menu
              </Link>
            </Button>
            <Button 
              variant="default" 
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/locations" onClick={() => setOpen(false)}>
                <div className={`w-6 h-6 rounded-full ${resolvedTheme === 'dark' ? 'bg-white' : 'bg-black'} flex items-center justify-center mr-2`}>
                  <MapPin className={`h-4 w-4 ${resolvedTheme === 'dark' ? 'text-black' : 'text-white'}`} />
                </div>
                Locations
              </Link>
            </Button>
            <Button 
              variant="default" 
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/events" onClick={() => setOpen(false)}>
                <div className={`w-6 h-6 rounded-full ${resolvedTheme === 'dark' ? 'bg-white' : 'bg-black'} flex items-center justify-center mr-2`}>
                  <Calendar className={`h-4 w-4 ${resolvedTheme === 'dark' ? 'text-black' : 'text-white'}`} />
                </div>
                Events
              </Link>
            </Button>
            <Button 
              variant="default" 
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/shop" onClick={() => setOpen(false)}>
                <div className={`w-6 h-6 rounded-full ${resolvedTheme === 'dark' ? 'bg-white' : 'bg-black'} flex items-center justify-center mr-2`}>
                  <ShoppingBag className={`h-4 w-4 ${resolvedTheme === 'dark' ? 'text-black' : 'text-white'}`} />
                </div>
                Shop
              </Link>
            </Button>
            <Button 
              variant="default" 
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/order" onClick={() => setOpen(false)}>
                <div className={`w-6 h-6 rounded-full ${resolvedTheme === 'dark' ? 'bg-white' : 'bg-black'} flex items-center justify-center mr-2`}>
                  <ShoppingCart className={`h-4 w-4 ${resolvedTheme === 'dark' ? 'text-black' : 'text-white'}`} />
                </div>
                Order
              </Link>
            </Button>
            <Button 
              variant="default" 
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/chef-blog" onClick={() => setOpen(false)}>
                <div className={`w-6 h-6 rounded-full ${resolvedTheme === 'dark' ? 'bg-white' : 'bg-black'} flex items-center justify-center mr-2`}>
                  <ChefHat className={`h-4 w-4 ${resolvedTheme === 'dark' ? 'text-black' : 'text-white'}`} />
                </div>
                Chef&apos;s Blog
              </Link>
            </Button>
            <Button 
              variant="default" 
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/about" onClick={() => setOpen(false)}>
                <div className={`w-6 h-6 rounded-full ${resolvedTheme === 'dark' ? 'bg-white' : 'bg-black'} flex items-center justify-center mr-2`}>
                  <Info className={`h-4 w-4 ${resolvedTheme === 'dark' ? 'text-black' : 'text-white'}`} />
                </div>
                About
              </Link>
            </Button>
            <Button 
              variant="default" 
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/contact" onClick={() => setOpen(false)}>
                <div className={`w-6 h-6 rounded-full ${resolvedTheme === 'dark' ? 'bg-white' : 'bg-black'} flex items-center justify-center mr-2`}>
                  <Mail className={`h-4 w-4 ${resolvedTheme === 'dark' ? 'text-black' : 'text-white'}`} />
                </div>
                Contact
              </Link>
            </Button>
          </nav>
          <div className="mt-auto p-6">
            <Button 
              variant="default" 
              className="w-full"
            >
              Sign In
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
