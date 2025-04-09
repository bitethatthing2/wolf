"use client"; // Context needs to run client-side to hold state

import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

// Define the possible location identifiers (adjust as needed)
export type LocationId = 'portland' | 'salem' | null;

// Define the shape of the context data
interface LocationContextProps {
  selectedLocation: LocationId;
  setSelectedLocation: (locationId: LocationId) => void;
}

// Create the context with an undefined initial value
const LocationContext = createContext<LocationContextProps | undefined>(undefined);

// Create the provider component
export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State to hold the currently selected location
  const [selectedLocation, setSelectedLocation] = useState<LocationId>(null); // Start with no location selected

  // Memoize the context value to prevent unnecessary re-renders of consumers
  // unless selectedLocation or setSelectedLocation actually changes.
  const contextValue = useMemo(() => ({
    selectedLocation,
    setSelectedLocation
  }), [selectedLocation]); // Dependency array includes selectedLocation

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    // Provides a helpful error if used outside the provider
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};