'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">An unexpected error occurred while loading this page.</p>
            <Button onClick={reset} variant="outline" size="sm">
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
