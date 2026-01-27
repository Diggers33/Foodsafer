import { api, getAccessToken } from './client';
import {
  Library,
  LibraryItem,
  CreateLibraryRequest,
  UpdateLibraryRequest,
  PaginatedResponse,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const librariesService = {
  // Query endpoints (read operations)
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Library>> {
    return api.get<PaginatedResponse<Library>>(`/queries/libraries?page=${page}&limit=${limit}`);
  },

  async getById(id: string): Promise<Library> {
    return api.get<Library>(`/queries/libraries/${id}`);
  },

  async getPublic(page = 1, limit = 20): Promise<PaginatedResponse<Library>> {
    return api.get<PaginatedResponse<Library>>(`/queries/libraries/public?page=${page}&limit=${limit}`);
  },

  async getMyLibraries(page = 1, limit = 20): Promise<PaginatedResponse<Library>> {
    return api.get<PaginatedResponse<Library>>(`/queries/libraries/my?page=${page}&limit=${limit}`);
  },

  async getItems(libraryId: string, page = 1, limit = 20): Promise<PaginatedResponse<LibraryItem>> {
    return api.get<PaginatedResponse<LibraryItem>>(
      `/queries/libraries/${libraryId}/items?page=${page}&limit=${limit}`
    );
  },

  async getItemById(libraryId: string, itemId: string): Promise<LibraryItem> {
    return api.get<LibraryItem>(`/queries/libraries/${libraryId}/items/${itemId}`);
  },

  async searchItems(query: string, page = 1, limit = 20): Promise<PaginatedResponse<LibraryItem>> {
    return api.get<PaginatedResponse<LibraryItem>>(
      `/queries/libraries/items/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
  },

  async getByType(type: 'document' | 'template' | 'resource', page = 1, limit = 20): Promise<PaginatedResponse<Library>> {
    return api.get<PaginatedResponse<Library>>(`/queries/libraries/type/${type}?page=${page}&limit=${limit}`);
  },

  // Command endpoints (write operations)
  async create(data: CreateLibraryRequest): Promise<Library> {
    return api.post<Library>('/commands/sync/libraries', data);
  },

  async update(id: string, data: UpdateLibraryRequest): Promise<Library> {
    return api.put<Library>(`/commands/sync/libraries/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/commands/sync/libraries/${id}`);
  },

  async addItem(libraryId: string, file: File, title: string, description: string): Promise<LibraryItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    const response = await fetch(`${API_BASE_URL}/commands/sync/libraries/${libraryId}/items`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to add library item');
    }

    const data = await response.json();
    return data.result;
  },

  async updateItem(libraryId: string, itemId: string, title: string, description: string): Promise<LibraryItem> {
    return api.put<LibraryItem>(`/commands/sync/libraries/${libraryId}/items/${itemId}`, { title, description });
  },

  async deleteItem(libraryId: string, itemId: string): Promise<void> {
    await api.delete(`/commands/sync/libraries/${libraryId}/items/${itemId}`);
  },

  // Download helpers
  getItemDownloadUrl(libraryId: string, itemId: string): string {
    return `${API_BASE_URL}/queries/libraries/${libraryId}/items/${itemId}/download?token=${getAccessToken()}`;
  },

  async incrementDownloadCount(libraryId: string, itemId: string): Promise<void> {
    await api.post(`/commands/sync/libraries/${libraryId}/items/${itemId}/download`);
  },
};
