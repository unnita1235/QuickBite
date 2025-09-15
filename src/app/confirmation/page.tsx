'use client';

import OrderSummary from '@/components/OrderSummary';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ConfirmationPage() {
  const { clearCart, cartItems } = useCart();

  // If the user navigates here directly without items, redirect them.
  // We don't clear cart immediately to allow refresh.
  useEffect(() => {
    if(cartItems.length === 0) {
      // router.push('/'); // This would cause a loop on clearCart. Best to just show a message.
    }
  }, [cartItems.length]);
  

  const handleFinish = () => {
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
       <div className="container mx-auto px-4 py-8 text-center">
         <div className="max-w-md mx-auto p-8">
            <h1 className="font-headline text-3xl mb-2">No Order Found</h1>
            <p className="text-muted-foreground mb-6">
              It looks like you haven't placed an order yet.
            </p>
            <Button asChild>
              <Link href="/">Browse Restaurants</Link>
            </Button>
          </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        <h1 className="font-headline text-4xl font-bold tracking-tight mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for your order. Your food is on its way and will arrive in approximately 30-45 minutes.
        </p>
        <div className="text-left mb-8">
          <OrderSummary />
        </div>
        <Button asChild size="lg" onClick={handleFinish}>
          <Link href="/">Back to Restaurants</Link>
        </Button>
      </div>
    </div>
  );
}
