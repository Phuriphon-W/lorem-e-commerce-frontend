import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ProductDetails from '../ProductDetails';
import * as cartApi from '@/apis/cart';
import { useAuthContext } from '@/shared/hooks/useAuthContext';
import axios from 'axios';
import { message } from 'antd';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    return React.createElement('img', { alt: props.alt as string, src: props.src as string });
  },
}));

// Mock API layer
vi.mock('@/apis/cart', () => ({
  addCartItem: vi.fn(),
}));
const mockedAddCartItem = vi.mocked(cartApi.addCartItem);

// Mock Auth Context hook
vi.mock('@/shared/hooks/useAuthContext', () => ({
  useAuthContext: vi.fn(),
}));
const mockedUseAuthContext = vi.mocked(useAuthContext);

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

// Mock antd message
vi.mock('antd', async () => {
  const original = await vi.importActual<any>('antd');
  return {
    ...original,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  };
});

describe('ProductDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuthContext.mockReturnValue({ userId: 'user-123' } as any);
  });

  const mockProduct = {
    id: 'prod-123',
    name: 'Awesome T-Shirt',
    description: 'Best T-Shirt in the universe.',
    price: 25.50,
    available: 5,
    image_url: 'http://example.com/tshirt.jpg',
    category: {
      id: 'cat-1',
      name: 'Apparel',
    },
  };

  it('renders all product information correctly', () => {
    render(<ProductDetails product={mockProduct} />);

    expect(screen.getByText('Awesome T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('$25.50')).toBeInTheDocument();
    expect(screen.getByText('Apparel')).toBeInTheDocument();
    expect(screen.getByText('5 in stock')).toBeInTheDocument();
    expect(screen.getByText('Best T-Shirt in the universe.')).toBeInTheDocument();
    expect(screen.getByAltText('Awesome T-Shirt-image')).toBeInTheDocument();
  });

  it('allows quantity input change up to available limit', async () => {
    const user = userEvent.setup();
    render(<ProductDetails product={mockProduct} />);

    const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(quantityInput).toBeInTheDocument();
    expect(Number(quantityInput.value)).toBe(1);

    // Change quantity to 3
    await user.clear(quantityInput);
    await user.type(quantityInput, '3');
    expect(Number(quantityInput.value)).toBe(3);
  });

  it('enforces available stock limit as the maximum quantity when input is too high', async () => {
    const user = userEvent.setup();
    render(<ProductDetails product={mockProduct} />);

    const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;
    await user.clear(quantityInput);
    await user.type(quantityInput, '10');
    fireEvent.blur(quantityInput);

    await waitFor(() => {
      expect(Number(quantityInput.value)).toBe(5);
    });
  });

  it('does not call addCartItem if userId is not present', async () => {
    mockedUseAuthContext.mockReturnValue({ userId: null } as any);
    const user = userEvent.setup();
    render(<ProductDetails product={mockProduct} />);

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addButton);

    expect(mockedAddCartItem).not.toHaveBeenCalled();
  });

  it('calls addCartItem and shows success message on successful add to cart', async () => {
    const user = userEvent.setup();
    mockedAddCartItem.mockResolvedValue({} as any);

    render(<ProductDetails product={mockProduct} />);

    const quantityInput = screen.getByRole('spinbutton');
    await user.clear(quantityInput);
    await user.type(quantityInput, '2');

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(mockedAddCartItem).toHaveBeenCalledWith({
        userId: 'user-123',
        productId: 'prod-123',
        quantity: 2,
      });
      expect(message.success).toHaveBeenCalledWith('Added 2 items to your cart!');
    });
  });

  it('shows custom error message on Axios error with detail', async () => {
    const user = userEvent.setup();
    const axiosError = {
      response: { data: { detail: 'Insufficient stock available' } },
      isAxiosError: true,
    };
    mockedAxios.isAxiosError.mockReturnValue(true);
    mockedAddCartItem.mockRejectedValue(axiosError);

    render(<ProductDetails product={mockProduct} />);

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith({
        content: 'Insufficient stock available',
        style: expect.any(Object),
      });
    });
  });

  it('shows generic fallback error message on Axios error without detail', async () => {
    const user = userEvent.setup();
    const axiosError = {
      response: { data: {} },
      isAxiosError: true,
    };
    mockedAxios.isAxiosError.mockReturnValue(true);
    mockedAddCartItem.mockRejectedValue(axiosError);

    render(<ProductDetails product={mockProduct} />);

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith({
        content: 'Something went wrong. Please try again.',
        style: expect.any(Object),
      });
    });
  });

  it('shows generic error message on non-Axios error', async () => {
    const user = userEvent.setup();
    mockedAxios.isAxiosError.mockReturnValue(false);
    mockedAddCartItem.mockRejectedValue(new Error('Network failure'));

    render(<ProductDetails product={mockProduct} />);

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith({
        content: 'Something went wrong. Please try again.',
        style: expect.any(Object),
      });
    });
  });
});
