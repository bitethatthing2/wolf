import React from 'react';
import Link from 'next/link';

// Placeholder Icons - Replace these with actual imports or SVG components later
const PlaceholderInstagramIcon = () => <span className="text-xs">[IG]</span>;
const PlaceholderGoogleIcon = () => <span className="text-xs">[G]</span>;
// Add placeholders for other social icons if needed (e.g., Facebook, Twitter)

export function SiteFooter() { // Changed export name slightly for clarity
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">

        {/* Left Section: Copyright */}
        <div className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          {currentYear} Hustle Hard. All Rights Reserved.
          {/* Optional: Add link to privacy policy or terms */}
        </div>

        {/* Right Section: Social Links */}
        <div className="flex items-center space-x-4">
          {/* Replace '#' with your actual social media URLs */}
          <Link
            href="https://www.instagram.com/sidehustle_bar"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary" // Example styling
          >
             <PlaceholderInstagramIcon />
             <span className="sr-only">Instagram</span>
             {/* Add <img src="/assets/icons/social_icon_instagram.svg"> when ready */}
          </Link>
          <Link
            href="https://www.facebook.com/p/The-Side-Hustle-Bar-100094503669280/"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
             <PlaceholderGoogleIcon />
             <span className="sr-only">Facebook</span>
              {/* Add <img src="/assets/icons/social_icon_facebook.svg"> when ready */}
          </Link>
          {/* Add other social links here */}
        </div>

      </div>
    </footer>
  );
}

// Optionally export default
// export default SiteFooter;