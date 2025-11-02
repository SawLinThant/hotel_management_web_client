import useSWR from 'swr';
import { fetcher, SWRError } from '@/lib/fetcher';
import { API_ENDPOINTS, SWR_CONFIG } from '@/lib/constants';
import type { PaginatedStayRecordsResponse, StayRecordSearchQuery } from '@/types/stayRecord';

export interface UseStayRecordsOptions {
  query?: StayRecordSearchQuery;
  enabled?: boolean;
  refreshInterval?: number;
}

/**
 * Hook for fetching stay records with filtering and pagination
 */
export function useStayRecords(options: UseStayRecordsOptions = {}) {
  const { query = {}, enabled = true, refreshInterval } = options;
  
  // Build query string
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  const key = enabled ? `${API_ENDPOINTS.STAY_RECORDS}${queryString ? `?${queryString}` : ''}` : null;

  const {
    data,
    error,
    mutate,
    isLoading,
    isValidating,
  } = useSWR<PaginatedStayRecordsResponse, SWRError>(
    key,
    fetcher,
    {
      ...SWR_CONFIG,
      refreshInterval,
    }
  );

  return {
    stayRecords: data?.stay_records || [],
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
    // Helper to check if we have stay records
    hasStayRecords: (data?.stay_records?.length || 0) > 0,
  };
}

/**
 * Hook for fetching a single stay record by ID
 */
export function useStayRecordDetail(stayRecordId: string | null) {
  const key = stayRecordId ? API_ENDPOINTS.STAY_RECORD_DETAIL(stayRecordId) : null;

  const {
    data,
    error,
    mutate,
    isLoading,
  } = useSWR(key, fetcher, SWR_CONFIG);

  return {
    stayRecord: data?.stayRecord || data,
    error,
    isLoading,
    mutate,
    refresh: () => mutate(),
    hasData: !!data,
  };
}

/**
 * Hook for stay record statistics
 */
export function useStayRecordStats() {
  const key = `${API_ENDPOINTS.STAY_RECORDS}/stats/overview`;

  const {
    data,
    error,
    mutate,
    isLoading,
  } = useSWR(key, fetcher, SWR_CONFIG);

  return {
    stats: data?.stats || data,
    error,
    isLoading,
    mutate,
    refresh: () => mutate(),
    hasData: !!data,
  };
}

/**
 * Hook for active stay records (checked in but not checked out)
 */
export function useActiveStayRecords() {
  return useStayRecords({
    query: {
      // This would need backend support for filtering active records
      // For now, fetch all and filter client-side
    },
    enabled: true,
  });
}

