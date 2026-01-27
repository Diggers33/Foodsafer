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

// API Error
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}
