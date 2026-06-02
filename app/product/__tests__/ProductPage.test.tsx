import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ProductPage from '../page';
import * as productApi from '@/apis/product';

// Setup router / search params / pathname mocks
const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/product',
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    return React.createElement('img', { alt: props.alt as string, src: props.src as string });
  },
}));

// Mock getProducts API
vi.mock('@/apis/product', () => ({
  getProducts: vi.fn(),
}));
const mockedGetProducts = vi.mocked(productApi.getProducts);

describe('ProductPage', () => {
  const mockProductsResponse = {
    products: [
      {
        id: 'prod-1',
        name: 'Product A',
        description: 'Description A',
        price: 19.99,
        available: 10,
        image_url: 'http://example.com/a.jpg',
        category: { id: 'cat-1', name: 'Apparel' },
      },
      {
        id: 'prod-2',
        name: 'Product B',
        description: 'Description B',
        price: 29.99,
        available: 5,
        image_url: 'http://example.com/b.jpg',
        category: { id: 'cat-2', name: 'Accessory' },
      },
    ],
    total: 20, // Total 20 items, so with page size 10 we'll have at least 2 pages
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    mockedGetProducts.mockResolvedValue(mockProductsResponse);
  });

  it('renders search bar, product cards, and pagination correctly', async () => {
    render(<ProductPage />);

    // Check search input renders
    expect(screen.getByPlaceholderText('Enter Product Name')).toBeInTheDocument();

    // Wait for products to load and render
    await waitFor(() => {
      expect(mockedGetProducts).toHaveBeenCalled();
      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
    });

    // Check pagination exists (next page button / quick jumper, etc.)
    expect(screen.getByRole('list')).toBeInTheDocument(); // Ant Design Pagination uses <ul>
  });

  it('navigates to next page on pagination change', async () => {
    mockSearchParams = new URLSearchParams('page=1');
    const user = userEvent.setup();
    render(<ProductPage />);

    await waitFor(() => {
      expect(screen.getByText('Product A')).toBeInTheDocument();
    });

    // Click on page 2 button
    const page2Button = screen.getByTitle('2');
    await user.click(page2Button);

    expect(mockPush).toHaveBeenCalledWith('/product?page=2');
  });

  it('resets page parameter to 1 when changing category filter', async () => {
    mockSearchParams = new URLSearchParams('page=2');
    const user = userEvent.setup();
    render(<ProductPage />);

    await waitFor(() => {
      expect(screen.getByText('Product A')).toBeInTheDocument();
    });

    // Open Category Select
    const categorySelect = screen.getByText('All Products');
    await user.click(categorySelect);

    // Click option "Accessories"
    const optionAccessory = await screen.findByText('Accessories');
    await user.click(optionAccessory);

    expect(mockPush).toHaveBeenCalledWith('/product?page=1&category=accessory');
  });

  it('resets page parameter to 1 when changing search keyword', async () => {
    mockSearchParams = new URLSearchParams('page=2');
    const user = userEvent.setup();
    render(<ProductPage />);

    await waitFor(() => {
      expect(screen.getByText('Product A')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Enter Product Name');
    await user.type(searchInput, 'jacket');
    // Press Enter to trigger search
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/product?page=1&search=jacket');
    });
  });

  it('resets page parameter to 1 when changing orderBy sorting', async () => {
    mockSearchParams = new URLSearchParams('page=2');
    const user = userEvent.setup();
    render(<ProductPage />);

    await waitFor(() => {
      expect(screen.getByText('Product A')).toBeInTheDocument();
    });

    const orderSelect = screen.getByText('Newest Arrivals');
    await user.click(orderSelect);
    const optionPriceAsc = await screen.findByText('Price: Low to High');
    await user.click(optionPriceAsc);

    expect(mockPush).toHaveBeenCalledWith('/product?page=1&orderBy=price_low');
  });
});
