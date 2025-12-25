import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Restaurant } from '@/lib/data';
import { Star, Clock } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isRecommended: boolean;
}

/**
 * RestaurantCard component displays a preview card for a restaurant.
 * Memoized to prevent unnecessary re-renders when parent component updates.
 */
const RestaurantCard = memo(function RestaurantCard({ restaurant, isRecommended }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
        <div className="relative">
          <Image
            src={restaurant.image}
            alt={`Photo of ${restaurant.name}`}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint={restaurant.imageHint}
          />
          {isRecommended && (
             <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">AI Pick</Badge>
          )}
        </div>
        <CardHeader>
          <CardTitle className="font-headline text-2xl tracking-tight">{restaurant.name}</CardTitle>
          <CardDescription>{restaurant.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">{restaurant.cuisine}</Badge>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-accent" />
            <span>{restaurant.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{restaurant.deliveryTime} min</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
});

export default RestaurantCard;
