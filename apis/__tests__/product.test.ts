import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { getProducts, getProductById } from '../product';
import { serverAddr } from '@/shared/constants';
import { OrderBy } from '@/shared/enums/orderBy';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Product APIs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should successfully fetch products with params', async () => {
      const mockResponse = { data: { products: [{ id: '1', name: 'Product 1' }], total: 1 } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const params = { pageNumber: 1, pageSize: 10, category: 'electronics', search: 'tv', orderBy: OrderBy.DateAsc };
      const result = await getProducts(params);
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${serverAddr}/api/product`,
        method: 'GET',
        params: params
      }));
      expect(result).toEqual({ products: [{ id: '1', name: 'Product 1' }], total: 1 });
    });
  });

  describe('getProductById', () => {
    it('should successfully fetch product by id', async () => {
      const mockResponse = { data: { id: '1', name: 'Product 1' } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await getProductById({ id: '1' });
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${serverAddr}/api/product/1`,
        method: 'GET'
      }));
      expect(result).toEqual({ id: '1', name: 'Product 1' });
    });
  });
});
