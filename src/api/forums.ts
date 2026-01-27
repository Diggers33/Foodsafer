import { api } from './client';
import {
  ForumCategory,
  ForumTopic,
  ForumReply,
  CreateForumTopicRequest,
  UpdateForumTopicRequest,
  CreateForumReplyRequest,
  PaginatedResponse,
} from './types';

export const forumsService = {
  // Query endpoints (read operations)
  async getCategories(): Promise<ForumCategory[]> {
    return api.get<ForumCategory[]>('/queries/forums/categories');
  },

  async getCategoryById(id: string): Promise<ForumCategory> {
    return api.get<ForumCategory>(`/queries/forums/categories/${id}`);
  },

  async getCategoryBySlug(slug: string): Promise<ForumCategory> {
    return api.get<ForumCategory>(`/queries/forums/categories/slug/${slug}`);
  },

  async getTopics(categoryId?: string, page = 1, limit = 20): Promise<PaginatedResponse<ForumTopic>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (categoryId) params.append('categoryId', categoryId);
    return api.get<PaginatedResponse<ForumTopic>>(`/queries/forums/topics?${params}`);
  },

  async getTopicById(id: string): Promise<ForumTopic> {
    return api.get<ForumTopic>(`/queries/forums/topics/${id}`);
  },

  async getLatestTopics(page = 1, limit = 20): Promise<PaginatedResponse<ForumTopic>> {
    return api.get<PaginatedResponse<ForumTopic>>(`/queries/forums/topics/latest?page=${page}&limit=${limit}`);
  },

  async getPopularTopics(page = 1, limit = 20): Promise<PaginatedResponse<ForumTopic>> {
    return api.get<PaginatedResponse<ForumTopic>>(`/queries/forums/topics/popular?page=${page}&limit=${limit}`);
  },

  async getMyTopics(page = 1, limit = 20): Promise<PaginatedResponse<ForumTopic>> {
    return api.get<PaginatedResponse<ForumTopic>>(`/queries/forums/topics/my?page=${page}&limit=${limit}`);
  },

  async getReplies(topicId: string, page = 1, limit = 20): Promise<PaginatedResponse<ForumReply>> {
    return api.get<PaginatedResponse<ForumReply>>(
      `/queries/forums/topics/${topicId}/replies?page=${page}&limit=${limit}`
    );
  },

  async searchTopics(query: string, page = 1, limit = 20): Promise<PaginatedResponse<ForumTopic>> {
    return api.get<PaginatedResponse<ForumTopic>>(
      `/queries/forums/topics/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
  },

  // Command endpoints (write operations)
  async createTopic(data: CreateForumTopicRequest): Promise<ForumTopic> {
    return api.post<ForumTopic>('/commands/sync/forums/topics', data);
  },

  async updateTopic(id: string, data: UpdateForumTopicRequest): Promise<ForumTopic> {
    return api.put<ForumTopic>(`/commands/sync/forums/topics/${id}`, data);
  },

  async deleteTopic(id: string): Promise<void> {
    await api.delete(`/commands/sync/forums/topics/${id}`);
  },

  async pinTopic(id: string): Promise<ForumTopic> {
    return api.post<ForumTopic>(`/commands/sync/forums/topics/${id}/pin`);
  },

  async unpinTopic(id: string): Promise<ForumTopic> {
    return api.post<ForumTopic>(`/commands/sync/forums/topics/${id}/unpin`);
  },

  async lockTopic(id: string): Promise<ForumTopic> {
    return api.post<ForumTopic>(`/commands/sync/forums/topics/${id}/lock`);
  },

  async unlockTopic(id: string): Promise<ForumTopic> {
    return api.post<ForumTopic>(`/commands/sync/forums/topics/${id}/unlock`);
  },

  async createReply(topicId: string, data: CreateForumReplyRequest): Promise<ForumReply> {
    return api.post<ForumReply>(`/commands/sync/forums/topics/${topicId}/replies`, data);
  },

  async updateReply(topicId: string, replyId: string, content: string): Promise<ForumReply> {
    return api.put<ForumReply>(`/commands/sync/forums/topics/${topicId}/replies/${replyId}`, { content });
  },

  async deleteReply(topicId: string, replyId: string): Promise<void> {
    await api.delete(`/commands/sync/forums/topics/${topicId}/replies/${replyId}`);
  },

  async reportTopic(id: string, reason: string): Promise<void> {
    await api.post(`/commands/sync/forums/topics/${id}/report`, { reason });
  },

  async reportReply(topicId: string, replyId: string, reason: string): Promise<void> {
    await api.post(`/commands/sync/forums/topics/${topicId}/replies/${replyId}/report`, { reason });
  },
};
