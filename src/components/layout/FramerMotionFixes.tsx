'use client';

import { useEffect } from 'react';
import { applyFramerMotionFixes } from '@/lib/framer-motion-fix';

/**
 * This component applies fixes for Framer Motion issues in development mode
 * It helps prevent errors related to animation timing and React Suspense
 */
const FramerMotionFixes = () => {
  useEffect(() => {
    // Apply the fixes when the component mounts
    applyFramerMotionFixes();
  }, []);

  // This component doesn't render anything
  return null;
};

export default FramerMotionFixes;
