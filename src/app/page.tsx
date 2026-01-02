'use client';

import { useState, useEffect, useMemo } from 'react';
import { restaurants, type Restaurant } from '@/lib/data';
import RestaurantCard from '@/components/RestaurantCard';
import SearchBar from '@/components/SearchBar';
import { getRecommendedRestaurants } from '@/actions/recommend';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [recommendedNames, setRecommendedNames] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiSearched, setAiSearched] = useState(false);
  const [aiError, setAiError] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true);
      setAiSearched(true);
      setAiError(false);
      const handleSearch = async () => {
        try {
          const recommendations = await getRecommendedRestaurants(query);
          setRecommendedNames(recommendations);
          setAiError(false);
        } catch (error) {
          console.error('Failed to get AI recommendations:', error);
          setAiError(true);
          setRecommendedNames([]);
        } finally {
          setIsSearching(false);
        }
      };
      handleSearch();
    } else {
      setRecommendedNames([]);
      setAiSearched(false);
      setAiError(false);
    }
  }, [query]);

  /**
   * Filters and sorts restaurants based on search query and AI recommendations.
   * - If no query: returns all restaurants
   * - If AI recommendations exist: separates recommended restaurants (shown first) from others
   * - Applies text-based filtering on restaurant names and cuisines
   * - Returns recommended restaurants first, followed by filtered others
   */
  const filteredRestaurants = useMemo(() => {
    let allRestaurants = [...restaurants];
    let recommended: Restaurant[] = [];
    let others: Restaurant[] = [];

    // No search active - return all restaurants
    if (query.length === 0 && !aiSearched) {
      return allRestaurants;
    }

    if (recommendedNames.length > 0) {
      // AI provided recommendations - separate recommended from others
      const recommendedSet = new Set(recommendedNames);
      allRestaurants.forEach(restaurant => {
        if (recommendedSet.has(restaurant.name)) {
          recommended.push(restaurant);
        } else {
          others.push(restaurant);
        }
      });
      // Apply text search filter on non-recommended restaurants
      others = others.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(query.toLowerCase())
      );
    } else if (aiSearched) {
      // AI search was attempted but returned no results - do full text search
      others = allRestaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      // AI search not active, just apply text filter
      others = allRestaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Return recommended restaurants first, then filtered others
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

      {aiError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>AI Search Unavailable</AlertTitle>
          <AlertDescription>
           We could not connect to our AI recommendation service. Showing text-based search results instead.          </AlertDescription>
        </Alert>
      )}
      
      {aiSearched && recommendedNames.length > 0 && !aiError && (
        <h2 className="font-headline text-3xl font-semibold tracking-tight mb-6">
           AI Recommendations for \"{query}\"        </h2>
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
