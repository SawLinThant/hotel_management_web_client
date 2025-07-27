import { RoomStatus, RoomType } from '@/lib/constants';

// Re-export types for easier importing
export type { RoomStatus, RoomType };

// Base room interface
export interface Room {
  id: string;
  room_number: string;
  type: RoomType;
  status: RoomStatus;
  capacity: number;
  price_per_night: number;
  description?: string;
  amenities: string[];
  images?: string[];
  floor?: number;
  size_sqm?: number;
  created_at: string;
  updated_at: string;
}

// Room creation payload
export interface CreateRoomPayload {
  room_number: string;
  type: RoomType;
  capacity: number;
  price_per_night: number;
  description?: string;
  amenities: string[];
  images?: string[];
  floor?: number;
  size_sqm?: number;
}

// Room update payload
export interface UpdateRoomPayload extends Partial<CreateRoomPayload> {
  status?: RoomStatus;
}

// Room availability query
export interface RoomAvailabilityQuery {
  check_in_date: string;
  check_out_date: string;
  guests?: number;
  room_type?: RoomType;
}

// Room availability response
export interface RoomAvailability {
  room_id: string;
  available: boolean;
  price_per_night: number;
  total_price: number;
  nights: number;
}

// Paginated rooms response
export interface PaginatedRoomsResponse {
  rooms: Room[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Room filters for listing
export interface RoomFilters {
  type?: RoomType;
  status?: RoomStatus;
  min_price?: number;
  max_price?: number;
  min_capacity?: number;
  max_capacity?: number;
  amenities?: string[];
  floor?: number;
  available_from?: string;
  available_to?: string;
}

// Room search query
export interface RoomSearchQuery extends RoomFilters {
  page?: number;
  limit?: number;
  sort_by?: 'price' | 'capacity' | 'room_number' | 'created_at';
  sort_order?: 'asc' | 'desc';
  search?: string;
} 