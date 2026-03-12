import type {
  ApiResponse,
  User,
  AuthResponse,
  ApiRestaurant,
  OrderItem,
  Order,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Utility function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Utility function to set auth token
const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
};

// Utility function to clear auth token
const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
};

// Generic fetch helper
const fetchApi = async <T,>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'An error occurred',
      };
    }

    return data as ApiResponse<T>;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const api = {
  // Auth endpoints
  auth: {
    register: async (email: string, password: string, name: string) => {
      return fetchApi<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
    },

    login: async (email: string, password: string) => {
      const response = await fetchApi<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success && response.data?.token) {
        setAuthToken(response.data.token);
      }

      return response;
    },

    logout: () => {
      clearAuthToken();
    },

    getCurrentUser: async () => {
      return fetchApi<User>('/users/profile', {
        method: 'GET',
      });
    },
  },

  // Restaurant endpoints
  restaurants: {
    getAll: async (page: number = 0, limit: number = 20) => {
      return fetchApi<{ data: ApiRestaurant[]; pagination: { total?: number; limit?: number; offset?: number } }>(
        `/restaurants?page=${page}&limit=${limit}`,
        { method: 'GET' }
      );
    },

    getById: async (id: string | number) => {
      return fetchApi<ApiRestaurant>(`/restaurants/${id}`, {
        method: 'GET',
      });
    },

    create: async (restaurant: Partial<ApiRestaurant>) => {
      return fetchApi<ApiRestaurant>('/restaurants', {
        method: 'POST',
        body: JSON.stringify(restaurant),
      });
    },
  },

  // Order endpoints
  orders: {
    create: async (restaurantId: number, items: OrderItem[], totalAmount: number, deliveryAddress?: string, deliveryNotes?: string) => {
      return fetchApi<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify({ restaurantId, items, totalAmount, deliveryAddress, deliveryNotes }),
      });
    },

    getAll: async () => {
      return fetchApi<Order[]>('/orders', {
        method: 'GET',
      });
    },

    getById: async (id: string | number) => {
      return fetchApi<Order>(`/orders/${id}`, {
        method: 'GET',
      });
    },
  },

  // User endpoints
  users: {
    getProfile: async () => {
      return fetchApi<User>('/users/profile', {
        method: 'GET',
      });
    },

    updateProfile: async (firstName?: string, lastName?: string, phone?: string, email?: string) => {
      return fetchApi<User>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ firstName, lastName, phone, email }),
      });
    },
  },

  // Cart endpoints
  cart: {
    get: async () => {
      return fetchApi<{ items: OrderItem[]; updated_at: string | null }>('/cart', {
        method: 'GET',
      });
    },

    save: async (items: OrderItem[]) => {
      return fetchApi<{ items: OrderItem[]; updated_at: string }>('/cart', {
        method: 'PUT',
        body: JSON.stringify({ items }),
      });
    },

    clear: async () => {
      return fetchApi('/cart', {
        method: 'DELETE',
      });
    },
  },

  // Health check
  health: async () => {
    return fetchApi('/health', { method: 'GET' });
  },
};

export { getAuthToken, setAuthToken, clearAuthToken };
export type { ApiResponse, User, ApiRestaurant, OrderItem, Order, AuthResponse } from '@/types';
