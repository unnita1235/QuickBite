'use client';

import OrderSummary from '@/components/OrderSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/config/api';
import { ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { restaurants } from '@/lib/data';
import { useMemo, useState } from 'react';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryTime = useMemo(() => {
    if (cartItems.length === 0) return 0;

    const restaurantIds = new Set<string>();
    cartItems.forEach(item => {
      const restaurantId = item.id.split('-')[0];
      restaurantIds.add(restaurantId);
    });

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

  const handlePlaceOrder = async () => {
    // Redirect to login if not authenticated.
    // The backend POST /api/orders requires verifyToken (server/src/routes/orders.routes.js:8).
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Group cart items by restaurant.
      // Cart item IDs use format "restaurantId-itemId" (verified in src/lib/data.ts:29+).
      // One order per restaurant (user chose Option A).
      const itemsByRestaurant = new Map<number, typeof cartItems>();

      for (const item of cartItems) {
        const restaurantId = parseInt(item.id.split('-')[0], 10);
        if (!itemsByRestaurant.has(restaurantId)) {
          itemsByRestaurant.set(restaurantId, []);
        }
        itemsByRestaurant.get(restaurantId)!.push(item);
      }

      const orderPromises = Array.from(itemsByRestaurant.entries()).map(
        ([restaurantId, items]) => {
          const orderItems = items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            description: item.description,
          }));
          const totalAmount = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          return api.orders.create(restaurantId, orderItems, totalAmount);
        }
      );

      const settled = await Promise.allSettled(orderPromises);

      const failed = settled.filter(
        (r): r is PromiseRejectedResult => r.status === 'rejected'
      );
      const rejectedApi = settled.filter(
        (r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof api.orders.create>>> =>
          r.status === 'fulfilled' && !r.value.success
      );

      const totalFailed = failed.length + rejectedApi.length;
      const totalSucceeded = settled.length - totalFailed;

      if (totalFailed > 0 && totalSucceeded === 0) {
        const firstError = rejectedApi[0]?.value.error || failed[0]?.reason?.message;
        setError(firstError || 'Your order could not be submitted. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (totalFailed > 0 && totalSucceeded > 0) {
        clearCart();
        setError(
          `${totalSucceeded} of ${settled.length} orders were placed successfully. ` +
          `${totalFailed} failed — please check your orders page.`
        );
        setIsSubmitting(false);
        return;
      }

      clearCart();
      router.push('/confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
              <p className="text-sm">You need to <Link href="/login" className="underline font-semibold">log in</Link> to place an order.</p>
            </div>
          )}

           <Button
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6"
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Placing Order...
              </>
            ) : (
              'Place Your Order'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
