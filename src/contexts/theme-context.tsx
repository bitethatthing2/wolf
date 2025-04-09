"use client"; // Required for client-side theme management

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

// Re-exporting the provider from next-themes under a local name
// This pattern allows easy swapping or extension later if needed.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class" // Apply theme via class (works with Tailwind dark: variant)
      defaultTheme="dark" // Default to dark theme for our black/white aesthetic
      // enableSystem // Removed hardcoded prop - allow override from layout
      {...props} // Pass any other props through
    >
      {children}
    </NextThemesProvider>
  );
}

// Re-export the useTheme hook for convenience
export { useTheme };