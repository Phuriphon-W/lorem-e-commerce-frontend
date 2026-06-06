import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import CartItemCard from '../CartItemCard';
import * as cartApi from '@/apis/cart';
import axios from 'axios';
import { message } from 'antd';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    return React.createElement('img', { alt: props.alt as string, src: props.src as string });
  },
}));

// Mock FontAwesomeIcon
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="trash-icon" />,
}));

// Mock APIs
vi.mock('@/apis/cart', () => ({
  editCartItem: vi.fn(),
  deleteCartItems: vi.fn(),
}));
const mockedEditCartItem = vi.mocked(cartApi.editCartItem);
const mockedDeleteCartItems = vi.mocked(cartApi.deleteCartItems);

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

describe('CartItemCard', () => {
  const mockOnRefresh = vi.fn();
  const mockUserId = 'user-123';

  const mockItem = {
    productId: 'prod-999',
    name: 'Fancy Shoes',
    description: 'Very fancy shoes indeed.',
    price: 49.90,
    image_url: 'http://example.com/shoes.jpg',
    category: { id: 'cat-2', name: 'Accessories' },
    quantity: 2,
    available: 5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders general item details correctly', () => {
    render(<CartItemCard item={mockItem} userId={mockUserId} onRefresh={mockOnRefresh} />);

    expect(screen.getByText('Fancy Shoes')).toBeInTheDocument();
    expect(screen.getByAltText('Fancy Shoes-image')).toBeInTheDocument();
    expect(screen.getByAltText('Fancy Shoes-image')).toHaveAttribute('src', 'http://example.com/shoes.jpg');
    expect(screen.getByText('$49.90')).toBeInTheDocument();
    expect(screen.getByText('Total Price: $99.80')).toBeInTheDocument();
  });

  it('calls editCartItem and onRefresh on quantity change', async () => {
    const user = userEvent.setup();
    mockedEditCartItem.mockResolvedValue({} as any);

    render(<CartItemCard item={mockItem} userId={mockUserId} onRefresh={mockOnRefresh} />);

    const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(Number(quantityInput.value)).toBe(2);

    await user.clear(quantityInput);
    await user.type(quantityInput, '3');

    await waitFor(() => {
      expect(mockedEditCartItem).toHaveBeenCalledWith({
        userId: mockUserId,
        productId: 'prod-999',
        quantity: 3,
      });
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });

  it('shows error message if editCartItem fails', async () => {
    const user = userEvent.setup();
    const axiosError = {
      response: { data: { detail: 'Insufficient stock' } },
      isAxiosError: true,
    };
    mockedAxios.isAxiosError.mockReturnValue(true);
    mockedEditCartItem.mockRejectedValue(axiosError);

    render(<CartItemCard item={mockItem} userId={mockUserId} onRefresh={mockOnRefresh} />);

    const quantityInput = screen.getByRole('spinbutton');
    await user.clear(quantityInput);
    await user.type(quantityInput, '3');

    await waitFor(() => {
      expect(mockedEditCartItem).toHaveBeenCalled();
      expect(message.error).toHaveBeenCalledWith({
        content: 'Insufficient stock',
        duration: 2,
      });
      expect(mockOnRefresh).not.toHaveBeenCalled();
    });
  });

  it('calls deleteCartItems and onRefresh on delete click', async () => {
    const user = userEvent.setup();
    mockedDeleteCartItems.mockResolvedValue({} as any);

    render(<CartItemCard item={mockItem} userId={mockUserId} onRefresh={mockOnRefresh} />);

    const trashIcon = screen.getByTestId('trash-icon');
    const deleteBtn = trashIcon.closest('button');
    expect(deleteBtn).toBeInTheDocument();
    if (deleteBtn) await user.click(deleteBtn);

    await waitFor(() => {
      expect(mockedDeleteCartItems).toHaveBeenCalledWith({
        userId: mockUserId,
        productIds: ['prod-999'],
      });
      expect(mockOnRefresh).toHaveBeenCalled();
      expect(message.success).toHaveBeenCalledWith('Item removed from cart');
    });
  });

  it('shows error message if deleteCartItems fails', async () => {
    const user = userEvent.setup();
    const axiosError = {
      response: { data: { detail: 'Delete failed' } },
      isAxiosError: true,
    };
    mockedAxios.isAxiosError.mockReturnValue(true);
    mockedDeleteCartItems.mockRejectedValue(axiosError);

    render(<CartItemCard item={mockItem} userId={mockUserId} onRefresh={mockOnRefresh} />);

    const trashIcon = screen.getByTestId('trash-icon');
    const deleteBtn = trashIcon.closest('button');
    expect(deleteBtn).toBeInTheDocument();
    if (deleteBtn) await user.click(deleteBtn);

    await waitFor(() => {
      expect(mockedDeleteCartItems).toHaveBeenCalled();
      expect(message.error).toHaveBeenCalledWith({
        content: 'Delete failed',
        duration: 2,
      });
      expect(mockOnRefresh).not.toHaveBeenCalled();
    });
  });
});
