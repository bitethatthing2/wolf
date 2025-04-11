import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/contexts/theme-context";
import { LocationProvider } from "@/contexts/LocationContext";
import { Toaster } from "@/components/ui/toaster";
import ClientScripts from "@/components/layout/ClientScripts";

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
            {children}
            <Toaster />
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
