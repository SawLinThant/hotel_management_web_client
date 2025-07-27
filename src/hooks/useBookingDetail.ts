import useSWR from 'swr';
import { fetcher, SWRError } from '@/lib/fetcher';
import { API_ENDPOINTS, SWR_CONFIG } from '@/lib/constants';
import type { Booking } from '@/types/booking';

export interface UseBookingDetailOptions {
  enabled?: boolean;
  refreshInterval?: number;
}

export function useBookingDetail(bookingId: string | null, options: UseBookingDetailOptions = {}) {
  const { enabled = true, refreshInterval } = options;
  
  const key = enabled && bookingId ? API_ENDPOINTS.BOOKING_DETAIL(bookingId) : null;

  const {
    data,
    error,
    mutate,
    isLoading,
    isValidating,
  } = useSWR<Booking, SWRError>(
    key,
    fetcher,
    {
      ...SWR_CONFIG,
      refreshInterval,
    }
  );

  return {
    booking: data,
    error,
    isLoading,
    isValidating,
    mutate,
    // Helper to refresh data
    refresh: () => mutate(),
    // Helper to check if we have data
    hasData: !!data,
    // Helper to get booking status
    isPending: data?.status === 'pending',
    isConfirmed: data?.status === 'confirmed',
    isCheckedIn: data?.status === 'checked_in',
    isCheckedOut: data?.status === 'checked_out',
    isCancelled: data?.status === 'cancelled',
    // Helper to check payment status
    isPaid: data ? data.paid_amount >= data.total_amount : false,
    isPartiallyPaid: data ? data.paid_amount > 0 && data.paid_amount < data.total_amount : false,
    outstandingAmount: data ? data.total_amount - data.paid_amount : 0,
  };
}

// Hook for checking if a booking exists
export function useBookingExists(bookingId: string | null) {
  const { booking, error, isLoading } = useBookingDetail(bookingId);
  
  return {
    exists: !!booking && !error,
    isLoading,
    booking,
  };
} 