import { api } from './client';
import { User, UpdateUserRequest, PaginatedResponse } from './types';

export const usersService = {
  async getMe(): Promise<User> {
    return api.get<User>('/users/me');
  },

  async getById(id: string): Promise<User> {
    return api.get<User>(`/users/${id}`);
  },

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    return api.put<User>(`/users/${id}`, data);
  },

  async updateAvatar(id: string, file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/users/${id}/avatar`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('foodsafer_access_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }

    return response.json();
  },

  async search(query: string, page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    return api.get<PaginatedResponse<User>>(
      `/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
  },

  async getConnections(userId: string, page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    return api.get<PaginatedResponse<User>>(
      `/users/${userId}/connections?page=${page}&limit=${limit}`
    );
  },

  async connect(userId: string): Promise<void> {
    await api.post(`/users/${userId}/connect`);
  },

  async disconnect(userId: string): Promise<void> {
    await api.delete(`/users/${userId}/connect`);
  },

  async getPendingRequests(): Promise<any[]> {
    return api.get<any[]>('/queries/users/connections/pending');
  },

  async acceptConnection(userId: string): Promise<void> {
    await api.post(`/commands/users/${userId}/connect/accept`);
  },

  async declineConnection(userId: string): Promise<void> {
    await api.post(`/commands/users/${userId}/connect/decline`);
  },
};
