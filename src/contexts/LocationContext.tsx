'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type LocationType = 'portland' | 'salem';

interface LocationData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  serviceOptions: string[];
  hours: {
    [key: string]: string;
  };
  embedUrl: string;
}

interface LocationContextType {
  selectedLocation: LocationType;
  setSelectedLocation: (location: LocationType) => void;
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
  locationData: {
    [key in LocationType]: LocationData;
  };
}

export const defaultLocationData = {
  portland: {
    name: "The Side Hustle Bar - Portland",
    description: "Our original location in downtown Portland. Come enjoy our famous tacos, craft cocktails, and vibrant nightlife atmosphere.",
    address: "327 SW Morrison St, Portland, OR 97204",
    phone: "(503) 391-9977",
    email: "contact@thesidehustleportland.com",
    serviceOptions: ["Dine-in", "Takeout", "Full Bar", "Late Night", "Weekend Brunch"],
    hours: {
      Sunday: "10 AM - 12 AM",
      Monday: "10 AM - 11 PM",
      Tuesday: "10 AM - 11 PM",
      Wednesday: "10 AM - 11 PM",
      Thursday: "10 AM - 1 AM",
      Friday: "10 AM - 2:30 AM",
      Saturday: "10 AM - 2:30 AM"
    },
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d719332.6607707763!2d-123.46261295315917!3d45.22972793451698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950bbb77279f67%3A0xfb5a916203b1c05a!2sSide%20Hustle!5e0!3m2!1sen!2sus!4v1744138010374!5m2!1sen!2sus"
  },
  salem: {
    name: "The Side Hustle Bar - Salem",
    description: "Margaritas and Mexican fare round out the menu at this high-energy sports bar and nightclub.",
    address: "145 Liberty St NE Suite &#35;101, Salem, OR 97301",
    phone: "(503) 391-9977",
    email: "contact@thesidehustlesalem.com",
    serviceOptions: ["Dine-in", "Takeout", "Full Bar", "Has outdoor seating", "Serves great cocktails", "Has dancing"],
    hours: {
      Sunday: "10 AM - 11 PM",
      Monday: "10 AM - 11 PM",
      Tuesday: "10 AM - 11 PM",
      Wednesday: "10 AM - 11 PM",
      Thursday: "10 AM - 12 AM",
      Friday: "10 AM - 2 AM",
      Saturday: "10 AM - 2 AM"
    },
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2824.156024280606!2d-123.0413951250114!3d44.940496071070186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54bfff43800426c7%3A0xe32b22509988966e!2sSide%20Hustle%20Bar!5e0!3m2!1sen!2sus!4v1744137985048!5m2!1sen!2sus"
  }
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationType>('portland');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationData] = useState(defaultLocationData);

  return (
    <LocationContext.Provider value={{
      selectedLocation,
      setSelectedLocation,
      showLocationModal,
      setShowLocationModal,
      locationData
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export type { LocationType, LocationData };
export { LocationContext }; 
