"use client";

import React from 'react';
import Image from 'next/image'; 
import Link from 'next/link';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Phone, UtensilsCrossed, ShoppingBag, ArrowRight } from 'lucide-react'; 

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
      
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {/* Online Ordering Section */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="bg-muted/10 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
                <ShoppingBag className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Online Ordering</h2>
                <p className="text-muted-foreground">Get your favorite food delivered</p>
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
        
        {/* Table Ordering Section */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="bg-muted/10 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
                <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Table Ordering</h2>
                <p className="text-muted-foreground">Order directly from your table</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-between h-[calc(100%-76px)]">
            <div className="p-6">
              <div className="mb-6 aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/img_placeholder_event_default.jpg"
                  alt="Table ordering"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">Scan & Order</h3>
                  <p className="text-sm text-white/80">Quick, easy, and contactless</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Enjoy a seamless dining experience with our table ordering system. Simply scan the QR code at your table to browse our menu, place orders, and pay - all from your phone.
                </p>
                <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                  <li>No waiting for service</li>
                  <li>Easy bill splitting</li>
                  <li>Exclusive table ordering specials</li>
                </ul>
              </div>
            </div>
            
            <div className="p-6 border-t border-border">
              <Link href="/table-ordering">
                <Button className="w-full gap-2">
                  Learn More About Table Ordering
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Coming Soon Section */}
      <div className="mt-12 rounded-lg border border-border bg-muted/30 p-6 text-center">
        <h2 className="mb-2 text-xl font-bold">Coming Soon: Integrated Online Ordering</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          We're working on our own integrated online ordering system to make your experience even better. 
          Stay tuned for updates and exclusive promotions when we launch!
        </p>
      </div>
    </div>
  );
}