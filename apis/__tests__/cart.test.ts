import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { getCartByUserId, addCartItem, editCartItem, deleteCartItems } from '../cart';
import { serverAddr } from '@/shared/constants';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Cart APIs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCartByUserId', () => {
    it('should fetch user cart', async () => {
      const mockResponse = { data: { id: 'cart1', items: [] } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await getCartByUserId('user1');
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${serverAddr}/user/user1/cart`,
        method: 'GET'
      }));
      expect(result).toEqual({ id: 'cart1', items: [] });
    });
  });

  describe('addCartItem', () => {
    it('should add item to cart', async () => {
      const mockResponse = { data: { cartItemId: 'item1' } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await addCartItem({ userId: 'user1', productId: 'prod1', quantity: 2 });
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${serverAddr}/user/user1/cart`,
        method: 'POST',
        data: { productId: 'prod1', quantity: 2 }
      }));
      expect(result).toEqual({ cartItemId: 'item1' });
    });
  });

  describe('editCartItem', () => {
    it('should edit cart item quantity', async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await editCartItem({ userId: 'user1', productId: 'prod1', quantity: 5 });
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${serverAddr}/user/user1/cart`,
        method: 'PUT',
        data: { productId: 'prod1', quantity: 5 }
      }));
      expect(result).toEqual({ success: true });
    });
  });

  describe('deleteCartItems', () => {
    it('should delete cart items', async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await deleteCartItems({ userId: 'user1', productIds: ['prod1', 'prod2'] });
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${serverAddr}/user/user1/cart/remove-items`,
        method: 'POST',
        data: { productIds: ['prod1', 'prod2'] }
      }));
      expect(result).toEqual({ success: true });
    });
  });
});
