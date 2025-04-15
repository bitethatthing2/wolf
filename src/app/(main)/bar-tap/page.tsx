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
  ChevronRight,
  InfoIcon
} from 'lucide-react';
import { BarTapProcess, BarTapBenefits, BarTapInfo, BarTapFAQ } from '@/components/features/bartap';

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
  const [depositAmount, setDepositAmount] = useState(50);
  const [isNewUser, setIsNewUser] = useState(true);
  const [step, setStep] = useState(1);

  const handleIncreaseDeposit = () => {
    setDepositAmount(prev => Math.min(prev + 10, 100));
  };

  const handleDecreaseDeposit = () => {
    setDepositAmount(prev => Math.max(prev - 10, isNewUser ? 50 : 20));
  };

  const handleSelectBartender = (id: string) => {
    setSelectedBartender(id);
    if (step === 3) setStep(3); // Keep on same step after selection
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
        title="BarTap™ Premium" 
        description="Stay with your friends and enjoy personalized drink service" 
      />
      
      <div className="mt-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-r from-black/95 to-black/85 dark:from-white/95 dark:to-white/85 p-8 rounded-2xl mb-10 text-white dark:text-black shadow-lg"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Enhanced Bar Experience, On Your Terms</h2>
              <p className="mb-4">BarTap™ is our exclusive premium service that creates a more restaurant-like experience at the bar. Enjoy dedicated bartender service without leaving your table or your friends—perfect for busy nights or when you want a more personalized experience.</p>
              
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-white/20 dark:bg-black/20 p-2 rounded-full">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">$50 Card Hold (Not a Charge)</h3>
                    <p className="text-sm text-white/80 dark:text-black/70">Only charged if you abandon your order</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-white/20 dark:bg-black/20 p-2 rounded-full">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Premium Bar Experience</h3>
                    <p className="text-sm text-white/80 dark:text-black/70">Choose your favorite bartender</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-white/20 dark:bg-black/20 p-2 rounded-full">
                    <Beer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Drinks Only Service</h3>
                    <p className="text-sm text-white/80 dark:text-black/70">Food orders can be placed separately</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative aspect-video md:aspect-square rounded-xl overflow-hidden">
              <Image
                src="/bartap.png"
                alt="BarTap Premium Service"
                fill
                quality={90}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-black/50 dark:bg-white/50 backdrop-blur-sm rounded-lg p-4 text-white dark:text-black">
                  <h3 className="text-xl font-bold">Friday & Saturday</h3>
                  <p className="text-sm">Beat the weekend crowd!</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Important Information */}
        <div className="mb-10">
          <BarTapInfo />
        </div>
        
        {/* Interactive 3-Step Process */}
        <div className="mb-16">
          <div className="border border-border rounded-xl overflow-hidden bg-muted/5">
            <div className="bg-muted/10 p-6">
              <h2 className="text-2xl font-bold text-black dark:text-white">How BarTap™ Works - 3 Simple Steps</h2>
            </div>
            
            {/* Step Indicator */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between max-w-2xl mx-auto mb-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step === 1 ? 'bg-primary text-white' : 'bg-primary/20 text-primary'} text-xl font-bold`}>1</div>
                <div className={`h-1 flex-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step === 2 ? 'bg-primary text-white' : 'bg-primary/20 text-primary'} text-xl font-bold`}>2</div>
                <div className={`h-1 flex-1 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step === 3 ? 'bg-primary text-white' : 'bg-primary/20 text-primary'} text-xl font-bold`}>3</div>
              </div>
              <div className="flex justify-between max-w-2xl mx-auto mb-6 text-center">
                <div className="w-24">Scan QR Code</div>
                <div className="w-24">Security Deposit</div>
                <div className="w-24">Select Bartender</div>
              </div>
            </div>
            
            {/* Step Content */}
            <div className="p-6">
              {step === 1 && (
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/2">
                    <h3 className="text-xl font-bold mb-3 text-black dark:text-white">Step 1: Scan Your Table's QR Code</h3>
                    <p className="text-muted-foreground mb-4">
                      Find the QR code at your table to begin your BarTap™ experience. Each table has a unique identifier that helps us provide accurate service.
                    </p>
                    
                    <div className="rounded-lg border border-border p-4 mb-6">
                      <h4 className="font-medium mb-2">Table Sections</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                          <span className="text-sm">Main Bar (100s)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-red-500"></div>
                          <span className="text-sm">VIP Section (200s)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-500"></div>
                          <span className="text-sm">Lounge (300s)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-purple-500"></div>
                          <span className="text-sm">Patio (400s)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <div className="rounded-lg overflow-hidden border-4 border-primary w-56 h-56 relative">
                        <Image
                          src="/bartap.png"
                          alt="QR Code Scanner"
                          fill
                          quality={90}
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="text-white text-center p-4">
                            <div className="mb-3 animate-bounce">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                            <p>Click to activate camera</p>
                            <p className="text-xs mt-2">Scan your table's QR code</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 text-center max-w-xs">
                      Your camera will open to scan the QR code at your table
                    </p>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/2">
                    <h3 className="text-xl font-bold mb-3 text-black dark:text-white">Step 2: Security Deposit</h3>
                    <p className="text-muted-foreground mb-4">
                      We place a temporary authorization hold on your card – not a charge. This is released after your visit and only processed if you abandon your order.
                    </p>
                    
                    <div className="flex items-center mb-6">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={!isNewUser}
                          onChange={() => {
                            setIsNewUser(!isNewUser);
                            setDepositAmount(isNewUser ? 20 : 50);
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary relative"></div>
                        <span className="ml-3 text-sm font-medium text-black dark:text-white">I'm a returning user</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2">
                    <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg mb-4">
                      <div className="flex items-center mb-3">
                        <CreditCard className="w-5 h-5 mr-2 text-muted-foreground" />
                        <span className="font-medium">Security Hold (Not a Charge)</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Selected Amount</span>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={handleDecreaseDeposit}
                            className="bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 h-8 w-8 rounded-full flex items-center justify-center transition-colors"
                            disabled={depositAmount <= (isNewUser ? 50 : 20)}
                            aria-label="Decrease deposit amount"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <div className="flex items-center gap-1 text-xl font-bold">
                            <DollarSign className="w-4 h-4" />
                            <span>{depositAmount}</span>
                          </div>
                          
                          <button 
                            onClick={handleIncreaseDeposit}
                            className="bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 h-8 w-8 rounded-full flex items-center justify-center transition-colors"
                            disabled={depositAmount >= 100}
                            aria-label="Increase deposit amount"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Service Fee</span>
                        <span className="font-medium">$2.00</span>
                      </div>
                      <div className="h-px bg-border my-3"></div>
                      <div className="flex justify-between items-center font-bold">
                        <span>Total Hold (Not Charged)</span>
                        <span>${depositAmount + 2}.00</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The hold will be released immediately after your visit. It's only processed if you abandon your order without canceling. You'll pay for drinks normally when served.
                    </p>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div>
                  <h3 className="text-xl font-bold mb-3 text-black dark:text-white">Step 3: Select Your Bartender</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl">
                    Choose a bartender based on their specialty or select "First Available" for fastest service. Each bartender has unique expertise to create your perfect drink experience.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div 
                      onClick={() => handleSelectBartender('first-available')}
                      className={`relative overflow-hidden rounded-xl border border-border transition-all hover:shadow-md cursor-pointer bg-primary/5 ${
                        selectedBartender === 'first-available' ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <div className="p-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-1">First Available</h4>
                        <p className="text-muted-foreground text-xs mb-2">Fastest service option</p>
                        <div className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                          Recommended
                        </div>
                        
                        {selectedBartender === 'first-available' && (
                          <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                            Selected
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {bartenders.slice(0, 2).map((bartender) => (
                      <div
                        key={bartender.id}
                        onClick={() => handleSelectBartender(bartender.id)}
                        className={`relative overflow-hidden rounded-xl border border-border transition-all hover:shadow-md cursor-pointer ${
                          selectedBartender === bartender.id ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{bartender.name}</h4>
                            <div className="flex items-center gap-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                              <Star className="w-3 h-3 fill-primary" />
                              <span className="text-xs font-medium">{bartender.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{bartender.specialty}</p>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{bartender.experience}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{bartender.availability}</span>
                            </div>
                          </div>
                          
                          {selectedBartender === bartender.id && (
                            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                              Selected
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Step Navigation */}
            <div className="p-6 border-t border-border">
              <div className="flex justify-between max-w-md mx-auto">
                <Button 
                  variant="outline"
                  disabled={step === 1}
                  onClick={() => setStep(prev => prev - 1)}
                >
                  Previous Step
                </Button>
                
                {step < 3 ? (
                  <Button 
                    variant="hustle"
                    onClick={() => setStep(prev => prev + 1)}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    variant="hustle"
                    disabled={!selectedBartender}
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Benefits Section */}
        <div className="mb-10">
          <BarTapBenefits />
        </div>
        
        {/* FAQ Section */}
        <div className="mt-12 mb-8">
          <BarTapFAQ />
        </div>
      </div>
    </div>
  );
} 