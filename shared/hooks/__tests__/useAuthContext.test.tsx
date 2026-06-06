import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuthContext } from '../useAuthContext';

// A minimal consumer component to read context values in tests
function AuthConsumer() {
  const { userId, isAdmin } = useAuthContext();
  return (
    <div>
      <span data-testid="user-id">{userId ?? 'NO_USER'}</span>
      <span data-testid="is-admin">{isAdmin === null ? 'NO_ADMIN' : isAdmin ? 'ADMIN' : 'CUSTOMER'}</span>
    </div>
  );
}

describe('AuthProvider & useAuthContext', () => {
  // ─── Default Context Value ─────────────────────────────────────────────────

  describe('default context (no provider)', () => {
    it('returns null userId and isAdmin when consumed outside of AuthProvider', () => {
      render(<AuthConsumer />);

      expect(screen.getByTestId('user-id').textContent).toBe('NO_USER');
      expect(screen.getByTestId('is-admin').textContent).toBe('NO_ADMIN');
    });
  });

  // ─── Authenticated State ────────────────────────────────────────────────────

  describe('when userId is provided (user logged in)', () => {
    it('exposes the userId and isAdmin via context', () => {
      render(
        <AuthProvider userId="user-abc-123" isAdmin={false}>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id').textContent).toBe('user-abc-123');
      expect(screen.getByTestId('is-admin').textContent).toBe('CUSTOMER');
    });

    it('renders children correctly', () => {
      render(
        <AuthProvider userId="user-xyz" isAdmin={false}>
          <div data-testid="child">Hello</div>
        </AuthProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('child').textContent).toBe('Hello');
    });
  });

  // ─── Unauthenticated State ──────────────────────────────────────────────────

  describe('when userId is null (user logged out)', () => {
    it('exposes null userId and isAdmin via context', () => {
      render(
        <AuthProvider userId={null} isAdmin={null}>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id').textContent).toBe('NO_USER');
      expect(screen.getByTestId('is-admin').textContent).toBe('NO_ADMIN');
    });
  });

  // ─── Empty String userId ────────────────────────────────────────────────────

  describe('when userId is an empty string (unauthenticated from JWT)', () => {
    it('exposes empty string userId — the layout passes "" for missing JWT id', () => {
      render(
        <AuthProvider userId="" isAdmin={false}>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id').textContent).toBe('');
      expect(screen.getByTestId('is-admin').textContent).toBe('CUSTOMER');
    });
  });

  // ─── Context Re-render on userId Change ────────────────────────────────────

  describe('context updates when userId prop changes', () => {
    it('re-renders children with new userId and isAdmin when the provider prop changes', () => {
      const { rerender } = render(
        <AuthProvider userId="first-user" isAdmin={false}>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id').textContent).toBe('first-user');
      expect(screen.getByTestId('is-admin').textContent).toBe('CUSTOMER');

      rerender(
        <AuthProvider userId="second-user" isAdmin={true}>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id').textContent).toBe('second-user');
      expect(screen.getByTestId('is-admin').textContent).toBe('ADMIN');
    });

    it('updates to null when user logs out', () => {
      const { rerender } = render(
        <AuthProvider userId="some-user" isAdmin={false}>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id').textContent).toBe('some-user');
      expect(screen.getByTestId('is-admin').textContent).toBe('CUSTOMER');

      rerender(
        <AuthProvider userId={null} isAdmin={null}>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id').textContent).toBe('NO_USER');
      expect(screen.getByTestId('is-admin').textContent).toBe('NO_ADMIN');
    });
  });

  // ─── Nested Providers ──────────────────────────────────────────────────────

  describe('nested AuthProvider', () => {
    it('inner provider overrides outer provider value for its subtree', () => {
      render(
        <AuthProvider userId="outer-user" isAdmin={false}>
          <div>
            <AuthConsumer />
            <AuthProvider userId="inner-user" isAdmin={true}>
              <div data-testid="inner">
                <AuthConsumer />
              </div>
            </AuthProvider>
          </div>
        </AuthProvider>
      );

      const [outerDisplay, innerDisplay] = screen.getAllByTestId('user-id');
      expect(outerDisplay.textContent).toBe('outer-user');
      expect(innerDisplay.textContent).toBe('inner-user');

      const [outerAdmin, innerAdmin] = screen.getAllByTestId('is-admin');
      expect(outerAdmin.textContent).toBe('CUSTOMER');
      expect(innerAdmin.textContent).toBe('ADMIN');
    });
  });
});
