'use client';

import { useState, useEffect, useMemo } from 'react';
import { restaurants as staticRestaurants, type Restaurant } from '@/lib/data';
import RestaurantCard from '@/components/RestaurantCard';
import SearchBar from '@/components/SearchBar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function mapApiRestaurant(r: any): Restaurant {
  return {
    id: r.id.toString(),
    name: r.name,
    description: r.description || '',
    cuisine: r.cuisine_type || r.cuisine || 'Other',
    rating: parseFloat(r.rating) || 0,
    deliveryTime: r.delivery_time || 30,
    image: r.image_url || 'https://picsum.photos/seed/101/600/400',
    imageHint: r.name,
    menu: []
  };
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);

  // Fetch all restaurants on initial load
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${apiUrl}/restaurants`);
        if (!response.ok) throw new Error('Failed to fetch restaurants');
        const data = await response.json();
        const mapped = (data.restaurants || data).map(mapApiRestaurant);
        setAllRestaurants(mapped);
      } catch (error) {
        console.error('Failed to fetch restaurants, using static data:', error);
        setAllRestaurants(staticRestaurants);
      } finally {
        setIsLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Handle search
  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true);
      setSearchError(false);

      const handleSearch = async () => {
        try {
          const response = await fetch(`${apiUrl}/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
          });

          if (!response.ok) {
            throw new Error('Search failed');
          }

          const data = await response.json();
          const mappedResults = data.results.map(mapApiRestaurant);
          setSearchResults(mappedResults);
          setSearchError(false);
        } catch (error) {
          console.error('Failed to search:', error);
          setSearchError(true);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      };

      handleSearch();
    } else {
      setSearchResults([]);
      setSearchError(false);
    }
  }, [query]);

  const displayedRestaurants = useMemo(() => {
    if (query.length > 2 && searchResults.length > 0) {
      return searchResults;
    }
    if (query.length > 2 && searchResults.length === 0 && !isSearching && !searchError) {
      return [];
    }
    return allRestaurants;
  }, [query, searchResults, isSearching, searchError, allRestaurants]);

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

      {searchError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Search Unavailable</AlertTitle>
          <AlertDescription>
            We could not connect to our search service. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {query.length > 2 && !searchError && (
        <h2 className="font-headline text-3xl font-semibold tracking-tight mb-6">
          Results for &quot;{query}&quot;
        </h2>
      )}

      {(isLoadingRestaurants || isSearching) && (
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

      {!isLoadingRestaurants && !isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              isRecommended={false}
            />
          ))}
        </div>
      )}

      {displayedRestaurants.length === 0 && !isSearching && !isLoadingRestaurants && query.length > 2 && (
        <div className="text-center col-span-full py-12">
          <p className="text-muted-foreground text-lg">No restaurants found matching your search.</p>
        </div>
      )}
    </div>
  );
}
