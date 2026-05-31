import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

class ApiService {
  private static instance: ApiService;
  private token: string | null = Cookies.get('token') || null;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      Cookies.set('token', token, { path: '/', secure: true, sameSite: 'strict' });
    } else {
      Cookies.remove('token', { path: '/' });
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = new Headers(options.headers);

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    if (options.body != null && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
      this.setToken(null);
      window.location.href = '/login';
    }

    if (response.status === 204) {
      return null as T;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new ApiError(errorData.message || response.statusText, response.status);
    }

    return response.json();
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T, B = unknown>(endpoint: string, body: B, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public put<T, B = unknown>(endpoint: string, body: B, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  public async fetchHealth(): Promise<{ status: string }> {
    return this.get<{ status: string }>('/health');
  }
}

export const api = ApiService.getInstance();
