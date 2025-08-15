// User roles
export type UserRole = 'admin' | 'staff' | 'guest';

// Base user interface
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
  address?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
  nationality?: string;
  passport_number?: string;
  id_card_number?: string;
  avatar_url?: string;
  preferences?: UserPreferences;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

// User preferences
export interface UserPreferences {
  language: 'en' | 'my';
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  marketing_emails: boolean;
}

// User registration payload
export interface RegisterUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
  nationality?: string;
  passport_number?: string;
  id_card_number?: string;
}

// User login payload
export interface LoginPayload {
  email: string;
  password: string;
  remember_me?: boolean;
  role?: 'guest' | 'staff' | 'admin';
}

// User update payload
export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
  nationality?: string;
  passport_number?: string;
  id_card_number?: string;
  preferences?: Partial<UserPreferences>;
  avatar_url?: string;
}

// Password change payload
export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// Password reset payload
export interface ResetPasswordPayload {
  email: string;
}

export interface ConfirmPasswordResetPayload {
  token: string;
  new_password: string;
  confirm_password: string;
}

// Authentication response
export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

// Refresh token payload
export interface RefreshTokenPayload {
  refresh_token: string;
}

// User filters for admin listing
export interface UserFilters {
  role?: UserRole;
  is_active?: boolean;
  email_verified?: boolean;
  created_from?: string;
  created_to?: string;
  last_login_from?: string;
  last_login_to?: string;
  country?: string;
  city?: string;
}

// User search query
export interface UserSearchQuery extends UserFilters {
  page?: number;
  limit?: number;
  sort_by?: 'first_name' | 'last_name' | 'email' | 'created_at' | 'last_login';
  sort_order?: 'asc' | 'desc';
  search?: string;
}

// Paginated users response
export interface PaginatedUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// User statistics
export interface UserStats {
  total_users: number;
  active_users: number;
  verified_users: number;
  admin_users: number;
  staff_users: number;
  guest_users: number;
  new_users_this_month: number;
  users_by_country: Array<{
    country: string;
    count: number;
  }>;
}

// Profile update response
export interface ProfileUpdateResponse {
  user: User;
  message: string;
} 