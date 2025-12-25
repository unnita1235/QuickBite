'use client';

import OrderSummary from '@/components/OrderSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { restaurants } from '@/lib/data';
import { useMemo } from 'react';

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();

  /**
   * Calculates delivery time based on restaurants in the cart.
   * Menu item IDs follow the format "restaurantId-itemId" (e.g., "1-1", "2-3").
   * If items are from multiple restaurants, returns the maximum delivery time.
   * @returns The maximum delivery time in minutes, or 0 if cart is empty
   */
  const deliveryTime = useMemo(() => {
    if (cartItems.length === 0) return 0;
    
    const restaurantIds = new Set<string>();
    cartItems.forEach(item => {
      const restaurantId = item.id.split('-')[0];
      restaurantIds.add(restaurantId);
    });
    
    // Find maximum delivery time among all restaurants in cart
    const deliveryTimes = Array.from(restaurantIds).map(id => {
      const restaurant = restaurants.find(r => r.id === id);
      return restaurant?.deliveryTime || 0;
    });
    
    return Math.max(...deliveryTimes, 0);
  }, [cartItems]);

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
                This is a demo application. No payment is required and form validation is intentionally skipped for simplicity.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                  Your order will be delivered in approximately {deliveryTime} {deliveryTime === 1 ? 'minute' : 'minutes'}.
                </p>
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
