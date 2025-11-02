'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { roomService } from '@/services/roomService';
import type { PaginatedRoomsResponse } from '@/types/room';

export default function RoomsListPage() {
  const { data, error, isLoading } = useSWR<PaginatedRoomsResponse>(
    ['rooms', { page: 1, limit: 20 }],
    ([, params]) => roomService.getRooms(params as any)
  );

  if (isLoading) return <div>Loading rooms...</div>;
  if (error) return <div className="text-red-600">Failed to load rooms</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black">Rooms</h2>
        <Link href="./rooms/new" className="px-4 py-2 rounded bg-blue-600 text-white">New Room</Link>
      </div>
      <div className="overflow-x-auto bg-white border border-gray-400 rounded text-black">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th className="text-left p-2">Number</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Capacity</th>
              <th className="text-left p-2">Price</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {data?.rooms.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.room_number}</td>
                <td className="p-2 capitalize">{r.type}</td>
                <td className="p-2 capitalize">{r.status}</td>
                <td className="p-2">{r.capacity}</td>
                <td className="p-2">{Number(r.price_per_night).toFixed(2)}</td>
                <td className="p-2 text-right">
                  <Link href={`./rooms/${r.id}`} className="text-blue-600 hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


