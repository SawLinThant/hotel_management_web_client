import useSWRMutation from 'swr/mutation';
import { poster } from '@/lib/poster';
import { API_ENDPOINTS } from '@/lib/constants';
import { roomService } from '@/services/roomService';
import { bookingService } from '@/services/bookingService';
import type { CreateBookingPayload, BookingConfirmation } from '@/types/booking';
import type { RoomAvailabilityQuery, RoomType } from '@/types/room';

// SWR mutation for creating bookings
export function useCreateBooking() {
  const {
    trigger,
    isMutating,
    error,
    data,
  } = useSWRMutation(
    API_ENDPOINTS.CREATE_BOOKING,
    async (url: string, { arg }: { arg: CreateBookingPayload }) => {
      console.log('useCreateBooking: Calling bookingService.createBooking with:', arg);
      try {
        const result = await bookingService.createBooking(arg);
        console.log('useCreateBooking: Booking service returned:', result);
        return result;
      } catch (err) {
        console.error('useCreateBooking: Booking service error:', err);
        throw err;
      }
    }
  );

  return {
    createBooking: trigger,
    isCreating: isMutating,
    error,
    data,
    isSuccess: !!data && !error,
  };
}

// Hook for checking room availability before booking
export function useBookingAvailability() {
  const {
    trigger,
    isMutating,
    error,
    data,
  } = useSWRMutation(
    API_ENDPOINTS.ROOM_AVAILABILITY,
    async (url: string, { arg }: { arg: RoomAvailabilityQuery }) => {
      return roomService.checkAvailability(arg);
    }
  );

  return {
    checkAvailability: trigger,
    isChecking: isMutating,
    error,
    availableRooms: data || [],
    hasAvailableRooms: (data?.length || 0) > 0,
  };
}

// Combined hook for booking flow with availability check
export function useBookingFlow() {
  const { checkAvailability, isChecking, availableRooms, hasAvailableRooms } = useBookingAvailability();
  const { createBooking, isCreating, error: createError, data: bookingConfirmation } = useCreateBooking();

  const createBookingWithCheck = async (bookingData: CreateBookingPayload) => {
    // First check availability
    const availability = await checkAvailability({
      check_in_date: bookingData.check_in_date,
      check_out_date: bookingData.check_out_date,
      guests: bookingData.guests,
    });

    // Check if selected room is available
    const isRoomAvailable = availability.some(room => room.room_id === bookingData.room_id && room.available);
    
    if (!isRoomAvailable) {
      throw new Error('Selected room is not available for the chosen dates');
    }

    // Create booking if room is available
    return createBooking(bookingData);
  };

  return {
    // Availability check
    checkAvailability,
    isChecking,
    availableRooms,
    hasAvailableRooms,
    
    // Booking creation
    createBooking: createBookingWithCheck,
    isCreating,
    createError,
    bookingConfirmation,
    
    // Combined state
    isLoading: isChecking || isCreating,
    isSuccess: !!bookingConfirmation && !createError,
  };
} 