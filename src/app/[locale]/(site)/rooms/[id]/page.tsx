import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/constants';
import RoomDetailClient from './RoomDetailClient';

interface RoomDetailPageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

/**
 * Room Detail Page
 * 
 * Server component that fetches dictionary and passes props to client component.
 * Follows Next.js App Router pattern with server/client component separation.
 */
export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { locale, id } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="px-4 py-8">
      <RoomDetailClient roomId={id} locale={locale} dict={dict} />
    </div>
  );
}



