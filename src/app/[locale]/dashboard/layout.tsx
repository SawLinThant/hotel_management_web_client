'use client';

import React, { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const { user, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Allow unauthenticated access to the dashboard login route itself
    if (pathname?.endsWith('/dashboard/login')) {
      return;
    }

    const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';
    if (!isAuthenticated || !isAdminOrStaff) {
      const next = encodeURIComponent(`/${locale}/dashboard`);
      router.replace(`/${locale}/dashboard/login?next=${next}`);
    }
  }, [isLoading, isAuthenticated, user, router, locale, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">Loading...</div>
    );
  }

  if (pathname?.endsWith('/dashboard/login')) {
    return <>{children}</>;
  }

  if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
    return null;
  }

  return <div className="min-h-screen">{children}</div>;
}


