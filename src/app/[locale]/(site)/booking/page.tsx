import { Suspense } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/constants';
import BookingClient from './BookingClient';

interface BookingPageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * Booking Page
 *
 * Server component that fetches dictionary and passes props to client component.
 * Follows Next.js App Router pattern with server/client component separation.
 */
export default async function BookingPage({ params }: BookingPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <BookingClient locale={locale} dict={dict} />
    </Suspense>
  );
}

