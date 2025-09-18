const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private headers: HeadersInit;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, error.error || 'Request failed');
    }

    const data = await response.json();
    return data;
  }

  async get<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      method: 'GET',
      headers: { ...this.headers, ...options?.headers },
    });

    return this.handleResponse<ApiResponse<T>>(response);
  }

  async post<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: { ...this.headers, ...options?.headers },
      body: JSON.stringify(data),
    });

    return this.handleResponse<ApiResponse<T>>(response);
  }

  async put<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      method: 'PUT',
      headers: { ...this.headers, ...options?.headers },
      body: JSON.stringify(data),
    });

    return this.handleResponse<ApiResponse<T>>(response);
  }

  async delete<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      method: 'DELETE',
      headers: { ...this.headers, ...options?.headers },
    });

    return this.handleResponse<ApiResponse<T>>(response);
  }

  setAuthToken(token: string) {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  removeAuthToken() {
    const { Authorization, ...headers } = this.headers as any;
    this.headers = headers;
  }
}

export const apiClient = new ApiClient();