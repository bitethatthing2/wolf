"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "@/contexts/LocationContext"
import { Flower2, Apple } from 'lucide-react';

interface LocationSwitcherProps {
  className?: string
}

export function LocationSwitcher({ className }: LocationSwitcherProps) {
  const { selectedLocation, setSelectedLocation } = useLocation()
  const { theme, setTheme, resolvedTheme } = useTheme()

  // Ensure component state matches context on mount or when context changes
  useEffect(() => {
    const expectedTheme = selectedLocation === 'portland' ? 'dark' : 'light';
    if (theme !== expectedTheme) {
      setTheme(expectedTheme);
    }
  }, [selectedLocation, theme, setTheme]);

  const isDarkMode = theme === 'dark' || resolvedTheme === 'dark'
  
  let currentImage: string;
  if (selectedLocation === 'portland') {
    currentImage = '/wolf-light-white.png';
  } else {
    currentImage = isDarkMode ? '/wolf-light-white.png' : '/wolf-icon-black.png';
  }
  
  // Function to toggle location AND theme
  const toggleLocation = () => {
    const newLocation = selectedLocation === 'portland' ? 'salem' : 'portland'
    setSelectedLocation(newLocation)
    setTheme(newLocation === 'portland' ? 'dark' : 'light')
  }
  
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Image Animation Section - KEEP THIS */}
      <div className="mt-6 flex justify-center items-center">
        <div className="relative w-96 h-96"> 
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedLocation}-${currentImage}`}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={currentImage}
                alt={`${selectedLocation} location`}
                width={360} 
                height={360} 
                className="object-contain w-96 h-96" 
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* --- Toggle Section with Simple Text Labels START --- */}
      <div className="flex items-center space-x-4">
        {/* PDX Text Label */}
        <span 
          className={`text-lg font-bold cursor-pointer ${selectedLocation === 'portland' 
            ? 'text-black dark:text-white' // Use theme's primary text color when active
            : 'text-gray-500 dark:text-gray-400' // Use dimmer color when inactive
          }`}
          onClick={() => {
            setSelectedLocation('portland')
            setTheme('dark') // Ensure theme syncs on direct click
          }}
        >
          PDX
        </span>
        
        {/* Toggle Button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          // Increased track size
          className={`relative inline-flex h-10 w-20 items-center rounded-full ${selectedLocation === 'salem' 
            ? 'bg-black dark:bg-white' // Salem (light) active: Black track (light) / White track (dark)
            : 'bg-gray-300 dark:bg-gray-600' // Portland (dark) active: Gray track (light) / Dark Gray track (dark)
          }`}
          onClick={toggleLocation} // Use the combined toggle function
          aria-label={`Switch location to ${selectedLocation === 'portland' ? 'Salem' : 'Portland'}`}
          title={`Switch location to ${selectedLocation === 'portland' ? 'Salem' : 'Portland'}`}
        >
          <motion.span 
            layout
            transition={{ 
              type: "spring", 
              stiffness: 700, 
              damping: 15,
              mass: 0.5
            }} 
            animate={{ 
              // Adjusted translation distance for wider track and bigger ball
              translateX: selectedLocation === 'salem' ? '2.5rem' : '0.25rem',
              scale: selectedLocation === 'salem' ? 1.1 : 1
            }}
            // Increased ball size, always white background
            className="flex h-9 w-9 rounded-full bg-white items-center justify-center shadow"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              // Set background only, image has its own colors
              className={`flex items-center justify-center w-full h-full rounded-full 
                ${selectedLocation === 'portland' 
                  ? 'bg-black' // Dark theme active: Black BG
                  : 'bg-white'} // Light theme active: White BG
              `}
            >
              {/* Using menu icons instead of wolf icons */}
              <Image
                src={selectedLocation === 'portland' ? '/main-menu-icon-black.png' : '/main-menu-icon-white copy.png'}
                alt="Location Toggle Icon"
                // Increased size
                width={28} 
                height={28}
                className="object-contain w-7 h-7" // Increased size
              />
            </motion.div>
          </motion.span>
        </motion.button>
        
        {/* SALEM Text Label */}
        <span 
          className={`text-lg font-bold cursor-pointer ${selectedLocation === 'salem' 
            ? 'text-black dark:text-white' // Use theme's primary text color when active
            : 'text-gray-500 dark:text-gray-400' // Use dimmer color when inactive
          }`}
          onClick={() => {
            setSelectedLocation('salem')
            setTheme('light') // Ensure theme syncs on direct click
          }}
        >
          Salem
        </span>
      </div>
      {/* --- Toggle Section END --- */}

    </div>
  )
}

export default LocationSwitcher
