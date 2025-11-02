'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { useBookingDetail } from '@/hooks/useBookingDetail';
import { useCancelBooking } from '@/hooks/useUpdateBooking';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/constants';
import { BookingStatus } from '@/lib/constants';

interface BookingDetailClientProps {
  locale: Locale;
  dict: Dictionary;
  bookingId: string;
}

/**
 * Booking Detail Client Component
 *
 * Displays detailed information about a booking including room details.
 * Guests can view their booking details and cancel their bookings.
 * Requires authentication and redirects to login if not authenticated.
 * Follows clean architecture with separation of concerns.
 */
export default function BookingDetailClient({ locale, dict, bookingId }: BookingDetailClientProps) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { booking, isLoading, error, refresh } = useBookingDetail(bookingId);
  const { cancelBooking, isCanceling } = useCancelBooking();
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const currentUrl = encodeURIComponent(`/${locale}/bookings/${bookingId}`);
      router.push(`/${locale}/login?next=${currentUrl}`);
    }
  }, [authLoading, isAuthenticated, router, locale, bookingId]);

  // Get status badge styling
  const getStatusBadge = (status: BookingStatus) => {
    const statusConfig: Record<BookingStatus, { bg: string; text: string; label: string }> = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pending',
      },
      confirmed: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Confirmed',
      },
      checked_in: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Checked In',
      },
      checked_out: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: 'Checked Out',
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Cancelled',
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle cancel booking
  const handleCancel = async () => {
    if (!booking) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking? This action cannot be undone.'
    );

    if (!confirmed) return;

    setCancelError(null);
    try {
      await cancelBooking(booking.id);
      refresh();
    } catch (err: any) {
      setCancelError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to cancel booking. Please try again.'
      );
    }
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading booking details...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold">{dict.common.error || 'Error'}</h3>
          <p className="text-gray-600 mt-2">
            {error?.message || dict.errors?.network_error || 'Failed to load booking details.'}
          </p>
        </div>
        <div className="flex gap-4 justify-center mt-6">
          <Link
            href={`/${locale}/bookings`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            {dict.common.back || 'Back to Bookings'}
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            {dict.common.retry || 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated or no booking
  if (!isAuthenticated || !booking) {
    return null; // Should redirect via useEffect
  }

  const nights = calculateNights(booking.check_in_date, booking.check_out_date);
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${locale}/bookings`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {dict.common.back || 'Back to Bookings'}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">      
              {dict.navigation?.booking || 'Booking Details'}
            </h1>
            <p className="text-gray-600">
              Booking ID: {booking.id.slice(0, 8)}... | {formatDate(booking.created_at)}
            </p>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </div>

      {/* Cancel Error */}
      {cancelError && (
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
              <p className="text-sm font-medium text-red-800">{cancelError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Room Information */}
          {booking.room && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {(dict.rooms as any)?.room_info || 'Room Information'}
              </h2>
              <div className="flex flex-col md:flex-row gap-6">
                {booking.room.images && booking.room.images.length > 0 && (
                  <div className="flex-shrink-0">
                    <img
                      src={booking.room.images[0]}
                      alt={`Room ${booking.room.room_number}`}
                      className="w-full md:w-64 h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-room.jpg';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Room {booking.room.room_number}
                    {booking.room.type && (
                      <span className="text-gray-500 text-sm ml-2">
                        ({booking.room.type.charAt(0).toUpperCase() + booking.room.type.slice(1)})
                      </span>
                    )}
                  </h3>
                  {booking.room.floor && (
                    <p className="text-sm text-gray-600 mb-2">
                      {(dict.rooms as any)?.floor || 'Floor'}: {booking.room.floor}
                    </p>
                  )}
                  {booking.room.amenities && booking.room.amenities.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {(dict.rooms as any)?.amenities || 'Amenities'}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {booking.room.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <Link
                      href={`/${locale}/rooms/${booking.room.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Room Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {(dict.booking as any)?.booking_details || 'Booking Details'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">{dict.booking?.check_in || 'Check-in Date'}</p>
                <p className="font-medium text-gray-900 mt-1">
                  {formatDate(booking.check_in_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{dict.booking?.check_out || 'Check-out Date'}</p>
                <p className="font-medium text-gray-900 mt-1">
                  {formatDate(booking.check_out_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {(dict.booking as any)?.nights || 'Number of Nights'}
                </p>
                <p className="font-medium text-gray-900 mt-1">{nights} {(dict.rooms as any)?.per_night || 'night(s)'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {(dict.booking as any)?.guests || 'Number of Guests'}
                </p>
                <p className="font-medium text-gray-900 mt-1">{booking.guests}</p>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.special_requests && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {dict.booking?.special_requests || 'Special Requests'}
              </h2>
              <p className="text-gray-700">{booking.special_requests}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {(dict.booking as any)?.booking_summary || 'Booking Summary'}
            </h2>

            <div className="space-y-4 mb-6">
              {booking.room && (
                <div>
                  <p className="text-sm text-gray-600">Room</p>
                  <p className="font-medium">Room {booking.room.room_number}</p>
                  {booking.room.type && (
                    <p className="text-xs text-gray-500">{booking.room.type}</p>
                  )}
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-bold text-xl text-blue-600">
                  ${Number(booking.total_amount).toFixed(2)}
                </p>
              </div>
              {booking.paid_amount > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Paid Amount</p>
                  <p className="font-medium text-green-600">
                    ${Number(booking.paid_amount).toFixed(2)}
                  </p>
                </div>
              )}
              {booking.total_amount > booking.paid_amount && (
                <div>
                  <p className="text-sm text-gray-600">Outstanding</p>
                  <p className="font-medium text-orange-600">
                    ${(Number(booking.total_amount) - Number(booking.paid_amount || 0)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Cancel Button */}
            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={isCanceling}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCanceling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            )}

            {!canCancel && (
              <div className="text-sm text-gray-500 text-center py-2">
                {booking.status === 'checked_in' && 'Booking cannot be cancelled after check-in.'}
                {booking.status === 'checked_out' && 'This booking has been completed.'}
                {booking.status === 'cancelled' && 'This booking has been cancelled.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

