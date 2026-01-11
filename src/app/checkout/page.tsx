'use client';

import OrderSummary from '@/components/OrderSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { restaurants } from '@/lib/data';
import { useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { DeliveryAddressForm } from '@/components/DeliveryAddressForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

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

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!address.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get restaurant ID from first cart item
      const restaurantId = cartItems[0]?.id.split('-')[0];
      
      const orderPayload = {
        restaurantId: parseInt(restaurantId),
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: getTotalPrice(),
        deliveryAddress: address,
        deliveryNotes: notes || undefined,
      };

      const response = await api.createOrder(orderPayload);
      clearCart();
      router.push(`/confirmation?orderId=${response.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
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
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Delivery Information</CardTitle>
              <CardDescription>
                Please provide your delivery address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DeliveryAddressForm 
                address={address}
                setAddress={setAddress}
                notes={notes}
                setNotes={setNotes}
              />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Delivery Time</CardTitle>
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
            disabled={isSubmitting || !address.trim()}
          >
            {isSubmitting ? 'Placing Order...' : 'Place Your Order'}
          </Button>
        </div>
      </div>
    </div>
  );
}
