"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

interface LocationDirectionButtonsProps {
  location?: 'portland' | 'salem' | 'both';
}

const LocationDirectionButtons: React.FC<LocationDirectionButtonsProps> = ({ 
  location = 'both' 
}) => {
  const salemDirectionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Side+Hustle+Bar,+Salem,+OR";
  const portlandDirectionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Side+Hustle,+Portland,+OR";

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full my-6">
      {(location === 'portland' || location === 'both') && (
        <Button
          asChild
          className="flex items-center justify-center gap-2 py-3 px-6 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-bold text-base rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:transition-colors"
        >
          <Link href={portlandDirectionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2"> 
            <div className="w-7 h-7 rounded-full bg-white dark:bg-black flex items-center justify-center mr-1">
              <MapPin className="w-4 h-4 text-black dark:text-white" />
            </div>
            <span>Directions to Portland</span>
          </Link>
        </Button>
      )}
      
      {(location === 'salem' || location === 'both') && (
        <Button
          asChild
          className="flex items-center justify-center gap-2 py-3 px-6 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-bold text-base rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:transition-colors"
        >
          <Link href={salemDirectionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2"> 
            <div className="w-7 h-7 rounded-full bg-white dark:bg-black flex items-center justify-center mr-1">
              <MapPin className="w-4 h-4 text-black dark:text-white" />
            </div>
            <span>Directions to Salem</span>
          </Link>
        </Button>
      )}
    </div>
  );
};

export default LocationDirectionButtons;
