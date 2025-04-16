"use client";

import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { useLocation } from "@/contexts/LocationContext"; 
import { cn } from "@/lib/utils";
import PortlandMap from './PortlandMap';
import SalemMap from './SalemMap';
import LocationDirectionButtons from './LocationDirectionButtons';

interface LocationSwitchProps {
  className?: string;
}

const LocationSwitch: React.FC<LocationSwitchProps> = ({ className }) => {
  const { selectedLocation, setSelectedLocation, locationData } = useLocation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckedChange = (checked: boolean) => {
    setSelectedLocation(checked ? 'salem' : 'portland');
  };

  const isChecked = selectedLocation === 'salem';
  const activeLocationData = locationData[selectedLocation];

  if (!isMounted || !activeLocationData) {
    return <div className={cn("flex flex-col items-center", className)}>Loading...</div>; 
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className={cn("font-medium", selectedLocation === 'portland' ? 'text-primary' : 'text-muted-foreground')}>Portland</span>
        <Switch 
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
          className="bg-primary"
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
        {selectedLocation === 'portland' ? (
          <PortlandMap />
        ) : (
          <SalemMap />
        )}
      </div>
      {/* Display Direction Buttons */}
      <LocationDirectionButtons location={selectedLocation} />
    </div>
  );
};

export default LocationSwitch;
