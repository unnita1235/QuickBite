'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { MenuItem } from '@/lib/data';

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

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      try {
        localStorage.setItem('quickbite-cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to localStorage", error);
      }
    }
  }, [cartItems, isInitialLoad]);

  /**
   * Adds an item to the cart. If the item already exists, increments its quantity.
   * @param item - The menu item to add to the cart
   */
  const addToCart = (item: MenuItem) => {
    setCartItems((prevItems: CartItem[]) => {
      const existingItem = prevItems.find((cartItem: CartItem) => cartItem.id === item.id);
      if (existingItem) {
        // Item already in cart - increment quantity
        return prevItems.map((cartItem: CartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // New item - add with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems: CartItem[]) => prevItems.filter((item: CartItem) => item.id !== itemId));
  };

  /**
   * Updates the quantity of an item in the cart.
   * If quantity is 0 or less, the item is removed from the cart.
   * @param itemId - The ID of the item to update
   * @param quantity - The new quantity (must be > 0)
   */
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
  };

  /**
   * Calculates the total price of all items in the cart.
   * @returns The sum of (item price * quantity) for all cart items
   */
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