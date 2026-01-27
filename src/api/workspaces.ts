import { api } from './client';
import {
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  WorkspaceMember,
  PaginatedResponse,
} from './types';

export const workspacesService = {
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Workspace>> {
    return api.get<PaginatedResponse<Workspace>>(`/workspaces?page=${page}&limit=${limit}`);
  },

  async getMy(page = 1, limit = 20): Promise<PaginatedResponse<Workspace>> {
    return api.get<PaginatedResponse<Workspace>>(`/workspaces/my?page=${page}&limit=${limit}`);
  },

  async getById(id: string): Promise<Workspace> {
    return api.get<Workspace>(`/workspaces/${id}`);
  },

  async create(data: CreateWorkspaceRequest): Promise<Workspace> {
    return api.post<Workspace>('/workspaces', data);
  },

  async update(id: string, data: UpdateWorkspaceRequest): Promise<Workspace> {
    return api.put<Workspace>(`/workspaces/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/workspaces/${id}`);
  },

  async getMembers(workspaceId: string, page = 1, limit = 20): Promise<PaginatedResponse<WorkspaceMember>> {
    return api.get<PaginatedResponse<WorkspaceMember>>(
      `/workspaces/${workspaceId}/members?page=${page}&limit=${limit}`
    );
  },

  async addMember(workspaceId: string, userId: string, role: 'admin' | 'member' = 'member'): Promise<void> {
    await api.post(`/workspaces/${workspaceId}/members`, { userId, role });
  },

  async removeMember(workspaceId: string, userId: string): Promise<void> {
    await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
  },

  async updateMemberRole(workspaceId: string, userId: string, role: 'admin' | 'member'): Promise<void> {
    await api.put(`/workspaces/${workspaceId}/members/${userId}`, { role });
  },

  async join(workspaceId: string): Promise<void> {
    await api.post(`/workspaces/${workspaceId}/join`);
  },

  async leave(workspaceId: string): Promise<void> {
    await api.post(`/workspaces/${workspaceId}/leave`);
  },
};
