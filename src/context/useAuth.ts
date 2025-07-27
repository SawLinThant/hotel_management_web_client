import { useUser } from '@/hooks/useUser';
import { userService } from '@/services/userService';
import type { LoginPayload, RegisterUserPayload } from '@/types/user';

export function useAuth() {
  const { user, error, isLoading, mutate } = useUser();

  const login = async (credentials: LoginPayload) => {
    try {
      const response = await userService.login(credentials);
      // Trigger SWR to refetch user data
      mutate(response.user, false);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterUserPayload) => {
    try {
      const response = await userService.register(userData);
      // Trigger SWR to refetch user data
      mutate(response.user, false);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await userService.logout();
      // Clear SWR cache
      mutate(undefined, false);
    } catch (error) {
      // Even if API call fails, clear local state
      mutate(undefined, false);
      throw error;
    }
  };

  return {
    user,
    error,
    isLoading,
    isAuthenticated: !!user && !error,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isGuest: user?.role === 'guest',
    login,
    register,
    logout,
    refresh: () => mutate(),
  };
} 