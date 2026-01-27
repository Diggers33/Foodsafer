import { ApiError } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Token storage keys
const ACCESS_TOKEN_KEY = 'foodsafer_access_token';
const REFRESH_TOKEN_KEY = 'foodsafer_refresh_token';

// Token management
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// CQRS Response format from FoodSafer API
interface ApiResponse<T> {
  result: T;
  status: 'OK' | 'KO';
}

// Request helper
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle token refresh on 401
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the original request with new token
      const newAccessToken = getAccessToken();
      (headers as Record<string, string>)['Authorization'] = `Bearer ${newAccessToken}`;
      const retryResponse = await fetch(url, { ...options, headers });
      return parseResponse<T>(retryResponse);
    } else {
      // Refresh failed, clear tokens
      clearTokens();
      throw new ApiError('Session expired. Please login again.', 401);
    }
  }

  return parseResponse<T>(response);
}

// Parse CQRS response format
async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    if (!response.ok) {
      throw new ApiError('Request failed', response.status);
    }
    return {} as T;
  }

  let data: ApiResponse<T>;
  try {
    data = JSON.parse(text) as ApiResponse<T>;
  } catch (e) {
    console.error('Failed to parse API response:', text.substring(0, 500));
    throw new ApiError('Invalid response from server', response.status);
  }

  // Handle CQRS response format
  if (data.status === 'KO') {
    const errorResult = data.result as { code?: string; message?: string };
    const errorMessage = errorResult.message || errorResult.code || 'Request failed';
    throw new ApiError(errorMessage, response.status);
  }

  // Return the unwrapped result
  return data.result;
}

// Refresh token helper
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json() as ApiResponse<{ accessToken: string; refreshToken: string }>;
    if (data.status === 'KO') return false;

    setTokens(data.result.accessToken, data.result.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// HTTP method helpers
export const api = {
  get<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE' });
  },
};
