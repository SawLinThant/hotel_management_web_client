import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/constants';
import BookingDetailClient from './BookingDetailClient';

interface BookingDetailPageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

/**
 * Booking Detail Page
 *
 * Server component that fetches dictionary and passes props to client component.
 * Follows Next.js App Router pattern with server/client component separation.
 */
export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { locale, id } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="px-4 py-8">
      <BookingDetailClient locale={locale} dict={dict} bookingId={id} />
    </div>
  );
}

