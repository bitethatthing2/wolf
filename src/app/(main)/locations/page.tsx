// Enhanced: global design system, glassmorphism cards, premium spacing, strict color rules, accessible, variable-based classes only
"use client";

import React from 'react';
import { useLocation } from "@/contexts/LocationContext"; 
import { useTheme } from 'next-themes'; 
import LocationSwitch from '@/components/features/locations/LocationSwitch'; 
import PageHeader from '@/components/layout/PageHeader'; 
import { Clock, Mail, Phone } from 'lucide-react';
import InstagramFeedSection from '@/components/features/social/ElfsightInstagramFeed';
import GoogleReviewsSection from '@/components/features/social/GoogleReviewsSection';

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card/80 backdrop-blur-lg border border-border shadow-xl rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

const LocationsPage = () => {
  const { selectedLocation, locationData } = useLocation();
  const { theme } = useTheme(); 
  const [isMounted, setIsMounted] = React.useState(false);

  // Use memo to prevent re-renders
  const socialComponents = React.useMemo(() => {
    return (
      <>
        {/* Instagram Feed - Temporarily disabled */}
        {/* <div className="mt-12"> 
          <InstagramFeedSection />
        </div> */}
        {/* Google Reviews - Temporarily disabled */}
        {/* <div className="mt-12"> 
          <GoogleReviewsSection />
        </div> */}
      </>
    );
  }, []);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !selectedLocation || !locationData) {
    return <div className="container mx-auto px-4 py-8 text-center text-foreground">Loading location data...</div>;
  }

  const activeLocation = locationData[selectedLocation];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 overflow-x-hidden mb-24">
        <PageHeader 
          title="Our Locations" 
          subtitle="Visit us at either of our locations in Portland or Salem"
        />

        <div className="flex flex-col items-center mb-10">
          <div className="w-full max-w-md mx-auto mb-8">
            <LocationSwitch className="w-full" /> 
          </div>
          {socialComponents}
          <h2 className="text-4xl font-extrabold text-foreground text-center mb-8 mt-10">
            {activeLocation.name}
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 w-full mt-12">
          {/* Contact Info Card */}
          <GlassCard className="flex flex-col gap-4 p-8">
            <h3 className="text-2xl font-bold text-card-foreground border-b border-border pb-3 mb-2">Contact Information</h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center justify-center rounded-full w-9 h-9 bg-white dark:bg-black border border-black dark:border-none">
                <Phone className="w-5 h-5 text-black dark:text-white" />
              </span>
              <a href={`tel:${activeLocation.phone}`} className="text-card-foreground hover:text-primary transition-colors font-medium text-lg">{activeLocation.phone}</a>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center rounded-full w-9 h-9 bg-white dark:bg-black border border-black dark:border-none">
                <Mail className="w-5 h-5 text-black dark:text-white" />
              </span>
              <a href={`mailto:${activeLocation.email}`} className="text-card-foreground hover:text-primary transition-colors font-medium text-lg">{activeLocation.email}</a>
            </div>
            <p className="text-muted-foreground mt-4 text-base">
              {activeLocation.address}
            </p>
          </GlassCard>

          {/* Hours Card */}
          <GlassCard className="flex flex-col gap-4 p-8">
            <div className="flex items-center gap-3 border-b border-border pb-3 mb-2">
              <span className="flex items-center justify-center rounded-full w-9 h-9 bg-white dark:bg-black border border-black dark:border-none">
                <Clock className="w-5 h-5 text-black dark:text-white" />
              </span>
              <h3 className="text-2xl font-bold text-card-foreground">Hours of Operation</h3>
            </div>
            <div className="space-y-2 mt-2">
              {Object.entries(activeLocation.hours).map(([day, time]: [string, string]) => (
                <div key={`${selectedLocation}-${day}`} className="flex justify-between items-center text-base">
                  <span className="text-muted-foreground capitalize">{day}</span>
                  <span className="text-card-foreground font-semibold">{String(time)}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default LocationsPage;