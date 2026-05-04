import { api } from './api';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password?: string; // Optional if using some other auth, but usually required
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

class AuthService {
  public async login(credentials: { email: string; password?: string }): Promise<AuthResponse> {
    const response = await api.post<{ token: string }>('/api/auth/login', credentials);
    api.setToken(response.token);
    // Since login doesn't return user, we might need to fetch it or decode token
    // For now, let's assume we fetch it or just return a dummy user until we have /api/auth/me
    return { token: response.token, user: { email: credentials.email, id: 'temp' } };
  }

  public async register(credentials: { email: string; password?: string; name?: string }): Promise<{ message: string; userId: string }> {
    return api.post<{ message: string; userId: string }>('/api/auth/register', credentials);
  }

  public logout(): void {
    api.setToken(null);
  }

  public async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me');
  }
}

export const authService = new AuthService();
