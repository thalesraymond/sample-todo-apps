import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './useAuth';
import { authService } from '../services/auth.service';
import { api } from '../services/api';

vi.mock('../services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock('../services/api', () => ({
  api: {
    getToken: vi.fn(),
  },
}));

describe('useAuth', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with user if token exists', async () => {
      vi.mocked(api.getToken).mockReturnValue('fake-token');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual({ id: 'current', email: 'user@example.com' });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should initialize without user if token does not exist', async () => {
      vi.mocked(api.getToken).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('should successfully login and set user', async () => {
      vi.mocked(api.getToken).mockReturnValue(null);
      const mockUser = { id: '1', email: 'test@example.com' };
      vi.mocked(authService.login).mockResolvedValue({ user: mockUser, token: 'token' });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'password' });
      });

      expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should set error when login fails with an Error', async () => {
      vi.mocked(api.getToken).mockReturnValue(null);
      const error = new Error('Invalid credentials');
      vi.mocked(authService.login).mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.login({ email: 'test@example.com', password: 'wrong' });
        } catch {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Invalid credentials');
      expect(result.current.user).toBeNull();
    });

    it('should set default error when login fails with non-Error', async () => {
      vi.mocked(api.getToken).mockReturnValue(null);
      vi.mocked(authService.login).mockRejectedValue('Some string error');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.login({ email: 'test@example.com', password: 'wrong' });
        } catch {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Failed to login');
    });
  });

  describe('register', () => {
    it('should successfully register and login', async () => {
      vi.mocked(api.getToken).mockReturnValue(null);
      const mockUser = { id: '2', email: 'new@example.com' };

      vi.mocked(authService.register).mockResolvedValue({ message: 'Success', userId: '2' });
      vi.mocked(authService.login).mockResolvedValue({ user: mockUser, token: 'token' });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.register({ email: 'new@example.com', password: 'password', name: 'New User' });
      });

      expect(authService.register).toHaveBeenCalledWith({ email: 'new@example.com', password: 'password', name: 'New User' });
      expect(authService.login).toHaveBeenCalledWith({ email: 'new@example.com', password: 'password' });
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should set error when register fails with an Error', async () => {
      vi.mocked(api.getToken).mockReturnValue(null);
      const error = new Error('Email taken');
      vi.mocked(authService.register).mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.register({ email: 'new@example.com', password: 'password', name: 'New User' });
        } catch {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Email taken');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should set default error when register fails with non-Error', async () => {
      vi.mocked(api.getToken).mockReturnValue(null);
      vi.mocked(authService.register).mockRejectedValue('Some string error');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.register({ email: 'new@example.com', password: 'password', name: 'New User' });
        } catch {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Failed to register');
    });
  });

  describe('logout', () => {
    it('should clear user and call authService.logout', async () => {
      vi.mocked(api.getToken).mockReturnValue('fake-token');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).not.toBeNull();

      act(() => {
        result.current.logout();
      });

      expect(authService.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('useAuth outside provider', () => {
    it('should throw an error when used outside of AuthProvider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });
});
