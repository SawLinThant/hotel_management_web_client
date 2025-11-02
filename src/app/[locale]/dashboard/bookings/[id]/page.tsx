'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingDetail } from '@/hooks/useBookingDetail';
import { useUpdateBooking, useCancelBooking, useCheckInGuest, useCheckOutGuest, useDeleteBooking } from '@/hooks/useUpdateBooking';
import type { UpdateBookingPayload } from '@/types/booking';

export default function BookingDetailPage() {
  const params = useParams<{ id: string; locale: string }>();
  const router = useRouter();
  const id = params?.id as string;
  
  // Use hooks for data fetching and mutations
  const { booking, isLoading, error: fetchError, refresh } = useBookingDetail(id);
  const { updateBooking, isUpdating } = useUpdateBooking();
  const { cancelBooking, isCanceling } = useCancelBooking();
  const { checkInGuest, isCheckingIn } = useCheckInGuest();
  const { checkOutGuest, isCheckingOut } = useCheckOutGuest();
  const { deleteBooking, isDeleting } = useDeleteBooking();
  
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateBookingPayload>({});

  const handleCheckIn = async () => {
    if (!booking) return;
    try {
      await checkInGuest(booking.id);
      refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    if (!booking) return;
    try {
      await checkOutGuest(booking.id);
      refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to check out');
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    try {
      await cancelBooking(booking.id);
      refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to cancel');
    }
  };

  const handleEdit = () => {
    if (!booking) return;
    setIsEditing(true);
    setEditForm({
      check_in_date: booking.check_in_date.split('T')[0],
      check_out_date: booking.check_out_date.split('T')[0],
      guests: booking.guests,
      special_requests: booking.special_requests,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    
    try {
      await updateBooking({ id: booking.id, data: editForm });
      setIsEditing(false);
      refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to update booking');
    }
  };

  const handleDelete = async () => {
    if (!booking || !confirm(`Are you sure you want to delete this booking? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await deleteBooking(booking.id);
      router.push(`/${params.locale}/dashboard/bookings`);
    } catch (e: any) {
      setError(e?.message || 'Failed to delete booking');
    }
  };

  const displayError = error || fetchError;
  
  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (displayError) return <div className="text-red-600 p-4">{String(displayError)}</div>;
  if (!booking) return null;

  return (
    <div className="space-y-4 text-black">
      <div className="flex items-center justify-between mb-6 text-black">
        <h2 className="text-xl font-semibold">Booking {booking?.id ? booking.id.slice(0, 8) : 'N/A'}</h2>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <button
                onClick={handleEdit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50 hover:bg-red-700 transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div className="text-red-600 text-sm p-3 bg-red-50 rounded">{String(error)}</div>}

      {isEditing ? (
        <form onSubmit={handleSaveEdit} className="bg-white border rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium">Check-in Date</span>
              <input
                type="date"
                className="mt-1 w-full border rounded px-3 py-2"
                value={editForm.check_in_date || ''}
                onChange={(e) => setEditForm({ ...editForm, check_in_date: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Check-out Date</span>
              <input
                type="date"
                className="mt-1 w-full border rounded px-3 py-2"
                value={editForm.check_out_date || ''}
                onChange={(e) => setEditForm({ ...editForm, check_out_date: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Number of Guests</span>
              <input
                type="number"
                min="1"
                className="mt-1 w-full border rounded px-3 py-2"
                value={editForm.guests || ''}
                onChange={(e) => setEditForm({ ...editForm, guests: Number(e.target.value) })}
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Status</span>
              <select
                className="mt-1 w-full border rounded px-3 py-2"
                value={editForm.status || booking.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium">Special Requests</span>
            <textarea
              className="mt-1 w-full border rounded px-3 py-2"
              rows={3}
              value={editForm.special_requests || ''}
              onChange={(e) => setEditForm({ ...editForm, special_requests: e.target.value })}
            />
          </label>
          <div className="flex gap-2 pt-4 border-t">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="bg-white border rounded-lg p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-600">Status</div>
                <div className="font-medium capitalize">{booking.status}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Room ID</div>
                <div className="font-medium">{booking.room_id.slice(0, 8)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Guest ID</div>
                <div className="font-medium">{booking.guest_id.slice(0, 8)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="font-medium">${Number(booking.total_amount).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Check-in</div>
                <div className="font-medium">{new Date(booking.check_in_date).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Check-out</div>
                <div className="font-medium">{new Date(booking.check_out_date).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Guests</div>
                <div className="font-medium">{booking.guests}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Paid Amount</div>
                <div className="font-medium">${Number(booking.paid_amount || 0).toFixed(2)}</div>
              </div>
            </div>
            {booking.special_requests && (
              <div className="border-t pt-4">
                <div className="text-sm text-gray-600 mb-2">Special Requests</div>
                <div className="text-gray-700">{booking.special_requests}</div>
              </div>
            )}
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50 hover:bg-green-700 transition-colors"
                onClick={handleCheckIn}
                disabled={(booking.status !== 'pending' && booking.status !== 'confirmed') || isCheckingIn}
              >
                {isCheckingIn ? 'Checking in...' : 'Check-in'}
              </button>
              <button
                className="px-4 py-2 rounded bg-yellow-600 text-white disabled:opacity-50 hover:bg-yellow-700 transition-colors"
                onClick={handleCheckOut}
                disabled={booking.status !== 'checked_in' || isCheckingOut}
              >
                {isCheckingOut ? 'Checking out...' : 'Check-out'}
              </button>
              <button
                className="px-4 py-2 rounded bg-orange-600 text-white disabled:opacity-50 hover:bg-orange-700 transition-colors"
                onClick={handleCancel}
                disabled={booking.status === 'checked_in' || booking.status === 'checked_out' || booking.status === 'cancelled' || isCanceling}
              >
                {isCanceling ? 'Canceling...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
