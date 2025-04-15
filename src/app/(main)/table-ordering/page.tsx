"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import { QrCode, Utensils, InfoIcon, Beer } from 'lucide-react';
import Link from 'next/link';
import { BarTapProcess } from '@/components/features/bartap';

export default function TableOrderingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Food Table Ordering" 
        description="Scan the QR code at your table to order food directly from our menu" 
      />
      
      <div className="mx-auto mt-12 max-w-3xl">
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-6 rounded-xl border-4 border-primary bg-white p-4">
                <div className="relative h-48 w-48">
                  <Image
                    src="/assets/icons/icon_feature_qrcode.svg"
                    alt="Sample QR Code"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <h2 className="mb-2 text-xl font-bold">Scan Me</h2>
              <p className="text-sm text-muted-foreground">
                This is a sample QR code. At Side Hustle, you'll find a unique QR code at your table.
              </p>
            </div>
            
            {/* Instructions Section */}
            <div className="bg-muted/30 p-8">
              <h2 className="mb-4 text-xl font-bold">How Food Ordering Works</h2>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    1
                  </div>
                  <p>Find the QR code on your table's stand or menu</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    2
                  </div>
                  <p>Scan it with your phone's camera</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    3
                  </div>
                  <p>Browse our food menu and select your items</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    4
                  </div>
                  <p>Pay securely through your phone</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    5
                  </div>
                  <p>We'll bring your food right to your table</p>
                </li>
              </ol>
            </div>
          </div>
          
          <div className="border-t border-border bg-muted/10 p-6">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <h3 className="text-lg font-semibold">Need assistance?</h3>
                <p className="text-sm text-muted-foreground">Our staff is always happy to help</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href="/order">
                  <Button variant="outline" className="gap-2">
                    <InfoIcon className="h-4 w-4" />
                    Food Delivery Options
                  </Button>
                </Link>
                <Link href="/bar-tap">
                  <Button variant="default" className="gap-2">
                    <Beer className="h-4 w-4" />
                    BarTap™ Drink Service
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 rounded-lg border border-border bg-muted/30 p-6">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
              <Utensils className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-semibold">Food Table Ordering Benefits</h3>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>No waiting for food service - order at your own pace</li>
                <li>Easily split food bills between friends</li>
                <li>View detailed food menu items with photos</li>
                <li>Special food offers exclusive to table ordering</li>
              </ul>
              <p className="mt-4 text-sm font-medium text-primary">
                <Link href="/bar-tap" className="flex items-center gap-2 hover:underline">
                  <Beer className="w-4 h-4" />
                  For premium drink service, use the BarTap™ feature - a simple 3-step process
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
