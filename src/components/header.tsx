"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"; 
import { BackButton } from "@/components/back-button"
import { MobileNav } from "@/components/mobile-nav"
import { useTheme } from "next-themes"

export function Header() {
  const [isMounted, setIsMounted] = useState(false); 
  const { resolvedTheme } = useTheme()
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const logoSrc = resolvedTheme === 'dark' 
    ? '/nav-bar-sidehustle-dark.png' 
    : '/nav-bar-sidehustle-white.png'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <BackButton />
          <Link href="/" className="flex items-center">
            {!isMounted && <div className="h-12 w-[225px]" />} 
            {isMounted && (
              <Image 
                key={logoSrc} 
                src={logoSrc} 
                alt="Hustle Hard" 
                width={225} 
                height={60} 
                className="h-12 w-auto"
              />
            )}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/menu" className="font-medium">
              Menu
            </Link>
            <Link href="/locations" className="font-medium">
              Locations
            </Link>
            <Link href="/events" className="font-medium">
              Events
            </Link>
            <Link href="/shop" className="font-medium">
              Shop
            </Link>
            <Link href="/order" className="font-medium">
              Order
            </Link>
            <Link href="/chef-blog" className="font-medium">
              Chef&apos;s Blog
            </Link>
            <Link href="/about" className="font-medium">
              About
            </Link>
            <Link href="/contact" className="font-medium">
              Contact
            </Link>
          </nav>
          {/* <ThemeToggle /> */}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}