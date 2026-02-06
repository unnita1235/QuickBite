'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmationPage() {
  // The checkout page clears the cart and creates the order before navigating here
  // (see src/app/checkout/page.tsx:107-109).
  // This page is now a static success screen — it does not depend on cart contents.

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        <h1 className="font-headline text-4xl font-bold tracking-tight mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          Thank you for your order. Your food is being prepared and will be on its way soon.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          You can track your order status on the{' '}
          <Link href="/orders" className="underline font-semibold text-emerald-600">
            Orders page
          </Link>.
        </p>
        <Button asChild size="lg">
          <Link href="/">Back to Restaurants</Link>
        </Button>
      </div>
    </div>
  );
}
