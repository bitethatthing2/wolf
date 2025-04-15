"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Beer, CreditCard } from 'lucide-react';

interface BarTapProcessProps {
  className?: string;
  compact?: boolean;
}

/**
 * Reusable component that displays the 3-step BarTap process
 * Can be rendered in compact mode for use in promotional sections
 */
export default function BarTapProcess({ className = "", compact = false }: BarTapProcessProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Use different layout and styling based on compact mode
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${compact ? 'p-4' : 'p-6 border border-border rounded-xl'} ${className}`}
    >
      <div className={compact ? "" : "bg-muted/10 p-4 mb-6 rounded-lg"}>
        <h2 className={`font-bold text-black dark:text-white ${compact ? 'text-xl mb-3' : 'text-2xl mb-4'}`}>
          How BarTap™ Works - 3 Simple Steps
        </h2>
      </div>
      
      <div className={`grid ${compact ? 'gap-4' : 'gap-8'} ${compact ? 'grid-cols-1 sm:grid-cols-3' : 'md:grid-cols-3'}`}>
        {/* Step 1 */}
        <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3 text-white text-xl font-bold">1</div>
          <div className="flex-shrink-0 w-12 h-12 rounded-full mb-3 bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h3 className={`font-bold mb-2 ${compact ? 'text-base' : 'text-lg'}`}>Scan Table QR Code</h3>
          <p className="text-muted-foreground text-sm">Scan the QR code at your table to begin your premium experience</p>
        </motion.div>
        
        {/* Step 2 */}
        <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3 text-white text-xl font-bold">2</div>
          <div className="flex-shrink-0 w-12 h-12 rounded-full mb-3 bg-primary/10 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <h3 className={`font-bold mb-2 ${compact ? 'text-base' : 'text-lg'}`}>Security Deposit</h3>
          <p className="text-muted-foreground text-sm">Provide a card for a temporary hold (not a charge) - only processed if order is abandoned</p>
        </motion.div>
        
        {/* Step 3 */}
        <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3 text-white text-xl font-bold">3</div>
          <div className="flex-shrink-0 w-12 h-12 rounded-full mb-3 bg-primary/10 flex items-center justify-center">
            <Beer className="h-6 w-6 text-primary" />
          </div>
          <h3 className={`font-bold mb-2 ${compact ? 'text-base' : 'text-lg'}`}>Select Bartender</h3>
          <p className="text-muted-foreground text-sm">Choose your preferred bartender or select "first available" for fastest service</p>
        </motion.div>
      </div>
      
      {!compact && (
        <div className="mt-8 p-4 bg-black/5 dark:bg-white/5 rounded-lg text-sm text-center max-w-xl mx-auto">
          <p className="text-muted-foreground">
            After these three simple steps, enjoy dedicated service right at your table. 
            Pay for your drinks normally when they're delivered, while enjoying the company of your friends.
          </p>
        </div>
      )}
      
      {compact && (
        <div className="mt-2 text-xs text-center">
          <span className="text-primary">
            View all details on the BarTap™ page
          </span>
        </div>
      )}
    </motion.div>
  );
}