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
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Post>> {
    return api.get<PaginatedResponse<Post>>(`/posts?page=${page}&limit=${limit}`);
  },

  async getById(id: string): Promise<Post> {
    return api.get<Post>(`/posts/${id}`);
  },

  async create(data: CreatePostRequest): Promise<Post> {
    return api.post<Post>('/posts', data);
  },

  async update(id: string, data: UpdatePostRequest): Promise<Post> {
    return api.put<Post>(`/posts/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },

  async react(
    postId: string,
    type: 'like' | 'not-relevant' | 'recommend' | 'insightful' | 'inappropriate'
  ): Promise<void> {
    await api.post(`/posts/${postId}/react`, { type });
  },

  async removeReaction(postId: string): Promise<void> {
    await api.delete(`/posts/${postId}/react`);
  },

  async getComments(postId: string, page = 1, limit = 20): Promise<PaginatedResponse<Comment>> {
    return api.get<PaginatedResponse<Comment>>(
      `/posts/${postId}/comments?page=${page}&limit=${limit}`
    );
  },

  async addComment(postId: string, data: CreateCommentRequest): Promise<Comment> {
    return api.post<Comment>(`/posts/${postId}/comments`, data);
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    await api.delete(`/posts/${postId}/comments/${commentId}`);
  },

  async save(postId: string): Promise<void> {
    await api.post(`/posts/${postId}/save`);
  },

  async unsave(postId: string): Promise<void> {
    await api.delete(`/posts/${postId}/save`);
  },

  async getSaved(page = 1, limit = 20): Promise<PaginatedResponse<Post>> {
    return api.get<PaginatedResponse<Post>>(`/posts/saved?page=${page}&limit=${limit}`);
  },

  async getByUser(userId: string, page = 1, limit = 20): Promise<PaginatedResponse<Post>> {
    return api.get<PaginatedResponse<Post>>(
      `/users/${userId}/posts?page=${page}&limit=${limit}`
    );
  },

  async getByWorkspace(workspaceId: string, page = 1, limit = 20): Promise<PaginatedResponse<Post>> {
    return api.get<PaginatedResponse<Post>>(
      `/workspaces/${workspaceId}/posts?page=${page}&limit=${limit}`
    );
  },
};
