import useSWR from 'swr';
import { fetcher, SWRError } from '@/lib/fetcher';
import { API_ENDPOINTS, SWR_CONFIG } from '@/lib/constants';
import type { PaginatedBookingsResponse, BookingSearchQuery, BookingStats } from '@/types/booking';

export interface UseBookingsOptions {
  query?: BookingSearchQuery;
  enabled?: boolean;
  refreshInterval?: number;
}

export function useBookings(options: UseBookingsOptions = {}) {
  const { query = {}, enabled = true, refreshInterval } = options;
  
  // Build query string
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  const key = enabled ? `${API_ENDPOINTS.BOOKINGS}${queryString ? `?${queryString}` : ''}` : null;

  const {
    data,
    error,
    mutate,
    isLoading,
    isValidating,
  } = useSWR<PaginatedBookingsResponse, SWRError>(
    key,
    fetcher,
    {
      ...SWR_CONFIG,
      refreshInterval,
    }
  );

  return {
    bookings: data?.bookings || [],
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
    // Helper to check if we have bookings
    hasBookings: (data?.bookings?.length || 0) > 0,
  };
}

// Hook for today's arrivals
export function useTodayArrivals() {
  const today = new Date().toISOString().split('T')[0];
  
  const {
    data,
    error,
    mutate,
    isLoading,
  } = useSWR(
    `${API_ENDPOINTS.BOOKINGS}/arrivals?date=${today}`,
    fetcher,
    SWR_CONFIG
  );

  return {
    arrivals: data || [],
    error,
    isLoading,
    mutate,
    refresh: () => mutate(),
    hasArrivals: (data?.length || 0) > 0,
  };
}

// Hook for today's departures
export function useTodayDepartures() {
  const today = new Date().toISOString().split('T')[0];
  
  const {
    data,
    error,
    mutate,
    isLoading,
  } = useSWR(
    `${API_ENDPOINTS.BOOKINGS}/departures?date=${today}`,
    fetcher,
    SWR_CONFIG
  );

  return {
    departures: data || [],
    error,
    isLoading,
    mutate,
    refresh: () => mutate(),
    hasDepartures: (data?.length || 0) > 0,
  };
}

// Hook for booking statistics
export function useBookingStats(dateFrom?: string, dateTo?: string) {
  const params = new URLSearchParams();
  if (dateFrom) params.set('date_from', dateFrom);
  if (dateTo) params.set('date_to', dateTo);
  
  const queryString = params.toString();
  const key = `${API_ENDPOINTS.BOOKINGS}/stats${queryString ? `?${queryString}` : ''}`;

  const {
    data,
    error,
    mutate,
    isLoading,
  } = useSWR<BookingStats, SWRError>(
    key,
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

// Hook for searching bookings
export function useSearchBookings(searchQuery: string, filters: Omit<BookingSearchQuery, 'search'> = {}) {
  const query: BookingSearchQuery = {
    ...filters,
    search: searchQuery.trim() || undefined,
  };

  return useBookings({
    query,
    enabled: searchQuery.length >= 2,
  });
}

// Hook for guest bookings
export function useGuestBookings(guestId: string | null) {
  const query: BookingSearchQuery = {
    guest_id: guestId || undefined,
  };

  return useBookings({
    query,
    enabled: !!guestId,
  });
}

// Hook for room bookings
export function useRoomBookings(roomId: string | null) {
  const query: BookingSearchQuery = {
    room_id: roomId || undefined,
  };

  return useBookings({
    query,
    enabled: !!roomId,
  });
} 