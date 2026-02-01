import { restaurants as staticRestaurants, type Restaurant } from './data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quickbite-backend-zsdz.onrender.com/api';

interface ApiRestaurant {
  id: number;
  name: string;
  description: string;
  cuisine_type: string;
  rating: number;
  delivery_time: number;
  image_url?: string;
  address?: string;
  menus?: ApiMenu[];
}

interface ApiMenu {
  id: number;
  name: string;
  items: ApiMenuItem[];
}

interface ApiMenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

// Maps a backend restaurant to the frontend Restaurant interface
function mapApiRestaurant(r: ApiRestaurant): Restaurant {
  return {
    id: r.id.toString(),
    name: r.name,
    description: r.description,
    cuisine: r.cuisine_type || 'Other',
    rating: parseFloat(String(r.rating)),
    deliveryTime: r.delivery_time || 30,
    image: r.image_url || `https://picsum.photos/seed/${r.id}/600/400`,
    imageHint: r.name.toLowerCase(),
    menu: (r.menus || []).map(m => ({
      name: m.name,
      items: (m.items || []).map(item => ({
        id: `${r.id}-${item.id}`,
        name: item.name,
        description: item.description || '',
        price: item.price,
        image: item.image || `https://picsum.photos/seed/${item.id}/200/200`,
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
      next: { revalidate: 60 },
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
