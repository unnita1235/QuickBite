'use client';

import { useState, useEffect, useMemo } from 'react';
import { restaurants, type Restaurant } from '@/lib/data';
import RestaurantCard from '@/components/RestaurantCard';
import SearchBar from '@/components/SearchBar';
import { getRecommendedRestaurants } from '@/actions/recommend';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [query, setQuery] = useState('');
  const [recommendedNames, setRecommendedNames] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiSearched, setAiSearched] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true);
      setAiSearched(true);
      const handleSearch = async () => {
        const recommendations = await getRecommendedRestaurants(query);
        setRecommendedNames(recommendations);
        setIsSearching(false);
      };
      handleSearch();
    } else {
      setRecommendedNames([]);
      setAiSearched(false);
    }
  }, [query]);

  const filteredRestaurants = useMemo(() => {
    let allRestaurants = [...restaurants];
    let recommended: Restaurant[] = [];
    let others: Restaurant[] = [];

    if (query.length === 0 && !aiSearched) {
      return allRestaurants;
    }

    if (recommendedNames.length > 0) {
      const recommendedSet = new Set(recommendedNames);
      allRestaurants.forEach(restaurant => {
        if (recommendedSet.has(restaurant.name)) {
          recommended.push(restaurant);
        } else {
          others.push(restaurant);
        }
      });
      // Simple text search on the rest
      others = others.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(query.toLowerCase())
      );
    } else if (aiSearched) {
      // AI search returned no results, so we do a full text search
      others = allRestaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      // AI search is not active, just filter
      others = allRestaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(query.toLowerCase())
      );
    }

    return [...recommended, ...others];
  }, [query, recommendedNames, aiSearched]);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Find your next favorite meal.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover local restaurants and delicious cuisines, delivered right to your door.
        </p>
      </section>

      <div className="mb-8">
        <SearchBar onSearch={setQuery} isSearching={isSearching} />
      </div>
      
      {aiSearched && recommendedNames.length > 0 && (
        <h2 className="font-headline text-3xl font-semibold tracking-tight mb-6">
          AI Recommendations for &quot;{query}&quot;
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            isRecommended={recommendedNames.includes(restaurant.name)}
          />
        ))}
      </div>

      {isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredRestaurants.length === 0 && !isSearching && (
        <div className="text-center col-span-full py-12">
          <p className="text-muted-foreground text-lg">No restaurants found matching your search.</p>
        </div>
      )}
    </div>
  );
}
