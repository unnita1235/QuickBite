'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);

  const total = searchParams.get('total');
  const items = searchParams.get('items');

  useEffect(() => {
    if (!total && !items) {
      router.replace('/');
    } else {
      setIsValid(true);
    }
  }, [total, items, router]);

  if (!isValid) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        <h1 className="font-headline text-4xl font-bold tracking-tight mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          Thank you for your order. Your food is being prepared and will be on its way soon.
        </p>
        {total && items && (
          <p className="text-muted-foreground mb-4">
            {items} {Number(items) === 1 ? 'item' : 'items'} &mdash; ${total} total
          </p>
        )}
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

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  );
}
