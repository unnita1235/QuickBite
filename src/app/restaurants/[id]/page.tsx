import { restaurants } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import MenuList from '@/components/MenuList';
import { Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RestaurantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return restaurants.map((restaurant) => ({
    id: restaurant.id,
  }));
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;
  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    notFound();
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
                    <span className='hidden sm:inline'>Rating</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-bold">{restaurant.deliveryTime} min</span>
                     <span className='hidden sm:inline'>Delivery</span>
                </div>
            </div>
          <MenuList menu={restaurant.menu} />
        </div>
      </div>
    </div>
  );
}
