'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { useUser } from '@/hooks/useUser';
import { useBookings } from '@/hooks/useBookings';
import { userService } from '@/services/userService';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/constants';
import type { Booking, BookingSearchQuery } from '@/types/booking';
import type { UpdateUserPayload } from '@/types/user';
import { BookingStatus } from '@/lib/constants';

interface ProfileClientProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Profile Client Component
 *
 * Displays user profile information, allows profile editing, and shows user's bookings.
 * Requires authentication and redirects to login if not authenticated.
 * Follows clean architecture with separation of concerns.
 */
export default function ProfileClient({ locale, dict }: ProfileClientProps) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const { user: authUser, isAuthenticated, isLoading: authLoading, updateUser: updateAuthUser } = useAuth();
  const { user, isLoading: userLoading, error: userError, refresh: refreshUser } = useUser();
  
  // Pagination and filter state for bookings
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  const [bookingsLimit] = useState(5); // Show only 5 bookings on profile page
  
  // Fetch user's bookings - backend will filter by guest_id automatically for guest role
  const {
    bookings,
    isLoading: bookingsLoading,
    error: bookingsError,
    page,
    totalPages,
    total,
    hasBookings,
  } = useBookings({
    query: {
      page: currentPage,
      limit: bookingsLimit,
      sort_by: 'created_at',
      sort_order: 'desc',
      ...(statusFilter && { status: statusFilter }),
    },
    enabled: !!user?.id,
  });

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserPayload>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const currentUrl = encodeURIComponent(`/${locale}/profile`);
      router.push(`/${locale}/login?next=${currentUrl}`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  // Initialize edit form when user data is available
  useEffect(() => {
    if (user && isEditing) {
      setEditForm({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        date_of_birth: user.date_of_birth || '',
        nationality: user.nationality || '',
      });
    }
  }, [user, isEditing]);

  // Handle profile update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setIsSaving(true);

    try {
      // Only send fields that have values (don't send empty strings)
      const updatePayload: UpdateUserPayload = {};
      if (editForm.first_name) updatePayload.first_name = editForm.first_name;
      if (editForm.last_name) updatePayload.last_name = editForm.last_name;
      if (editForm.phone !== undefined) updatePayload.phone = editForm.phone || undefined;
      if (editForm.address !== undefined) updatePayload.address = editForm.address || undefined;
      if (editForm.city !== undefined) updatePayload.city = editForm.city || undefined;
      if (editForm.country !== undefined) updatePayload.country = editForm.country || undefined;
      if (editForm.date_of_birth) updatePayload.date_of_birth = editForm.date_of_birth;
      if (editForm.nationality !== undefined) updatePayload.nationality = editForm.nationality || undefined;

      const updatedUser = await userService.updateProfile(updatePayload);
      
      // Update auth context
      updateAuthUser(updatedUser);
      
      // Refresh user data from API
      await refreshUser();
      
      setIsEditing(false);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setSaveError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to update profile. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Get status badge styling for bookings
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
  if (authLoading || userLoading) {
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
  if (userError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold">{dict.common.error || 'Error'}</h3>
          <p className="text-gray-600 mt-2">
            {(userError as any)?.message || dict.errors?.network_error || 'Failed to load profile'}
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

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {(dict.navigation as any)?.profile || 'My Profile'}
        </h1>
        <p className="text-gray-600">
          Manage your profile information and view your booking history
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Information Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {(dict.booking as any)?.personal_info || 'Personal Information'}
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  {dict.common.edit || 'Edit'}
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {saveError && (
                  <div className="mb-4 rounded-md bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">{saveError}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {(dict.booking as any)?.first_name || 'First Name'}
                    </label>
                    <input
                      type="text"
                      value={editForm.first_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {(dict.booking as any)?.last_name || 'Last Name'}
                    </label>
                    <input
                      type="text"
                      value={editForm.last_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {(dict.booking as any)?.phone || 'Phone'}
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={editForm.city || ''}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={editForm.country || ''}
                      onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={editForm.date_of_birth || ''}
                      onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? 'Saving...' : (dict.common.save || 'Save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setSaveError(null);
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md transition-colors"
                  >
                    {dict.common.cancel || 'Cancel'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">{(dict.booking as any)?.first_name || 'First Name'}</span>
                    <p className="font-medium text-gray-900">{user.first_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{(dict.booking as any)?.last_name || 'Last Name'}</span>
                    <p className="font-medium text-gray-900">{user.last_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email</span>
                    <p className="font-medium text-gray-900">{user.email}</p>
                    {!user.email_verified && (
                      <p className="text-xs text-yellow-600 mt-1">Email not verified</p>
                    )}
                  </div>
                  {user.phone && (
                    <div>
                      <span className="text-sm text-gray-600">{(dict.booking as any)?.phone || 'Phone'}</span>
                      <p className="font-medium text-gray-900">{user.phone}</p>
                    </div>
                  )}
                  {user.address && (
                    <div>
                      <span className="text-sm text-gray-600">Address</span>
                      <p className="font-medium text-gray-900">{user.address}</p>
                    </div>
                  )}
                  {user.city && (
                    <div>
                      <span className="text-sm text-gray-600">City</span>
                      <p className="font-medium text-gray-900">{user.city}</p>
                    </div>
                  )}
                  {user.country && (
                    <div>
                      <span className="text-sm text-gray-600">Country</span>
                      <p className="font-medium text-gray-900">{user.country}</p>
                    </div>
                  )}
                  {user.date_of_birth && (
                    <div>
                      <span className="text-sm text-gray-600">Date of Birth</span>
                      <p className="font-medium text-gray-900">
                        {new Date(user.date_of_birth).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {user.nationality && (
                    <div>
                      <span className="text-sm text-gray-600">Nationality</span>
                      <p className="font-medium text-gray-900">{user.nationality}</p>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Member since {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {(dict.booking as any)?.my_bookings || 'My Bookings'}
              </h2>
              {total > bookingsLimit && (
                <Link
                  href={`/${locale}/bookings`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {(dict.common as any)?.view_all || 'View All'} ({total})
                </Link>
              )}
            </div>

            {bookingsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : bookingsError ? (
              <div className="text-center py-8">
                <p className="text-sm text-red-600">
                  {(bookingsError as any)?.message || 'Failed to load bookings'}
                </p>
              </div>
            ) : hasBookings ? (
              <div className="space-y-4">
                {bookings.map((booking: Booking) => {
                  const nights = calculateNights(booking.check_in_date, booking.check_out_date);
                  
                  return (
                    <div
                      key={booking.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">
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
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Check-in:</span>
                              <span className="ml-1 font-medium">{formatDate(booking.check_in_date)}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Check-out:</span>
                              <span className="ml-1 font-medium">{formatDate(booking.check_out_date)}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Nights:</span>
                              <span className="ml-1 font-medium">{nights}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Total:</span>
                              <span className="ml-1 font-medium text-blue-600">
                                ${Number(booking.total_amount).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/${locale}/bookings/${booking.id}`}
                          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors whitespace-nowrap"
                        >
                          {(dict.common as any)?.view_details || 'View Details'}
                        </Link>
                      </div>
                    </div>
                  );
                })}
                
                {total > bookingsLimit && (
                  <div className="text-center pt-4 border-t">
                    <Link
                      href={`/${locale}/bookings`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {(dict.common as any)?.view_all_bookings || 'View All Bookings'} →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
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
                <p className="text-gray-600 mb-4">You haven't made any bookings yet</p>
                <Link
                  href={`/${locale}/rooms`}
                  className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                  {(dict.rooms as any)?.browse_rooms || 'Browse Rooms'}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <div className="text-center mb-6">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-blue-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">
                    {user.first_name[0]}{user.last_name[0]}
                  </span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-gray-600 capitalize">{user.role}</p>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <div>
                <span className="text-sm text-gray-600">Email Status</span>
                <div className="mt-1">
                  {user.email_verified ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Not Verified
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Account Status</span>
                <div className="mt-1">
                  {user.is_active ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t">
                <Link
                  href={`/${locale}/bookings`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                  {(dict.booking as any)?.view_all_bookings || 'View All Bookings'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

