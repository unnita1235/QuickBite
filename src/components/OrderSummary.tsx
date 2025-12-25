'use client';

import { useCart } from '@/hooks/useCart';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Separator } from './ui/separator';
import Image from 'next/image';

export default function OrderSummary() {
  const { cartItems, getTotalPrice } = useCart();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md object-cover h-10 w-10"/>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex-col items-stretch space-y-2">
        <Separator />
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total</span>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
