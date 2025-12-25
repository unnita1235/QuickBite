import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../useCart';
import type { MenuItem } from '@/lib/data';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockMenuItem: MenuItem = {
  id: '1-1',
  name: 'Test Item',
  description: 'Test Description',
  price: 10.99,
  image: 'test.jpg',
  imageHint: 'test image',
};

describe('useCart', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockMenuItem);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].name).toBe('Test Item');
    expect(result.current.cartItems[0].quantity).toBe(1);
    expect(result.current.getTotalPrice()).toBe(10.99);
  });

  it('should increment quantity when adding same item twice', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.addToCart(mockMenuItem);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(2);
    expect(result.current.getTotalPrice()).toBe(21.98);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockMenuItem);
    });

    expect(result.current.cartItems).toHaveLength(1);

    act(() => {
      result.current.removeFromCart(mockMenuItem.id);
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.updateQuantity(mockMenuItem.id, 3);
    });

    expect(result.current.cartItems[0].quantity).toBe(3);
    expect(result.current.getTotalPrice()).toBe(32.97);
  });

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.updateQuantity(mockMenuItem.id, 0);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockMenuItem);
    });

    expect(result.current.cartItems).toHaveLength(1);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it('should calculate total price correctly with multiple items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const item2: MenuItem = {
      ...mockMenuItem,
      id: '1-2',
      name: 'Item 2',
      price: 5.99,
    };

    act(() => {
      result.current.addToCart(mockMenuItem);
      result.current.addToCart(mockMenuItem);
      result.current.addToCart(item2);
    });

    expect(result.current.getTotalPrice()).toBe(27.97); // 10.99 * 2 + 5.99
  });
});

