'use client';

import { useState, useMemo } from 'react';
import OrderSummary from '@/components/OrderSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const restaurantId = useMemo(() => {
    if (cartItems.length === 0) return null;
    return cartItems[0].id.split('-')[0];
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
    if (!isAuthenticated || !token) {
      router.push('/login?message=Please+login+to+place+an+order');
      return;
    }

    if (!deliveryAddress.trim()) {
      setOrderError('Please enter a delivery address.');
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId,
          items: cartItems,
          totalAmount: getTotalPrice(),
          deliveryAddress: deliveryAddress.trim(),
          deliveryNotes: deliveryNotes.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to place order');
      }

      const data = await response.json();
      const orderId = data.order?.id || data.orderId || data.id;

      clearCart();
      router.push(`/confirmation?orderId=${orderId}`);
    } catch (error: any) {
      console.error('Failed to place order:', error);
      setOrderError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-headline text-4xl font-bold tracking-tight mb-8 text-center">
          Ready to Order?
        </h1>

        {orderError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Order Failed</AlertTitle>
            <AlertDescription>{orderError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-8">
          <OrderSummary />

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Delivery Details</CardTitle>
              <CardDescription>
                Enter your delivery address and any special instructions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                <Input
                  id="deliveryAddress"
                  placeholder="Enter your full delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryNotes">Delivery Notes (optional)</Label>
                <Textarea
                  id="deliveryNotes"
                  placeholder="e.g., Ring the doorbell, leave at the door, etc."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? (
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
