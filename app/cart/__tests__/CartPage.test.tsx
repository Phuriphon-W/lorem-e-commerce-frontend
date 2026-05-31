import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import CartPage from '../page';
import * as cartApi from '@/apis/cart';
import * as orderApi from '@/apis/order';
import * as userApi from '@/apis/user';
import { useAuthContext } from '@/shared/hooks/useAuthContext';
import useMediaQuery from '@/shared/hooks/useMediaQuery';
import { message } from 'antd';

// Mock useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock sub-components
vi.mock('@/components/cart/table/CartTable', () => ({
  default: (props: any) => <div data-testid="cart-table">Table Items: {props.cartItems.length}</div>,
}));

vi.mock('@/components/cart/CartMobile', () => ({
  default: (props: any) => <div data-testid="cart-mobile">Mobile Items: {props.cartItems.length}</div>,
}));

vi.mock('@/components/global/NoData', () => ({
  default: (props: any) => <div data-testid="no-data">No {props.text}</div>,
}));

// Mock API layer
vi.mock('@/apis/cart', () => ({
  getCartByUserId: vi.fn(),
  deleteCartItems: vi.fn(),
}));
const mockedGetCartByUserId = vi.mocked(cartApi.getCartByUserId);
const mockedDeleteCartItems = vi.mocked(cartApi.deleteCartItems);

vi.mock('@/apis/order', () => ({
  createOrder: vi.fn(),
}));
const mockedCreateOrder = vi.mocked(orderApi.createOrder);

vi.mock('@/apis/user', () => ({
  getProfile: vi.fn(),
}));
const mockedGetProfile = vi.mocked(userApi.getProfile);

// Mock Context & Media Query Hooks
vi.mock('@/shared/hooks/useAuthContext', () => ({
  useAuthContext: vi.fn(),
}));
const mockedUseAuthContext = vi.mocked(useAuthContext);

vi.mock('@/shared/hooks/useMediaQuery', () => ({
  default: vi.fn(),
}));
const mockedUseMediaQuery = vi.mocked(useMediaQuery);

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

