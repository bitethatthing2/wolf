// Refined: hero section is now a 2-column layout (text left, image right), stepper is always visible below, all theme rules enforced
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
    if (step === 3) setStep(3);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="BarTap Premium" 
        description="Stay with your friends and enjoy personalized drink service" 
      />
      {/* Hero Section: 2-column layout */}
      <section className="bg-muted/30 rounded-xl shadow-lg mb-10 p-0 md:p-0">
        <div className="flex flex-col md:flex-row gap-0 md:gap-8 items-stretch">
          {/* Left: Text */}
          <div className="flex-1 p-6 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">Enhanced Bar Experience, On Your Terms</h2>
            <p className="mb-4 text-muted-foreground">BarTap is our exclusive premium service that creates a more restaurant-like experience at the bar. Enjoy dedicated bartender service without leaving your table or your friends—perfect for busy nights or when you want a more personalized experience.</p>
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white/20 dark:bg-black/20 p-2 rounded-full">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-black dark:text-white">$50 Card Hold (Not a Charge)</h3>
                  <p className="text-sm text-muted-foreground">Only charged if you abandon your order</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white/20 dark:bg-black/20 p-2 rounded-full">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-black dark:text-white">Premium Bar Experience</h3>
                  <p className="text-sm text-muted-foreground">Choose your favorite bartender</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white/20 dark:bg-black/20 p-2 rounded-full">
                  <Beer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-black dark:text-white">Drinks Only Service</h3>
                  <p className="text-sm text-muted-foreground">Food orders can be placed separately</p>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Image */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-xs md:max-w-sm lg:max-w-md aspect-[4/3] rounded-xl overflow-hidden shadow-xl border border-border bg-white dark:bg-black">
              <Image
                src="/bartap.png"
                alt="BarTap Premium Service"
                width={400}
                height={300}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      {/* Stepper always visible, theme-consistent */}
      <div className="mb-16">
        <BarTapProcess 
          step={step}
          setStep={setStep}
          selectedBartender={selectedBartender}
          setSelectedBartender={handleSelectBartender}
          depositAmount={depositAmount}
          setDepositAmount={setDepositAmount}
          isNewUser={isNewUser}
          setIsNewUser={setIsNewUser}
          bartenders={bartenders}
          onIncreaseDeposit={handleIncreaseDeposit}
          onDecreaseDeposit={handleDecreaseDeposit}
          className="bg-muted/10"
        />
      </div>
      {/* Important Information */}
      <div className="mb-10">
        <BarTapInfo />
      </div>
      {/* Benefits Section */}
      <div className="mb-16">
        <BarTapBenefits />
      </div>
      {/* FAQ Section */}
      <div className="mb-16">
        <BarTapFAQ />
      </div>
    </div>
  );
}