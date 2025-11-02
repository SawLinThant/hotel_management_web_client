import { apiClient } from '@/lib/fetcher';
import { API_ENDPOINTS } from '@/lib/constants';
import type {
  User,
  LoginPayload,
  RegisterUserPayload,
  UpdateUserPayload,
  ChangePasswordPayload,
  ResetPasswordPayload,
  ConfirmPasswordResetPayload,
  AuthResponse,
  RefreshTokenPayload,
  UserSearchQuery,
  PaginatedUsersResponse,
  UserStats,
} from '@/types/user';

export const userService = {
  // Authentication
  async login(credentials: LoginPayload): Promise<AuthResponse> {
    // Use the role-specific endpoint if role is provided
    // Otherwise use the generic endpoint
    const endpoint = credentials.role === 'guest' 
      ? '/auth/guest/login'
      : credentials.role === 'staff'
      ? '/auth/staff/login'
      : credentials.role === 'admin'
      ? '/auth/admin/login'
      : API_ENDPOINTS.LOGIN;

    // Remove role from payload for role-specific endpoints (they don't need it)
    const payload = endpoint !== API_ENDPOINTS.LOGIN 
      ? { email: credentials.email, password: credentials.password }
      : credentials;

    console.log('userService.login: Calling endpoint:', endpoint);
    console.log('userService.login: Payload:', { ...payload, password: '***' });
    
    const response = await apiClient.post(endpoint, payload);
    
    console.log('userService.login: Response received:', {
      hasUser: !!response.data.user,
      userRole: response.data.user?.role,
      hasToken: !!response.data.access_token,
    });
    
    // Store tokens in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      console.log('userService.login: Tokens stored in localStorage');
    }
    
    return response.data;
  },

  async register(userData: RegisterUserPayload): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
    
    // Store tokens in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } finally {
      // Clear tokens from localStorage regardless of API response
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      }
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.REFRESH_TOKEN, {
      refresh_token: refreshToken,
    });
    
    // Update tokens in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  },

  // User profile
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get(API_ENDPOINTS.USER_PROFILE);
    return response.data;
  },

  async updateProfile(userData: UpdateUserPayload): Promise<User> {
    const response = await apiClient.put(API_ENDPOINTS.USER_PROFILE, userData);
    return response.data;
  },

  async changePassword(passwordData: ChangePasswordPayload): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.USER_PROFILE}/change-password`, passwordData);
  },

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post(
      `${API_ENDPOINTS.USER_PROFILE}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.avatar_url;
  },

  // Password reset
  async requestPasswordReset(payload: ResetPasswordPayload): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.USER_PROFILE}/reset-password`, payload);
  },

  async confirmPasswordReset(payload: ConfirmPasswordResetPayload): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.USER_PROFILE}/confirm-reset`, payload);
  },

  // Admin user management
  async getUsers(query: UserSearchQuery = {}): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });

    const response = await apiClient.get(
      `${API_ENDPOINTS.USERS}?${params.toString()}`
    );
    return response.data;
  },

  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS}/${userId}`);
    return response.data;
  },

  async createUser(userData: RegisterUserPayload & { role?: string }): Promise<User> {
    const response = await apiClient.post(API_ENDPOINTS.USERS, userData);
    return response.data;
  },

  async updateUser(userId: string, userData: UpdateUserPayload & { role?: string; is_active?: boolean }): Promise<User> {
    const response = await apiClient.put(`${API_ENDPOINTS.USERS}/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.USERS}/${userId}`);
  },

  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS}/stats`);
    return response.data;
  },

  // Bulk operations
  async bulkUpdateUsers(
    userIds: string[],
    updateData: { is_active?: boolean; role?: string }
  ): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.USERS}/bulk-update`, {
      user_ids: userIds,
      ...updateData,
    });
  },

  async bulkDeleteUsers(userIds: string[]): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.USERS}/bulk-delete`, {
      data: { user_ids: userIds },
    });
  },

  // Email verification
  async sendVerificationEmail(): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.USER_PROFILE}/send-verification`);
  },

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.USER_PROFILE}/verify-email`, { token });
  },
}; 