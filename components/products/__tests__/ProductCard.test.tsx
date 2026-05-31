import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ProductCard from '../ProductCard';

// Mock useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', { alt: props.alt as string, src: props.src as string });
  },
}));

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProduct = {
    id: 'prod-123',
    name: 'Sample Product',
    description: 'This is a sample product description.',
    price: 99.99,
    available: 10,
    image_url: 'http://example.com/image.jpg',
    category: {
      id: 'cat-1',
      name: 'Apparel',
    },
  };

  it('renders the product name, price, and image', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Sample Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByAltText('Sample Product-image')).toBeInTheDocument();
    expect(screen.getByAltText('Sample Product-image')).toHaveAttribute('src', 'http://example.com/image.jpg');
  });

  it('navigates to product detail page on click', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);

    // Click on the card
    const card = screen.getByText('Sample Product').closest('.hover\\:cursor-pointer');
    expect(card).toBeInTheDocument();
    if (card) {
      await user.click(card);
      expect(mockPush).toHaveBeenCalledWith('/product/prod-123');
    }
  });
});
