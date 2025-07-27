import useSWR from 'swr';
import { fetcher, SWRError } from '@/lib/fetcher';
import { API_ENDPOINTS, SWR_CONFIG } from '@/lib/constants';
import type { PaginatedRoomsResponse, RoomSearchQuery } from '@/types/room';

export interface UseRoomsOptions {
  query?: RoomSearchQuery;
  enabled?: boolean;
  refreshInterval?: number;
}

export function useRooms(options: UseRoomsOptions = {}) {
  const { query = {}, enabled = true, refreshInterval } = options;
  
  // Build query string
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => params.append(key, String(item)));
      } else {
        params.set(key, String(value));
      }
    }
  });

  const queryString = params.toString();
  const key = enabled ? `${API_ENDPOINTS.ROOMS}${queryString ? `?${queryString}` : ''}` : null;

  const {
    data,
    error,
    mutate,
    isLoading,
    isValidating,
  } = useSWR<PaginatedRoomsResponse, SWRError>(
    key,
    fetcher,
    {
      ...SWR_CONFIG,
      refreshInterval,
    }
  );

  return {
    rooms: data?.rooms || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: data?.total_pages || 0,
    error,
    isLoading,
    isValidating,
    mutate,
    // Helper to refresh data
    refresh: () => mutate(),
    // Helper to check if we have data
    hasData: !!data,
    // Helper to check if we have rooms
    hasRooms: (data?.rooms?.length || 0) > 0,
  };
}

// Hook for searching rooms with debounced query
export function useSearchRooms(searchQuery: string, filters: Omit<RoomSearchQuery, 'search'> = {}) {
  const query: RoomSearchQuery = {
    ...filters,
    search: searchQuery.trim() || undefined,
  };

  return useRooms({
    query,
    enabled: searchQuery.length >= 2, // Only search when query is at least 2 characters
  });
}

// Hook for available rooms in a date range
export function useAvailableRooms(checkIn: string, checkOut: string, guests?: number) {
  const query: RoomSearchQuery = {
    available_from: checkIn,
    available_to: checkOut,
    min_capacity: guests,
  };

  return useRooms({
    query,
    enabled: !!(checkIn && checkOut),
  });
} 