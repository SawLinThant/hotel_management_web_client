import React from 'react';
import useSWRMutation from 'swr/mutation';
import { API_ENDPOINTS } from '@/lib/constants';
import type { UpdateBookingPayload, Booking } from '@/types/booking';
import { apiClient } from '@/lib/fetcher';
import { mutate } from 'swr';

/**
 * Hook for updating a booking
 * Provides update functionality with automatic cache invalidation
 */
export function useUpdateBooking() {
  const {
    trigger,
    isMutating,
    error,
    data,
    reset,
  } = useSWRMutation(
    'update-booking',
    async (key: string, { arg }: { arg: { id: string; data: UpdateBookingPayload } }) => {
      const response = await apiClient.put(
        API_ENDPOINTS.BOOKING_DETAIL(arg.id),
        arg.data
      );
      
      // Invalidate related cache keys
      mutate(API_ENDPOINTS.BOOKINGS);
      mutate(API_ENDPOINTS.BOOKING_DETAIL(arg.id));
      
      return response.data;
    }
  );

  return {
    updateBooking: trigger,
    isUpdating: isMutating,
    error,
    updatedBooking: data,
    reset,
    isSuccess: !!data && !error,
  };
}

/**
 * Hook for canceling a booking
 */
export function useCancelBooking() {
  const [isCanceling, setIsCanceling] = React.useState(false);
  const [error, setError] = React.useState<Error>();
  
  const cancelBooking = async (id: string, reason?: string) => {
    setIsCanceling(true);
    setError(undefined);
    
    try {
      const response = await apiClient.post(API_ENDPOINTS.CANCEL_BOOKING(id), { reason });
      
      // Invalidate cache
      mutate(API_ENDPOINTS.BOOKINGS);
      mutate(API_ENDPOINTS.BOOKING_DETAIL(id));
      
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsCanceling(false);
    }
  };

  return {
    cancelBooking,
    isCanceling,
    error,
    isSuccess: !error,
  };
}

/**
 * Hook for checking in a guest
 */
export function useCheckInGuest() {
  const [isCheckingIn, setIsCheckingIn] = React.useState(false);
  const [error, setError] = React.useState<Error>();
  
  const checkInGuest = async (id: string, payload?: any) => {
    setIsCheckingIn(true);
    setError(undefined);
    
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.BOOKING_DETAIL(id)}/check-in`,
        payload
      );
      
      // Invalidate cache
      mutate(API_ENDPOINTS.BOOKINGS);
      mutate(API_ENDPOINTS.BOOKING_DETAIL(id));
      
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsCheckingIn(false);
    }
  };

  return {
    checkInGuest,
    isCheckingIn,
    error,
    isSuccess: !error,
  };
}

/**
 * Hook for checking out a guest
 */
export function useCheckOutGuest() {
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [error, setError] = React.useState<Error>();
  
  const checkOutGuest = async (id: string, payload?: any) => {
    setIsCheckingOut(true);
    setError(undefined);
    
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.BOOKING_DETAIL(id)}/check-out`,
        payload
      );
      
      // Invalidate cache
      mutate(API_ENDPOINTS.BOOKINGS);
      mutate(API_ENDPOINTS.BOOKING_DETAIL(id));
      
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsCheckingOut(false);
    }
  };

  return {
    checkOutGuest,
    isCheckingOut,
    error,
    isSuccess: !error,
  };
}

/**
 * Hook for deleting a booking
 */
export function useDeleteBooking() {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<Error>();
  
  const deleteBooking = async (id: string) => {
    setIsDeleting(true);
    setError(undefined);
    
    try {
      const { bookingService } = await import('@/services/bookingService');
      await bookingService.deleteBooking(id);
      
      // Invalidate cache
      mutate(API_ENDPOINTS.BOOKINGS);
      mutate(API_ENDPOINTS.BOOKING_DETAIL(id));
      
      return;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteBooking,
    isDeleting,
    error,
    isSuccess: !error,
  };
}