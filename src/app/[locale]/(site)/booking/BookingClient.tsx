'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { useCreateBooking } from '@/hooks/useCreateBooking';
import { useRoomDetail } from '@/hooks/useRoomDetail';
import { useRooms } from '@/hooks/useRooms';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/constants';
import type { CreateBookingPayload } from '@/types/booking';
import type { Room } from '@/types/room';

interface BookingClientProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Booking Client Component
 *
 * Handles the booking form for guests to create new bookings.
 * Pre-fills room selection if coming from room detail page.
 * Requires authentication and redirects to login if not authenticated.
 * Follows clean architecture with separation of concerns.
 */
export default function BookingClient({ locale, dict }: BookingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ locale: string }>();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { createBooking, isCreating, error: createError, data: bookingConfirmation } = useCreateBooking();

  // Get room ID from query params if coming from room detail page
  const roomIdFromQuery = searchParams.get('room');
  const [selectedRoomId, setSelectedRoomId] = useState<string>(roomIdFromQuery || '');
  
  // Fetch room details if room is pre-selected
  const { room: selectedRoom, isLoading: roomLoading } = useRoomDetail(
    selectedRoomId || null
  );

  // Fetch available rooms for selection
  const { rooms, isLoading: roomsLoading } = useRooms({ query: { limit: 100 } });

  // Form state
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Set minimum dates (today)
  const today = new Date().toISOString().split('T')[0];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const currentUrl = encodeURIComponent(`/${locale}/booking${roomIdFromQuery ? `?room=${roomIdFromQuery}` : ''}`);
      router.push(`/${locale}/login?next=${currentUrl}`);
    }
  }, [authLoading, isAuthenticated, router, locale, roomIdFromQuery]);

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!selectedRoomId) {
      errors.room = 'Please select a room';
    }

    if (!checkInDate) {
      errors.checkInDate = 'Check-in date is required';
    } else {
      const checkIn = new Date(checkInDate);
      if (checkIn < new Date(today)) {
        errors.checkInDate = 'Check-in date cannot be in the past';
      }
    }

    if (!checkOutDate) {
      errors.checkOutDate = 'Check-out date is required';
    } else if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      if (checkOut <= checkIn) {
        errors.checkOutDate = 'Check-out date must be after check-in date';
      }
    }

    if (guests < 1) {
      errors.guests = 'At least 1 guest is required';
    }

    if (selectedRoom && guests > selectedRoom.capacity) {
      errors.guests = `This room can only accommodate ${selectedRoom.capacity} guest(s)`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});

    if (!user || !isAuthenticated) {
      setError('You must be logged in to make a booking');
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!selectedRoomId || !checkInDate || !checkOutDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Verify user is authenticated and has a token
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        setError('You are not authenticated. Please log in again.');
        router.push(`/${locale}/login?next=/${locale}/booking${roomIdFromQuery ? `?room=${roomIdFromQuery}` : ''}`);
        return;
      }

      console.log('User authentication check:', {
        userId: user?.id,
        userRole: user?.role,
        hasToken: !!token,
      });

      // Convert dates to ISO datetime format for backend
      const checkInDateTime = new Date(checkInDate + 'T14:00:00Z').toISOString();
      const checkOutDateTime = new Date(checkOutDate + 'T11:00:00Z').toISOString();

      // Build booking payload - backend expects guest_id (user.id) instead of guest_info
      // Using type assertion since backend structure differs from type definition
      const bookingData = {
        room_id: selectedRoomId,
        guest_id: user.id, // Use authenticated user's ID as guest_id
        check_in_date: checkInDateTime,
        check_out_date: checkOutDateTime,
        guests,
        special_requests: specialRequests || undefined,
      } as any as CreateBookingPayload; // Type assertion needed because backend uses guest_id, not guest_info

      console.log('Creating booking with data:', bookingData);

      // Call the mutation trigger function
      const result = await createBooking(bookingData);
      
      console.log('Booking creation result:', result);
      
      // Success - booking created
      // Backend returns: { message: 'Booking created successfully', booking: {...} }
      const bookingId = result?.booking?.id || (result as any)?.id;
      if (bookingId) {
        router.push(`/${locale}/bookings?booking=success&id=${bookingId}`);
      } else {
        router.push(`/${locale}/bookings?booking=success`);
      }
    } catch (err: any) {
      console.error('Booking creation error:', err);
      console.error('Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
      });
      
      const errorMessage = 
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to create booking. Please try again.';
      
      setError(errorMessage);
    }
  };

  // Calculate nights and total price
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = calculateNights();
  const totalPrice = selectedRoom && nights > 0 
    ? Number(selectedRoom.price_per_night) * nights 
    : 0;

  // Show loading state
  if (authLoading || (roomIdFromQuery && roomLoading)) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!authLoading && !isAuthenticated) {
    return null;
  }

  // Show error state
  if (roomIdFromQuery && selectedRoomId && !selectedRoom && !roomLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold">{dict.common.error || 'Error'}</h3>
          <p className="text-gray-600 mt-2">Room not found</p>
        </div>
        <Link
          href={`/${locale}/rooms`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {dict.common.back || 'Back to Rooms'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {dict.booking?.title || 'Book Your Stay'}
      </h1>

      {(error || createError) && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {error || (createError as any)?.message || 'An error occurred'}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Room Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {(dict.booking as any)?.room_selection || 'Select Room'}
            </h2>
            <div className="space-y-4">
              {roomIdFromQuery && selectedRoom ? (
                <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Room {selectedRoom.room_number} - {(dict.rooms as any)?.single || selectedRoom.type}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {(dict.rooms as any)?.capacity || 'Capacity'}: {selectedRoom.capacity} {(dict.booking as any)?.guests || 'guests'}
                        {selectedRoom.floor && ` • ${(dict.rooms as any)?.floor || 'Floor'}: ${selectedRoom.floor}`}
                      </p>
                      <p className="text-lg font-bold text-blue-600 mt-2">
                        ${Number(selectedRoom.price_per_night).toFixed(2)} / {(dict.rooms as any)?.per_night || 'night'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoomId('');
                        router.replace(`/${locale}/booking`);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Change Room
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 ${
                      formErrors.room ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select a room...</option>
                    {rooms?.map((room: Room) => (
                      <option key={room.id} value={room.id}>
                        Room {room.room_number} - {room.type} (${Number(room.price_per_night).toFixed(2)}/night)
                      </option>
                    ))}
                  </select>
                  {formErrors.room && (
                    <p className="text-sm text-red-600">{formErrors.room}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Dates and Guests */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {(dict.booking as any)?.personal_info || 'Booking Details'}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {dict.booking?.check_in || 'Check-in Date'}
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={today}
                  className={`w-full border rounded-md px-3 py-2 ${
                    formErrors.checkInDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.checkInDate && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.checkInDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {dict.booking?.check_out || 'Check-out Date'}
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={checkInDate || today}
                  className={`w-full border rounded-md px-3 py-2 ${
                    formErrors.checkOutDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.checkOutDate && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.checkOutDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {dict.booking?.guests || 'Number of Guests'}
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedRoom?.capacity || 10}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className={`w-full border rounded-md px-3 py-2 ${
                    formErrors.guests ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.guests && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.guests}</p>
                )}
                {selectedRoom && (
                  <p className="text-xs text-gray-500 mt-1">
                    Max capacity: {selectedRoom.capacity} {(dict.booking as any)?.guests || 'guests'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {dict.booking?.special_requests || 'Special Requests'}
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Any special requests or notes for your stay..."
            />
          </div>

          {/* Guest Information Display */}
          {user && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {(dict.booking as any)?.personal_info || 'Guest Information'}
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{user.first_name} {user.last_name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{user.email}</span>
                </div>
                {user.phone && (
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium">{user.phone}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                This information will be used for your booking. To update your profile, visit{' '}
                <Link href={`/${locale}/profile`} className="text-blue-600 hover:text-blue-700">
                  your profile page
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Booking Summary Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {(dict.booking as any)?.booking_summary || 'Booking Summary'}
            </h2>

            {selectedRoom ? (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Room</p>
                    <p className="font-medium">Room {selectedRoom.room_number}</p>
                  </div>
                  {checkInDate && (
                    <div>
                      <p className="text-sm text-gray-600">{dict.booking?.check_in || 'Check-in'}</p>
                      <p className="font-medium">{new Date(checkInDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {checkOutDate && (
                    <div>
                      <p className="text-sm text-gray-600">{dict.booking?.check_out || 'Check-out'}</p>
                      <p className="font-medium">{new Date(checkOutDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {nights > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Nights</p>
                      <p className="font-medium">{nights}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="font-medium">{guests}</p>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      ${Number(selectedRoom.price_per_night).toFixed(2)} × {nights || 0} {(dict.rooms as any)?.per_night || 'nights'}
                    </span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreating || !selectedRoomId || !checkInDate || !checkOutDate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating ? 'Processing...' : (dict.booking?.confirm_booking || 'Confirm Booking')}
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Please select a room to see booking summary
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

