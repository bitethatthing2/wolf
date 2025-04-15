// Make BarTapProcess interactive: accepts step, setStep, selectedBartender, depositAmount, etc. and renders accordingly
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Beer, CreditCard, QrCode } from 'lucide-react';
import Image from 'next/image';
import bartenderIcon from '@/assets/icons/icon_bartender.svg';

interface Bartender {
  id: string;
  name: string;
  image: string;
  specialty: string;
  experience: string;
  rating: number;
  availability: string;
}

interface BarTapProcessProps {
  className?: string;
  compact?: boolean;
  step?: number;
  setStep?: (step: number) => void;
  selectedBartender?: string | null;
  setSelectedBartender?: (id: string) => void;
  depositAmount?: number;
  setDepositAmount?: (amount: number) => void;
  isNewUser?: boolean;
  setIsNewUser?: (val: boolean) => void;
  bartenders?: Bartender[];
  onIncreaseDeposit?: () => void;
  onDecreaseDeposit?: () => void;
}

const stepIcons = [
  QrCode,
  CreditCard,
  Beer
];

/**
 * Interactive BarTap 3-step process
 */
export default function BarTapProcess({
  className = "",
  compact = false,
  step = 1,
  setStep,
  selectedBartender,
  setSelectedBartender,
  depositAmount = 50,
  setDepositAmount,
  isNewUser = true,
  setIsNewUser,
  bartenders = [],
  onIncreaseDeposit,
  onDecreaseDeposit
}: BarTapProcessProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Stepper header
  const steps = [
    { title: 'Scan Table QR Code', desc: 'Scan the QR code at your table to begin your premium experience' },
    { title: 'Security Deposit', desc: 'Provide a card for a temporary hold (not a charge) - only processed if order is abandoned' },
    { title: 'Select Bartender', desc: 'Choose your preferred bartender or select "first available" for fastest service' }
  ];

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
      {/* Stepper nav */}
      <div className={`flex items-center justify-center gap-3 mb-8 ${compact ? 'hidden' : ''}`}>
        {steps.map((s, idx) => {
          const isActive = step === idx + 1;
          return (
            <button
              key={idx}
              onClick={() => setStep && setStep(idx + 1)}
              className={`flex flex-col items-center group focus:outline-none`}
              aria-label={`Go to step ${idx + 1}`}
              type="button"
            >
              <span
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 border-2 transition-colors
                  bg-white text-black border-primary shadow-lg
                `}
                style={{ boxShadow: isActive ? '0 0 0 2px var(--color-primary)' : undefined }}
              >
                {idx + 1}
              </span>
            </button>
          );
        })}
      </div>
      {/* Step content */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Step 1: Scanner */}
        <motion.div variants={itemVariants} className={`flex flex-col items-center text-center ${step !== 1 ? 'opacity-50 pointer-events-none' : ''}`}> 
          <div className="flex flex-col items-center mb-3">
            <span
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 border-2 transition-colors
                bg-white text-black border-primary shadow-lg
              `}
            >
              1
            </span>
          </div>
          <div className="flex-shrink-0 w-20 h-20 rounded-xl mb-3 bg-muted flex items-center justify-center border border-primary/30 relative">
            {/* SVG QR scanner frame */}
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
              <rect x="6" y="6" width="44" height="44" rx="10" stroke="currentColor" strokeWidth="2" className="text-primary" fill="none" />
              <rect x="18" y="18" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" className="text-primary/70" fill="none" />
              <rect x="25" y="25" width="6" height="6" rx="1" fill="currentColor" className="text-primary" />
            </svg>
          </div>
          <h3 className="font-bold mb-2 text-lg">{steps[0].title}</h3>
          <p className="text-muted-foreground text-sm">{steps[0].desc}</p>
        </motion.div>
        {/* Step 2: Deposit */}
        <motion.div variants={itemVariants} className={`flex flex-col items-center text-center ${step !== 2 ? 'opacity-50 pointer-events-none' : ''}`}> 
          <div className="flex flex-col items-center mb-3">
            <span
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 border-2 transition-colors
                bg-white text-black border-primary shadow-lg
              `}
            >
              2
            </span>
          </div>
          <div className="flex-shrink-0 w-20 h-20 rounded-xl mb-3 bg-muted flex flex-col items-center justify-center border border-primary/30">
            <CreditCard className="h-8 w-8 text-primary mb-1" />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={onDecreaseDeposit}
                className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="Decrease deposit"
                type="button"
              >-</button>
              <span className="font-bold text-lg">${depositAmount}</span>
              <button
                onClick={onIncreaseDeposit}
                className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="Increase deposit"
                type="button"
              >+</button>
            </div>
          </div>
          <h3 className="font-bold mb-2 text-lg">{steps[1].title}</h3>
          <p className="text-muted-foreground text-sm">{steps[1].desc}</p>
        </motion.div>
        {/* Step 3: Bartender selection */}
        <motion.div variants={itemVariants} className={`flex flex-col items-center text-center ${step !== 3 ? 'opacity-50 pointer-events-none' : ''}`}> 
          <div className="flex flex-col items-center mb-3">
            <span
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 border-2 transition-colors
                bg-white text-black border-primary shadow-lg
              `}
            >
              3
            </span>
          </div>
          <div className="flex-shrink-0 w-20 h-20 rounded-xl mb-3 bg-muted flex flex-col items-center justify-center border border-primary/30 overflow-hidden">
            <div className="w-full h-full flex flex-col gap-1 items-center justify-center">
              {bartenders && bartenders.length > 0 ? (
                <>
                  <span className="text-xs mb-1 text-muted-foreground">Choose:</span>
                  <div className="flex flex-col gap-1 w-full">
                    {bartenders.map(b => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBartender && setSelectedBartender(b.id)}
                        className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-primary/10 transition-colors w-full text-left
                          ${selectedBartender === b.id ? 'bg-primary text-white' : 'bg-white dark:bg-black text-primary'}
                        `}
                        aria-label={`Select bartender ${b.name}`}
                        type="button"
                      >
                        {b.image ? (
                          <img src={b.image} alt={b.name} width={24} height={24} className="rounded-full border border-border bg-white" />
                        ) : (
                          <img src={bartenderIcon.src || bartenderIcon} alt="Bartender icon" width={24} height={24} className="rounded-full border border-border bg-white" />
                        )}
                        <span className="font-semibold text-xs">{b.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">No bartenders available</span>
              )}
            </div>
          </div>
          <h3 className="font-bold mb-2 text-lg">{steps[2].title}</h3>
          <p className="text-muted-foreground text-sm">{steps[2].desc}</p>
        </motion.div>
      </div>
      {/* Step description */}
      {!compact && (
        <div className="mt-8 p-4 bg-black/5 dark:bg-white/5 rounded-lg text-sm text-center max-w-xl mx-auto">
          <p className="text-muted-foreground">
            {step === 1 && 'After scanning, you’ll be prompted to add a card for a temporary hold.'}
            {step === 2 && 'Set your deposit amount. This is a hold, not a charge, unless you abandon your order.'}
            {step === 3 && 'Choose your bartender or select "first available" for the fastest service.'}
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