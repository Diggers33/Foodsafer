import { api, setTokens, clearTokens } from './client';
import { LoginRequest, LoginResponse, User } from './types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Clear any stale tokens before login attempt
    clearTokens();

    // API returns just the token string in result
    const token = await api.post<string>('/auth/login', credentials);

    // Store the token (use same token for both access and refresh)
    setTokens(token, token);

    // Fetch user info with the new token
    const user = await this.getCurrentUser();

    return {
      accessToken: token,
      refreshToken: token,
      user,
    };
  },

  async loginWithGoogle(token: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/google', { token });
    setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  async loginWithMicrosoft(token: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/microsoft', { token });
    setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  async loginWithLinkedIn(token: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/linkedin', { token });
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
    return api.get<User>('/queries/v2/users/me');
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
  },
};
