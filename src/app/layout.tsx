import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/contexts/theme-context"; // Corrected import path
import { LocationProvider } from "@/contexts/LocationContext"; // Import LocationProvider
import { Toaster } from "@/components/ui/toaster";
import ClientScripts from "@/components/layout/ClientScripts";
import FramerMotionFixes from "@/components/layout/FramerMotionFixes";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Hustle Hard",
  description: "High-Energy Sports Bar • Restaurant • Nightclub",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hustle Hard",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" 
          enableSystem={false} // Disable system theme detection
          disableTransitionOnChange
        >
          {/* Wrap children with LocationProvider */}
          <LocationProvider>
            {children}
            <Toaster />
          </LocationProvider>
        </ThemeProvider>
        <FramerMotionFixes />
        <ClientScripts />
      </body>
    </html>
  );
}
