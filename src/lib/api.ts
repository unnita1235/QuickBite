'use client';

import { User, Restaurant, Order, CreateOrderPayload } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://quickbite-backend-zsdz.onrender.com/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch (error) {
    // If response is not JSON, throw an error
    throw new ApiError(response.status, 'Invalid response format');
  }
  
  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'Request failed');
  }
  
  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) => 
    fetchApi<{token: string; user: User}>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (email: string, password: string, name: string) =>
    fetchApi<{token: string; user: User}>('/auth/register', {
      method: 'POST', 
      body: JSON.stringify({ email, password, name }),
    }),

  // Restaurants
  getRestaurants: () => fetchApi<{data: Restaurant[]}>('/restaurants'),
  getRestaurant: (id: string) => fetchApi<{data: Restaurant}>(`/restaurants/${id}`),

  // Orders
  createOrder: (order: CreateOrderPayload) =>
    fetchApi<{data: Order}>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
  
  getOrders: () => fetchApi<{data: Order[]}>('/orders'),
  getOrder: (id: string) => fetchApi<{data: Order}>(`/orders/${id}`),

  // User
  getProfile: () => fetchApi<{data: User}>('/users/profile'),
  updateProfile: (data: Partial<User>) =>
    fetchApi<{data: User}>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Legacy functions for backward compatibility
export async function fetchRestaurants(): Promise<Restaurant[]> {
  try {
    const response = await api.getRestaurants();
    return response.data || [];
  } catch (error) {
    console.error('API error fetching restaurants:', error);
    return [];
  }
}

export async function fetchRestaurantById(id: string): Promise<Restaurant | null> {
  try {
    const response = await api.getRestaurant(id);
    return response.data || null;
  } catch (error) {
    console.error('API error fetching restaurant:', error);
    return null;
  }
}

export async function getHealthStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`, {
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
