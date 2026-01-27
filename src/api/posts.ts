import { api } from './client';
import {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  Comment,
  CreateCommentRequest,
  PaginatedResponse,
} from './types';

export const postsService = {
  // Query endpoints (read operations)
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Post>> {
    return api.get<PaginatedResponse<Post>>(`/queries/posts?page=${page}&limit=${limit}`);
  },

  async getById(id: string): Promise<Post> {
    return api.get<Post>(`/queries/posts/${id}`);
  },

  async getComments(postId: string, page = 1, limit = 20): Promise<PaginatedResponse<Comment>> {
    return api.get<PaginatedResponse<Comment>>(
      `/queries/posts/${postId}/comments?page=${page}&limit=${limit}`
    );
  },

  async getSaved(page = 1, limit = 20): Promise<PaginatedResponse<Post>> {
    return api.get<PaginatedResponse<Post>>(`/queries/posts/saved?page=${page}&limit=${limit}`);
  },

  async getByUser(userId: string, page = 1, limit = 20): Promise<PaginatedResponse<Post>> {
    return api.get<PaginatedResponse<Post>>(
      `/queries/users/${userId}/posts?page=${page}&limit=${limit}`
    );
  },

  async getByWorkspace(workspaceId: string, page = 1, limit = 20): Promise<PaginatedResponse<Post>> {
    return api.get<PaginatedResponse<Post>>(
      `/queries/workspaces/${workspaceId}/posts?page=${page}&limit=${limit}`
    );
  },

  // Command endpoints (write operations)
  async create(data: CreatePostRequest): Promise<Post> {
    return api.post<Post>('/commands/posts', data);
  },

  async update(id: string, data: UpdatePostRequest): Promise<Post> {
    return api.put<Post>(`/commands/posts/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/commands/posts/${id}`);
  },

  async react(
    postId: string,
    type: 'like' | 'not-relevant' | 'recommend' | 'insightful' | 'inappropriate'
  ): Promise<void> {
    await api.post(`/commands/posts/${postId}/react`, { type });
  },

  async removeReaction(postId: string): Promise<void> {
    await api.delete(`/commands/posts/${postId}/react`);
  },

  async addComment(postId: string, data: CreateCommentRequest): Promise<Comment> {
    return api.post<Comment>(`/commands/posts/${postId}/comments`, data);
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    await api.delete(`/commands/posts/${postId}/comments/${commentId}`);
  },

  async save(postId: string): Promise<void> {
    await api.post(`/commands/posts/${postId}/save`);
  },

  async unsave(postId: string): Promise<void> {
    await api.delete(`/commands/posts/${postId}/save`);
  },
};
