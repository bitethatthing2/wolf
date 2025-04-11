"use client";

import React, { useState, useEffect } from 'react';
// import { useTheme } from 'next-themes'; // Unused
import { Switch } from "@/components/ui/switch";
import { useLocation } from "@/contexts/LocationContext"; 
import { cn } from "@/lib/utils";
import PortlandMap from './PortlandMap'; // Import map component
import SalemMap from './SalemMap'; // Import map component
import LocationDirectionButtons from './LocationDirectionButtons'; // Import directions component

interface LocationSwitchProps {
  className?: string;
}

const LocationSwitch: React.FC<LocationSwitchProps> = ({ className }) => {
  const { selectedLocation, setSelectedLocation, locationData } = useLocation(); // Get full location data
  // const { resolvedTheme } = useTheme(); // Unused
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckedChange = (checked: boolean) => {
    setSelectedLocation(checked ? 'salem' : 'portland');
  };

  const isChecked = selectedLocation === 'salem';
  const activeLocationData = locationData[selectedLocation]; // Get data for the selected location

  if (!isMounted || !activeLocationData) {
    // Add placeholders or loading state
    return <div className={cn("flex flex-col items-center", className)}>Loading...</div>; 
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className={cn("font-medium", selectedLocation === 'portland' ? 'text-primary' : 'text-muted-foreground')}>Portland</span>
        <Switch 
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
          className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary"
          aria-label={`Switch location to ${isChecked ? 'Portland' : 'Salem'}`}
          title={`Switch location to ${isChecked ? 'Portland' : 'Salem'}`}
        />
        <span className={cn("font-medium", selectedLocation === 'salem' ? 'text-primary' : 'text-muted-foreground')}>Salem</span>
      </div>
      
      {/* Display Name and Address */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">{activeLocationData.name}</h3>
        <p className="text-muted-foreground">{activeLocationData.address}</p>
      </div>

      {/* Display Map based on selection */}
      <div className="w-full max-w-4xl mx-auto mb-6 relative min-h-[450px]">
        <div className={`absolute inset-0 transition-opacity duration-300 ${selectedLocation === 'portland' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <PortlandMap />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-300 ${selectedLocation === 'salem' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <SalemMap />
        </div>
      </div>

      {/* Display Direction Buttons */}
      <LocationDirectionButtons location={selectedLocation} />

    </div>
  );
};

export default LocationSwitch;
