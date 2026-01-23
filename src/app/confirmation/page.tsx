'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto p-8">
          <h1 className="font-headline text-3xl mb-2">No Order Found</h1>
          <p className="text-muted-foreground mb-6">
            It looks like you haven&apos;t placed an order yet.
          </p>
          <Button asChild>
            <Link href="/">Browse Restaurants</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        <h1 className="font-headline text-4xl font-bold tracking-tight mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          Your order has been placed successfully.
        </p>
        <p className="text-sm text-muted-foreground mb-2">
          Order ID: <span className="font-mono font-semibold text-foreground">{orderId}</span>
        </p>
        <p className="text-lg text-muted-foreground mb-8">
          Estimated delivery time: <span className="font-semibold">30-45 minutes</span>
        </p>
        <Button asChild size="lg">
          <Link href="/">Back to Restaurants</Link>
        </Button>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <Skeleton className="h-20 w-20 rounded-full mx-auto" />
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
