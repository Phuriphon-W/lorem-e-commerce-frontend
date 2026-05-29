import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from '../order';
import { serverAddr } from '@/shared/constants';
import { OrderBy } from '@/shared/enums/orderBy';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Order APIs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const mockResponse = { data: { orderId: 'order1' } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const payload = { userId: '1', productIds: ['p1'] } as any;
      const result = await createOrder(payload);
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${serverAddr}/api/order`,
        method: 'POST',
        data: payload
      }));
      expect(result).toEqual({ orderId: 'order1' });
    });
  });

  describe('getUserOrders', () => {
    it('should fetch user orders', async () => {
      const mockResponse = { data: { orders: [], total: 0 } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await getUserOrders({ userId: 'user1' });
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${serverAddr}/api/user/user1/orders`,
        method: 'GET'
      }));
      expect(result).toEqual({ orders: [], total: 0 });
    });
  });

  describe('getOrderById', () => {
    it('should fetch order by id', async () => {
      const mockResponse = { data: { id: 'order1' } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await getOrderById('order1');
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${serverAddr}/api/order/order1`,
        method: 'GET'
      }));
      expect(result).toEqual({ id: 'order1' });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await updateOrderStatus({ orderId: 'order1', status: 'shipped' as any });
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${serverAddr}/api/order/order1/status`,
        method: 'PATCH',
        data: { status: 'shipped' }
      }));
      expect(result).toEqual({ success: true });
    });
  });
});
