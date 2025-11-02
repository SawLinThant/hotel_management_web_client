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
  } = useSWR<{ booking?: Booking } | Booking, SWRError>(
    key,
    fetcher,
    {
      ...SWR_CONFIG,
      refreshInterval,
    }
  );

  // Extract booking from response (API may return { booking } or just Booking)
  const booking = (data && 'booking' in data) ? (data as { booking: Booking }).booking : (data as Booking | undefined);

  return {
    booking,
    error,
    isLoading,
    isValidating,
    mutate,
    // Helper to refresh data
    refresh: () => mutate(),
    // Helper to check if we have data
    hasData: !!booking,
    // Helper to get booking status
    isPending: booking?.status === 'pending',
    isConfirmed: booking?.status === 'confirmed',
    isCheckedIn: booking?.status === 'checked_in',
    isCheckedOut: booking?.status === 'checked_out',
    isCancelled: booking?.status === 'cancelled',
    // Helper to check payment status
    isPaid: booking ? booking.paid_amount >= booking.total_amount : false,
    isPartiallyPaid: booking ? booking.paid_amount > 0 && booking.paid_amount < booking.total_amount : false,
    outstandingAmount: booking ? booking.total_amount - booking.paid_amount : 0,
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