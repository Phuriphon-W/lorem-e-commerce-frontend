import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuthContext } from '../useAuthContext';

// A minimal consumer component to read context values in tests
function AuthConsumer() {
  const { userId } = useAuthContext();
  return (
    <div>
      <span data-testid="user-id">{userId ?? 'NO_USER'}</span>
    </div>
  );
}

describe('AuthProvider & useAuthContext', () => {
  // ─── Default Context Value ─────────────────────────────────────────────────

  describe('default context (no provider)', () => {
    it('returns null userId when consumed outside of AuthProvider', () => {
      // useAuthContext falls back to the default context value { userId: null }
      render(<AuthConsumer />);

      expect(screen.getByTestId('user-id').textContent).toBe('NO_USER');
    });
  });

  // ─── Authenticated State ────────────────────────────────────────────────────

  describe('when userId is provided (user logged in)', () => {
    it('exposes the userId via context', () => {
      render(
        <AuthProvider userId="user-abc-123">
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id').textContent).toBe('user-abc-123');
    });

    it('renders children correctly', () => {
      render(
        <AuthProvider userId="user-xyz">
          <div data-testid="child">Hello</div>
        </AuthProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('child').textContent).toBe('Hello');
    });
  });

  // ─── Unauthenticated State ──────────────────────────────────────────────────

  describe('when userId is null (user logged out)', () => {
    it('exposes null userId via context', () => {
      render(
        <AuthProvider userId={null}>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id').textContent).toBe('NO_USER');
    });
  });

  // ─── Empty String userId ────────────────────────────────────────────────────

  describe('when userId is an empty string (unauthenticated from JWT)', () => {
    it('exposes empty string userId — the layout passes "" for missing JWT id', () => {
      render(
        <AuthProvider userId="">
          <AuthConsumer />
        </AuthProvider>
      );

      // "" is not null/undefined, so ?? does NOT fall back — the consumer
      // renders the empty string directly (empty textContent).
      expect(screen.getByTestId('user-id').textContent).toBe('');
    });
  });

  // ─── Context Re-render on userId Change ────────────────────────────────────

  describe('context updates when userId prop changes', () => {
    it('re-renders children with new userId when the provider prop changes', () => {
      const { rerender } = render(
        <AuthProvider userId="first-user">
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id').textContent).toBe('first-user');

      rerender(
        <AuthProvider userId="second-user">
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id').textContent).toBe('second-user');
    });

    it('updates to null when user logs out', () => {
      const { rerender } = render(
        <AuthProvider userId="some-user">
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id').textContent).toBe('some-user');

      rerender(
        <AuthProvider userId={null}>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id').textContent).toBe('NO_USER');
    });
  });

  // ─── Nested Providers ──────────────────────────────────────────────────────

  describe('nested AuthProvider', () => {
    it('inner provider overrides outer provider value for its subtree', () => {
      render(
        <AuthProvider userId="outer-user">
          <div>
            <AuthConsumer />
            <AuthProvider userId="inner-user">
              <div data-testid="inner">
                <AuthConsumer />
              </div>
            </AuthProvider>
          </div>
        </AuthProvider>
      );

      // The first AuthConsumer reads the outer context
      const [outerDisplay, innerDisplay] = screen.getAllByTestId('user-id');
      expect(outerDisplay.textContent).toBe('outer-user');
      expect(innerDisplay.textContent).toBe('inner-user');
    });
  });
});
