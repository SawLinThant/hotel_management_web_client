'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome back{user ? `, ${user.first_name}` : ''}.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="./dashboard/rooms" className="block p-4 border rounded bg-white hover:shadow">
          <div className="font-medium">Rooms</div>
          <div className="text-sm text-gray-500">Manage rooms inventory</div>
        </Link>
        <Link href="./dashboard/bookings" className="block p-4 border rounded bg-white hover:shadow">
          <div className="font-medium">Bookings</div>
          <div className="text-sm text-gray-500">View and manage bookings</div>
        </Link>
      </div>
    </div>
  );
}



