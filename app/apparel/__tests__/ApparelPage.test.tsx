import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ApparelPage from '../page';
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
  usePathname: () => '/apparel',
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', { alt: props.alt as string, src: props.src as string });
  },
}));

// Mock getProducts API
vi.mock('@/apis/product', () => ({
  getProducts: vi.fn(),
}));
const mockedGetProducts = vi.mocked(productApi.getProducts);

describe('ApparelPage', () => {
  const mockProductsResponse = {
    products: [
      {
        id: 'prod-1',
        name: 'Apparel A',
        description: 'Description A',
        price: 19.99,
        available: 10,
        image_url: 'http://example.com/a.jpg',
        category: { id: 'cat-1', name: 'Apparel' },
      },
      {
        id: 'prod-2',
        name: 'Apparel B',
        description: 'Description B',
        price: 29.99,
        available: 5,
        image_url: 'http://example.com/b.jpg',
        category: { id: 'cat-1', name: 'Apparel' },
      },
    ],
    total: 20,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    mockedGetProducts.mockResolvedValue(mockProductsResponse);
  });

  it('renders search bar, product cards, and pagination correctly', async () => {
    render(<ApparelPage />);

    expect(screen.getByPlaceholderText('Enter Product Name')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedGetProducts).toHaveBeenCalled();
      expect(screen.getByText('Apparel A')).toBeInTheDocument();
      expect(screen.getByText('Apparel B')).toBeInTheDocument();
    });

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('navigates to next page on pagination change', async () => {
    mockSearchParams = new URLSearchParams('page=1');
    const user = userEvent.setup();
    render(<ApparelPage />);

    await waitFor(() => {
      expect(screen.getByText('Apparel A')).toBeInTheDocument();
    });

    const page2Button = screen.getByTitle('2');
    await user.click(page2Button);

    expect(mockPush).toHaveBeenCalledWith('/apparel?page=2');
  });

  it('resets page parameter to 1 when changing search keyword', async () => {
    mockSearchParams = new URLSearchParams('page=2');
    const user = userEvent.setup();
    render(<ApparelPage />);

    await waitFor(() => {
      expect(screen.getByText('Apparel A')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Enter Product Name');
    await user.type(searchInput, 'shirt');
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/apparel?page=1&search=shirt');
    });
  });

  it('resets page parameter to 1 when changing orderBy sorting', async () => {
    mockSearchParams = new URLSearchParams('page=2');
    const user = userEvent.setup();
    render(<ApparelPage />);

    await waitFor(() => {
      expect(screen.getByText('Apparel A')).toBeInTheDocument();
    });

    const orderSelect = screen.getByText('Newest Arrivals');
    await user.click(orderSelect);
    const optionPriceAsc = await screen.findByText('Price: Low to High');
    await user.click(optionPriceAsc);

    expect(mockPush).toHaveBeenCalledWith('/apparel?page=1&orderBy=price_low');
  });
});
