'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import type { MenuItem } from '@/lib/data';
import { api, getAuthToken } from '@/config/api';

export type CartItem = MenuItem & {
  quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load cart: try server first (if authenticated), then localStorage
  useEffect(() => {
    const loadCart = async () => {
      const token = getAuthToken();

      if (token) {
        try {
          const response = await api.cart.get();
          if (response.success && response.data?.items && response.data.items.length > 0) {
            setCartItems(response.data.items);
            setIsInitialLoad(false);
            return;
          }
        } catch {
          // Fall through to localStorage
        }
      }

      try {
        const storedCart = localStorage.getItem('quickbite-cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        localStorage.removeItem('quickbite-cart');
      }

      setIsInitialLoad(false);
    };

    loadCart();
  }, []);

  // Sync cart to localStorage and server (debounced)
  const syncCart = useCallback((items: CartItem[]) => {
    // Always persist to localStorage
    try {
      localStorage.setItem('quickbite-cart', JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }

    // Debounced sync to server if authenticated
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      const token = getAuthToken();
      if (token) {
        try {
          await api.cart.save(items);
        } catch {
          // Silently fail - localStorage is the fallback
        }
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      syncCart(cartItems);
    }
  }, [cartItems, isInitialLoad, syncCart]);

  const addToCart = (item: MenuItem) => {
    setCartItems((prevItems: CartItem[]) => {
      const existingItem = prevItems.find((cartItem: CartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map((cartItem: CartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems: CartItem[]) => prevItems.filter((item: CartItem) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems: CartItem[]) =>
      prevItems.map((item: CartItem) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    // Also clear server cart
    const token = getAuthToken();
    if (token) {
      api.cart.clear().catch(() => {});
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);
  };

  const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
