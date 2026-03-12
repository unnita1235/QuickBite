export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageHint: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  rating: number;
  deliveryTime: number;
  image: string;
  imageHint: string;
  menu: MenuCategory[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  created_at?: string;
  last_name?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface OrderItem {
  id?: number | string;
  name: string;
  price: number;
  quantity?: number;
  description?: string;
}

export interface Order {
  id: number;
  user_id: number;
  restaurant_id: number;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
  delivery_address: string | null;
  delivery_notes: string | null;
  created_at: string;
  updated_at: string | null;
  completed_at: string | null;
  restaurant_name?: string;
}

export interface ApiRestaurant {
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

export interface ApiMenu {
  id: number;
  name: string;
  items: ApiMenuItem[];
}

export interface ApiMenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}
