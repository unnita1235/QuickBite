'use client';

import OrderSummary from '@/components/OrderSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const deliveryTime = useMemo(() => {
    if (cartItems.length === 0) return 0;

    const restaurantIds = new Set<string>();
    cartItems.forEach(item => {
      const rid = item.restaurantId ?? item.id.split('-')[0];
      restaurantIds.add(rid);
    });

    const deliveryTimes = Array.from(restaurantIds).map(id => {
      const restaurant = restaurants.find(r => r.id === id);
      return restaurant?.deliveryTime || 0;
    });

    return Math.max(...deliveryTimes, 0);
  }, [cartItems]);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const itemsByRestaurant = new Map<number, typeof cartItems>();

      for (const item of cartItems) {
        const rid = item.restaurantId ?? item.id.split('-')[0];
        const restaurantId = parseInt(rid, 10);
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
          return api.orders.create(
            restaurantId,
            orderItems,
            totalAmount,
            deliveryAddress || undefined,
            deliveryNotes || undefined,
          );
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

      const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      clearCart();
      router.push(`/confirmation?total=${totalAmount.toFixed(2)}&items=${itemCount}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

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
              <CardTitle className="font-headline text-2xl">Delivery Details</CardTitle>
              <CardDescription>
                Tell us where to deliver your order.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="delivery-address" className="text-sm font-medium">
                  Delivery Address
                </label>
                <Input
                  id="delivery-address"
                  placeholder="123 Main St, Apt 4B, City, State"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="delivery-notes" className="text-sm font-medium">
                  Delivery Notes <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="delivery-notes"
                  placeholder="Ring the doorbell, leave at door, etc."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Estimated delivery in approximately {deliveryTime} {deliveryTime === 1 ? 'minute' : 'minutes'}.
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
