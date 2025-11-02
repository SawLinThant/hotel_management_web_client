import { Room } from '@/types/room';
import { Property } from '@/types/property';

/**
 * Convert Room data to Property format for display in PropertySection
 */
export function convertRoomToProperty(room: Room): Property {
  // Map room type to property category
  const categoryMap: Record<string, Property['category']> = {
    single: 'rooms',
    double: 'rooms',
    suite: 'villas',
    deluxe: 'flats',
  };

  // Generate title from room info
  const title = `Room ${room.room_number} - ${room.type.charAt(0).toUpperCase() + room.type.slice(1)}`;

  // Generate address (can be customized based on your needs)
  const address = room.floor 
    ? `Floor ${room.floor}, Hotel Address`
    : 'Hotel Address';

  // Format price - ensure it's a number first
  const pricePerNight = Number(room.price_per_night) || 0;
  const price = `$${pricePerNight.toFixed(2)} /night`;

  // Map capacity to beds (capacity = number of guests, roughly equals beds)
  const beds = Math.max(1, Math.floor(room.capacity / 2)); // Rough estimate

  // Get images or use placeholder
  const images = room.images && room.images.length > 0 
    ? room.images 
    : ['/api/placeholder/400/300'];

  return {
    id: room.id,
    title,
    address,
    price,
    images,
    features: {
      beds,
      baths: Math.max(1, Math.floor(beds / 2)), // Rough estimate
      parking: 0, // Can be added to room data if needed
    },
    category: categoryMap[room.type] || 'rooms',
    isFeatured: room.status === 'available',
    isTopRated: false, // Can be enhanced based on reviews/ratings
  };
}

/**
 * Convert array of rooms to properties
 */
export function convertRoomsToProperties(rooms: Room[]): Property[] {
  return rooms.map(convertRoomToProperty);
}

