'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { useBookings } from '@/hooks/useBookings';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/constants';
import type { Booking, BookingSearchQuery } from '@/types/booking';
import { BookingStatus } from '@/lib/constants';

interface BookingsClientProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Bookings Client Component
 *
 * Displays a list of bookings for the authenticated guest user.
 * Requires authentication and redirects to login if not authenticated.
 * Follows clean architecture with separation of concerns.
 */
export default function BookingsClient({ locale, dict }: BookingsClientProps) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  
  // Build query for user's bookings - backend will filter by guest_id automatically for guest role
  const {
    bookings,
    isLoading,
    error,
    page,
    totalPages,
    total,
    hasBookings,
  } = useBookings({
    query: {
      page: currentPage,
      limit: 10,
      sort_by: 'created_at',
      sort_order: 'desc',
      ...(statusFilter && { status: statusFilter }),
    },
    enabled: !!user?.id,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const currentUrl = encodeURIComponent(`/${locale}/bookings`);
      router.push(`/${locale}/login?next=${currentUrl}`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

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
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">{dict.common.loading}</p>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!authLoading && !isAuthenticated) {
    return null;
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold">{dict.common.error || 'Error'}</h3>
          <p className="text-gray-600 mt-2">
            {(error as any)?.message || dict.errors?.network_error || 'Failed to load bookings'}
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {dict.common.retry || 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {(dict.booking as any)?.my_bookings || 'My Bookings'}
        </h1>
        <p className="text-gray-600">
          {total > 0 
            ? `You have ${total} ${total === 1 ? 'booking' : 'bookings'}`
            : 'You have no bookings yet'}
        </p>
      </div>

      {/* Filter by Status */}
      {total > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as BookingStatus | '');
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      )}

      {/* Bookings List */}
      {hasBookings ? (
        <div className="space-y-4">
          {bookings.map((booking: Booking) => {
            const nights = calculateNights(booking.check_in_date, booking.check_out_date);
            
            return (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left: Booking Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.room ? (
                            <>
                              Room {booking.room.room_number}
                              {booking.room.type && (
                                <span className="text-gray-500 text-sm ml-2">
                                  ({booking.room.type})
                                </span>
                              )}
                            </>
                          ) : (
                            'Room Information'
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Booking ID: {booking.id.slice(0, 8)}...
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Check-in:</span>
                        <span className="ml-2 font-medium">{formatDate(booking.check_in_date)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Check-out:</span>
                        <span className="ml-2 font-medium">{formatDate(booking.check_out_date)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Guests:</span>
                        <span className="ml-2 font-medium">{booking.guests}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Nights:</span>
                        <span className="ml-2 font-medium">{nights}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="ml-2 font-medium text-blue-600">
                          ${Number(booking.total_amount).toFixed(2)}
                        </span>
                      </div>
                      {booking.paid_amount > 0 && (
                        <div>
                          <span className="text-gray-600">Paid:</span>
                          <span className="ml-2 font-medium text-green-600">
                            ${Number(booking.paid_amount).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {booking.special_requests && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Special Requests:</span>{' '}
                          {booking.special_requests}
                        </p>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Booked on {formatDate(booking.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2 md:w-auto">
                    <Link
                      href={`/${locale}/bookings/${booking.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors text-center"
                    >
                      {(dict.common as any)?.view_details || 'View Details'}
                    </Link>
                    {booking.room?.id && (
                      <Link
                        href={`/${locale}/rooms/${booking.room.id}`}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-md transition-colors text-center"
                      >
                        {(dict.rooms as any)?.view_room || 'View Room'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                {dict.common.previous || 'Previous'}
              </button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                {dict.common.next || 'Next'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {(dict.booking as any)?.no_bookings || 'No Bookings Yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {(dict.booking as any)?.no_bookings_message || "You haven't made any bookings yet. Start exploring our rooms!"}
          </p>
          <Link
            href={`/${locale}/rooms`}
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            {(dict.rooms as any)?.browse_rooms || 'Browse Rooms'}
          </Link>
        </div>
      )}
    </div>
  );
}

