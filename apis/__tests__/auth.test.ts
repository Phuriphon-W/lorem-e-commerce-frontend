import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { signin, signup, signout, forgotPassword, resetPassword } from '../auth';
import { AUTH_BASE_URL } from '@/shared/constants/auth';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Auth APIs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signin', () => {
    it('should successfully sign in and return user data', async () => {
      const mockResponse = { data: { id: '1', username: 'testuser' } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await signin({ email: 'test@test.com', password: 'password123' });
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${AUTH_BASE_URL}/signin`,
        method: 'post',
        data: { email: 'test@test.com', password: 'password123' }
      }));
      expect(result).toEqual({ id: '1', username: 'testuser' });
    });

    it('should throw error when signin fails', async () => {
      const mockError = new Error('Invalid credentials');
      mockedAxios.request.mockRejectedValue(mockError);

      await expect(signin({ email: 'test@test.com', password: 'wrong' })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signup', () => {
    it('should successfully sign up and return user data', async () => {
      const mockResponse = { data: { id: '2', username: 'newuser' } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const payload = { email: 'new@test.com', password: 'pass', firstName: 'John', lastName: 'Doe', username: 'newuser' };
      const result = await signup(payload);
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${AUTH_BASE_URL}/register`,
        method: 'post',
        data: payload
      }));
      expect(result).toEqual({ id: '2', username: 'newuser' });
    });
  });

  describe('signout', () => {
    it('should successfully sign out', async () => {
      mockedAxios.request.mockResolvedValue({});

      await signout();
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${AUTH_BASE_URL}/signout`,
        method: 'post',
        withCredentials: true
      }));
    });
  });

  describe('forgotPassword', () => {
    it('should send forgot password request', async () => {
      mockedAxios.request.mockResolvedValue({ data: { message: 'Email sent' } });

      const result = await forgotPassword('test@test.com');
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${AUTH_BASE_URL}/forgot-password`,
        method: 'post',
        data: { email: 'test@test.com' }
      }));
      expect(result).toEqual({ message: 'Email sent' });
    });
  });

  describe('resetPassword', () => {
    it('should send reset password request', async () => {
      mockedAxios.request.mockResolvedValue({ data: { message: 'Password reset' } });

      const result = await resetPassword('token123', 'newpass');
      
      expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
        url: `${AUTH_BASE_URL}/reset-password`,
        method: 'post',
        data: { token: 'token123', password: 'newpass' }
      }));
      expect(result).toEqual({ message: 'Password reset' });
    });
  });
});
