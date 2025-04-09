'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Script component to prevent static rendering issues
const Script = dynamic(() => import('next/script'), { ssr: false });

interface ElfsightWidgetProps {
  widgetId: string;
  className?: string;
}

const ElfsightWidget = ({ widgetId, className = '' }: ElfsightWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetClass = `elfsight-app-${widgetId}`;

  useEffect(() => {
    // Load the Elfsight script manually in useEffect to avoid SSR issues
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    script.onload = () => {
      if (window.elfsight) {
        window.elfsight.reinit();
      }
    };
    document.body.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [widgetId]);

  return (
    <div ref={containerRef} className={`${widgetClass} ${className}`}></div>
  );
};

// Add TypeScript declaration for the Elfsight global
declare global {
  interface Window {
    elfsight: {
      reinit: () => void;
    };
  }
}

export default ElfsightWidget;
