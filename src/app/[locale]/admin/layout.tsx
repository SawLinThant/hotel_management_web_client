import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/constants';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {dict.admin.dashboard}
          </h2>
        </div>
        <nav className="mt-6">
          <a
            href={`/${locale}/admin`}
            className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            {dict.admin.dashboard}
          </a>
          <a
            href={`/${locale}/admin/rooms`}
            className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            {dict.admin.room_management}
          </a>
          <a
            href={`/${locale}/admin/bookings`}
            className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            {dict.admin.booking_management}
          </a>
          <a
            href={`/${locale}/admin/users`}
            className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            {dict.admin.user_management}
          </a>
        </nav>
      </div>

      {/* Admin Content */}
      <div className="flex-1">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 