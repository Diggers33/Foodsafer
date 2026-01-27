import { api } from './client';
import {
  Event,
  EventAttendee,
  CreateEventRequest,
  UpdateEventRequest,
  PaginatedResponse,
} from './types';

export const eventsService = {
  // Query endpoints (read operations)
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Event>> {
    return api.get<PaginatedResponse<Event>>(`/queries/events?page=${page}&limit=${limit}`);
  },

  async getById(id: string): Promise<Event> {
    return api.get<Event>(`/queries/events/${id}`);
  },

  async getUpcoming(page = 1, limit = 20): Promise<PaginatedResponse<Event>> {
    return api.get<PaginatedResponse<Event>>(`/queries/events/upcoming?page=${page}&limit=${limit}`);
  },

  async getMyEvents(page = 1, limit = 20): Promise<PaginatedResponse<Event>> {
    return api.get<PaginatedResponse<Event>>(`/queries/events/my?page=${page}&limit=${limit}`);
  },

  async getAttendees(eventId: string, page = 1, limit = 20): Promise<PaginatedResponse<EventAttendee>> {
    return api.get<PaginatedResponse<EventAttendee>>(
      `/queries/events/${eventId}/attendees?page=${page}&limit=${limit}`
    );
  },

  async getByWorkspace(workspaceId: string, page = 1, limit = 20): Promise<PaginatedResponse<Event>> {
    return api.get<PaginatedResponse<Event>>(
      `/queries/workspaces/${workspaceId}/events?page=${page}&limit=${limit}`
    );
  },

  // Command endpoints (write operations)
  async create(data: CreateEventRequest): Promise<Event> {
    return api.post<Event>('/commands/sync/events', data);
  },

  async update(id: string, data: UpdateEventRequest): Promise<Event> {
    return api.put<Event>(`/commands/sync/events/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/commands/sync/events/${id}`);
  },

  async register(eventId: string): Promise<void> {
    await api.post(`/commands/sync/events/${eventId}/register`);
  },

  async unregister(eventId: string): Promise<void> {
    await api.delete(`/commands/sync/events/${eventId}/register`);
  },

  async updateAttendeeStatus(
    eventId: string,
    userId: string,
    status: 'pending' | 'accepted' | 'declined'
  ): Promise<void> {
    await api.put(`/commands/sync/events/${eventId}/attendees/${userId}`, { status });
  },

  async publish(eventId: string): Promise<Event> {
    return api.post<Event>(`/commands/sync/events/${eventId}/publish`);
  },

  async cancel(eventId: string): Promise<Event> {
    return api.post<Event>(`/commands/sync/events/${eventId}/cancel`);
  },
};
