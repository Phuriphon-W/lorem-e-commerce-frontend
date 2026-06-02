import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import AuthForm from '../AuthForm';
import axios from 'axios';

// Mock next/image to avoid test environment issues
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    return React.createElement('img', { alt: props.alt as string, src: props.src as string });
  },
}));

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

// Helper to build a mock apiAction
const mockApiAction = vi.fn();

// Obtain router mock
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    refresh: mockRefresh,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Sign In Mode ──────────────────────────────────────────────────────────

  describe('Sign In mode', () => {
    it('renders the Sign In title', { timeout: 15000 }, () => {
      render(<AuthForm formName="Sign In" apiAction={mockApiAction} />);
      // Ant Design renders the button text inside a <span>, so we use getByRole
      // to target the heading specifically and avoid multiple-element ambiguity.
      expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('renders email and password fields (no firstName/lastName/username/confirmPassword)', () => {
      render(<AuthForm formName="Sign In" apiAction={mockApiAction} />);

      expect(screen.getByPlaceholderText('Enter your e-mail')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();

      expect(screen.queryByPlaceholderText('First name')).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Last name')).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Enter your username')).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Confirm your password')).not.toBeInTheDocument();
    });

    it('renders "Forgot password?" and "Create new account" links in Sign In mode', () => {
      render(<AuthForm formName="Sign In" apiAction={mockApiAction} />);

      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
      expect(screen.getByText('Create new account')).toBeInTheDocument();
    });

    it('navigates to /forgot-password when "Forgot password?" is clicked', async () => {
      const user = userEvent.setup();
      render(<AuthForm formName="Sign In" apiAction={mockApiAction} />);

      await user.click(screen.getByText('Forgot password?'));
      expect(mockPush).toHaveBeenCalledWith('/forgot-password');
    });

    it('navigates to /signup when "Create new account" is clicked', async () => {
      const user = userEvent.setup();
      render(<AuthForm formName="Sign In" apiAction={mockApiAction} />);

      await user.click(screen.getByText('Create new account'));
      expect(mockPush).toHaveBeenCalledWith('/signup');
    });

    it('calls apiAction with email and password on successful submission', async () => {
      const user = userEvent.setup();
      mockApiAction.mockResolvedValue({ id: '1', username: 'testuser' });

      render(<AuthForm formName="Sign In" apiAction={mockApiAction} />);

      await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'test@test.com');
      await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(mockApiAction).toHaveBeenCalledWith({
          email: 'test@test.com',
          password: 'password123',
        });
      });
    });

    it('redirects to "/" after successful sign in', async () => {
      const user = userEvent.setup();
      mockApiAction.mockResolvedValue({ id: '1', username: 'testuser' });

      render(<AuthForm formName="Sign In" apiAction={mockApiAction} />);

      await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'user@test.com');
      await user.type(screen.getByPlaceholderText('Enter your password'), 'mypassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/', { scroll: true });
      });
    });

    it('shows error message when apiAction throws an Axios error', async () => {
      const user = userEvent.setup();
      const axiosError = {
        response: { data: { detail: 'Invalid credentials' } },
        isAxiosError: true,
      };
      mockedAxios.isAxiosError = vi.fn().mockReturnValue(true) as any;
      mockApiAction.mockRejectedValue(axiosError);

      render(<AuthForm formName="Sign In" apiAction={mockApiAction} />);

      await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'test@test.com');
      await user.type(screen.getByPlaceholderText('Enter your password'), 'wrongpass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      // apiAction was called
      await waitFor(() => {
        expect(mockApiAction).toHaveBeenCalled();
      });
      // Router should NOT have been called on error
      expect(mockPush).not.toHaveBeenCalledWith('/', expect.anything());
    });

    it('shows generic error message when a non-Axios error is thrown', async () => {
      const user = userEvent.setup();
      mockedAxios.isAxiosError = vi.fn().mockReturnValue(false) as any;
      mockApiAction.mockRejectedValue(new Error('Network error'));

      render(<AuthForm formName="Sign In" apiAction={mockApiAction} />);

      await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'test@test.com');
      await user.type(screen.getByPlaceholderText('Enter your password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(mockApiAction).toHaveBeenCalled();
      });
      expect(mockPush).not.toHaveBeenCalledWith('/', expect.anything());
    });
  });

  // ─── Sign Up Mode ──────────────────────────────────────────────────────────

  describe('Sign Up mode', () => {
    it('renders the Sign Up title', () => {
      render(<AuthForm formName="Sign Up" apiAction={mockApiAction} />);
      expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
    });

    it('renders all Sign Up specific fields', () => {
      render(<AuthForm formName="Sign Up" apiAction={mockApiAction} />);

      expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your e-mail')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
    });

    it('renders "I already have account" link in Sign Up mode', () => {
      render(<AuthForm formName="Sign Up" apiAction={mockApiAction} />);
      expect(screen.getByText('I already have account')).toBeInTheDocument();
    });

    it('does NOT render "Forgot password?" or "Create new account" in Sign Up mode', () => {
      render(<AuthForm formName="Sign Up" apiAction={mockApiAction} />);
      expect(screen.queryByText('Forgot password?')).not.toBeInTheDocument();
      expect(screen.queryByText('Create new account')).not.toBeInTheDocument();
    });

    it('navigates to /signin when "I already have account" is clicked', async () => {
      const user = userEvent.setup();
      render(<AuthForm formName="Sign Up" apiAction={mockApiAction} />);

      await user.click(screen.getByText('I already have account'));
      expect(mockPush).toHaveBeenCalledWith('/signin');
    });

    it('calls apiAction WITHOUT confirmPassword on successful submission', { timeout: 15000 }, async () => {
      const user = userEvent.setup();
      mockApiAction.mockResolvedValue({ id: '2', username: 'newuser' });

      render(<AuthForm formName="Sign Up" apiAction={mockApiAction} />);

      await user.type(screen.getByPlaceholderText('First name'), 'John');
      await user.type(screen.getByPlaceholderText('Last name'), 'Doe');
      await user.type(screen.getByPlaceholderText('Enter your username'), 'johndoe');
      await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'john@test.com');
      await user.type(screen.getByPlaceholderText('Enter your password'), 'mypassword');
      await user.type(screen.getByPlaceholderText('Confirm your password'), 'mypassword');
      await user.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(mockApiAction).toHaveBeenCalledWith(
          expect.not.objectContaining({ confirmPassword: expect.anything() })
        );
        expect(mockApiAction).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            email: 'john@test.com',
            password: 'mypassword',
          })
        );
      });
    });

    it('redirects to "/" after successful sign up', { timeout: 15000 }, async () => {
      const user = userEvent.setup();
      mockApiAction.mockResolvedValue({ id: '2', username: 'newuser' });

      render(<AuthForm formName="Sign Up" apiAction={mockApiAction} />);

      await user.type(screen.getByPlaceholderText('First name'), 'Jane');
      await user.type(screen.getByPlaceholderText('Last name'), 'Doe');
      await user.type(screen.getByPlaceholderText('Enter your username'), 'janedoe');
      await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'jane@test.com');
      await user.type(screen.getByPlaceholderText('Enter your password'), 'pass123');
      await user.type(screen.getByPlaceholderText('Confirm your password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/', { scroll: true });
      });
    });
  });
});
