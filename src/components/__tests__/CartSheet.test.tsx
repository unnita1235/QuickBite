import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartSheet from '../CartSheet';
import { CartProvider, useCart } from '@/hooks/useCart';
import type { MenuItem } from '@/lib/data';

// Mock Next.js modules
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockMenuItem1: MenuItem = {
  id: 'test-item-1',
  name: 'Margherita Pizza',
  description: 'Classic pizza with tomato sauce and mozzarella',
  price: 12.99,
  image: 'https://example.com/pizza.jpg',
  imageHint: 'delicious margherita pizza',
};

const mockMenuItem2: MenuItem = {
  id: 'test-item-2',
  name: 'Caesar Salad',
  description: 'Fresh romaine lettuce with Caesar dressing',
  price: 8.99,
  image: 'https://example.com/salad.jpg',
  imageHint: 'fresh caesar salad',
};

const mockMenuItem3: MenuItem = {
  id: 'test-item-3',
  name: 'Pasta Carbonara',
  description: 'Creamy pasta with bacon and parmesan',
  price: 14.50,
  image: 'https://example.com/pasta.jpg',
  imageHint: 'creamy carbonara pasta',
};

// Helper component to set up cart state
function CartSheetWithItems({ items }: { items: MenuItem[] }) {
  const { addToCart } = useCart();

  React.useEffect(() => {
    items.forEach((item) => addToCart(item));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <CartSheet />;
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartSheet', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure cart isolation
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders cart trigger button with shopping cart icon', () => {
      render(<CartSheet />, { wrapper });
      const triggerButton = screen.getByRole('button');
      expect(triggerButton).toBeInTheDocument();
    });

    it('does not show item count badge when cart is empty', () => {
      render(<CartSheet />, { wrapper });
      const badge = screen.queryByText(/^\d+$/);
      expect(badge).not.toBeInTheDocument();
    });

    it('shows correct item count badge when cart has items', () => {
      render(<CartSheetWithItems items={[mockMenuItem1, mockMenuItem2]} />, { wrapper });
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('shows correct total quantity in badge when items have multiple quantities', () => {
      // Adding same item twice will increment quantity
      render(<CartSheetWithItems items={[mockMenuItem1, mockMenuItem1, mockMenuItem2]} />, { wrapper });
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays empty cart message when cart is empty', async () => {
      const user = userEvent.setup();
      render(<CartSheet />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
      expect(screen.getByText('Add some delicious food to get started!')).toBeInTheDocument();
    });

    it('does not show checkout button when cart is empty', async () => {
      const user = userEvent.setup();
      render(<CartSheet />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      const checkoutLink = screen.queryByRole('link', { name: /go to checkout/i });
      expect(checkoutLink).not.toBeInTheDocument();
    });
  });

  describe('Cart Items Display', () => {
    it('displays cart items with correct information', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
      expect(screen.getByText('$12.99 each')).toBeInTheDocument();
    });

    it('displays multiple cart items', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1, mockMenuItem2, mockMenuItem3]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
    });

    it('displays item images with correct alt text', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      const image = screen.getByAltText('Margherita Pizza');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/pizza.jpg');
    });

    it('displays correct quantity for each item', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1, mockMenuItem1, mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      // Look for quantity display within the quantity control
      const quantityDisplay = screen.getByText('3', {
        selector: '.px-2.text-sm.font-medium.min-w-\\[2rem\\].text-center'
      });
      expect(quantityDisplay).toBeInTheDocument();
    });
  });

  describe('Quantity Controls', () => {
    it('increases quantity when plus button is clicked', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      const increaseButton = screen.getByRole('button', {
        name: /increase quantity of margherita pizza/i
      });
      await user.click(increaseButton);

      const quantityDisplay = screen.getByText('2', {
        selector: '.px-2.text-sm.font-medium.min-w-\\[2rem\\].text-center'
      });
      expect(quantityDisplay).toBeInTheDocument();
    });

    it('decreases quantity when minus button is clicked', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1, mockMenuItem1, mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      const decreaseButton = screen.getByRole('button', {
        name: /decrease quantity of margherita pizza/i
      });
      await user.click(decreaseButton);

      const quantityDisplay = screen.getByText('2', {
        selector: '.px-2.text-sm.font-medium.min-w-\\[2rem\\].text-center'
      });
      expect(quantityDisplay).toBeInTheDocument();
    });

    it('removes item when quantity is decreased to 0', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      const decreaseButton = screen.getByRole('button', {
        name: /decrease quantity of margherita pizza/i
      });
      await user.click(decreaseButton);

      expect(screen.queryByText('Margherita Pizza')).not.toBeInTheDocument();
      expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });

    it('handles multiple quantity increases correctly', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      const increaseButton = screen.getByRole('button', {
        name: /increase quantity of margherita pizza/i
      });

      await user.click(increaseButton);
      await user.click(increaseButton);
      await user.click(increaseButton);

      const quantityDisplay = screen.getByText('4', {
        selector: '.px-2.text-sm.font-medium.min-w-\\[2rem\\].text-center'
      });
      expect(quantityDisplay).toBeInTheDocument();
    });
  });

  describe('Remove Item', () => {
    it('removes item when trash button is clicked', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      const removeButton = screen.getByRole('button', {
        name: /remove margherita pizza from cart/i
      });
      await user.click(removeButton);

      expect(screen.queryByText('Margherita Pizza')).not.toBeInTheDocument();
      expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });

    it('removes only the specified item when multiple items exist', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1, mockMenuItem2]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      const removeButton = screen.getByRole('button', {
        name: /remove margherita pizza from cart/i
      });
      await user.click(removeButton);

      expect(screen.queryByText('Margherita Pizza')).not.toBeInTheDocument();
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    });
  });

  describe('Subtotal Display', () => {
    it('displays correct subtotal for a single item', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      expect(screen.getByText('Subtotal')).toBeInTheDocument();
      expect(screen.getByText('$12.99')).toBeInTheDocument();
    });

    it('displays correct subtotal for multiple items', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1, mockMenuItem2]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      expect(screen.getByText('$21.98')).toBeInTheDocument();
    });

    it('displays correct subtotal when items have quantities greater than 1', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1, mockMenuItem1, mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      expect(screen.getByText('$38.97')).toBeInTheDocument();
    });

    it('updates subtotal correctly when quantity changes', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      expect(screen.getByText('$12.99')).toBeInTheDocument();

      const increaseButton = screen.getByRole('button', {
        name: /increase quantity of margherita pizza/i
      });
      await user.click(increaseButton);

      expect(screen.getByText('$25.98')).toBeInTheDocument();
    });

    it('displays subtotal with correct decimal formatting', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem3]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      expect(screen.getByText('$14.50')).toBeInTheDocument();
    });
  });

  describe('Checkout Button', () => {
    it('displays checkout button when cart has items', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      const checkoutLink = screen.getByRole('link', { name: /go to checkout/i });
      expect(checkoutLink).toBeInTheDocument();
      expect(checkoutLink).toHaveAttribute('href', '/checkout');
    });

    it('checkout button is present for multiple items', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1, mockMenuItem2, mockMenuItem3]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      const checkoutLink = screen.getByRole('link', { name: /go to checkout/i });
      expect(checkoutLink).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible labels for quantity controls', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      expect(screen.getByRole('button', {
        name: /increase quantity of margherita pizza/i
      })).toBeInTheDocument();
      expect(screen.getByRole('button', {
        name: /decrease quantity of margherita pizza/i
      })).toBeInTheDocument();
    });

    it('has accessible label for remove button', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      expect(screen.getByRole('button', {
        name: /remove margherita pizza from cart/i
      })).toBeInTheDocument();
    });

    it('maintains accessibility labels for multiple different items', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1, mockMenuItem2]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      expect(screen.getByRole('button', {
        name: /increase quantity of margherita pizza/i
      })).toBeInTheDocument();
      expect(screen.getByRole('button', {
        name: /increase quantity of caesar salad/i
      })).toBeInTheDocument();
      expect(screen.getByRole('button', {
        name: /remove margherita pizza from cart/i
      })).toBeInTheDocument();
      expect(screen.getByRole('button', {
        name: /remove caesar salad from cart/i
      })).toBeInTheDocument();
    });
  });

  describe('Complex Scenarios', () => {
    it('handles removing items in sequence', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1, mockMenuItem2]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();

      // Remove first item
      const removeButton1 = screen.getByRole('button', {
        name: /remove margherita pizza from cart/i
      });
      await user.click(removeButton1);

      expect(screen.queryByText('Margherita Pizza')).not.toBeInTheDocument();
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    });

    it('maintains correct state when all items are removed', async () => {
      const user = userEvent.setup();
      render(<CartSheetWithItems items={[mockMenuItem1, mockMenuItem2]} />, { wrapper });

      const triggerButton = screen.getByRole('button');
      await user.click(triggerButton);

      // Remove both items
      const removeButton1 = screen.getByRole('button', {
        name: /remove margherita pizza from cart/i
      });
      await user.click(removeButton1);

      const removeButton2 = screen.getByRole('button', {
        name: /remove caesar salad from cart/i
      });
      await user.click(removeButton2);

      // Should show empty state
      expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /go to checkout/i })).not.toBeInTheDocument();
    });
  });
});
