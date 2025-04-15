"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface BarTapFAQProps {
  className?: string;
  compact?: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Reusable component that displays BarTap FAQs
 * Can be rendered in compact mode for use in promotional sections
 */
export default function BarTapFAQ({ className = "", compact = false }: BarTapFAQProps) {
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
  
  const faqs: FAQItem[] = [
    {
      question: "Is my card actually charged $50?",
      answer: "No, it's just a temporary authorization hold. This security deposit is released after your visit and is only a precaution to ensure table availability for committed customers."
    },
    {
      question: "How does the bartender know my table?",
      answer: "When you scan your table's QR code, it creates a digital connection between your table location and your selected bartender, allowing them to deliver directly to you."
    },
    {
      question: "What are the benefits of choosing a specific bartender?", 
      answer: "Each bartender has unique expertise in different drink styles. Selecting a specialist means getting personalized recommendations and custom-crafted drinks suited to your taste preferences."
    },
    {
      question: "When is BarTap™ most valuable?",
      answer: "BarTap™ enhances your experience during busy nights, when celebrating special occasions, or anytime you prefer staying with your group instead of waiting at the bar."
    }
  ];

  // Show fewer items if in compact mode
  const displayFaqs = compact ? faqs.slice(0, 2) : faqs;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${className}`}
    >
      <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold mb-6 text-black dark:text-white`}>
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-4">
        {displayFaqs.map((faq, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            className="bg-muted/20 p-4 rounded-lg border border-border"
          >
            <h3 className="font-semibold mb-2">{faq.question}</h3>
            <p className="text-muted-foreground">{faq.answer}</p>
          </motion.div>
        ))}
      </div>
      
      {compact && (
        <div className="mt-4 text-center">
          <span className="text-sm text-primary hover:underline cursor-pointer">
            View all FAQs on the BarTap™ page
          </span>
        </div>
      )}
    </motion.div>
  );
}