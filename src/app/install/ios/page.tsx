import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function IOSInstructionsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="text-bar-accent hover:text-bar-accent/80 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-bar-accent">iOS Installation Guide</h1>
        </div>

        {/* Instructions Card */}
        <div className="bg-black/80 rounded-lg overflow-hidden border border-bar-accent/20 p-6">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-bar-accent mb-3">Step 1: Open Share Menu</h2>
              <div className="flex flex-col gap-6">
                {/* Share button instruction */}
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="space-y-2 text-white/90">
                    <p>1. Open Safari and visit <span className="text-bar-accent">thesidehustlebar.com</span></p>
                    <p>2. Tap the Share button <span className="inline-block w-5 h-5"><svg viewBox="0 0 20 20" fill="currentColor" className="text-bar-accent"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/></svg></span> at the bottom center of your screen</p>
                    <p className="text-white/70 text-sm italic mt-2">This will open the share menu shown in the image</p>
                  </div>
                  <div className="relative w-full sm:w-1/2 h-auto rounded-lg overflow-hidden border border-white/10 shadow-lg">
                    <Image 
                      src="/share-ios.png" 
                      alt="iOS Safari Share Button" 
                      width={500} 
                      height={300}
                      priority
                      unoptimized
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-bar-accent mb-3">Step 2: Add to Home Screen</h2>
              <div className="flex flex-col gap-6">
                {/* Add to Home Screen instruction */}
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="space-y-2 text-white/90">
                    <p>1. In the share menu, scroll down and find <span className="font-medium">&quot;Add to Home Screen&quot;</span> (highlighted)</p>
                    <p>2. Tap on <span className="font-medium">&quot;Add to Home Screen&quot;</span></p>
                    <p>3. On the next screen, tap <span className="font-medium">&quot;Add&quot;</span> in the top right corner</p>
                  </div>
                  <div className="relative w-full sm:w-1/2 h-auto rounded-lg overflow-hidden border border-white/10 shadow-lg">
                    <Image 
                      src="/ios-add-homescreen.png" 
                      alt="iOS Add to Home Screen Option" 
                      width={500} 
                      height={300}
                      priority
                      unoptimized
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-bar-accent mb-3">Step 3: Enable Notifications</h2>
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="space-y-2 text-white/90">
                  <p className="font-medium text-bar-accent">Important: After adding to your home screen, you must:</p>
                  <p>1. Open the Side Hustle Bar app from your home screen</p>
                  <p>2. When the button appears, tap <span className="font-medium">&quot;Enable Notifications&quot;</span> as shown</p>
                  <p className="text-white/70 text-sm italic mt-2">This step is required to receive updates and special offers</p>
                </div>
                <div className="relative w-full sm:w-1/2 h-auto rounded-lg overflow-hidden border border-white/10 shadow-lg bg-gray-900 flex items-center justify-center p-6">
                  {/* Enable Notifications Button Image */}
                  <div className="w-full max-w-[300px] mx-auto">
                    <div className="bg-transparent w-full text-white text-center py-3 px-5 rounded flex items-center justify-center gap-2 border border-white/20">
                      <Image 
                        src="/only_these/logos/menu_icon.png" 
                        alt="Menu Icon" 
                        width={24} 
                        height={24}
                        unoptimized
                        className="w-6 h-6"
                      />
                      <span className="font-medium text-lg">&quot;Enable Notifications&quot;</span>
                    </div>
                    <p className="text-sm text-white/60 text-center mt-4">
                      Tap this button when it appears after opening the app
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Welcome to the Pack Message */}
            <section className="bg-bar-accent/10 rounded-lg p-6 border border-bar-accent/30">
              <div className="flex items-center gap-3 mb-3">
                <Image 
                  src="/only_these/logos/welcome_to_pack.png" 
                  alt="Wolf Icon" 
                  width={40} 
                  height={40} 
                  className="w-8 h-8 object-contain mr-2"
                  unoptimized
                />
                <h2 className="text-xl font-semibold text-bar-accent">Welcome to the Pack!</h2>
              </div>
              <p className="text-white/90 mb-2">
                If you&apos;ve followed all the steps, congratulations! We&apos;ll be howling at you with all the latest hustle news and updates.
              </p>
              <p className="text-white/90">
                We have some major things in the works. Mr. and Ms. Hustle are making future memories as we speak.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-bar-accent mb-3">Step 4: Verify Installation</h2>
              <div className="space-y-2 text-white/90">
                <p>1. Look for the Side Hustle Bar icon on your home screen</p>
                <p>2. Open the app by tapping on the icon</p>
                <p>3. Verify that the app loads fully with all functionality</p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-bar-accent/10 rounded-lg border border-bar-accent/20">
              <h3 className="text-bar-accent font-semibold mb-2">Need Help?</h3>
              <p className="text-white/70 text-sm">
                If you&apos;re having trouble with the installation, please{' '}
                <Link href="/contact" className="text-bar-accent hover:text-bar-accent/80 underline">
                  contact our support team
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
