import { api } from './client';
import {
  Training,
  TrainingParticipant,
  CreateTrainingRequest,
  UpdateTrainingRequest,
  PaginatedResponse,
} from './types';

export const trainingsService = {
  // Query endpoints (read operations)
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Training>> {
    return api.get<PaginatedResponse<Training>>(`/queries/trainings?page=${page}&limit=${limit}`);
  },

  async getById(id: string): Promise<Training> {
    return api.get<Training>(`/queries/trainings/${id}`);
  },

  async getUpcoming(page = 1, limit = 20): Promise<PaginatedResponse<Training>> {
    return api.get<PaginatedResponse<Training>>(`/queries/trainings/upcoming?page=${page}&limit=${limit}`);
  },

  async getMyTrainings(page = 1, limit = 20): Promise<PaginatedResponse<Training>> {
    return api.get<PaginatedResponse<Training>>(`/queries/trainings/my?page=${page}&limit=${limit}`);
  },

  async getRegistered(page = 1, limit = 20): Promise<PaginatedResponse<Training>> {
    return api.get<PaginatedResponse<Training>>(`/queries/trainings/registered?page=${page}&limit=${limit}`);
  },

  async getParticipants(trainingId: string, page = 1, limit = 20): Promise<PaginatedResponse<TrainingParticipant>> {
    return api.get<PaginatedResponse<TrainingParticipant>>(
      `/queries/trainings/${trainingId}/participants?page=${page}&limit=${limit}`
    );
  },

  async getByType(type: 'online' | 'in_person' | 'hybrid', page = 1, limit = 20): Promise<PaginatedResponse<Training>> {
    return api.get<PaginatedResponse<Training>>(`/queries/trainings/type/${type}?page=${page}&limit=${limit}`);
  },

  async searchTrainings(query: string, page = 1, limit = 20): Promise<PaginatedResponse<Training>> {
    return api.get<PaginatedResponse<Training>>(
      `/queries/trainings/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
  },

  async getCompletedByUser(userId: string, page = 1, limit = 20): Promise<PaginatedResponse<Training>> {
    return api.get<PaginatedResponse<Training>>(
      `/queries/users/${userId}/trainings/completed?page=${page}&limit=${limit}`
    );
  },

  // Command endpoints (write operations)
  async create(data: CreateTrainingRequest): Promise<Training> {
    return api.post<Training>('/commands/sync/trainings', data);
  },

  async update(id: string, data: UpdateTrainingRequest): Promise<Training> {
    return api.put<Training>(`/commands/sync/trainings/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/commands/sync/trainings/${id}`);
  },

  async register(trainingId: string): Promise<TrainingParticipant> {
    return api.post<TrainingParticipant>(`/commands/sync/trainings/${trainingId}/register`);
  },

  async unregister(trainingId: string): Promise<void> {
    await api.delete(`/commands/sync/trainings/${trainingId}/register`);
  },

  async start(id: string): Promise<Training> {
    return api.post<Training>(`/commands/sync/trainings/${id}/start`);
  },

  async complete(id: string): Promise<Training> {
    return api.post<Training>(`/commands/sync/trainings/${id}/complete`);
  },

  async cancel(id: string): Promise<Training> {
    return api.post<Training>(`/commands/sync/trainings/${id}/cancel`);
  },

  async updateParticipantStatus(
    trainingId: string,
    userId: string,
    status: 'registered' | 'attended' | 'completed' | 'no_show'
  ): Promise<TrainingParticipant> {
    return api.put<TrainingParticipant>(
      `/commands/sync/trainings/${trainingId}/participants/${userId}`,
      { status }
    );
  },

  async markAttendance(trainingId: string, userIds: string[]): Promise<void> {
    await api.post(`/commands/sync/trainings/${trainingId}/attendance`, { userIds });
  },

  async issueCertificate(trainingId: string, userId: string): Promise<{ certificateUrl: string }> {
    return api.post<{ certificateUrl: string }>(
      `/commands/sync/trainings/${trainingId}/participants/${userId}/certificate`
    );
  },
};
