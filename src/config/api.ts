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
  first_name?: string;
  last_name?: string;
  phone?: string;
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
  delivery_charge?: number;
  min_order?: number;
  image_url?: string;
  address: string;
  phone?: string;
  is_active?: boolean;
  menus?: Menu[];
  created_at?: string;
  updated_at?: string;
}

interface Menu {
  id: number;
  restaurant_id?: number;
  name: string;
  items: MenuItem[];
  created_at?: string;
  updated_at?: string;
}

interface MenuItem {
  id: number | string;
  name: string;
  price: number;
  description: string;
  image?: string;
  quantity?: number;
}

interface Order {
  id: number;
  user_id: number;
  restaurant_id: number;
  restaurant_name?: string;
  items: MenuItem[];
  total_amount: number;
  delivery_fee?: number;
  delivery_address?: string;
  delivery_notes?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  imageHint: string;
  quantity: number;
}

interface SearchParams {
  query: string;
  cuisineType?: string;
  minRating?: number;
  maxDeliveryTime?: number;
  limit?: number;
  offset?: number;
}

interface SearchResponse {
  results: Restaurant[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
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

      // Server returns token/user at top level, map to data field
      const raw = response as ApiResponse<AuthResponse> & { token?: string; user?: User };
      if (response.success && (response.data?.token || raw.token)) {
        const token = response.data?.token || raw.token;
        const user = response.data?.user || raw.user;
        if (token) {
          setAuthToken(token);
        }
        if (!response.data && token && user) {
          response.data = { token, user } as AuthResponse;
        }
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
      return fetchApi<PaginatedResponse<Restaurant>>(
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
    create: async (
      restaurantId: number,
      items: MenuItem[],
      totalAmount: number,
      deliveryAddress?: string,
      deliveryNotes?: string
    ) => {
      return fetchApi<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          restaurantId,
          items,
          totalAmount,
          deliveryAddress,
          deliveryNotes,
        }),
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

    updateStatus: async (id: string | number, status: string) => {
      return fetchApi<Order>(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
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

    updateProfile: async (profile: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
    }) => {
      return fetchApi<User>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
    },
  },

  // Cart endpoints
  cart: {
    get: async <T = CartItem>() => {
      return fetchApi<{ items: T[]; updated_at: string | null }>('/cart', {
        method: 'GET',
      });
    },

    save: async <T = CartItem>(items: T[]) => {
      return fetchApi<{ items: T[]; updated_at: string }>('/cart', {
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

  // Search endpoint
  search: async (params: SearchParams) => {
    return fetchApi<SearchResponse>('/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Health check
  health: async () => {
    return fetchApi('/health', { method: 'GET' });
  },
};

export { getAuthToken, setAuthToken, clearAuthToken };
export type {
  ApiResponse,
  User,
  Restaurant,
  Menu,
  MenuItem,
  Order,
  AuthResponse,
  CartItem,
  SearchParams,
  SearchResponse,
  PaginatedResponse,
};
