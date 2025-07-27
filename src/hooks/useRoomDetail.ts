import useSWR from 'swr';
import { fetcher, SWRError } from '@/lib/fetcher';
import { API_ENDPOINTS, SWR_CONFIG } from '@/lib/constants';
import type { Room } from '@/types/room';

export interface UseRoomDetailOptions {
  enabled?: boolean;
  refreshInterval?: number;
}

export function useRoomDetail(roomId: string | null, options: UseRoomDetailOptions = {}) {
  const { enabled = true, refreshInterval } = options;
  
  const key = enabled && roomId ? API_ENDPOINTS.ROOM_DETAIL(roomId) : null;

  const {
    data,
    error,
    mutate,
    isLoading,
    isValidating,
  } = useSWR<Room, SWRError>(
    key,
    fetcher,
    {
      ...SWR_CONFIG,
      refreshInterval,
    }
  );

  return {
    room: data,
    error,
    isLoading,
    isValidating,
    mutate,
    // Helper to refresh data
    refresh: () => mutate(),
    // Helper to check if we have data
    hasData: !!data,
    // Helper to get room status
    isAvailable: data?.status === 'available',
    isOccupied: data?.status === 'occupied',
    isUnderMaintenance: data?.status === 'maintenance',
  };
}

// Hook for checking if a room exists
export function useRoomExists(roomId: string | null) {
  const { room, error, isLoading } = useRoomDetail(roomId);
  
  return {
    exists: !!room && !error,
    isLoading,
    room,
  };
} 