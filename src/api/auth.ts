import { api, publicApi, setTokens, clearTokens } from './client';
import { LoginRequest, LoginResponse, User } from './types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Use publicApi to avoid sending stale auth tokens
    const response = await publicApi.post<LoginResponse>('/auth/login', credentials);
    setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  async loginWithGoogle(token: string): Promise<LoginResponse> {
    const response = await publicApi.post<LoginResponse>('/auth/google', { token });
    setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  async loginWithMicrosoft(token: string): Promise<LoginResponse> {
    const response = await publicApi.post<LoginResponse>('/auth/microsoft', { token });
    setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  async loginWithLinkedIn(token: string): Promise<LoginResponse> {
    const response = await publicApi.post<LoginResponse>('/auth/linkedin', { token });
    setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      clearTokens();
    }
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/queries/users/me');
  },

  async forgotPassword(email: string): Promise<void> {
    await publicApi.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await publicApi.post('/auth/reset-password', { token, password });
  },
};
