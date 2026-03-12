import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <p className="text-muted-foreground text-sm font-medium mb-2">404</p>
        <h1 className="font-headline text-3xl font-bold mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you’re looking for doesn’t exist or has been moved. Head back to browse restaurants.
        </p>
        <Button asChild>
          <Link href="/" className="inline-flex items-center gap-2">
            <Search className="h-4 w-4" />
            Browse Restaurants
          </Link>
        </Button>
      </div>
    </div>
  );
}
