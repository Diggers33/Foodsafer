import { api } from './client';
import {
  Course,
  CourseModule,
  Lesson,
  CourseEnrollment,
  CreateCourseRequest,
  UpdateCourseRequest,
  PaginatedResponse,
} from './types';

export const elearningService = {
  // Query endpoints (read operations)
  async getCourses(page = 1, limit = 20): Promise<PaginatedResponse<Course>> {
    return api.get<PaginatedResponse<Course>>(`/queries/courses?page=${page}&limit=${limit}`);
  },

  async getCourseById(id: string): Promise<Course> {
    return api.get<Course>(`/queries/courses/${id}`);
  },

  async getPublishedCourses(page = 1, limit = 20): Promise<PaginatedResponse<Course>> {
    return api.get<PaginatedResponse<Course>>(`/queries/courses/published?page=${page}&limit=${limit}`);
  },

  async getMyCourses(page = 1, limit = 20): Promise<PaginatedResponse<Course>> {
    return api.get<PaginatedResponse<Course>>(`/queries/courses/my?page=${page}&limit=${limit}`);
  },

  async getEnrolledCourses(page = 1, limit = 20): Promise<PaginatedResponse<CourseEnrollment>> {
    return api.get<PaginatedResponse<CourseEnrollment>>(`/queries/courses/enrolled?page=${page}&limit=${limit}`);
  },

  async getCourseModules(courseId: string): Promise<CourseModule[]> {
    return api.get<CourseModule[]>(`/queries/courses/${courseId}/modules`);
  },

  async getLesson(courseId: string, moduleId: string, lessonId: string): Promise<Lesson> {
    return api.get<Lesson>(`/queries/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
  },

  async getEnrollment(courseId: string): Promise<CourseEnrollment | null> {
    return api.get<CourseEnrollment | null>(`/queries/courses/${courseId}/enrollment`);
  },

  async searchCourses(query: string, page = 1, limit = 20): Promise<PaginatedResponse<Course>> {
    return api.get<PaginatedResponse<Course>>(
      `/queries/courses/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
  },

  async getCoursesByCategory(category: string, page = 1, limit = 20): Promise<PaginatedResponse<Course>> {
    return api.get<PaginatedResponse<Course>>(
      `/queries/courses/category/${encodeURIComponent(category)}?page=${page}&limit=${limit}`
    );
  },

  // Command endpoints (write operations)
  async createCourse(data: CreateCourseRequest): Promise<Course> {
    return api.post<Course>('/commands/sync/courses', data);
  },

  async updateCourse(id: string, data: UpdateCourseRequest): Promise<Course> {
    return api.put<Course>(`/commands/sync/courses/${id}`, data);
  },

  async deleteCourse(id: string): Promise<void> {
    await api.delete(`/commands/sync/courses/${id}`);
  },

  async publishCourse(id: string): Promise<Course> {
    return api.post<Course>(`/commands/sync/courses/${id}/publish`);
  },

  async archiveCourse(id: string): Promise<Course> {
    return api.post<Course>(`/commands/sync/courses/${id}/archive`);
  },

  async addModule(courseId: string, data: Omit<CourseModule, 'id' | 'lessons'>): Promise<CourseModule> {
    return api.post<CourseModule>(`/commands/sync/courses/${courseId}/modules`, data);
  },

  async updateModule(courseId: string, moduleId: string, data: Partial<CourseModule>): Promise<CourseModule> {
    return api.put<CourseModule>(`/commands/sync/courses/${courseId}/modules/${moduleId}`, data);
  },

  async deleteModule(courseId: string, moduleId: string): Promise<void> {
    await api.delete(`/commands/sync/courses/${courseId}/modules/${moduleId}`);
  },

  async addLesson(courseId: string, moduleId: string, data: Omit<Lesson, 'id'>): Promise<Lesson> {
    return api.post<Lesson>(`/commands/sync/courses/${courseId}/modules/${moduleId}/lessons`, data);
  },

  async updateLesson(courseId: string, moduleId: string, lessonId: string, data: Partial<Lesson>): Promise<Lesson> {
    return api.put<Lesson>(`/commands/sync/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, data);
  },

  async deleteLesson(courseId: string, moduleId: string, lessonId: string): Promise<void> {
    await api.delete(`/commands/sync/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
  },

  async enroll(courseId: string): Promise<CourseEnrollment> {
    return api.post<CourseEnrollment>(`/commands/sync/courses/${courseId}/enroll`);
  },

  async unenroll(courseId: string): Promise<void> {
    await api.delete(`/commands/sync/courses/${courseId}/enroll`);
  },

  async completeLesson(courseId: string, lessonId: string): Promise<CourseEnrollment> {
    return api.post<CourseEnrollment>(`/commands/sync/courses/${courseId}/lessons/${lessonId}/complete`);
  },

  async updateProgress(courseId: string, lessonId: string, progress: number): Promise<CourseEnrollment> {
    return api.put<CourseEnrollment>(`/commands/sync/courses/${courseId}/lessons/${lessonId}/progress`, { progress });
  },
};
