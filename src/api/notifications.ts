import { api } from './client';
import {
  Notification,
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
  PaginatedResponse,
} from './types';

export const notificationsService = {
  // Query endpoints (read operations)
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Notification>> {
    return api.get<PaginatedResponse<Notification>>(`/queries/notifications?page=${page}&limit=${limit}`);
  },

  async getUnread(page = 1, limit = 20): Promise<PaginatedResponse<Notification>> {
    return api.get<PaginatedResponse<Notification>>(`/queries/notifications/unread?page=${page}&limit=${limit}`);
  },

  async getUnreadCount(): Promise<{ count: number }> {
    return api.get<{ count: number }>('/queries/notifications/unread-count');
  },

  async getById(id: string): Promise<Notification> {
    return api.get<Notification>(`/queries/notifications/${id}`);
  },

  async getPreferences(): Promise<NotificationPreferences> {
    return api.get<NotificationPreferences>('/queries/notifications/preferences');
  },

  // Command endpoints (write operations)
  async markAsRead(id: string): Promise<Notification> {
    return api.put<Notification>(`/commands/sync/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/commands/sync/notifications/read-all');
  },

  async markAsUnread(id: string): Promise<Notification> {
    return api.put<Notification>(`/commands/sync/notifications/${id}/unread`);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/commands/sync/notifications/${id}`);
  },

  async deleteAll(): Promise<void> {
    await api.delete('/commands/sync/notifications');
  },

  async updatePreferences(data: UpdateNotificationPreferencesRequest): Promise<NotificationPreferences> {
    return api.put<NotificationPreferences>('/commands/sync/notifications/preferences', data);
  },

  async subscribeToPush(subscription: PushSubscriptionJSON): Promise<void> {
    await api.post('/commands/sync/notifications/push/subscribe', subscription);
  },

  async unsubscribeFromPush(): Promise<void> {
    await api.delete('/commands/sync/notifications/push/subscribe');
  },

  async testPush(): Promise<void> {
    await api.post('/commands/sync/notifications/push/test');
  },
};
