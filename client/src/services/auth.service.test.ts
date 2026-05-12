import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './auth.service';
import { api } from './api';

// Mock the api module
vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    setToken: vi.fn(),
    getToken: vi.fn(),
  }
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call api.post with the correct endpoint and set the token', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'password123' };
      const mockResponse = { token: 'mock-jwt-token' };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await authService.login(mockCredentials);

      expect(api.post).toHaveBeenCalledWith('/api/auth/login', mockCredentials);
      expect(api.setToken).toHaveBeenCalledWith('mock-jwt-token');
      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: { email: 'test@example.com', id: 'temp' }
      });
    });
  });

  describe('register', () => {
    it('should call api.post with the correct endpoint and data', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'password123', name: 'Test User' };
      const mockResponse = { message: 'User created successfully', userId: 'new-user-id' };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await authService.register(mockCredentials);

      expect(api.post).toHaveBeenCalledWith('/api/auth/register', mockCredentials);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should call api.setToken with null', () => {
      authService.logout();

      expect(api.setToken).toHaveBeenCalledWith(null);
    });
  });

  describe('getCurrentUser', () => {
    it('should call api.get with the correct endpoint', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com', name: 'Test User' };
      vi.mocked(api.get).mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });
  });
});
