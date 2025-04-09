"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "@/contexts/LocationContext"

interface LocationSwitcherProps {
  className?: string
}

export function LocationSwitcher({ className }: LocationSwitcherProps) {
  const { resolvedTheme, theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { selectedLocation, setSelectedLocation } = useLocation()
  
  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
    
    // Sync theme with location on initial load
    if (selectedLocation === 'portland' && theme !== 'dark') {
      setTheme('dark')
    } else if (selectedLocation === 'salem' && theme !== 'light') {
      setTheme('light')
    }
  }, [])
  
  // If not mounted yet, return a placeholder to prevent layout shift
  if (!mounted) {
    return <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="mt-6 flex justify-center items-center">
        <div className="relative w-96 h-96 opacity-0">
          Loading...
        </div>
      </div>
    </div>
  }
  
  // Get current image based on both location and theme
  const isDarkMode = theme === 'dark' || resolvedTheme === 'dark'
  
  let currentImage: string;
  if (selectedLocation === 'portland') {
    // Portland always uses white wolf (dark theme)
    currentImage = '/wolf-light-white.png';
  } else {
    // Salem uses black wolf for light theme, white wolf for dark theme
    currentImage = isDarkMode ? '/wolf-light-white.png' : '/wolf-icon-black.png';
  }
  
  const toggleLocation = () => {
    const newLocation = selectedLocation === 'portland' ? 'salem' : 'portland'
    setSelectedLocation(newLocation)
    
    // Toggle theme when location changes
    setTheme(newLocation === 'portland' ? 'dark' : 'light')
  }
  
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
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
      
      <div className="flex items-center space-x-4">
        <span 
          className={`text-lg font-bold cursor-pointer ${selectedLocation === 'portland' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => {
            setSelectedLocation('portland')
            setTheme('dark')
          }}
        >
          Portland
        </span>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative inline-flex h-8 w-14 items-center rounded-full ${selectedLocation === 'salem' ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'}`}
          onClick={toggleLocation}
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
              translateX: selectedLocation === 'salem' ? '1.5rem' : '0.25rem',
              scale: selectedLocation === 'salem' ? 1.1 : 1
            }}
            className="flex h-7 w-7 rounded-full bg-white dark:bg-white items-center justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image
                src={'/wolf-icon-black.png'}
                alt="Location Toggle Icon"
                width={20} 
                height={20}
                className="object-contain w-full h-full" 
              />
            </motion.div>
          </motion.span>
        </motion.button>
        
        <span 
          className={`text-lg font-bold cursor-pointer ${selectedLocation === 'salem' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => {
            setSelectedLocation('salem')
            setTheme('light')
          }}
        >
          Salem
        </span>
      </div>
    </div>
  )
}

export default LocationSwitcher
