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
          variant="outline"
          className="flex items-center gap-2 bg-black border-black text-white hover:bg-black/90 hover:text-white px-6 py-3"
        >
          <Link href={portlandDirectionsUrl} target="_blank" rel="noopener noreferrer">
            <MapPin className="w-2 h-2" />
            <span>Directions to Portland</span>
          </Link>
        </Button>
      )}
      
      {(location === 'salem' || location === 'both') && (
        <Button
          asChild
          variant="outline"
          className="flex items-center gap-2 bg-black border-black text-white hover:bg-black/90 hover:text-white px-6 py-3"
        >
          <Link href={salemDirectionsUrl} target="_blank" rel="noopener noreferrer">
            <MapPin className="w-2 h-2" />
            <span>Directions to Salem</span>
          </Link>
        </Button>
      )}
    </div>
  );
};

export default LocationDirectionButtons;
