'use client';

import React, { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import DashboardSidebar from '@/components/organisms/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const { user, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar locale={locale} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64">
            <DashboardSidebar locale={locale} />
          </div>
        </>
      )}

      {/* Mobile sidebar toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}


