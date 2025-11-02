import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/constants';
import BookingsClient from './BookingsClient';

interface BookingsPageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * Bookings Page
 *
 * Server component that fetches dictionary and passes props to client component.
 * Follows Next.js App Router pattern with server/client component separation.
 */
export default async function BookingsPage({ params }: BookingsPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <BookingsClient locale={locale} dict={dict} />;
}

