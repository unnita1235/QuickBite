'use client';

import OrderSummary from '@/components/OrderSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
         <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-lg">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-headline text-3xl mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              You need to add items to your cart before you can check out.
            </p>
            <Button asChild>
              <Link href="/">Browse Restaurants</Link>
            </Button>
          </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    // In a real app, this would submit the order to a backend.
    // For this demo, we'll just navigate to the confirmation page.
    router.push('/confirmation');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-headline text-4xl font-bold tracking-tight mb-8 text-center">
          Ready to Order?
        </h1>
        <div className="grid grid-cols-1 gap-8">
          <OrderSummary />
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Payment & Delivery</CardTitle>
              <CardDescription>
                This is a demo. No payment is required.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Your order will be delivered in approximately 30-45 minutes.</p>
            </CardContent>
          </Card>
           <Button
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6"
            onClick={handlePlaceOrder}
          >
            Place Your Order
          </Button>
        </div>
      </div>
    </div>
  );
}
