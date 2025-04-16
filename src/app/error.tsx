'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="space-y-4 px-4">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground">
          An unexpected error occurred. We've been notified and are working to fix the issue.
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Go to homepage
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
