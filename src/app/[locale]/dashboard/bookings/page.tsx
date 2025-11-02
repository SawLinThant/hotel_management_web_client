'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { API_ENDPOINTS } from '@/lib/constants';
import { fetcherWithParams } from '@/lib/fetcher';
import type { PaginatedBookingsResponse } from '@/types/booking';

export default function BookingsListPage() {
  const { data, error, isLoading } = useSWR<PaginatedBookingsResponse>(API_ENDPOINTS.BOOKINGS, fetcherWithParams);

  if (isLoading) return <div>Loading bookings...</div>;
  if (error) return <div className="text-red-600">Failed to load bookings</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-black">Bookings</h2>
      <div className="overflow-x-auto bg-white border border-gray-400 rounded text-black">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Room</th>
              <th className="text-left p-2">Guest</th>
              <th className="text-left p-2">Check-in</th>
              <th className="text-left p-2">Check-out</th>
              <th className="text-left p-2">Status</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {data?.bookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-2">{b.id.slice(0, 8)}</td>
                <td className="p-2">{b.room_id.slice(0, 6)}</td>
                <td className="p-2">{b.guest_id.slice(0, 6)}</td>
                <td className="p-2">{new Date(b.check_in_date).toLocaleDateString()}</td>
                <td className="p-2">{new Date(b.check_out_date).toLocaleDateString()}</td>
                <td className="p-2 capitalize">{b.status}</td>
                <td className="p-2 text-right">
                  <Link href={`./bookings/${b.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


