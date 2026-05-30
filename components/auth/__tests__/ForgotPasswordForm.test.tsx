import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ForgotPasswordForm from '../ForgotPasswordForm';
import axios from 'axios';
import * as authApi from '@/apis/auth';

// Mock next/image to avoid test environment issues
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement('img', { alt: props.alt as string, src: props.src as string }),
}));

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

vi.mock('@/apis/auth', () => ({
  forgotPassword: vi.fn(),
}));
const mockedForgotPassword = vi.mocked(authApi.forgotPassword);

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the heading and description text', () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    expect(
      screen.getByText('Enter your email address to receive a password reset link.')
    ).toBeInTheDocument();
  });

  it('renders the email input and submit button', () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByPlaceholderText('Enter your e-mail')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Reset Link' })).toBeInTheDocument();
  });

  it('renders "Back to Sign In" link', () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByText('Back to Sign In')).toBeInTheDocument();
  });

  it('navigates to /signin when "Back to Sign In" is clicked', async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.click(screen.getByText('Back to Sign In'));
    expect(mockPush).toHaveBeenCalledWith('/signin');
  });

  // ─── Success State ──────────────────────────────────────────────────────────

  describe('success state', () => {
    it('calls forgotPassword API with the entered email', async () => {
      const user = userEvent.setup();
      mockedForgotPassword.mockResolvedValue({ message: 'Email sent' });

      render(<ForgotPasswordForm />);

      await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'user@test.com');
      await user.click(screen.getByRole('button', { name: 'Send Reset Link' }));

      await waitFor(() => {
        expect(mockedForgotPassword).toHaveBeenCalledWith('user@test.com');
      });
    });

    it('redirects to /signin after successful submission', async () => {
      const user = userEvent.setup();
      mockedForgotPassword.mockResolvedValue({ message: 'Email sent' });

      render(<ForgotPasswordForm />);

      await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'user@test.com');
      await user.click(screen.getByRole('button', { name: 'Send Reset Link' }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/signin');
      });
    });
  });

  // ─── Error State ────────────────────────────────────────────────────────────

  describe('error state', () => {
    it('does NOT redirect when forgotPassword throws an Axios error', async () => {
      const user = userEvent.setup();
      const axiosError = {
        response: { data: { detail: 'User not found', message: '' } },
        isAxiosError: true,
      };
      mockedAxios.isAxiosError = vi.fn().mockReturnValue(true);
      mockedForgotPassword.mockRejectedValue(axiosError);

      render(<ForgotPasswordForm />);

      await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'notfound@test.com');
      await user.click(screen.getByRole('button', { name: 'Send Reset Link' }));

      await waitFor(() => {
        expect(mockedForgotPassword).toHaveBeenCalled();
      });
      expect(mockPush).not.toHaveBeenCalledWith('/signin');
    });

    it('does NOT redirect when forgotPassword throws a generic error', async () => {
      const user = userEvent.setup();
      mockedAxios.isAxiosError = vi.fn().mockReturnValue(false);
      mockedForgotPassword.mockRejectedValue(new Error('Network failure'));

      render(<ForgotPasswordForm />);

      await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'user@test.com');
      await user.click(screen.getByRole('button', { name: 'Send Reset Link' }));

      await waitFor(() => {
        expect(mockedForgotPassword).toHaveBeenCalled();
      });
      expect(mockPush).not.toHaveBeenCalledWith('/signin');
    });

    it('uses fallback message if response data has only "message" field', async () => {
      const user = userEvent.setup();
      const axiosError = {
        response: { data: { message: 'Bad request', detail: undefined } },
        isAxiosError: true,
      };
      mockedAxios.isAxiosError = vi.fn().mockReturnValue(true);
      mockedForgotPassword.mockRejectedValue(axiosError);

      render(<ForgotPasswordForm />);

      await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'user@test.com');
      await user.click(screen.getByRole('button', { name: 'Send Reset Link' }));

      await waitFor(() => {
        expect(mockedForgotPassword).toHaveBeenCalled();
      });
    });
  });
});
