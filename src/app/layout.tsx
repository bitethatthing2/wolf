import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/contexts/theme-context";
import { LocationProvider } from "@/contexts/LocationContext";
import { Toaster } from "@/components/ui/toaster";
import ClientScripts from "@/components/layout/ClientScripts";
import ClientComponentsWrapper from "@/components/layout/ClientComponentsWrapper";
import Script from "next/script";

// Optimize font loading with display: swap for better performance
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Side Hustle Bar | High-Energy Sports Bar • Restaurant • Nightclub",
  description: "Side Hustle Bar offers an exciting sports bar experience with great food, drinks, and entertainment. Visit us in Portland and Salem for the ultimate sports viewing, dining, and nightlife experience.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Side Hustle Bar",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: ["/favicon.ico"],
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png"
    },
  },
  // Add PWA metadata
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Side Hustle Bar",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#000000",
    "msapplication-tap-highlight": "no",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Allow users to zoom for accessibility
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  // Important: Remove themeColor since we're using a more compatible method in the head
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apple Touch Icons (single declaration to prevent duplicates) */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        
        {/* Manually add viewport meta tag to ensure it's included */}
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes" />
        
        {/* Manually add title and description to ensure they're included */}
        <title>Side Hustle Bar | High-Energy Sports Bar • Restaurant • Nightclub</title>
        <meta name="description" content="Side Hustle Bar offers an exciting sports bar experience with great food, drinks, and entertainment. Visit us in Portland and Salem for the ultimate sports viewing, dining, and nightlife experience." />
        
        {/* PWA meta tags - cross-browser compatible */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Side Hustle Bar" />
        <meta name="application-name" content="Side Hustle Bar" />
        
        {/* Theme colors using color-scheme meta tag (better cross-browser support) */}
        <meta name="color-scheme" content="dark light" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-navbutton-color" content="#000000" />
        {/* <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; connect-src 'self' https://*.elfsight.com https://static.elfsight.com https://*.elfsightcdn.com https://*.instagram.com https://*.google.com https://api.instagram.com https://*.googleapis.com; img-src 'self' https://*.elfsight.com https://*.elfsightcdn.com https://*.instagram.com https://*.cdninstagram.com https://*.google.com https://*.googleapis.com https://*.gstatic.com https://lh3.googleusercontent.com data:; style-src 'self' 'unsafe-inline' https://*.elfsight.com https://fonts.googleapis.com https://www.instagram.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.elfsight.com https://static.elfsight.com https://*.google.com https://*.gstatic.com https://www.instagram.com; frame-src 'self' https://*.google.com https://*.youtube.com https://*.instagram.com https://www.instagram.com https://maps.google.com; font-src 'self' https://fonts.gstatic.com data:;" /> */}
        {/* Temporarily disabling CSP for debugging - will be added back with proper configuration */}
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Pre-CSP Check - Run this before anything else to detect CSP issues */}
        <Script 
          src="/only_these/pre-csp-check.js"
          strategy="beforeInteractive"
          id="pre-csp-check"
        />
        
        {/* Service Worker Registration */}
        <Script 
          // src="/service-worker-registration.js" // Removed: deprecated duplicate registration script
          strategy="afterInteractive"
          id="service-worker-registration"
        />
        
        <ClientScripts />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="sidehustle-theme"
        >
          <LocationProvider>
            <ClientComponentsWrapper>
              {children}
            </ClientComponentsWrapper>
            <Toaster />
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
