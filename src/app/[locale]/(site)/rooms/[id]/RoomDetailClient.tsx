'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRoomDetail } from '@/hooks/useRoomDetail';
import { useAuth } from '@/context/AuthProvider';
import { Locale } from '@/lib/constants';
import type { Dictionary } from '@/lib/dictionaries';

interface RoomDetailClientProps {
  roomId: string;
  locale: Locale;
  dict: Dictionary;
}

/**
 * Room Detail Client Component
 * 
 * Displays detailed information about a room including images, amenities, and booking options.
 * Uses the useRoomDetail hook for data fetching.
 * Follows clean architecture with separation of concerns.
 */
export default function RoomDetailClient({ roomId, locale, dict }: RoomDetailClientProps) {
  const router = useRouter();
  const { room, isLoading, error } = useRoomDetail(roomId);
  const { isAuthenticated } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{dict.common.loading}</p>
      </div>
    );
  }

  // Error state
  if (error || !room) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold">{dict.common.error || 'Error'}</h3>
          <p className="text-gray-600 mt-2">
            {error?.message || dict.errors?.network_error || 'Room not found or failed to load'}
          </p>
        </div>
        <Link
          href={`/${locale}/rooms`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {dict.common.back || 'Back to Rooms'}
        </Link>
      </div>
    );
  }

  const images = room.images && room.images.length > 0 ? room.images : [];
  const displayImage = images[selectedImageIndex];
  
  // Handle image load errors
  const handleImageError = (imageSrc: string) => {
    if (!imageErrors.has(imageSrc)) {
      setImageErrors(prev => new Set(prev).add(imageSrc));
    }
  };
  
  const hasImageError = (imageSrc: string) => imageErrors.has(imageSrc);

  const getRoomTypeLabel = (type: string) => {
    switch (type) {
      case 'single':
        return dict.rooms?.single || 'Single';
      case 'double':
        return dict.rooms?.double || 'Double';
      case 'suite':
        return dict.rooms?.suite || 'Suite';
      case 'deluxe':
        return dict.rooms?.deluxe || 'Deluxe';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return dict.rooms?.available || 'Available';
      case 'occupied':
        return dict.rooms?.occupied || 'Occupied';
      case 'maintenance':
        return dict.rooms?.maintenance || 'Maintenance';
      case 'cleaning':
        return (dict.rooms as any)?.cleaning || 'Cleaning';
      default:
        return status;
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login?next=/${locale}/rooms/${roomId}`);
      return;
    }
    router.push(`/${locale}/booking?room=${roomId}`);
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href={`/${locale}/rooms`}
        className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {dict.common.back || 'Back'} to {dict.rooms?.title || 'Rooms'}
      </Link>

      {/* Room Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Room {room.room_number}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="capitalize">{getRoomTypeLabel(room.type)}</span>
              <span>•</span>
              <span>{room.capacity} {dict.rooms?.capacity || 'guests'}</span>
              {room.floor && (
                <>
                  <span>•</span>
                  <span>{(dict.rooms as any)?.floor || 'Floor'} {room.floor}</span>
                </>
              )}
              {room.size_sqm && (
                <>
                  <span>•</span>
                  <span>{room.size_sqm} m²</span>
                </>
              )}
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                room.status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : room.status === 'occupied'
                  ? 'bg-red-100 text-red-800'
                  : room.status === 'maintenance'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {getStatusLabel(room.status)}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="text-3xl font-bold text-blue-600">
            ${Number(room.price_per_night).toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            {dict.rooms?.per_night || 'per night'}
          </div>
        </div>
      </div>

      {/* Images Gallery */}
      {images.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative">
            {/* Main Image */}
            <div className="aspect-video bg-gray-200 relative overflow-hidden flex items-center justify-center">
              {displayImage && !hasImageError(displayImage) ? (
                <img
                  src={displayImage}
                  alt={`Room ${room.room_number}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(displayImage)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 p-8">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Image not available</p>
                </div>
              )}
            </div>

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Thumbnail Strip */}
                <div className="p-4 bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-blue-600 ring-2 ring-blue-200'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {!hasImageError(image) ? (
                          <img
                            src={image}
                            alt={`Room ${room.room_number} image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(image)}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          {room.description && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {(dict.rooms as any)?.description || 'Description'}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{room.description}</p>
            </div>
          )}

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {dict.rooms?.amenities || 'Amenities'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {room.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Room Details */}
          <div className="bg-white rounded-lg shadow-md p-6 text-black">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {(dict.rooms as any)?.details || 'Room Details'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">{dict.rooms?.room_type || 'Room Type'}</div>
                <div className="font-medium capitalize">{getRoomTypeLabel(room.type)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">{dict.rooms?.capacity || 'Capacity'}</div>
                <div className="font-medium">{room.capacity} {(dict.rooms as any)?.guests || 'guests'}</div>
              </div>
              {room.floor && (
                <div>
                  <div className="text-sm text-gray-600">{(dict.rooms as any)?.floor || 'Floor'}</div>
                  <div className="font-medium">{room.floor}</div>
                </div>
              )}
              {room.size_sqm && (
                <div>
                  <div className="text-sm text-gray-600">{(dict.rooms as any)?.size || 'Size'}</div>
                  <div className="font-medium">{room.size_sqm} m²</div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-600">{(dict.rooms as any)?.status || 'Status'}</div>
                <div className="font-medium capitalize">{getStatusLabel(room.status)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <div className="mb-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                ${Number(room.price_per_night).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">
                {dict.rooms?.per_night || 'per night'}
              </div>
            </div>

            {room.status === 'available' ? (
              <button
                onClick={handleBookNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                {dict.rooms?.book_now || 'Book Now'}
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-600 font-medium py-3 px-4 rounded-md cursor-not-allowed"
              >
                {(dict.rooms as any)?.not_available || 'Not Available'}
              </button>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{(dict.rooms as any)?.free_cancellation || 'Free cancellation'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{(dict.rooms as any)?.best_price || 'Best price guaranteed'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{(dict.rooms as any)?.secure_booking || 'Secure booking'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

