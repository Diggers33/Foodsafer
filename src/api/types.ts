// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organization?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  organization?: string;
  bio?: string;
  location?: string;
  skills?: string[];
}

// Post types
export interface Post {
  id: string;
  author: User;
  title: string;
  content: string;
  images?: string[];
  documents?: string[];
  tags: string[];
  visibility: 'public' | 'private' | 'workspace';
  workspaceId?: string;
  reactions: PostReaction[];
  reactionCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostReaction {
  id: string;
  userId: string;
  type: 'like' | 'not-relevant' | 'recommend' | 'insightful' | 'inappropriate';
}

export interface CreatePostRequest {
  title: string;
  content: string;
  images?: string[];
  documents?: string[];
  tags: string[];
  visibility: 'public' | 'private' | 'workspace';
  workspaceId?: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  images?: string[];
  documents?: string[];
  tags?: string[];
  visibility?: 'public' | 'private' | 'workspace';
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
}

// Workspace types
export interface Workspace {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  isPublic: boolean;
  ownerId: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  user: User;
  workspaceId: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  description: string;
  thumbnail?: string;
  isPublic: boolean;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  thumbnail?: string;
  isPublic?: boolean;
}

// Company types
export interface Company {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
}

export interface UpdateCompanyRequest {
  name?: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  isOnline: boolean;
  meetingUrl?: string;
  organizerId: string;
  organizer?: User;
  attendees?: EventAttendee[];
  attendeeCount: number;
  maxAttendees?: number;
  status: 'draft' | 'published' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface EventAttendee {
  id: string;
  userId: string;
  user?: User;
  eventId: string;
  status: 'pending' | 'accepted' | 'declined';
  joinedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  isOnline: boolean;
  meetingUrl?: string;
  maxAttendees?: number;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  isOnline?: boolean;
  meetingUrl?: string;
  maxAttendees?: number;
  status?: 'draft' | 'published' | 'cancelled';
}

// File types
export interface FileItem {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  folderId?: string;
  workspaceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  workspaceId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFolderRequest {
  name: string;
  parentId?: string;
  workspaceId?: string;
}

export interface UploadFileResponse {
  file: FileItem;
  uploadUrl?: string;
}

// Survey types
export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  status: 'draft' | 'active' | 'closed';
  startDate?: string;
  endDate?: string;
  responseCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'text' | 'single_choice' | 'multiple_choice' | 'rating' | 'scale';
  options?: string[];
  required: boolean;
  order: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  answers: SurveyAnswer[];
  submittedAt: string;
}

export interface SurveyAnswer {
  questionId: string;
  value: string | string[] | number;
}

export interface CreateSurveyRequest {
  title: string;
  description: string;
  questions: Omit<SurveyQuestion, 'id'>[];
  startDate?: string;
  endDate?: string;
}

export interface UpdateSurveyRequest {
  title?: string;
  description?: string;
  questions?: Omit<SurveyQuestion, 'id'>[];
  status?: 'draft' | 'active' | 'closed';
  startDate?: string;
  endDate?: string;
}

export interface SubmitSurveyRequest {
  answers: SurveyAnswer[];
}

// E-Learning types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  modules: CourseModule[];
  instructorId: string;
  instructor?: User;
  enrollmentCount: number;
  rating?: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: number;
  order: number;
  resources?: string[];
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  startedAt: string;
  completedAt?: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  thumbnail?: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  status?: 'draft' | 'published' | 'archived';
}

// Marketplace types
export interface MarketplaceProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  sellerId: string;
  seller?: User;
  status: 'draft' | 'active' | 'sold' | 'archived';
  stock?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMarketplaceProductRequest {
  name: string;
  description: string;
  price: number;
  currency: string;
  images?: string[];
  category: string;
  stock?: number;
}

export interface UpdateMarketplaceProductRequest {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  category?: string;
  status?: 'draft' | 'active' | 'sold' | 'archived';
  stock?: number;
}

// Forum types
export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  topicCount: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  category?: ForumCategory;
  authorId: string;
  author?: User;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  lastReplyAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumReply {
  id: string;
  topicId: string;
  content: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateForumTopicRequest {
  title: string;
  content: string;
  categoryId: string;
}

export interface UpdateForumTopicRequest {
  title?: string;
  content?: string;
  isPinned?: boolean;
  isLocked?: boolean;
}

export interface CreateForumReplyRequest {
  content: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  digest: 'none' | 'daily' | 'weekly';
  categories: Record<string, boolean>;
}

export interface UpdateNotificationPreferencesRequest {
  email?: boolean;
  push?: boolean;
  inApp?: boolean;
  digest?: 'none' | 'daily' | 'weekly';
  categories?: Record<string, boolean>;
}

// Library types
export interface Library {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'template' | 'resource';
  items: LibraryItem[];
  isPublic: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryItem {
  id: string;
  libraryId: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLibraryRequest {
  name: string;
  description: string;
  type: 'document' | 'template' | 'resource';
  isPublic: boolean;
}

export interface UpdateLibraryRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

// Training types
export interface Training {
  id: string;
  title: string;
  description: string;
  type: 'online' | 'in_person' | 'hybrid';
  startDate: string;
  endDate: string;
  location?: string;
  meetingUrl?: string;
  trainerId: string;
  trainer?: User;
  maxParticipants?: number;
  participantCount: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  materials?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TrainingParticipant {
  id: string;
  trainingId: string;
  userId: string;
  user?: User;
  status: 'registered' | 'attended' | 'completed' | 'no_show';
  registeredAt: string;
  completedAt?: string;
}

export interface CreateTrainingRequest {
  title: string;
  description: string;
  type: 'online' | 'in_person' | 'hybrid';
  startDate: string;
  endDate: string;
  location?: string;
  meetingUrl?: string;
  maxParticipants?: number;
  materials?: string[];
}

export interface UpdateTrainingRequest {
  title?: string;
  description?: string;
  type?: 'online' | 'in_person' | 'hybrid';
  startDate?: string;
  endDate?: string;
  location?: string;
  meetingUrl?: string;
  maxParticipants?: number;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  materials?: string[];
}

// Skill types
export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skill: Skill;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements: number;
}

// Best Practice types
export interface BestPractice {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  author?: User;
  viewCount: number;
  likeCount: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBestPracticeRequest {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface UpdateBestPracticeRequest {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
}

// Broadcast Message types
export interface BroadcastMessage {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'urgent';
  targetAudience: 'all' | 'workspace' | 'company';
  targetIds?: string[];
  scheduledAt?: string;
  sentAt?: string;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateBroadcastMessageRequest {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'urgent';
  targetAudience: 'all' | 'workspace' | 'company';
  targetIds?: string[];
  scheduledAt?: string;
  expiresAt?: string;
}

// API Error
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}
