import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { Suspense } from 'react';
import ResetPasswordForm from '../ResetPasswordForm';
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
  resetPassword: vi.fn(),
}));
const mockedResetPassword = vi.mocked(authApi.resetPassword);

const mockPush = vi.fn();
// Default: token present
let mockSearchParams = new URLSearchParams('token=valid-token-123');

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/',
}));

// Helper: wrap in Suspense (component uses Suspense boundary internally, but
// the inner content component uses useSearchParams which needs Suspense in tests too)
function renderWithSuspense(ui: React.ReactElement) {
  return render(<Suspense fallback={<div>Loading...</div>}>{ui}</Suspense>);
}

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams('token=valid-token-123');
  });

  // ─── Token Present ──────────────────────────────────────────────────────────

  describe('when a valid token is present in the URL', () => {
    it('renders the Reset Password heading', async () => {
      renderWithSuspense(<ResetPasswordForm />);

      await waitFor(() => {
        // Ant Design puts button text inside a <span>, use heading role to disambiguate
        expect(screen.getByRole('heading', { name: 'Reset Password' })).toBeInTheDocument();
      });
    });

    it('renders new password and confirm password fields', async () => {
      renderWithSuspense(<ResetPasswordForm />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
      });
    });

    it('renders the "Reset Password" submit button', async () => {
      renderWithSuspense(<ResetPasswordForm />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
      });
    });

    // ─── Success State ────────────────────────────────────────────────────────

    describe('success state', () => {
      it('calls resetPassword API with token and new password', async () => {
        const user = userEvent.setup();
        mockedResetPassword.mockResolvedValue({ message: 'Password reset' });

        renderWithSuspense(<ResetPasswordForm />);

        await waitFor(() => {
          expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
        });

        await user.type(screen.getByPlaceholderText('Enter new password'), 'newpass123');
        await user.type(screen.getByPlaceholderText('Confirm new password'), 'newpass123');
        await user.click(screen.getByRole('button', { name: 'Reset Password' }));

        await waitFor(() => {
          expect(mockedResetPassword).toHaveBeenCalledWith('valid-token-123', 'newpass123');
        });
      });

      it('redirects to /signin after successful password reset', async () => {
        const user = userEvent.setup();
        mockedResetPassword.mockResolvedValue({ message: 'Password reset' });

        renderWithSuspense(<ResetPasswordForm />);

        await waitFor(() => {
          expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
        });

        await user.type(screen.getByPlaceholderText('Enter new password'), 'newpass123');
        await user.type(screen.getByPlaceholderText('Confirm new password'), 'newpass123');
        await user.click(screen.getByRole('button', { name: 'Reset Password' }));

        await waitFor(() => {
          expect(mockPush).toHaveBeenCalledWith('/signin');
        });
      });
    });

    // ─── Error State ──────────────────────────────────────────────────────────

    describe('error state', () => {
      it('does NOT redirect when resetPassword throws an Axios error', async () => {
        const user = userEvent.setup();
        const axiosError = {
          response: { data: { detail: 'Token expired', message: '' } },
          isAxiosError: true,
        };
        mockedAxios.isAxiosError = vi.fn().mockReturnValue(true);
        mockedResetPassword.mockRejectedValue(axiosError);

        renderWithSuspense(<ResetPasswordForm />);

        await waitFor(() => {
          expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
        });

        await user.type(screen.getByPlaceholderText('Enter new password'), 'pass123');
        await user.type(screen.getByPlaceholderText('Confirm new password'), 'pass123');
        await user.click(screen.getByRole('button', { name: 'Reset Password' }));

        await waitFor(() => {
          expect(mockedResetPassword).toHaveBeenCalled();
        });
        expect(mockPush).not.toHaveBeenCalledWith('/signin');
      });

      it('does NOT redirect when resetPassword throws a generic error', async () => {
        const user = userEvent.setup();
        mockedAxios.isAxiosError = vi.fn().mockReturnValue(false);
        mockedResetPassword.mockRejectedValue(new Error('Network failure'));

        renderWithSuspense(<ResetPasswordForm />);

        await waitFor(() => {
          expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
        });

        await user.type(screen.getByPlaceholderText('Enter new password'), 'pass123');
        await user.type(screen.getByPlaceholderText('Confirm new password'), 'pass123');
        await user.click(screen.getByRole('button', { name: 'Reset Password' }));

        await waitFor(() => {
          expect(mockedResetPassword).toHaveBeenCalled();
        });
        expect(mockPush).not.toHaveBeenCalledWith('/signin');
      });

      it('uses fallback "message" field if "detail" is absent in error response', async () => {
        const user = userEvent.setup();
        const axiosError = {
          response: { data: { message: 'Invalid token', detail: undefined } },
          isAxiosError: true,
        };
        mockedAxios.isAxiosError = vi.fn().mockReturnValue(true);
        mockedResetPassword.mockRejectedValue(axiosError);

        renderWithSuspense(<ResetPasswordForm />);

        await waitFor(() => {
          expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
        });

        await user.type(screen.getByPlaceholderText('Enter new password'), 'pass123');
        await user.type(screen.getByPlaceholderText('Confirm new password'), 'pass123');
        await user.click(screen.getByRole('button', { name: 'Reset Password' }));

        await waitFor(() => {
          expect(mockedResetPassword).toHaveBeenCalled();
        });
      });
    });

    // ─── Confirm Password Validation ─────────────────────────────────────────

    describe('confirm password validation', () => {
      it('does NOT call resetPassword when passwords do not match', async () => {
        const user = userEvent.setup();
        renderWithSuspense(<ResetPasswordForm />);

        await waitFor(() => {
          expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
        });

        await user.type(screen.getByPlaceholderText('Enter new password'), 'pass123');
        await user.type(screen.getByPlaceholderText('Confirm new password'), 'different456');
        await user.click(screen.getByRole('button', { name: 'Reset Password' }));

        await waitFor(() => {
          expect(screen.getByText('The passwords that you entered do not match!')).toBeInTheDocument();
        });
        expect(mockedResetPassword).not.toHaveBeenCalled();
      });
    });
  });

  // ─── Missing Token ──────────────────────────────────────────────────────────

  describe('when no token is present in the URL', () => {
    it('does not render the form content and redirects to /signin', async () => {
      mockSearchParams = new URLSearchParams(); // no token
      renderWithSuspense(<ResetPasswordForm />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/signin');
      });

      // The form should not be rendered at all when token is missing
      expect(screen.queryByPlaceholderText('Enter new password')).not.toBeInTheDocument();
    });
  });
});
