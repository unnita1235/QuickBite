import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import OrderSummary from '../OrderSummary';
import { CartProvider, useCart } from '@/hooks/useCart';
import type { MenuItem } from '@/lib/data';

const mockMenuItem1: MenuItem = {
  id: '1-1',
  name: 'Test Item 1',
  description: 'Test Description 1',
  price: 10.99,
  image: 'https://example.com/test1.jpg',
  imageHint: 'test image 1',
};

const mockMenuItem2: MenuItem = {
  id: '1-2',
  name: 'Test Item 2',
  description: 'Test Description 2',
  price: 5.99,
  image: 'https://example.com/test2.jpg',
  imageHint: 'test image 2',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('OrderSummary', () => {
  it('renders order summary title', () => {
    render(<OrderSummary />, { wrapper });
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
  });

  it('displays empty state when cart is empty', () => {
    render(<OrderSummary />, { wrapper });
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('displays cart items with quantities', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockMenuItem1);
      result.current.addToCart(mockMenuItem1); // Add twice to test quantity
      result.current.addToCart(mockMenuItem2);
    });

    render(<OrderSummary />, { wrapper });
    
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
    expect(screen.getByText('Qty: 1')).toBeInTheDocument();
  });

  it('calculates and displays correct total', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    // Clear cart first
    act(() => {
      result.current.clearCart();
    });
    
    act(() => {
      result.current.addToCart(mockMenuItem1);
      result.current.addToCart(mockMenuItem2);
    });

    render(<OrderSummary />, { wrapper });
    
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    // Total should be 10.99 + 5.99 = 16.98
    expect(screen.getByText('$16.98')).toBeInTheDocument();
  });
});
