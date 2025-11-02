import { apiClient } from '@/lib/fetcher';
import { API_ENDPOINTS } from '@/lib/constants';
import type {
  Room,
  CreateRoomPayload,
  UpdateRoomPayload,
  RoomAvailabilityQuery,
  RoomAvailability,
  PaginatedRoomsResponse,
  RoomSearchQuery,
} from '@/types/room';

export const roomService = {
  // Get all rooms with filters and pagination
  async getRooms(query: RoomSearchQuery = {}): Promise<PaginatedRoomsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => params.append(key, String(item)));
        } else {
          params.set(key, String(value));
        }
      }
    });

    const response = await apiClient.get(
      `${API_ENDPOINTS.ROOMS}?${params.toString()}`
    );
    return response.data;
  },

  // Get room by ID
  async getRoomById(roomId: string): Promise<Room> {
    const response = await apiClient.get(API_ENDPOINTS.ROOM_DETAIL(roomId));
    return response.data;
  },

  // Create new room with optional file uploads
  async createRoom(roomData: CreateRoomPayload, images?: File[]): Promise<Room> {
    // Always use FormData to be compatible with multer middleware
    const formData = new FormData();
    
    // Append room data fields
    formData.append('room_number', roomData.room_number);
    formData.append('type', roomData.type);
    formData.append('capacity', String(roomData.capacity));
    formData.append('price_per_night', String(roomData.price_per_night));
    
    if (roomData.description) {
      formData.append('description', roomData.description);
    }
    
    if (roomData.amenities && roomData.amenities.length > 0) {
      formData.append('amenities', JSON.stringify(roomData.amenities));
    }
    
    if (roomData.floor) {
      formData.append('floor', String(roomData.floor));
    }
    
    if (roomData.size_sqm) {
      formData.append('size_sqm', String(roomData.size_sqm));
    }
    
    // Append image files if provided
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await apiClient.post(API_ENDPOINTS.ROOMS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.room;
  },

  // Update room with optional file uploads
  async updateRoom(roomId: string, roomData: UpdateRoomPayload, images?: File[]): Promise<Room> {
    // Always use FormData to be compatible with multer middleware
    const formData = new FormData();
    
    // Append room data fields
    if (roomData.type !== undefined) formData.append('type', roomData.type);
    if (roomData.status !== undefined) formData.append('status', roomData.status);
    if (roomData.capacity !== undefined) formData.append('capacity', String(roomData.capacity));
    if (roomData.price_per_night !== undefined) formData.append('price_per_night', String(roomData.price_per_night));
    if (roomData.description !== undefined) formData.append('description', roomData.description);
    if (roomData.amenities !== undefined && roomData.amenities.length > 0) {
      formData.append('amenities', JSON.stringify(roomData.amenities));
    }
    if (roomData.floor !== undefined) formData.append('floor', String(roomData.floor));
    if (roomData.size_sqm !== undefined) formData.append('size_sqm', String(roomData.size_sqm));
    
    // Append image files if provided
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await apiClient.put(API_ENDPOINTS.ROOM_DETAIL(roomId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.room;
  },

  // Delete room
  async deleteRoom(roomId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.ROOM_DETAIL(roomId));
  },

  // Check room availability
  async checkAvailability(query: RoomAvailabilityQuery): Promise<RoomAvailability[]> {
    const params = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });

    const response = await apiClient.get(
      `${API_ENDPOINTS.ROOM_AVAILABILITY}?${params.toString()}`
    );
    return response.data;
  },

  // Bulk update room status
  async bulkUpdateStatus(roomIds: string[], status: string): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.ROOMS}/bulk-status`, {
      room_ids: roomIds,
      status,
    });
  },

  // Upload room images
  async uploadImages(roomId: string, images: File[]): Promise<string[]> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await apiClient.post(
      `${API_ENDPOINTS.ROOM_DETAIL(roomId)}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.image_urls;
  },

  // Delete room image
  async deleteImage(roomId: string, imageUrl: string): Promise<void> {
    await apiClient.delete(
      `${API_ENDPOINTS.ROOM_DETAIL(roomId)}/images`,
      {
        data: { image_url: imageUrl },
      }
    );
  },
}; 