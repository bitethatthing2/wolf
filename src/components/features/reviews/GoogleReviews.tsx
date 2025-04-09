// Note: This component relies on the Elfsight script being loaded globally,
// typically in the root layout, and uses the ElfsightWidget component internally.

"use client";

import React from 'react';
import ElfsightWidget from '@/components/features/ElfsightWidget'; // Correct path to the component

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
    <ElfsightWidget
      widgetId={appId}
      className={className}
      wrapperClassName="my-8" // Add some margin around the reviews widget
      fallbackMessage="Loading Google Reviews..."
    />
  );
};

export default GoogleReviews;
