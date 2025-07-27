import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/constants';

interface RoomDetailPageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { locale, id } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="px-4 py-8">
      <div className="mb-8">
        <a 
          href={`/${locale}/rooms`}
          className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
        >
          ← {dict.common.back} to {dict.rooms.title}
        </a>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Room Details - {id}
        </h1>
        <p className="text-gray-600">
          Detailed view of the selected room with booking options.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">
          Room detail implementation using useRoomDetail hook will go here.
        </p>
      </div>
    </div>
  );
} 