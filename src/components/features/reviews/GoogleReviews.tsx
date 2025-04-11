// Note: This component relies on the Elfsight script being loaded globally,
// typically in the root layout, and uses the ElfsightWidget component internally.

"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Import the reliable SideHustleGoogleReviews component with no SSR
const SideHustleGoogleReviews = dynamic(
  () => import('./SideHustleGoogleReviews'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full p-6 flex justify-center items-center">
        <div className="animate-pulse text-gray-500">Loading Google Reviews...</div>
      </div>
    )
  }
);

interface GoogleReviewsProps {
  appId?: string; // The Elfsight *widget* ID for Google Reviews
  className?: string;
}

const GoogleReviews: React.FC<GoogleReviewsProps> = ({ 
  // Default Elfsight Google Reviews Widget ID (replace if needed)
  appId = "f4fdffed-81de-4d5d-b688-2da302faebbe", 
  className = "" 
}) => {
  return (
    <SideHustleGoogleReviews
      widgetId={appId}
      className={className}
      title=""
    />
  );
};

export default GoogleReviews;
