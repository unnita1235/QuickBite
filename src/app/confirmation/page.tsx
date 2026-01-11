'use client';

import OrderSummary from '@/components/OrderSummary';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState, Suspense } from 'react';
import { restaurants } from '@/lib/data';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function ConfirmationContent() {
  const { clearCart, cartItems } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      api.getOrder(orderId)
        .then(res => setOrder(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  // Calculate delivery time based on restaurants in cart or order
  const deliveryTime = useMemo(() => {
    if (order) {
      // If we have order data, try to get restaurant delivery time
      // Convert API restaurant_id (number) to match static data id (string)
      const restaurantIdStr = String(order.restaurant_id);
      const restaurant = restaurants.find(r => r.id === restaurantIdStr);
      return restaurant?.deliveryTime || 30;
    }
    
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
  }, [cartItems, order]);

  const handleFinish = () => {
    clearCart();
  };

  if (loading && orderId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full mb-8" />
        </div>
      </div>
    );
  }

  if (!orderId || (!loading && !order && cartItems.length === 0)) {
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
          Thank you for your order. Your food is on its way and will arrive in approximately {deliveryTime} {deliveryTime === 1 ? 'minute' : 'minutes'}.
        </p>
        {order && (
          <div className="text-left mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Order #{order.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Items:</h3>
                    <ul className="space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.name} x {item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {order.delivery_address && (
                    <div>
                      <h3 className="font-semibold mb-1">Delivery Address:</h3>
                      <p className="text-muted-foreground">{order.delivery_address}</p>
                    </div>
                  )}
                  {order.delivery_notes && (
                    <div>
                      <h3 className="font-semibold mb-1">Delivery Notes:</h3>
                      <p className="text-muted-foreground">{order.delivery_notes}</p>
                    </div>
                  )}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-emerald-600">₹{order.total_amount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {!order && cartItems.length > 0 && (
          <div className="text-left mb-8">
            <OrderSummary />
          </div>
        )}
        <Button asChild size="lg" onClick={handleFinish}>
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
        <div className="max-w-2xl mx-auto text-center">
          <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full mb-8" />
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
