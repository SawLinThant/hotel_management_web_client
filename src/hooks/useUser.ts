import useSWR from 'swr';
import { fetcher, SWRError } from '@/lib/fetcher';
import { API_ENDPOINTS, SWR_CONFIG } from '@/lib/constants';
import type { User, PaginatedUsersResponse, UserSearchQuery, UserStats } from '@/types/user';

// Hook for current user profile
export function useUser() {
  const {
    data,
    error,
    mutate,
    isLoading,
  } = useSWR<User, SWRError>(
    API_ENDPOINTS.USER_PROFILE,
    fetcher,
    {
      ...SWR_CONFIG,
      onError: (error) => {
        // If unauthorized, clear auth token
        if (error.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        }
      },
    }
  );

  return {
    user: data,
    error,
    isLoading,
    mutate,
    // Helper to refresh data
    refresh: () => mutate(),
    // Helper to check if logged in
    isLoggedIn: !!data && !error,
    // Helper to check user role
    isAdmin: data?.role === 'admin',
    isStaff: data?.role === 'staff',
    isGuest: data?.role === 'guest',
    // Helper to check verification status
    isEmailVerified: data?.email_verified || false,
  };
}

// Hook for user management (admin)
export interface UseUsersOptions {
  query?: UserSearchQuery;
  enabled?: boolean;
}

export function useUsers(options: UseUsersOptions = {}) {
  const { query = {}, enabled = true } = options;
  
  // Build query string
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  const key = enabled ? `${API_ENDPOINTS.USERS}${queryString ? `?${queryString}` : ''}` : null;

  const {
    data,
    error,
    mutate,
    isLoading,
  } = useSWR<PaginatedUsersResponse, SWRError>(
    key,
    fetcher,
    SWR_CONFIG
  );

  return {
    users: data?.users || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: data?.total_pages || 0,
    error,
    isLoading,
    mutate,
    refresh: () => mutate(),
    hasData: !!data,
    hasUsers: (data?.users?.length || 0) > 0,
  };
}

// Hook for user details by ID
export function useUserDetail(userId: string | null, enabled = true) {
  const key = enabled && userId ? `${API_ENDPOINTS.USERS}/${userId}` : null;

  const {
    data,
    error,
    mutate,
    isLoading,
  } = useSWR<User, SWRError>(
    key,
    fetcher,
    SWR_CONFIG
  );

  return {
    user: data,
    error,
    isLoading,
    mutate,
    refresh: () => mutate(),
    hasData: !!data,
  };
}

// Hook for user statistics
export function useUserStats() {
  const {
    data,
    error,
    mutate,
    isLoading,
  } = useSWR<UserStats, SWRError>(
    `${API_ENDPOINTS.USERS}/stats`,
    fetcher,
    SWR_CONFIG
  );

  return {
    stats: data,
    error,
    isLoading,
    mutate,
    refresh: () => mutate(),
    hasData: !!data,
  };
}

// Hook for searching users
export function useSearchUsers(searchQuery: string, filters: Omit<UserSearchQuery, 'search'> = {}) {
  const query: UserSearchQuery = {
    ...filters,
    search: searchQuery.trim() || undefined,
  };

  return useUsers({
    query,
    enabled: searchQuery.length >= 2,
  });
} 