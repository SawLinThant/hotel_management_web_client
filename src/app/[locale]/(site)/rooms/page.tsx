import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/constants';
import RoomsClient from './RoomsClient';

interface RoomsPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RoomsPage({ params, searchParams }: RoomsPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const resolvedSearchParams = await searchParams;

  return (
    <div className="px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {dict.rooms.title}
        </h1>
        <p className="text-gray-600">
          Browse our available rooms and find the perfect accommodation for your stay.
        </p>
      </div>

      <RoomsClient 
        locale={locale} 
        dict={dict} 
        initialSearchParams={resolvedSearchParams}
      />
    </div>
  );
}



