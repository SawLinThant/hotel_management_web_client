'use client';

import React from 'react';
import { useAuth } from '@/context/AuthProvider';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600">Welcome back{user ? `, ${user.first_name}` : ''}.</p>
      {/* Overview widgets will be added later */}
    </div>
  );
}


