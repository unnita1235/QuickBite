export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  cuisine_type: string;
  rating: number;
  delivery_time: number;
  address?: string;
  menus?: Menu[];
}

export interface Menu {
  id: number;
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface Order {
  id: number;
  user_id: number;
  restaurant_id: number;
  restaurant_name?: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
  delivery_address?: string;
  delivery_notes?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CreateOrderPayload {
  restaurantId: number;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress?: string;
  deliveryNotes?: string;
}
