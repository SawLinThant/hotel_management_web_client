'use client';

import { useState } from 'react';
import { useRooms, useSearchRooms } from '@/hooks/useRooms';
import { Locale } from '@/lib/constants';
import type { Dictionary } from '@/lib/dictionaries';
import type { RoomSearchQuery } from '@/types/room';

interface RoomsClientProps {
  locale: Locale;
  dict: Dictionary;
  initialSearchParams?: { [key: string]: string | string[] | undefined };
}

export default function RoomsClient({ locale, dict, initialSearchParams }: RoomsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Omit<RoomSearchQuery, 'search'>>({
    page: 1,
    limit: 12,
  });

  // Always call both hooks, then use the appropriate data
  const searchResults = useSearchRooms(searchQuery, filters);
  const regularResults = useRooms({ query: filters });
  
  const {
    rooms,
    page,
    totalPages,
    isLoading,
    error,
    hasRooms,
  } = searchQuery.length >= 2 ? searchResults : regularResults;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSearchQuery(formData.get('search') as string || '');
  };

  const handleFilterChange = (newFilters: Partial<RoomSearchQuery>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold">{dict.common.error}</h3>
          <p className="text-gray-600 mt-2">{dict.errors.network_error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {dict.common.retry}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4 text-black">
          <div className="flex-1">
            <input
              type="text"
              name="search"
              placeholder={`${dict.common.search}...`}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue={searchQuery}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            {dict.common.search}
          </button>
        </form>

        {/* Filter Controls */}
        <div className="grid md:grid-cols-4 gap-4">
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange({ type: e.target.value as any || undefined })}
            className="px-3 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{dict.rooms.room_type}</option>
            <option value="single">{dict.rooms.single}</option>
            <option value="double">{dict.rooms.double}</option>
            <option value="suite">{dict.rooms.suite}</option>
            <option value="deluxe">{dict.rooms.deluxe}</option>
          </select>

          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange({ status: e.target.value as any || undefined })}
            className="px-3 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="available">{dict.rooms.available}</option>
            <option value="occupied">{dict.rooms.occupied}</option>
            <option value="maintenance">{dict.rooms.maintenance}</option>
          </select>

          <input
            type="number"
            placeholder="Min Capacity"
            value={filters.min_capacity || ''}
            onChange={(e) => handleFilterChange({ min_capacity: parseInt(e.target.value) || undefined })}
            className="px-3 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            onClick={() => setFilters({ page: 1, limit: 12 })}
            className="text-gray-600 hover:text-gray-800 px-3 py-2 border border-gray-300 rounded-md"
          >
            {dict.common.clear}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{dict.common.loading}</p>
        </div>
      )}

      {/* Rooms Grid */}
      {!isLoading && hasRooms && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                  {room.images && room.images.length > 0 ? (
                    <img
                      src={room.images[0]}
                      alt={`Room ${room.room_number}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">
                      Room {room.room_number}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.status === 'available' 
                        ? 'bg-green-100 text-green-800'
                        : room.status === 'occupied'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.status === 'available' && dict.rooms.available}
                      {room.status === 'occupied' && dict.rooms.occupied}
                      {room.status === 'maintenance' && dict.rooms.maintenance}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">
                    {room.type === 'single' && dict.rooms.single}
                    {room.type === 'double' && dict.rooms.double}
                    {room.type === 'suite' && dict.rooms.suite}
                    {room.type === 'deluxe' && dict.rooms.deluxe}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      {dict.rooms.capacity}: {room.capacity}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      ${room.price_per_night} {dict.rooms.per_night}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`/${locale}/rooms/${room.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm"
                    >
                      {dict.rooms.view_details}
                    </a>
                    {room.status === 'available' && (
                      <a
                        href={`/${locale}/booking?room=${room.id}`}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md text-sm"
                      >
                        {dict.rooms.book_now}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dict.common.previous}
              </button>
              
              <span className="px-4 py-2 text-gray-700">
                Page {page} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dict.common.next}
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && !hasRooms && (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No rooms found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
}



