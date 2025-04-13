"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import { 
  Beer, 
  CreditCard, 
  Plus, 
  Minus, 
  Star, 
  Users, 
  Clock, 
  DollarSign,
  ChevronRight
} from 'lucide-react';

interface Bartender {
  id: string;
  name: string;
  image: string;
  specialty: string;
  experience: string;
  rating: number;
  availability: string;
}

const bartenders: Bartender[] = [
  {
    id: 'alex-taylor',
    name: 'Alex Taylor',
    image: '/assets/images/img_placeholder_bartender.jpg',
    specialty: 'Craft Cocktails',
    experience: '5+ years',
    rating: 4.8,
    availability: 'Mon-Fri'
  },
  {
    id: 'jamie-rodriguez',
    name: 'Jamie Rodriguez',
    image: '/assets/images/img_placeholder_bartender.jpg',
    specialty: 'Whiskey Expert',
    experience: '8+ years',
    rating: 4.9,
    availability: 'Wed-Sun'
  },
  {
    id: 'morgan-patel',
    name: 'Morgan Patel',
    image: '/assets/images/img_placeholder_bartender.jpg',
    specialty: 'Mixology',
    experience: '3+ years',
    rating: 4.7,
    availability: 'Thu-Mon'
  },
  {
    id: 'jordan-lee',
    name: 'Jordan Lee',
    image: '/assets/images/img_placeholder_bartender.jpg',
    specialty: 'Beer Connoisseur',
    experience: '4+ years',
    rating: 4.6,
    availability: 'Fri-Tue'
  }
];

export default function BarTapPage() {
  const [selectedBartender, setSelectedBartender] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState(20);

  const handleIncreaseDeposit = () => {
    setDepositAmount(prev => Math.min(prev + 10, 100));
  };

  const handleDecreaseDeposit = () => {
    setDepositAmount(prev => Math.max(prev - 10, 10));
  };

  const handleSelectBartender = (id: string) => {
    setSelectedBartender(id);
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="BarTap™" 
        description="Reserve your personal bartender for an exceptional experience" 
      />
      
      <div className="mt-8 max-w-3xl mx-auto">
        {/* Explanation Section */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-r from-black/95 to-black/85 dark:from-white/95 dark:to-white/85 p-6 rounded-2xl mb-10 text-white dark:text-black shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-3">What is BarTap™?</h2>
          <p className="mb-4">BarTap™ is our premium service that allows you to reserve a personal bartender for your visit. Place a deposit to secure priority service, personalized recommendations, and a truly exceptional drinking experience.</p>
          
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-white/20 dark:bg-black/20 p-2 rounded-full">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Pre-Pay Deposit</h3>
                <p className="text-sm text-white/80 dark:text-black/70">Secure your service with a refundable deposit</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-white/20 dark:bg-black/20 p-2 rounded-full">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Personal Service</h3>
                <p className="text-sm text-white/80 dark:text-black/70">Skip the line with dedicated attention</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-white/20 dark:bg-black/20 p-2 rounded-full">
                <Beer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Expert Recommendations</h3>
                <p className="text-sm text-white/80 dark:text-black/70">Get personalized drink suggestions</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Bartender Selection */}
        <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Select Your Bartender</h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
        >
          {bartenders.map((bartender) => (
            <motion.div
              key={bartender.id}
              variants={itemVariants} 
              onClick={() => handleSelectBartender(bartender.id)}
              className={`relative overflow-hidden rounded-xl border border-border transition-all hover:shadow-md cursor-pointer ${
                selectedBartender === bartender.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="relative h-28 w-full overflow-hidden bg-muted">
                <Image
                  src={bartender.image}
                  alt={bartender.name}
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{bartender.name}</h3>
                    <p className="text-sm text-muted-foreground">{bartender.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-primary" />
                    <span className="text-xs font-medium">{bartender.rating}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{bartender.experience}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{bartender.availability}</span>
                  </div>
                </div>
              </div>
              
              {selectedBartender === bartender.id && (
                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Selected
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
        
        {/* Deposit Amount */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-muted/30 rounded-xl p-6 border border-border mb-10"
        >
          <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Set Your Deposit</h2>
          
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">Amount:</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleDecreaseDeposit}
                className="bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                disabled={depositAmount <= 10}
                aria-label="Decrease deposit amount"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1 text-2xl font-bold">
                <DollarSign className="w-5 h-5" />
                <span>{depositAmount}</span>
              </div>
              
              <button 
                onClick={handleIncreaseDeposit}
                className="bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                disabled={depositAmount >= 100}
                aria-label="Increase deposit amount"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Deposit Amount</span>
              <span className="font-medium">${depositAmount}.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Service Fee</span>
              <span className="font-medium">$2.00</span>
            </div>
            <div className="h-px bg-border my-3"></div>
            <div className="flex justify-between items-center font-bold">
              <span>Total</span>
              <span>${depositAmount + 2}.00</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground mb-6">
            <p>Your deposit amount is fully refundable and will be applied to your bar tab. The $2 service fee is non-refundable.</p>
          </div>
          
          <Button 
            variant="hustle" 
            className="w-full flex items-center justify-center gap-2"
            disabled={!selectedBartender}
          >
            <span>Reserve Your Bartender</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
        
        {/* How It Works */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">How It Works</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">1</div>
              <div>
                <h3 className="font-semibold mb-1">Select Your Bartender</h3>
                <p className="text-muted-foreground">Choose from our experienced team based on specialty and availability</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">2</div>
              <div>
                <h3 className="font-semibold mb-1">Set Your Deposit</h3>
                <p className="text-muted-foreground">Choose an amount that will be applied to your drinks</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">3</div>
              <div>
                <h3 className="font-semibold mb-1">Complete Reservation</h3>
                <p className="text-muted-foreground">Receive confirmation and instructions for your visit</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">4</div>
              <div>
                <h3 className="font-semibold mb-1">Enjoy Premium Service</h3>
                <p className="text-muted-foreground">Skip the line and enjoy personalized service during your visit</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 