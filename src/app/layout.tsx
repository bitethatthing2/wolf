import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/contexts/theme-context";
import { LocationProvider } from "@/contexts/LocationContext";
import { Toaster } from "@/components/ui/toaster";
import ClientScripts from "@/components/layout/ClientScripts";
import ClientComponentsWrapper from "@/components/layout/ClientComponentsWrapper";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Side Hustle Bar",
  description: "High-Energy Sports Bar • Restaurant • Nightclub",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Side Hustle Bar",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/splash_screens/icon.png",
  },
  // Add PWA metadata
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Side Hustle Bar",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
    "msapplication-tap-highlight": "no",
  }
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
          disableTransitionOnChange
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
