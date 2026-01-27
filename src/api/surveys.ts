import { api } from './client';
import {
  Survey,
  SurveyResponse,
  CreateSurveyRequest,
  UpdateSurveyRequest,
  SubmitSurveyRequest,
  PaginatedResponse,
} from './types';

export const surveysService = {
  // Query endpoints (read operations)
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Survey>> {
    return api.get<PaginatedResponse<Survey>>(`/queries/surveys?page=${page}&limit=${limit}`);
  },

  async getById(id: string): Promise<Survey> {
    return api.get<Survey>(`/queries/surveys/${id}`);
  },

  async getActive(page = 1, limit = 20): Promise<PaginatedResponse<Survey>> {
    return api.get<PaginatedResponse<Survey>>(`/queries/surveys/active?page=${page}&limit=${limit}`);
  },

  async getMySurveys(page = 1, limit = 20): Promise<PaginatedResponse<Survey>> {
    return api.get<PaginatedResponse<Survey>>(`/queries/surveys/my?page=${page}&limit=${limit}`);
  },

  async getResponses(surveyId: string, page = 1, limit = 20): Promise<PaginatedResponse<SurveyResponse>> {
    return api.get<PaginatedResponse<SurveyResponse>>(
      `/queries/surveys/${surveyId}/responses?page=${page}&limit=${limit}`
    );
  },

  async getMyResponse(surveyId: string): Promise<SurveyResponse | null> {
    return api.get<SurveyResponse | null>(`/queries/surveys/${surveyId}/my-response`);
  },

  async getAnalytics(surveyId: string): Promise<{
    totalResponses: number;
    completionRate: number;
    questionStats: Record<string, unknown>;
  }> {
    return api.get(`/queries/surveys/${surveyId}/analytics`);
  },

  // Command endpoints (write operations)
  async create(data: CreateSurveyRequest): Promise<Survey> {
    return api.post<Survey>('/commands/sync/surveys', data);
  },

  async update(id: string, data: UpdateSurveyRequest): Promise<Survey> {
    return api.put<Survey>(`/commands/sync/surveys/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/commands/sync/surveys/${id}`);
  },

  async publish(id: string): Promise<Survey> {
    return api.post<Survey>(`/commands/sync/surveys/${id}/publish`);
  },

  async close(id: string): Promise<Survey> {
    return api.post<Survey>(`/commands/sync/surveys/${id}/close`);
  },

  async submit(surveyId: string, data: SubmitSurveyRequest): Promise<SurveyResponse> {
    return api.post<SurveyResponse>(`/commands/sync/surveys/${surveyId}/submit`, data);
  },

  async duplicate(id: string): Promise<Survey> {
    return api.post<Survey>(`/commands/sync/surveys/${id}/duplicate`);
  },
};