describe('CartPage', () => {
  const mockUserId = 'user-abc';
  const mockCart = {
    cartItems: [
      {
        productId: 'prod-1',
        name: 'Item 1',
        description: 'Desc 1',
        price: 10,
        image_url: 'http://example.com/1.jpg',
        category: { id: 'c1', name: 'Cat 1' },
        quantity: 2,
        available: 5,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuthContext.mockReturnValue({ userId: mockUserId } as any);
    mockedUseMediaQuery.mockReturnValue(false); // default to Desktop
  });

  it('renders empty state when cart is empty', async () => {
    mockedGetCartByUserId.mockResolvedValue({ cartItems: [] } as any);

    render(<CartPage />);

    await waitFor(() => {
      expect(mockedGetCartByUserId).toHaveBeenCalledWith(mockUserId);
      expect(screen.getByTestId('no-data')).toBeInTheDocument();
      expect(screen.queryByTestId('cart-table')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /empty cart/i })).not.toBeInTheDocument();
    });
  });

  it('renders CartTable on desktop screen size', async () => {
    mockedGetCartByUserId.mockResolvedValue(mockCart as any);
    mockedUseMediaQuery.mockReturnValue(false);

    render(<CartPage />);

    await waitFor(() => {
      expect(screen.getByTestId('cart-table')).toBeInTheDocument();
      expect(screen.queryByTestId('cart-mobile')).not.toBeInTheDocument();
    });
  });

  it('renders CartMobile on mobile screen size', async () => {
    mockedGetCartByUserId.mockResolvedValue(mockCart as any);
    mockedUseMediaQuery.mockReturnValue(true);

    render(<CartPage />);

    await waitFor(() => {
      expect(screen.getByTestId('cart-mobile')).toBeInTheDocument();
      expect(screen.queryByTestId('cart-table')).not.toBeInTheDocument();
    });
  });

  it('allows emptying the cart successfully', async () => {
    const user = userEvent.setup();
    mockedGetCartByUserId.mockResolvedValue(mockCart as any);
    mockedDeleteCartItems.mockResolvedValue({} as any);

    render(<CartPage />);

    // Wait for item to load
    await waitFor(() => {
      expect(screen.getByTestId('cart-table')).toBeInTheDocument();
    });

    const emptyBtn = screen.getByRole('button', { name: /empty cart/i });
    await user.click(emptyBtn);

    await waitFor(() => {
      expect(mockedDeleteCartItems).toHaveBeenCalledWith({
        userId: mockUserId,
        productIds: ['prod-1'],
      });
      expect(message.success).toHaveBeenCalledWith('All items removed from cart');
    });
  });

  // ─── Checkout Boundary Conditions ──────────────────────────────────────────

  describe('Checkout boundary conditions', () => {
    const mockValidProfile = {
      address: {
        houseNumber: '123/45',
        district: 'Pathum Wan',
        subDistrict: 'Lumpini',
        province: 'Bangkok',
        zip: '10330',
      },
    };

    it('blocks checkout and shows warning if address is completely missing', async () => {
      const user = userEvent.setup();
      mockedGetCartByUserId.mockResolvedValue(mockCart as any);
      mockedGetProfile.mockResolvedValue({ address: null } as any);

      render(<CartPage />);
      await waitFor(() => expect(screen.getByTestId('cart-table')).toBeInTheDocument());

      const checkoutBtn = screen.getByRole('button', { name: /checkout/i });
      await user.click(checkoutBtn);

      await waitFor(() => {
        expect(mockedGetProfile).toHaveBeenCalled();
        expect(message.warning).toHaveBeenCalledWith('Please add your address details in your profile before checking out.');
        expect(mockedCreateOrder).not.toHaveBeenCalled();
      });
    });

    it('blocks checkout and shows warning if any address field is empty string', async () => {
      const user = userEvent.setup();
      mockedGetCartByUserId.mockResolvedValue(mockCart as any);
      const invalidProfile = {
        address: { ...mockValidProfile.address, zip: '' },
      };
      mockedGetProfile.mockResolvedValue(invalidProfile as any);

      render(<CartPage />);
      await waitFor(() => expect(screen.getByTestId('cart-table')).toBeInTheDocument());

      const checkoutBtn = screen.getByRole('button', { name: /checkout/i });
      await user.click(checkoutBtn);

      await waitFor(() => {
        expect(message.warning).toHaveBeenCalledWith('Please add your address details in your profile before checking out.');
        expect(mockedCreateOrder).not.toHaveBeenCalled();
      });
    });

    it('blocks checkout and shows warning if any address field is the literal string "null"', async () => {
      const user = userEvent.setup();
      mockedGetCartByUserId.mockResolvedValue(mockCart as any);
      const invalidProfile = {
        address: { ...mockValidProfile.address, district: 'null' },
      };
      mockedGetProfile.mockResolvedValue(invalidProfile as any);

      render(<CartPage />);
      await waitFor(() => expect(screen.getByTestId('cart-table')).toBeInTheDocument());

      const checkoutBtn = screen.getByRole('button', { name: /checkout/i });
      await user.click(checkoutBtn);

      await waitFor(() => {
        expect(message.warning).toHaveBeenCalledWith('Please add your address details in your profile before checking out.');
        expect(mockedCreateOrder).not.toHaveBeenCalled();
      });
    });

    it('shows error if profile verification fails', async () => {
      const user = userEvent.setup();
      mockedGetCartByUserId.mockResolvedValue(mockCart as any);
      mockedGetProfile.mockRejectedValue(new Error('Profile API failure'));

      render(<CartPage />);
      await waitFor(() => expect(screen.getByTestId('cart-table')).toBeInTheDocument());

      const checkoutBtn = screen.getByRole('button', { name: /checkout/i });
      await user.click(checkoutBtn);

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith('Failed to verify user profile.');
        expect(mockedCreateOrder).not.toHaveBeenCalled();
      });
    });

    it('creates order, clears cart, and redirects on successful checkout', async () => {
      const user = userEvent.setup();
      mockedGetCartByUserId.mockResolvedValue(mockCart as any);
      mockedGetProfile.mockResolvedValue(mockValidProfile as any);
      mockedCreateOrder.mockResolvedValue({ id: 'order-777' } as any);
      mockedDeleteCartItems.mockResolvedValue({} as any);

      render(<CartPage />);
      await waitFor(() => expect(screen.getByTestId('cart-table')).toBeInTheDocument());

      const checkoutBtn = screen.getByRole('button', { name: /checkout/i });
      await user.click(checkoutBtn);

      await waitFor(() => {
        expect(mockedCreateOrder).toHaveBeenCalledWith({
          userId: mockUserId,
          items: [{ productId: 'prod-1', quantity: 2 }],
        });
        expect(mockedDeleteCartItems).toHaveBeenCalledWith({
          userId: mockUserId,
          productIds: ['prod-1'],
        });
        expect(message.success).toHaveBeenCalledWith('Order created successfully. Your order ID is order-777');
        expect(mockPush).toHaveBeenCalledWith('/order');
      });
    });
  });
});
