"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocation } from '@/contexts/LocationContext';
import { MapPin, Phone, Mail, Instagram, Facebook, Clock, ArrowUp, ShoppingCart, Calendar, Users, UtensilsCrossed, Download, Bell, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useHydration } from '@/hooks/use-hydration';

export default function DynamicFooter() {
  const { resolvedTheme } = useTheme(); // Use resolvedTheme instead of theme
  const { selectedLocation, locationData } = useLocation();
  const currentLocation = locationData[selectedLocation];
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isHydrated = useHydration();
  
  // Add scroll to top functionality
  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Format phone number for tel: link
  const formattedPhone = currentLocation.phone.replace(/\D/g, '');
  
  // If not hydrated yet, return a placeholder to prevent layout shift
  if (!isHydrated) {
    return (
      <section className="w-full bg-white dark:bg-background relative">
        <div className="container mx-auto py-12 px-8">
          {/* Placeholder content with same structure but no theme-dependent elements */}
          <div className="opacity-0">Loading footer...</div>
        </div>
      </section>
    );
  }
  
  // Determine color scheme based on current theme
  const isDark = resolvedTheme === 'dark';
  
  return (
    <section className="footer w-full bg-white dark:bg-background relative outline-none">
      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-md shadow-lg transition-all flex items-center gap-2"
          aria-label="Scroll to top"
        >
          <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mr-1 icon-circle">
            <ArrowUp className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium">Back to top</span>
        </button>
      )}
      
      <div className="container mx-auto py-12 px-8">
        {/* App features section */}
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <div className="h-10 w-10 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="h-5 w-5 text-white dark:text-black" />
          </div>
          <div className="mb-6 flex-1 text-center">
            <h3 className={`${isDark ? 'text-white' : 'text-black'} font-bold text-2xl mb-2`}>Experience Side Hustle</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-900 font-medium'}`}>Food • Drinks • Events • Atmosphere</p>
          </div>
          <div className="w-full max-w-md flex flex-wrap justify-center gap-4">
            <a 
              href="/menu" 
              className="flex items-center justify-center py-3 px-6 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-gray-100 font-bold text-base rounded-md"
            >
              <div className="w-6 h-6 rounded-full bg-white dark:bg-black flex items-center justify-center mr-2 icon-circle">
                <UtensilsCrossed className="h-4 w-4 text-black dark:text-white" />
              </div>
              <span>View Menu</span>
            </a>
            <a 
              href="/order" 
              className="flex items-center justify-center py-3 px-6 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-gray-100 font-bold text-base rounded-md"
            >
              <div className="w-6 h-6 rounded-full bg-white dark:bg-black flex items-center justify-center mr-2 icon-circle">
                <ShoppingCart className="h-4 w-4 text-black dark:text-white" />
              </div>
              <span>Order Now</span>
            </a>
            <a 
              href="/events" 
              className="flex items-center justify-center py-3 px-6 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-gray-100 font-bold text-base rounded-md"
            >
              <div className="w-6 h-6 rounded-full bg-white dark:bg-black flex items-center justify-center mr-2 icon-circle">
                <Calendar className="h-4 w-4 text-black dark:text-white" />
              </div>
              <span>Upcoming Events</span>
            </a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row flex-wrap gap-10 lg:gap-16">
          {/* Logo and Description Section */}
          <div className="flex flex-col flex-1 min-w-[250px]">
            <div className="mb-6 relative">
              <div className="flex items-center justify-center">
                <Image 
                  src={isDark ? '/logo-main-dark.png' : '/logo-main-light.png'}
                  alt="Side Hustle Bar Wolf Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-900 font-medium'} mb-6`}>
              {selectedLocation === 'portland' 
                ? "Portland's premier sports bar and restaurant serving amazing food and drinks in the heart of downtown."
                : "Salem's top destination for food, drinks, and entertainment in a stylish and vibrant setting."}
            </p>
            
            <div className="mt-auto flex space-x-4">
              <a 
                href="https://www.instagram.com/sidehustle_bar" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="h-10 w-10 bg-white rounded-full flex items-center justify-center transition-all hover:bg-gray-100 hover:shadow-md border-4 border-black dark:bg-black dark:border-transparent"
              >
                <Instagram className="h-5 w-5 text-black dark:text-white" strokeWidth={2.5} />
              </a>
              <a 
                href="https://www.facebook.com/p/The-Side-Hustle-Bar-100094503669280/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="h-10 w-10 bg-white rounded-full flex items-center justify-center transition-all hover:bg-gray-100 hover:shadow-md border-4 border-black dark:bg-black dark:border-transparent"
              >
                <Facebook className="h-5 w-5 text-black dark:text-white" strokeWidth={2.5} />
              </a>
            </div>
          </div>
          
          {/* Location Details Section */}
          <div className="flex flex-col flex-1 min-w-[250px]">
            <h3 className={`${isDark ? 'text-white' : 'text-black'} font-bold mb-5 text-xl`}>Visit {currentLocation.name.split('-')[1].trim()}</h3>
            <ul className="space-y-5">
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm icon-circle border-4 border-black dark:bg-black dark:border-transparent">
                    <MapPin className="h-4 w-4 text-black dark:text-white" />
                  </div>
                </div>
                <div>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-900 font-medium'}>{currentLocation.address}</p>
                  <Link href="/locations" className={`${isDark ? 'text-white' : 'text-black font-semibold'} text-sm hover:underline mt-1 inline-block`}>
                    Get directions
                  </Link>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border-4 border-black dark:bg-black dark:border-transparent">
                    <Phone className="h-4 w-4 text-black dark:text-white" />
                  </div>
                </div>
                <div>
                  <a href={`tel:${formattedPhone}`} className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-900 font-medium hover:text-black'}`}>
                    {currentLocation.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border-4 border-black dark:bg-black dark:border-transparent">
                    <Mail className="h-4 w-4 text-black dark:text-white" />
                  </div>
                </div>
                <div>
                  <a href={`mailto:${currentLocation.email}`} className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-900 font-medium hover:text-black'}`}>
                    {currentLocation.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border-4 border-black dark:bg-black dark:border-transparent">
                    <Clock className="h-4 w-4 text-black dark:text-white" />
                  </div>
                </div>
                <div>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-900 font-medium'}>Today: {currentLocation.hours[getDayOfWeek()]}</p>
                  <button className={`${isDark ? 'text-white' : 'text-black font-semibold'} text-sm hover:underline mt-1`} onClick={() => document.getElementById('hours-details')?.classList.toggle('hidden')}>
                    View all hours
                  </button>
                  <div id="hours-details" className="hidden mt-2 space-y-1">
                    {Object.entries(currentLocation.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>{day}</span>
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-xs`}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Quick Links Section */}
          <div className="flex flex-1 min-w-[250px]">
            <div className="w-1/2">
              <h3 className={`${isDark ? 'text-white' : 'text-black'} font-bold mb-5 text-xl`}>Menu</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/menu#food" prefetch={false} className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-900 font-medium hover:text-black'} transition-colors`}>
                    Food Menu
                  </Link>
                </li>
                <li>
                  <Link href="/menu#happy-hour" prefetch={false} className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-900 font-medium hover:text-black'} transition-colors`}>
                    Drinks
                  </Link>
                </li>
                <li>
                  <Link href="/menu#happy-hour" prefetch={false} className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-900 font-medium hover:text-black'} transition-colors`}>
                    Happy Hour
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="w-1/2">
              <h3 className={`${isDark ? 'text-white' : 'text-black'} font-bold mb-5 text-xl`}>Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-900 font-medium hover:text-black'} transition-colors`}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/events" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-900 font-medium hover:text-black'} transition-colors`}>
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/locations" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-900 font-medium hover:text-black'} transition-colors`}>
                    Locations
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-900 font-medium hover:text-black'} transition-colors`}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Call to Action Section */}
          <div className="flex flex-col flex-1 min-w-[250px]">
            <h3 className={`${isDark ? 'text-white' : 'text-black'} font-bold mb-5 text-xl`}>Ready to Order?</h3>
            <div className="rounded-lg py-4 flex flex-col">
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-900 font-medium'} mb-4`}>Order online for pickup or delivery</p>
              
              {/* Order Online Button */}
              <div className="mb-4">
                <a 
                  href="/order" 
                  className="inline-flex items-center justify-center w-full py-3 px-6 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-gray-100 font-bold text-base rounded-md"
                >
                  <span className="w-6 h-6 rounded-full bg-white dark:bg-black flex items-center justify-center mr-2">
                    <ShoppingCart className="h-4 w-4 text-black dark:text-white" strokeWidth={2.5} />
                  </span>
                  <span>Order Online</span>
                </a>
              </div>
              
              {/* Make a Reservation Button */}
              <div>
                <a 
                  href="/reservations"
                  className="inline-flex items-center justify-center w-full py-3 px-6 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-gray-100 font-bold text-base rounded-md"
                >
                  <span className="w-6 h-6 rounded-full bg-white dark:bg-black flex items-center justify-center mr-2">
                    <Calendar className="h-4 w-4 text-black dark:text-white" strokeWidth={2.5} />
                  </span>
                  <span>Make a Reservation</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Simple separator div instead of Separator component */}
        <div className={`my-10 h-px ${isDark ? 'bg-gray-700/50' : 'bg-gray-200'} w-full bg-blend-normal`}></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-800 font-medium'} mb-4 md:mb-0`}>
            &copy; {new Date().getFullYear()} Side Hustle Bar. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center bg-transparent">
            <Link 
              href="/privacy" 
              className="bg-white text-black px-3 py-1 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:bg-gray-100"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="bg-white text-black px-3 py-1 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:bg-gray-100"
            >
              Terms of Service
            </Link>
            <Link 
              href="/accessibility" 
              className="bg-white text-black px-3 py-1 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:bg-gray-100"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper function to get current day of week
function getDayOfWeek() {
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  return days[new Date().getDay()];
}
