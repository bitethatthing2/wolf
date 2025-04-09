"use client";

import React from 'react';
import PageHeader from '@/components/common/PageHeader';

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
            {/* DoorDash Option */}
            <a 
              href="https://www.doordash.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center rounded-lg border p-4 text-center transition-colors hover:bg-muted/50"
            >
              <div className="mb-2 h-12 w-12">
                <img 
                  src="/doordash_icon-light.png" 
                  alt="DoorDash" 
                  className="h-full w-full object-contain dark:hidden"
                />
                <img 
                  src="/doordash_icon-light.png" 
                  alt="DoorDash" 
                  className="hidden h-full w-full object-contain dark:block"
                />
              </div>
              <h3 className="text-lg font-medium">DoorDash</h3>
              <p className="mt-1 text-sm text-muted-foreground">Delivery or pickup</p>
            </a>
            
            {/* Direct Order Option */}
            <a 
              href="tel:+15035551234" 
              className="flex flex-col items-center rounded-lg border p-4 text-center transition-colors hover:bg-muted/50"
            >
              <div className="mb-2 h-12 w-12 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium">Call Directly</h3>
              <p className="mt-1 text-sm text-muted-foreground">Place your order by phone</p>
            </a>
            
            {/* Table Ordering Option */}
            <div className="flex flex-col items-center rounded-lg border p-4 text-center transition-colors hover:bg-muted/50">
              <div className="mb-2 h-12 w-12 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <path d="M8 7v10"></path>
                  <path d="M16 7v10"></path>
                  <path d="M3 12h18"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium">Table Ordering</h3>
              <p className="mt-1 text-sm text-muted-foreground">Scan QR code at your table</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold">Coming Soon</h2>
          <p className="text-muted-foreground">
            We're working on an integrated online ordering system. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}