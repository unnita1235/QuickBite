'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quickbite-backend-zsdz.onrender.com/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  token?: string;
  user?: any;
  pagination?: any;
}

// Helper function for API calls
const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add JWT token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Authentication APIs
export const authApi = {
  register: async (email: string, password: string, name: string) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  login: async (email: string, password: string) => {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token);
      }
    }
    
    return response;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },
};

// Restaurant APIs
export const restaurantApi = {
  getAll: async (page = 0, limit = 20) =>
    apiFetch(`/restaurants?page=${page}&limit=${limit}`, {
      method: 'GET',
    }),

  getById: async (id: string | number) =>
    apiFetch(`/restaurants/${id}`, {
      method: 'GET',
    }),

  create: async (restaurantData: any) =>
    apiFetch('/restaurants', {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    }),
};

// Order APIs
export const orderApi = {
  create: async (restaurantId: number, items: any[], totalAmount: number) =>
    apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify({ restaurantId, items, totalAmount }),
    }),

  getAll: async () =>
    apiFetch('/orders', {
      method: 'GET',
    }),

  getById: async (id: string | number) =>
    apiFetch(`/orders/${id}`, {
      method: 'GET',
    }),
};

// User APIs
export const userApi = {
  getProfile: async () =>
    apiFetch('/users/profile', {
      method: 'GET',
    }),

  updateProfile: async (userData: any) =>
    apiFetch('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};

// Health check
export const healthApi = {
  check: async () =>
    apiFetch('/health', {
      method: 'GET',
    }),
};

export default {
  auth: authApi,
  restaurants: restaurantApi,
  orders: orderApi,
  users: userApi,
  health: healthApi,
};
