'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RestaurantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Restaurant page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h2 className="font-headline text-3xl font-bold mb-4">
          Could not load restaurant
        </h2>
        <p className="text-muted-foreground mb-6">
          We had trouble loading this restaurant. Please try again or browse other restaurants.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
          <Button asChild>
            <Link href="/">Browse Restaurants</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
