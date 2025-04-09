"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface GoogleMapEmbedProps {
  lat: number;
  lng: number;
  zoom?: number;
  className?: string;
}

const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({
  lat,
  lng,
  zoom = 15,
  className
}) => {
  // Create a Google Maps embed URL that works without an API key
  // Using a more browser-friendly format with no Node.js dependencies
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.727!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1615!5m2!1sen!2sus`;

  return (
    <div className="w-full rounded-lg overflow-hidden border border-white/10 shadow-md">
      {/* Maintain aspect ratio for responsiveness */}
      <div className="relative pb-[56.25%] h-0"> {/* 16:9 Aspect Ratio */}
        <iframe
          src={mapUrl}
          title="Google Maps"
          width="100%"
          height="100%"
          referrerPolicy="no-referrer-when-downgrade"
          className={cn("absolute top-0 left-0 w-full h-full hh-iframe-no-border", className)}
          allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; geolocation; microphone; camera; display-capture; fullscreen; magnetometer; payment; publickey-credentials-get; screen-wake-lock; serial; usb; xr-spatial-tracking"
        />
      </div>
    </div>
  );
};

export default GoogleMapEmbed;
