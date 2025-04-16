'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Main layout error caught:', error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center text-center py-20">
      <div className="space-y-6 max-w-md">
        <h2 className="text-3xl font-bold tracking-tight">Oops! Something went wrong</h2>
        <p className="text-muted-foreground">
          We encountered an error while trying to display this page. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button onClick={() => reset()} size="lg">
            Try again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline" size="lg">
            Return to home
          </Button>
        </div>
      </div>
    </div>
  );
}

// Ensure critical meta tags are present even if layout is skipped
export function head() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes" />
      <meta name="description" content="An error occurred on Side Hustle Bar." />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      {/* lang attribute can't be set here, but ensure it's set in layout */}
    </>
  );
}
