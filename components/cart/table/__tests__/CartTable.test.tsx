import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import CartTable from '../CartTable';
import * as cartApi from '@/apis/cart';
import axios from 'axios';
import { message } from 'antd';

// Mock CartItemCard to simplify rendering
vi.mock('../../CartItemCard', () => ({
  default: (props: any) => <div data-testid="cart-item-card">{props.item.name}</div>,
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

describe('CartTable', () => {
  const mockOnRefresh = vi.fn();
  const mockUserId = 'user-123';

  const mockCartItems = [
    {
      productId: 'prod-1',
      name: 'Product 1',
      description: 'Desc 1',
      price: 10,
      image_url: 'http://example.com/1.jpg',
      category: { id: 'c1', name: 'Cat 1' },
      quantity: 2,
      available: 5,
    },
    {
      productId: 'prod-2',
      name: 'Product 2',
      description: 'Desc 2',
      price: 25.5,
      image_url: 'http://example.com/2.jpg',
      category: { id: 'c2', name: 'Cat 2' },
      quantity: 1,
      available: 10,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table columns and rows correctly', () => {
    render(
      <CartTable
        cartItems={mockCartItems}
        userId={mockUserId}
        onRefresh={mockOnRefresh}
      />
    );

    // Header cells
    expect(screen.getByText('Items')).toBeInTheDocument();
    expect(screen.getByText('Unit Price')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Total Price')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Renders the mocked CartItemCard components
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();

    // Unit prices
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getAllByText('$25.50')).toHaveLength(2); // One for Unit Price, one for Total Price

    // Total prices for rows
    expect(screen.getByText('$20.00')).toBeInTheDocument();
    // Sum for row 2 is 25.5 * 1 = 25.50 (captured in the getAllByText assert above)
    // Overall sum: 10 * 2 + 25.5 * 1 = 45.50
    expect(screen.getByText('$45.50')).toBeInTheDocument();
  });

  it('calculates and shows the correct total amount in summary row', () => {
    render(
      <CartTable
        cartItems={mockCartItems}
        userId={mockUserId}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText('Total Amount:')).toBeInTheDocument();
    // The sum is 10 * 2 + 25.5 * 1 = 45.50
    expect(screen.getByText('$45.50')).toBeInTheDocument();
  });

  it('calls editCartItem and onRefresh on quantity change', async () => {
    const user = userEvent.setup();
    mockedEditCartItem.mockResolvedValue({} as any);

    render(
      <CartTable
        cartItems={mockCartItems}
        userId={mockUserId}
        onRefresh={mockOnRefresh}
      />
    );

    // Find the spinbutton (quantity input) for Product 1 (value 2)
    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    expect(Number(inputs[0].value)).toBe(2);

    await user.clear(inputs[0]);
    await user.type(inputs[0], '4');

    await waitFor(() => {
      expect(mockedEditCartItem).toHaveBeenCalledWith({
        userId: mockUserId,
        productId: 'prod-1',
        quantity: 4,
      });
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });

  it('displays error message if editCartItem fails', async () => {
    const user = userEvent.setup();
    const axiosError = {
      response: { data: { detail: 'Unable to set quantity' } },
      isAxiosError: true,
    };
    mockedAxios.isAxiosError.mockReturnValue(true);
    mockedEditCartItem.mockRejectedValue(axiosError);

    render(
      <CartTable
        cartItems={mockCartItems}
        userId={mockUserId}
        onRefresh={mockOnRefresh}
      />
    );

    const inputs = screen.getAllByRole('spinbutton');
    await user.clear(inputs[0]);
    await user.type(inputs[0], '4');

    await waitFor(() => {
      expect(mockedEditCartItem).toHaveBeenCalled();
      expect(message.error).toHaveBeenCalledWith({
        content: 'Unable to set quantity',
        duration: 2,
      });
      expect(mockOnRefresh).not.toHaveBeenCalled();
    });
  });

  it('calls deleteCartItems and onRefresh on delete click', async () => {
    const user = userEvent.setup();
    mockedDeleteCartItems.mockResolvedValue({} as any);

    render(
      <CartTable
        cartItems={mockCartItems}
        userId={mockUserId}
        onRefresh={mockOnRefresh}
      />
    );

    // Find the delete button containing the trash icon for the first row
    const trashIcons = screen.getAllByTestId('trash-icon');
    const deleteBtn = trashIcons[0].closest('button');
    expect(deleteBtn).toBeInTheDocument();
    if (deleteBtn) await user.click(deleteBtn);

    await waitFor(() => {
      expect(mockedDeleteCartItems).toHaveBeenCalledWith({
        userId: mockUserId,
        productIds: ['prod-1'],
      });
      expect(mockOnRefresh).toHaveBeenCalled();
      expect(message.success).toHaveBeenCalledWith('Item removed from cart');
    });
  });

  it('displays error message if deleteCartItems fails', async () => {
    const user = userEvent.setup();
    const axiosError = {
      response: { data: { detail: 'Delete failed' } },
      isAxiosError: true,
    };
    mockedAxios.isAxiosError.mockReturnValue(true);
    mockedDeleteCartItems.mockRejectedValue(axiosError);

    render(
      <CartTable
        cartItems={mockCartItems}
        userId={mockUserId}
        onRefresh={mockOnRefresh}
      />
    );

    const trashIcons = screen.getAllByTestId('trash-icon');
    const deleteBtn = trashIcons[0].closest('button');
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
