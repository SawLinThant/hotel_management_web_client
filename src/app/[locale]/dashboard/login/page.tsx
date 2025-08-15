'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ locale: string }>();
  const { login, isLoading, user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'staff' | 'admin'>('staff');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = searchParams.get('next') || `/${params?.locale || 'en'}/dashboard`;

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'staff' || user?.role === 'admin')) {
      // Ensure admin users go to dashboard, staff can use the next param if specified
      const finalRedirect = user?.role === 'admin' && !searchParams.get('next') 
        ? `/${params?.locale || 'en'}/dashboard` 
        : redirectTo;
      router.replace(finalRedirect);
    }
  }, [isAuthenticated, user, router, redirectTo, searchParams, params?.locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Use generic login endpoint and let backend validate role; alternatively, you can call staff/guest explicitly.
      await login({ email, password, remember_me: true, role });
      // Use the same redirect logic as the useEffect
      const finalRedirect = role === 'admin' && !searchParams.get('next') 
        ? `/${params?.locale || 'en'}/dashboard` 
        : redirectTo;
      router.replace(finalRedirect);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white h-screen w-screen flex justify-center items-center">
    <div className="max-w-md min-w-md mx-auto mt-16 bg-white border border-gray-300 p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-6 text-black">Admin Login</h1>
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            className="mt-1 block w-full border border-black rounded px-3 text-black py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value as 'staff' | 'admin')}
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={submitting || isLoading}
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
    </div>
  );
}


