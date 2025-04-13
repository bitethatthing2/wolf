"use client";

import React from 'react';
import Image from 'next/image'; 
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Phone, UtensilsCrossed } from 'lucide-react'; 

export default function OrderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Order Online" description="Order your favorite food for pickup or delivery" />
      
      <div className="mt-8 grid gap-6">
        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold">Order Options</h2>
          <p className="mb-6 text-muted-foreground">
            Choose your preferred ordering method below:
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {/* DoorDash Option - Restyled */}
            <a 
              href="https://www.doordash.com/store/placeholder-store-name/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block" 
            >
              <Button variant="default" className="h-auto w-full flex flex-col items-center p-4">
                {/* Re-added p-1 to slightly shrink icon */}
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-black p-1"> 
                  <div className="relative h-full w-full">
                    {/* Light Mode Icon */}
                    <Image 
                      src="/delivery-doordash-light.png" 
                      alt="DoorDash Logo Light"
                      fill
                      className="object-contain dark:hidden" // Hide in dark mode
                    />
                    {/* Dark Mode Icon (Updated filename) */}
                    <Image 
                      src="/delivery-doordash-dark.png" 
                      alt="DoorDash Logo Dark"
                      fill
                      className="object-contain hidden dark:block" // Show only in dark mode
                    />
                  </div>
                </div>
                <h3 className="text-lg font-medium">DoorDash</h3>
                <p className="mt-1 text-sm opacity-80">Delivery or pickup</p> 
              </Button>
            </a>

            {/* Postmates Option - Restyled */}
            <a 
              href="https://postmates.com/store/placeholder-store-name/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block" 
            >
              <Button variant="default" className="h-auto w-full flex flex-col items-center p-4">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-black"> 
                  <div className="relative h-full w-full">
                    {/* Light Mode Icon */}
                    <Image 
                      src="/delivery-postmates-light.png" 
                      alt="Postmates Logo Light"
                      fill
                      className="object-contain dark:hidden" // Hide in dark mode
                    />
                    {/* Dark Mode Icon (Updated filename) */}
                    <Image 
                      src="/delivery-postmates-dark.png" 
                      alt="Postmates Logo Dark"
                      fill
                      className="object-contain hidden dark:block" // Show only in dark mode
                    />
                  </div>
                </div>
                <h3 className="text-lg font-medium">Postmates</h3>
                <p className="mt-1 text-sm opacity-80">Delivery or pickup</p> 
              </Button>
            </a>

            {/* Uber Eats Option - Added back with PNGs */}
            <a 
              href="https://www.ubereats.com/store/placeholder-store-name/" // Replace with actual Uber Eats link
              target="_blank" 
              rel="noopener noreferrer"
              className="block" 
            >
              <Button variant="default" className="h-auto w-full flex flex-col items-center p-4">
                {/* Icon container WITHOUT bg-white */}
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full"> 
                  <div className="relative h-full w-full">
                    {/* Light Mode Icon */}
                    <Image 
                      src="/delivery-ubereats-light.png" // Light theme icon
                      alt="Uber Eats Logo Light"
                      fill
                      className="object-contain dark:hidden" // Hide in dark mode
                    />
                    {/* Dark Mode Icon */}
                    <Image 
                      src="/delivery-ubereats-dark.png" // Dark theme icon
                      alt="Uber Eats Logo Dark"
                      fill
                      className="object-contain hidden dark:block" // Show only in dark mode
                    />
                  </div>
                </div>
                <h3 className="text-lg font-medium">Uber Eats</h3>
                <p className="mt-1 text-sm opacity-80">Delivery or pickup</p> 
              </Button>
            </a>

            {/* Direct Order Option - Restyled */}
            <a 
              href="tel:+15035551234" // Replace with actual phone number
              className="block" // Let button control styling
            >
              <Button variant="default" className="h-auto w-full flex flex-col items-center p-4">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-black"> 
                  {/* Updated icon color: black light, white dark */}
                  <Phone className="h-6 w-6 stroke-black dark:stroke-white" /> 
                </div>
                <h3 className="text-lg font-medium">Call Directly</h3>
                <p className="mt-1 text-sm opacity-80">Place your order by phone</p> {/* Adjusted sub-text */} 
              </Button>
            </a>
            
            {/* Table Ordering Option - Restyled */}
            <Button variant="default" className="h-auto w-full flex flex-col items-center p-4">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-black"> 
                {/* Updated icon color: black light, white dark */}
                <UtensilsCrossed className="h-6 w-6 stroke-black dark:stroke-white" /> 
              </div>
              <h3 className="text-lg font-medium">Table Ordering</h3>
              <p className="mt-1 text-sm opacity-80">Scan QR code at your table</p> {/* Adjusted sub-text */} 
            </Button>
          </div>
        </div>
        
        {/* Coming Soon Section - Adjusted container style */}
        <div className="rounded-lg border p-6"> {/* Removed shadow-sm */} 
          <h2 className="mb-4 text-2xl font-bold">Coming Soon</h2>
          <p className="text-muted-foreground">
            We're working on an integrated online ordering system. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}