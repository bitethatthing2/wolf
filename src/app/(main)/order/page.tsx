// Remove BarTap feature; only show online ordering info
"use client";

import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  url: string;
  lightIcon?: string;
  darkIcon?: string;
}

const deliveryOptions: DeliveryOption[] = [
  {
    id: 'doordash',
    name: 'DoorDash',
    description: 'Delivery or pickup',
    url: 'https://www.doordash.com/store/side-hustle-bar/',
    lightIcon: '/doordash-dark.png', 
    darkIcon: '/doordash-light.png', 
  },
  {
    id: 'postmates',
    name: 'Postmates',
    description: 'Delivery or pickup',
    url: 'https://postmates.com/store/side-hustle-bar/',
    lightIcon: '/postmates-dark.png', 
    darkIcon: '/postmates-light.png', 
  },
  {
    id: 'ubereats',
    name: 'Uber Eats',
    description: 'Delivery or pickup',
    url: 'https://www.ubereats.com/store/side-hustle-bar/',
    lightIcon: '/uber-eats-dark.png', 
    darkIcon: '/uber-eats-light.png', 
  }
];

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <PageHeader 
          title="Order Online" 
          description="Order your favorite food for pickup or delivery" 
        />
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-border overflow-hidden mb-8 bg-card/80 backdrop-blur-lg shadow-xl">
            <div className="bg-muted/10 p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary">
                  <ShoppingBag className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground">Food Ordering</h2>
                  <p className="text-muted-foreground">Get your favorite food delivered or for pickup</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid gap-6 sm:grid-cols-3">
                {deliveryOptions.map((option) => (
                  <a 
                    key={option.id}
                    href={option.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="h-auto w-full flex flex-col items-center p-5 hover:bg-muted/20 rounded-xl">
                      <div className="mb-3 flex h-16 w-16 items-center justify-center">
                        <div className="relative h-full w-full">
                          <Image 
                            src={
                              typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
                                ? option.darkIcon || option.lightIcon || ''
                                : option.lightIcon || option.darkIcon || ''
                            }
                            alt={`${option.name} Logo`} 
                            width={64}
                            height={64}
                            className="object-contain dark:hidden"
                          />
                          <Image 
                            src={
                              typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
                                ? option.lightIcon || option.darkIcon || ''
                                : option.darkIcon || option.lightIcon || ''
                            }
                            alt={`${option.name} Logo`} 
                            width={64}
                            height={64}
                            className="object-contain hidden dark:block"
                          />
                        </div>
                      </div>
                      <span className="font-semibold text-card-foreground text-lg mb-1">{option.name}</span>
                      <span className="text-muted-foreground text-base">{option.description}</span>
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}