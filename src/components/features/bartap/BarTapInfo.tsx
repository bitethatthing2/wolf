"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { InfoIcon } from 'lucide-react';

interface BarTapInfoProps {
  className?: string;
  compact?: boolean;
}

/**
 * Reusable component that displays important information about BarTap
 * Can be rendered in compact mode for use in promotional sections
 */
export default function BarTapInfo({ className = "", compact = false }: BarTapInfoProps) {
  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const infoPoints = [
    {
      title: "Security Deposit",
      description: "The card hold is only a temporary authorization, not a charge. It's released immediately after your visit."
    },
    {
      title: "Payment Process",
      description: "You pay for your drinks normally when served. The hold is completely separate from your actual payment."
    },
    {
      title: "Bartender Selection",
      description: "You can choose a specific bartender with expertise in your preferred drinks or select \"First Available\" for fastest service."
    },
    {
      title: "Table Service",
      description: "After completing these three simple steps, your drinks will be delivered directly to your table for a seamless experience."
    }
  ];

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className={`${compact ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${compact ? 'border-yellow-100 dark:border-yellow-700/20' : 'border-yellow-200 dark:border-yellow-700/30'} rounded-xl p-6 ${className}`}
    >
      <h2 className={`${compact ? 'text-lg' : 'text-xl'} font-bold mb-4 text-black dark:text-white flex items-center gap-2`}>
        <InfoIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        Important Information
      </h2>
      
      <ul className={`space-y-${compact ? '2' : '3'} text-gray-700 dark:text-gray-300`}>
        {infoPoints.map((point, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="mt-1 min-w-5 text-center">•</div>
            <p><strong>{point.title}:</strong> {point.description}</p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}