'use client';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://quickbite-backend-zsdz.onrender.com';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  cuisine_type: string;
  rating: number;
  delivery_time: number;
  address: string;
  created_at: string;
}

interface MenuItem {
  id: number;
  restaurant_id: number;
  name: string;
  description: string;
  price: number;
  created_at: string;
}

export async function fetchRestaurants(): Promise<Restaurant[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/restaurants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'revalidate',
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      console.error('Failed to fetch restaurants:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('API error fetching restaurants:', error);
    return [];
  }
}

export async function fetchRestaurantById(id: string): Promise<Restaurant | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/restaurants/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'revalidate',
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('Failed to fetch restaurant:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('API error fetching restaurant:', error);
    return null;
  }
}

export async function fetchMenuItems(restaurantId: string): Promise<MenuItem[]> {
  try {
    const restaurant = await fetchRestaurantById(restaurantId);
    if (restaurant && 'menus' in restaurant) {
      return (restaurant as any).menus || [];
    }
    return [];
  } catch (error) {
    console.error('API error fetching menu items:', error);
    return [];
  }
}

export async function createOrder(
  restaurantId: number,
  items: any[],
  totalAmount: number,
  token: string
): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        restaurantId,
        items,
        totalAmount,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('API error creating order:', error);
    throw error;
  }
}

export async function getHealthStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}
