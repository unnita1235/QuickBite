'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import type { Restaurant } from '@/types';
import { getRestaurants } from '@/lib/restaurant-service';
import RestaurantCard from '@/components/RestaurantCard';
import SearchBar from '@/components/SearchBar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface SearchResultRow {
  id: number;
  name: string;
  description: string;
  cuisine_type?: string;
  cuisine?: string;
  rating: number | string;
  delivery_time?: number;
  image_url?: string;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await getRestaurants();
        if (!cancelled) setAllRestaurants(data);
      } catch {
        // Static fallback is already handled inside getRestaurants()
      } finally {
        if (!cancelled) setIsLoadingRestaurants(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (query.length > 2) {
      setIsSearching(true);
      setSearchError(false);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const handleSearch = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          const response = await fetch(`${apiUrl}/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error('Search failed');
          }

          const data = await response.json();
          const results = Array.isArray(data?.results) ? data.results : [];
          const mappedResults = results.map((r: SearchResultRow) => ({
            id: r.id.toString(),
            name: r.name,
            description: r.description,
            cuisine: r.cuisine_type || r.cuisine || 'Other',
            rating: parseFloat(String(r.rating)),
            deliveryTime: r.delivery_time || 30,
            image: r.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
            imageHint: r.name,
            menu: [],
          }));

          setSearchResults(mappedResults);
          setSearchError(false);
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          setSearchError(true);
          setSearchResults([]);
        } finally {
          if (!controller.signal.aborted) {
            setIsSearching(false);
          }
        }
      };

      handleSearch();
    } else {
      setSearchResults([]);
      setSearchError(false);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            isRecommended={false}
          />
        ))}
      </div>

      {(isSearching || isLoadingRestaurants) && displayedRestaurants.length === 0 && (
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

      {displayedRestaurants.length === 0 && !isSearching && !isLoadingRestaurants && query.length > 2 && (
        <div className="text-center col-span-full py-12">
          <p className="text-muted-foreground text-lg">No restaurants found matching your search.</p>
        </div>
      )}
    </div>
  );
}
