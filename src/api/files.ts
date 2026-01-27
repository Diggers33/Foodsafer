import { api, getAccessToken } from './client';
import {
  FileItem,
  Folder,
  CreateFolderRequest,
  UploadFileResponse,
  PaginatedResponse,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const filesService = {
  // Query endpoints (read operations)
  async getAll(folderId?: string, page = 1, limit = 20): Promise<PaginatedResponse<FileItem>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (folderId) params.append('folderId', folderId);
    return api.get<PaginatedResponse<FileItem>>(`/queries/files?${params}`);
  },

  async getById(id: string): Promise<FileItem> {
    return api.get<FileItem>(`/queries/files/${id}`);
  },

  async getFolders(parentId?: string): Promise<Folder[]> {
    const params = parentId ? `?parentId=${parentId}` : '';
    return api.get<Folder[]>(`/queries/folders${params}`);
  },

  async getFolderById(id: string): Promise<Folder> {
    return api.get<Folder>(`/queries/folders/${id}`);
  },

  async getByWorkspace(workspaceId: string, folderId?: string, page = 1, limit = 20): Promise<PaginatedResponse<FileItem>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (folderId) params.append('folderId', folderId);
    return api.get<PaginatedResponse<FileItem>>(
      `/queries/workspaces/${workspaceId}/files?${params}`
    );
  },

  async search(query: string, page = 1, limit = 20): Promise<PaginatedResponse<FileItem>> {
    return api.get<PaginatedResponse<FileItem>>(
      `/queries/files/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
  },

  // Command endpoints (write operations)
  async upload(file: File, folderId?: string, workspaceId?: string): Promise<UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);
    if (workspaceId) formData.append('workspaceId', workspaceId);

    const response = await fetch(`${API_BASE_URL}/commands/sync/files/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.result;
  },

  async uploadMultiple(files: File[], folderId?: string, workspaceId?: string): Promise<UploadFileResponse[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (folderId) formData.append('folderId', folderId);
    if (workspaceId) formData.append('workspaceId', workspaceId);

    const response = await fetch(`${API_BASE_URL}/commands/sync/files/upload-multiple`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const data = await response.json();
    return data.result;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/commands/sync/files/${id}`);
  },

  async move(id: string, targetFolderId: string): Promise<FileItem> {
    return api.put<FileItem>(`/commands/sync/files/${id}/move`, { targetFolderId });
  },

  async rename(id: string, name: string): Promise<FileItem> {
    return api.put<FileItem>(`/commands/sync/files/${id}/rename`, { name });
  },

  // Folder operations
  async createFolder(data: CreateFolderRequest): Promise<Folder> {
    return api.post<Folder>('/commands/sync/folders', data);
  },

  async updateFolder(id: string, name: string): Promise<Folder> {
    return api.put<Folder>(`/commands/sync/folders/${id}`, { name });
  },

  async deleteFolder(id: string): Promise<void> {
    await api.delete(`/commands/sync/folders/${id}`);
  },

  async moveFolder(id: string, targetParentId: string): Promise<Folder> {
    return api.put<Folder>(`/commands/sync/folders/${id}/move`, { targetParentId });
  },

  // Download helpers
  getDownloadUrl(id: string): string {
    return `${API_BASE_URL}/queries/files/${id}/download?token=${getAccessToken()}`;
  },
};
