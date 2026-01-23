'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { restaurants as staticRestaurants, type Restaurant } from '@/lib/data';
import Image from 'next/image';
import MenuList from '@/components/MenuList';
import { Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function RestaurantPage() {
  const params = useParams();
  const id = params.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`${apiUrl}/restaurants/${id}`);
        if (!response.ok) throw new Error('Failed to fetch restaurant');
        const data = await response.json();
        const r = data.restaurant || data;
        setRestaurant({
          id: r.id.toString(),
          name: r.name,
          description: r.description || '',
          cuisine: r.cuisine_type || r.cuisine || 'Other',
          rating: parseFloat(r.rating) || 0,
          deliveryTime: r.delivery_time || 30,
          image: r.image_url || 'https://picsum.photos/seed/101/600/400',
          imageHint: r.name,
          menu: r.menu || []
        });
      } catch (error) {
        console.error('Failed to fetch restaurant from API, using static data:', error);
        const staticRestaurant = staticRestaurants.find((r) => r.id === id);
        if (staticRestaurant) {
          setRestaurant(staticRestaurant);
        } else {
          setNotFound(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-64 md:h-80 w-full" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between p-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !restaurant) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Restaurant Not Found</h1>
        <p className="text-muted-foreground">The restaurant you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-64 md:h-80 w-full">
        <Image
          src={restaurant.image}
          alt={`Cover image for ${restaurant.name}`}
          fill
          className="object-cover"
          priority
          data-ai-hint={restaurant.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 container mx-auto">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-white tracking-tight">
            {restaurant.name}
          </h1>
          <Badge className="mt-2 text-base">{restaurant.cuisine}</Badge>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-muted-foreground mb-8 text-lg p-4 bg-card rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              <span className="font-bold">{restaurant.rating.toFixed(1)}</span>
              <span className="hidden sm:inline">Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-bold">{restaurant.deliveryTime} min</span>
              <span className="hidden sm:inline">Delivery</span>
            </div>
          </div>
          {restaurant.menu.length > 0 && <MenuList menu={restaurant.menu} />}
        </div>
      </div>
    </div>
  );
}
