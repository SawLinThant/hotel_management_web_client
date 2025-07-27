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

  // Create new room
  async createRoom(roomData: CreateRoomPayload): Promise<Room> {
    const response = await apiClient.post(API_ENDPOINTS.ROOMS, roomData);
    return response.data;
  },

  // Update room
  async updateRoom(roomId: string, roomData: UpdateRoomPayload): Promise<Room> {
    const response = await apiClient.put(
      API_ENDPOINTS.ROOM_DETAIL(roomId),
      roomData
    );
    return response.data;
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
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
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