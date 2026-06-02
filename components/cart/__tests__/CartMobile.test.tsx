import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import CartMobile from '../CartMobile';

// Mock CartItemCard to simplify rendering
vi.mock('../CartItemCard', () => ({
  default: (props: any) => (
    <div data-testid="cart-item-card">
      {props.item.name} - {props.userId}
    </div>
  ),
}));

describe('CartMobile', () => {
  const mockOnRefresh = vi.fn();
  const mockUserId = 'user-123';

  const mockCartItems = [
    {
      productId: 'prod-1',
      name: 'Product 1',
      description: 'Desc 1',
      price: 15.00,
      image_url: 'http://example.com/1.jpg',
      category: { id: 'c1', name: 'Cat 1' },
      quantity: 2,
      available: 5,
    },
    {
      productId: 'prod-2',
      name: 'Product 2',
      description: 'Desc 2',
      price: 10.50,
      image_url: 'http://example.com/2.jpg',
      category: { id: 'c2', name: 'Cat 2' },
      quantity: 3,
      available: 10,
    },
  ];

  it('renders a list of CartItemCards and the total amount', () => {
    render(
      <CartMobile
        cartItems={mockCartItems}
        userId={mockUserId}
        onRefresh={mockOnRefresh}
      />
    );

    // Assert that the items are rendered with correct props
    const cards = screen.getAllByTestId('cart-item-card');
    expect(cards).toHaveLength(2);
    expect(cards[0].textContent).toBe('Product 1 - user-123');
    expect(cards[1].textContent).toBe('Product 2 - user-123');

    // Total: 15.00 * 2 + 10.50 * 3 = 30 + 31.5 = 61.50
    expect(screen.getByText('Total Amount: $61.50')).toBeInTheDocument();
  });
});
