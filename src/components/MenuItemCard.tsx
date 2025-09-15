'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import { useCart } from '@/hooks/useCart';
import type { MenuItem } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(item);
    toast({
      title: 'Added to cart!',
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <div className="flex gap-4 items-start p-4 border-b transition-colors hover:bg-card">
      <div className="flex-1">
        <h3 className="font-bold text-lg">{item.name}</h3>
        <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
        <p className="font-semibold mt-2 text-primary">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="relative h-24 w-24 rounded-md overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            data-ai-hint={item.imageHint}
          />
        </div>
        <Button size="sm" variant="outline" onClick={handleAddToCart}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
}
