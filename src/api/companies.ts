import { api } from './client';
import {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  PaginatedResponse,
  User,
} from './types';

export const companiesService = {
  // Query endpoints (read operations)
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Company>> {
    return api.get<PaginatedResponse<Company>>(`/queries/companies?page=${page}&limit=${limit}`);
  },

  async getById(id: string): Promise<Company> {
    return api.get<Company>(`/queries/companies/${id}`);
  },

  async getMembers(companyId: string, page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    return api.get<PaginatedResponse<User>>(
      `/queries/companies/${companyId}/members?page=${page}&limit=${limit}`
    );
  },

  async search(query: string, page = 1, limit = 20): Promise<PaginatedResponse<Company>> {
    return api.get<PaginatedResponse<Company>>(
      `/queries/companies/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
  },

  // Command endpoints (write operations)
  async create(data: CreateCompanyRequest): Promise<Company> {
    return api.post<Company>('/commands/sync/companies', data);
  },

  async update(id: string, data: UpdateCompanyRequest): Promise<Company> {
    return api.put<Company>(`/commands/sync/companies/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/commands/sync/companies/${id}`);
  },

  async addMember(companyId: string, userId: string): Promise<void> {
    await api.post(`/commands/sync/companies/${companyId}/members`, { userId });
  },

  async removeMember(companyId: string, userId: string): Promise<void> {
    await api.delete(`/commands/sync/companies/${companyId}/members/${userId}`);
  },
};
