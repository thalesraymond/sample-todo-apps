import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './auth.service';
import { api } from './api';

// Mock the api module
vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    setToken: vi.fn(),
  }
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call api.post with the correct endpoint and credentials, set the token, and return auth response', async () => {
      const mockToken = 'mock-jwt-token';
      const credentials = { email: 'test@example.com', password: 'password123' };

      vi.mocked(api.post).mockResolvedValue({ token: mockToken });

      const result = await authService.login(credentials);

      expect(api.post).toHaveBeenCalledWith('/api/auth/login', credentials);
      expect(api.setToken).toHaveBeenCalledWith(mockToken);
      expect(result).toEqual({
        token: mockToken,
        user: { email: credentials.email, id: 'temp' }
      });
    });
  });

  describe('register', () => {
    it('should call api.post with the correct endpoint and credentials', async () => {
      const mockResponse = { message: 'User created', userId: '123' };
      const credentials = { email: 'test@example.com', password: 'password123', name: 'Test User' };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await authService.register(credentials);

      expect(api.post).toHaveBeenCalledWith('/api/auth/register', credentials);
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
      const mockUser = { id: '123', email: 'test@example.com', name: 'Test User' };

      vi.mocked(api.get).mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });
  });
});
