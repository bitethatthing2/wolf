"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Download, Bell, ShoppingBag, Store } from "lucide-react"
import { LocationSwitcher } from "@/components/features/location-switcher"
import { motion } from "framer-motion"
import { useLocation } from "@/contexts/LocationContext";
import PortlandMap from "@/components/features/locations/PortlandMap"; 
import SalemMap from "@/components/features/locations/SalemMap";     
import LocationDirectionButtons from "@/components/features/locations/LocationDirectionButtons"; 
import InstagramFeedSection from '@/components/features/social/InstagramFeedSection';
import GoogleReviewsSection from '@/components/features/social/GoogleReviewsSection';
import AppInstallFlow from '@/components/features/install/AppInstallFlow';

export default function HomePage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { selectedLocation, locationData } = useLocation() 

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-8">
      <LocationSwitcher className="mb-8" /> 

      {/* Header Text with Animations */}
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-black dark:text-white leading-tight">
          High-Energy Sports<br />
          Bar • Restaurant •<br />
          Nightclub
        </h1>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl font-semibold flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 mt-2 text-center"
        >
          <span className="w-full text-center mb-1 text-gray-800 dark:text-gray-200">Featuring Executive Chef</span>
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ 
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="rounded-full bg-black dark:bg-white p-1"
            >
              <Image 
                src="/wolf_girl.png" 
                alt="Wolf icon" 
                width={24} 
                height={24} 
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
              />
            </motion.div>
            <span className="text-gray-900 dark:text-gray-100 font-semibold">Rebecca Sanchez</span>
            <motion.div
              animate={{ 
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="rounded-full bg-black dark:bg-white p-1"
            >
              <Image 
                src="/wolf_girl.png" 
                alt="Wolf icon" 
                width={24} 
                height={24} 
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
              />
            </motion.div>
          </div>
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center"
        >
          <p className="text-xl italic text-gray-800 dark:text-gray-200 mb-5">
            #1 Rated Mexican Food & Best Tacos in Town
          </p>
        </motion.div>
        
        {/* Order Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col items-center justify-center gap-4 mt-2 w-full max-w-md mx-auto"
        >
          <h3 className="text-2xl font-bold text-black dark:text-white">Order Online</h3>
          <div className="flex flex-row justify-center gap-4 w-full">
            <Button 
              className={`h-12 w-full max-w-[160px] text-sm sm:text-base font-semibold rounded-full transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} border border-transparent hover:border-current shadow-md hover:shadow-lg transform hover:scale-105`}
              onClick={() => window.location.href = '/order?mode=online'}
            >
              <div className="w-5 h-5 relative">
                <Image 
                  src={theme === 'dark' ? "/order-online-icon-light.png" : "/order-online-icon-dark.png"}
                  alt="Delivery"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </div>
              <span>Delivery</span>
            </Button>
            <Button 
              className={`h-12 w-full max-w-[160px] text-sm sm:text-base font-semibold rounded-full transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} border border-transparent hover:border-current shadow-md hover:shadow-lg transform hover:scale-105`}
              onClick={() => window.location.href = '/order?mode=pickup'}
            >
              <div className="w-5 h-5 relative">
                <Image 
                  src={theme === 'dark' ? "/order-online-icon-light.png" : "/order-online-icon-dark.png"}
                  alt="Pickup"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </div>
              <span>Pickup</span>
            </Button>
          </div>
        </motion.div>
        
        {/* App Installation Flow */}
        <AppInstallFlow />
      </div>

      {/* Conditional Map and Directions Section */}
      <div className="w-full max-w-3xl mb-8"> 
        {selectedLocation === 'portland' ? (
          <>
            <PortlandMap 
              key={`home-portland-map-${mounted ? 'mounted' : 'loading'}`}
            />
            <div className="mt-4 flex justify-center">
              <LocationDirectionButtons location="portland" />
            </div>
          </>
        ) : (
          <>
            <SalemMap 
              key={`home-salem-map-${mounted ? 'mounted' : 'loading'}`}
            />
            <div className="mt-4 flex justify-center">
              <LocationDirectionButtons location="salem" />
            </div>
          </>
        )}
      </div>

      <InstagramFeedSection />
      
      <GoogleReviewsSection />
    </main>
  )
}