import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { getProfile, updateProfile } from '../user';
import { serverAddr } from '@/shared/constants';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('User APIs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should successfully fetch user profile and return it as is', async () => {
      const mockResponse = { 
        data: { id: '1', username: 'testuser', lastName: null, address: { zip: null } } 
      };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await getProfile();
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${serverAddr}/user/me`,
        method: 'get',
        withCredentials: true
      }));
      expect(result.lastName).toBe(null);
      expect(result.address.zip).toBe(null);
    });

    it('should throw error when fetching profile fails', async () => {
      const mockError = new Error('Network error');
      mockedAxios.request.mockRejectedValue(mockError);

      await expect(getProfile()).rejects.toThrow('Network error');
    });
  });

  describe('updateProfile', () => {
    it('should successfully update user profile', async () => {
      const mockResponse = { data: { message: 'Success' } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const payload = {
        firstName: 'John',
        lastName: 'Doe',
        telephone: '12345',
        address: { zip: '123', road: 'Road', district: 'D', subDistrict: 'SD', houseNumber: '1', province: 'P' }
      };

      const result = await updateProfile(payload);
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${serverAddr}/user/me`,
        method: 'put',
        data: payload
      }));
      expect(result).toEqual({ message: 'Success' });
    });
  });
});
