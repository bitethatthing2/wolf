"use client";

import { useState, useEffect } from 'react';

/**
 * A hook that returns true when the component is hydrated on the client side
 * Prevents hydration mismatch errors in server-side rendering
 */
export const useHydration = (): boolean => {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  return isHydrated;
};
