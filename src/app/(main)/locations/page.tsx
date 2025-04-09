"use client";

import React from 'react';
import { useLocation } from "@/contexts/LocationContext"; 
import { useTheme } from 'next-themes'; 
import LocationSwitch from '@/components/features/locations/LocationSwitch'; 
import PageHeader from '@/components/layout/PageHeader'; 
import { Clock, Mail, Phone } from 'lucide-react';
import InstagramFeedSection from '@/components/features/social/InstagramFeedSection';
import GoogleReviewsSection from '@/components/features/social/GoogleReviewsSection';

const LocationsPage = () => {
  const { selectedLocation, locationData } = useLocation();
  const { theme } = useTheme(); 
  
  const activeLocation = locationData[selectedLocation];

  if (!selectedLocation || !locationData) {
    return <div className="container mx-auto px-4 py-8 text-center text-white">Loading location data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-hidden mb-24">
      <PageHeader 
        title="Our Locations" 
        subtitle="Visit us at either of our locations in Portland or Salem"
      />
      
      <div className="flex flex-col items-center mb-6">
        <div className="w-full max-w-md mx-auto mb-6">
          <LocationSwitch className="w-full" /> 
        </div>
        
        <div className="mt-12"> 
          <InstagramFeedSection />
        </div>

        <div className="mt-12"> 
          <GoogleReviewsSection />
        </div>

        <h2 className="text-3xl font-bold text-white text-center mb-4">
          {activeLocation.name}
        </h2>
      </div>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-12">
        <div className="flex flex-col gap-4 bg-black/30 p-6 rounded-lg border border-white/10">
          <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Contact Information</h3>
          
          <div className="flex items-center gap-3 mt-2">
            <Phone className="w-5 h-5 text-white/60 flex-shrink-0" />
            <a href={`tel:${activeLocation.phone}`} className="text-white hover:text-primary transition-colors">{activeLocation.phone}</a>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-white/60 flex-shrink-0" />
            <a href={`mailto:${activeLocation.email}`} className="text-white hover:text-primary transition-colors">{activeLocation.email}</a>
          </div>
          
          <p className="text-white/80 mt-4">
            {activeLocation.address}
          </p>
        </div>
        
        <div className="flex flex-col gap-4 bg-black/30 p-6 rounded-lg border border-white/10">
          <div className="flex items-center gap-3 border-b border-white/10 pb-2">
            <Clock className="w-5 h-5 text-white/60" />
            <h3 className="text-xl font-semibold text-white">Hours of Operation</h3>
          </div>
          
          <div className="space-y-2 mt-2">
            {Object.entries(activeLocation.hours).map(([day, time]: [string, string]) => (
              <div key={day} className="flex justify-between items-center text-sm">
                <span className="text-white/80 capitalize">{day}</span>
                <span className="text-white font-medium">{String(time)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationsPage;