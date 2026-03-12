import { restaurants as staticRestaurants } from './data';
import type { Restaurant, ApiRestaurant } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Maps a backend restaurant to the frontend Restaurant interface
function mapApiRestaurant(r: ApiRestaurant): Restaurant {
  return {
    id: r.id.toString(),
    name: r.name,
    description: r.description,
    cuisine: r.cuisine_type || 'Other',
    rating: parseFloat(String(r.rating)),
    deliveryTime: r.delivery_time || 30,
    image: r.image_url || `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop`,
    imageHint: r.name.toLowerCase(),
    menu: (r.menus || []).map(m => ({
      name: m.name,
      items: (m.items || []).map(item => ({
        id: `${r.id}-${item.id}`,
        name: item.name,
        description: item.description || '',
        price: item.price,
        image: item.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop`,
        imageHint: item.name.toLowerCase(),
      })),
    })),
  };
}

/**
 * Fetches all restaurants from the API, falls back to static data on failure.
 */
export async function getRestaurants(): Promise<Restaurant[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants?limit=50`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('API unavailable');

    const data = await response.json();
    if (data.success && data.data && data.data.length > 0) {
      return data.data.map(mapApiRestaurant);
    }
  } catch {
    // Fall through to static data
  }

  return staticRestaurants;
}

/**
 * Fetches a single restaurant by ID from the API, falls back to static data.
 */
export async function getRestaurantById(id: string): Promise<Restaurant | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error('API unavailable');

    const data = await response.json();
    if (data.success && data.data) {
      return mapApiRestaurant(data.data);
    }
  } catch {
    // Fall through to static data
  }

  return staticRestaurants.find(r => r.id === id);
}
