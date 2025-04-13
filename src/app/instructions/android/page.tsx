import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AndroidInstructionsPage() {
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
          <h1 className="text-2xl sm:text-3xl font-bold text-bar-accent">Android Installation Guide</h1>
        </div>

        {/* Instructions Card */}
        <div className="bg-black/80 rounded-lg overflow-hidden border border-bar-accent/20 p-6 -webkit-backdrop-filter backdrop-filter backdrop-blur-sm">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-bar-accent mb-3">Step 1: Install from Banner</h2>
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="space-y-2 text-white/90">
                  <p>When you visit our website, you may see an installation banner at the bottom of your screen:</p>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>Look for the "Add Side Hustle Bar to Home screen" banner</li>
                    <li>Tap "Install" on the banner</li>
                    <li>Confirm by tapping "Add" on the popup</li>
                  </ol>
                </div>
                <div className="relative w-full sm:w-1/2 h-auto rounded-lg overflow-hidden border border-white/10 shadow-lg">
                  <Image 
                    src="/app-install-android-light.png" 
                    alt="Android Installation Banner" 
                    width={300} 
                    height={600}
                    priority
                    unoptimized
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </section>

            <div className="w-full border-t border-gray-800 my-6"></div>

            <section>
              <h2 className="text-xl font-semibold text-bar-accent mb-3">Step 2: Manual Installation</h2>
              <p className="text-white/90 mb-3">If you don't see the banner, you can install manually:</p>
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="space-y-2 text-white/90">
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>Tap the menu icon (<span className="inline-block text-center">⋮</span>) in the top right of Chrome</li>
                    <li>Select "Install app" or "Add to Home Screen" from the menu</li>
                    <li>Tap "Install" when prompted</li>
                    <li>The app will be added to your home screen</li>
                  </ol>
                </div>
                <div className="relative w-full sm:w-1/2 h-auto rounded-lg overflow-hidden border border-white/10 shadow-lg flex flex-col gap-4">
                  <div className="bg-gray-900 p-3 text-center rounded-lg">
                    <div className="flex justify-end mb-2">
                      <span className="inline-block text-center text-2xl">⋮</span>
                    </div>
                    <div className="border border-white/20 rounded-lg p-2 text-left">
                      <div className="py-1 px-2 flex items-center">
                        <span className="ml-2">Install app...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="w-full border-t border-gray-800 my-6"></div>

            <section>
              <h2 className="text-xl font-semibold text-bar-accent mb-3">Step 3: Enable Notifications</h2>
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="space-y-2 text-white/90">
                  <p className="font-medium text-bar-accent">After installing, enable notifications to stay updated:</p>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>When you first open the app, tap "Allow" when prompted for notifications</li>
                    <li>If you missed the prompt, tap the "Enable Notifications" button in the app</li>
                    <li>You can also enable notifications in your device settings:
                      <ul className="list-disc ml-5 mt-1">
                        <li>Open Settings > Apps > Side Hustle Bar > Notifications</li>
                        <li>Enable all notification categories</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                <div className="relative w-full sm:w-1/2 h-auto rounded-lg overflow-hidden border border-white/10 shadow-lg">
                  <div className="bg-gray-900 p-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-800 rounded-lg p-4 w-full max-w-[250px] mb-3">
                      <div className="text-center mb-2 font-medium">Allow notifications?</div>
                      <div className="flex justify-between gap-3">
                        <button className="px-4 py-2 bg-gray-700 rounded-md w-full">Block</button>
                        <button className="px-4 py-2 bg-bar-accent text-white rounded-md w-full">Allow</button>
                      </div>
                    </div>
                    <p className="text-sm text-white/60 text-center">
                      Tap "Allow" to receive updates about events and promotions
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="w-full border-t border-gray-800 my-6"></div>

            <section>
              <h2 className="text-xl font-semibold text-bar-accent mb-3">Step 4: Verify Installation</h2>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="space-y-2 text-white/90">
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>Look for the Side Hustle Bar icon on your home screen</li>
                    <li>Tap the icon to open the app</li>
                    <li>The app should open in fullscreen mode without browser controls</li>
                    <li>You should receive a welcome notification shortly after setup</li>
                  </ol>
                </div>
                <div className="relative w-full sm:w-1/2 h-auto rounded-lg overflow-hidden border border-white/10 shadow-lg flex justify-center items-center p-4 bg-gray-900">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-bar-accent to-bar-accent/70">
                    <Image 
                      src="/logo-main-dark.png" 
                      alt="App Icon" 
                      width={40} 
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-8 p-4 bg-bar-accent/10 rounded-lg border border-bar-accent/20">
              <h3 className="text-bar-accent font-semibold mb-2">Need Help?</h3>
              <p className="text-white/70 text-sm">
                If you're having trouble with the installation, please{' '}
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