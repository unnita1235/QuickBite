'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quickbite-backend-zsdz.onrender.com/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface Restaurant {
  id: number;
  name: string;
  description: string;
  cuisine_type: string;
  rating: number;
  delivery_time: number;
  address: string;
  menus?: Menu[];
}

interface Menu {
  id: number;
  name: string;
  items: MenuItem[];
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface Order {
  id: number;
  user_id: number;
  restaurant_id: number;
  items: MenuItem[];
  total_amount: number;
  status: string;
  created_at: string;
}

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
const fetchApi = async<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
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
      return fetchApi<User>('/auth/register', {
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
      return fetchApi<{ data: Restaurant[]; pagination: any }>(
        `/restaurants?page=${page}&limit=${limit}`,
        { method: 'GET' }
      );
    },

    getById: async (id: string | number) => {
      return fetchApi<Restaurant>(`/restaurants/${id}`, {
        method: 'GET',
      });
    },

    create: async (restaurant: Partial<Restaurant>) => {
      return fetchApi<Restaurant>('/restaurants', {
        method: 'POST',
        body: JSON.stringify(restaurant),
      });
    },
  },

  // Order endpoints
  orders: {
    create: async (restaurantId: number, items: MenuItem[], totalAmount: number) => {
      return fetchApi<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify({ restaurantId, items, totalAmount }),
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

    updateProfile: async (name?: string, email?: string) => {
      return fetchApi<User>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, email }),
      });
    },
  },

  // Health check
  health: async () => {
    return fetchApi('/health', { method: 'GET' });
  },
};

export { getAuthToken, setAuthToken, clearAuthToken };
export type { ApiResponse, User, Restaurant, Menu, MenuItem, Order, AuthResponse };
