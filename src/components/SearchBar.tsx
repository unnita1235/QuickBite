'use client';

import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Search, LoaderCircle } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export default function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [query, onSearch]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search for restaurants or cuisine (e.g., 'sushi' or 'spicy noodles')..."
        className="w-full pl-10 pr-10 py-6 text-base rounded-full shadow-lg focus-visible:ring-accent"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search restaurants and cuisine"
        aria-describedby="search-description"
      />
      <span id="search-description" className="sr-only">
        Search for restaurants by name or cuisine type. Results will appear as you type.
      </span>
      {isSearching && (
        <LoaderCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
      )}
    </div>
  );
}
