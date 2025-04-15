"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Beer, CreditCard, Star } from 'lucide-react';

interface BarTapBenefitProps {
  className?: string;
  compact?: boolean;
}

/**
 * Reusable component that displays the BarTap benefits
 * Can be rendered in compact mode for use in promotional sections
 */
export default function BarTapBenefits({ className = "", compact = false }: BarTapBenefitProps) {
  // Animation variants for staggered animation
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
  
  const benefits = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Stay With Your Group",
      description: "Enjoy drinks without leaving your table, allowing you to remain part of the conversation with your friends"
    },
    {
      icon: <Beer className="w-5 h-5" />,
      title: "Craft Beverage Experience",
      description: "Choose your favorite bartender for expert recommendations and drinks crafted to your exact preferences"
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Seamless Payment Process",
      description: "The temporary authorization ensures your table service—you'll only pay for what you order when your drinks are delivered"
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Premium Experience",
      description: "Enjoy a more personalized service while staying with your group instead of waiting at the bar"
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${compact ? '' : 'border border-border rounded-xl overflow-hidden'} ${className}`}
    >
      <div className={`${compact ? '' : 'bg-muted/10 p-6'}`}>
        <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-black dark:text-white`}>
          Why Use BarTap™?
        </h2>
      </div>
      
      <div className={`${compact ? 'p-0' : 'p-6'} grid ${compact ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 gap-6'}`}>
        {benefits.map((benefit, index) => (
          <motion.div key={index} variants={itemVariants} className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {benefit.icon}
            </div>
            <div>
              <h3 className="font-semibold mb-1">{benefit.title}</h3>
              <p className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>{benefit.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}