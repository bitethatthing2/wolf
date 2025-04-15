"use client";

import React from 'react';
import Image from 'next/image'; 
import Link from 'next/link';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Phone, UtensilsCrossed, ShoppingBag, ArrowRight, Beer } from 'lucide-react';
import { BarTapProcess } from '@/components/features/bartap';

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  url: string;
  icon?: string;
  iconClass?: string;
  lightIcon?: string;
  darkIcon?: string;
}

const deliveryOptions: DeliveryOption[] = [
  {
    id: 'doordash',
    name: 'DoorDash',
    description: 'Delivery or pickup',
    url: 'https://www.doordash.com/store/side-hustle-bar/',
    icon: '/doordash-svgrepo-com.svg',
    iconClass: 'invert-0 dark:invert' // Black icon that needs to be inverted in dark mode
  },
  {
    id: 'postmates',
    name: 'Postmates',
    description: 'Delivery or pickup',
    url: 'https://postmates.com/store/side-hustle-bar/',
    icon: '/Postmates--Streamline-Simple-Icons (1).svg',
    iconClass: 'invert-0 dark:invert' // Black icon that needs to be inverted in dark mode
  },
  {
    id: 'ubereats',
    name: 'Uber Eats',
    description: 'Delivery or pickup',
    url: 'https://www.ubereats.com/store/side-hustle-bar/',
    // Using separate PNG images for light and dark modes
    lightIcon: '/uber-eats-for-light-screen.png',
    darkIcon: '/uber-eats-for-dark-screen.png'
  }
];

export default function OrderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Order Online" 
        description="Order your favorite food for pickup or delivery" 
      />
      
      <div className="mt-12 max-w-3xl mx-auto">
        {/* Food Ordering Section */}
        <div className="rounded-xl border border-border overflow-hidden mb-8">
          <div className="bg-muted/10 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
                <ShoppingBag className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Food Ordering</h2>
                <p className="text-muted-foreground">Get your favorite food delivered or for pickup</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {deliveryOptions.map((option) => (
                <a 
                  key={option.id}
                  href={option.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block" 
                >
                  <Button variant="outline" className="h-auto w-full flex flex-col items-center p-4 hover:bg-muted/20">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center"> 
                      <div className="relative h-full w-full">
                        {option.id === 'ubereats' && option.lightIcon && option.darkIcon ? (
                          <>
                            {/* Light mode Uber Eats image */}
                            <Image 
                              src={option.lightIcon} 
                              alt={`${option.name} Logo Light`}
                              width={64}
                              height={64}
                              className="object-contain dark:hidden"
                            />
                            {/* Dark mode Uber Eats image */}
                            <Image 
                              src={option.darkIcon} 
                              alt={`${option.name} Logo Dark`}
                              width={64}
                              height={64}
                              className="object-contain hidden dark:block"
                            />
                          </>
                        ) : option.icon ? (
                          <Image 
                            src={option.icon} 
                            alt={`${option.name} Logo`}
                            width={64}
                            height={64}
                            className={`object-contain ${option.iconClass || ''}`}
                          />
                        ) : null}
                      </div>
                    </div>
                    <h3 className="text-lg font-medium">{option.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{option.description}</p> 
                  </Button>
                </a>
              ))}
            </div>
            
            <div className="mt-6">
              <a 
                href="tel:+15035551234" 
                className="flex w-full items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/10" 
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-black"> 
                    <Phone className="h-5 w-5 stroke-black dark:stroke-white" /> 
                  </div>
                  <div>
                    <h3 className="font-medium">Call Directly</h3>
                    <p className="text-sm text-muted-foreground">Place your order by phone</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>
        
        {/* BarTap Promo Section */}
        <div className="rounded-xl border border-border overflow-hidden mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="bg-black/10 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
                <Beer className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">BarTap™ Premium</h2>
                <p className="text-muted-foreground">Skip the line with our premium drink service</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2 aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="/bartap.png"
                  alt="Bar service"
                  fill
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">Premium Bar Experience</h3>
                  <p className="text-sm text-white/80">Reserve your personal bartender</p>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 space-y-4">
                <Link href="/bar-tap" className="block mb-4">
                  <BarTapProcess compact />
                </Link>
                
                <Link href="/bar-tap">
                  <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                    Learn More About BarTap™
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coming Soon Section */}
        <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
          <h2 className="mb-2 text-xl font-bold">Coming Soon: Integrated Online Ordering</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We're working on our own integrated online ordering system to make your experience even better. 
            Stay tuned for updates and exclusive promotions when we launch!
          </p>
        </div>
      </div>
    </div>
  );
}