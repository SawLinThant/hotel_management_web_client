import { useUpdateMutation, useDeleteMutation } from './useSWRMutation';
import { API_ENDPOINTS } from '@/lib/constants';
import type { UpdateRoomPayload, Room } from '@/types/room';

/**
 * Hook for updating a room
 * Provides update functionality with automatic cache invalidation
 */
export function useUpdateRoom() {
  const {
    update,
    isUpdating,
    error,
    data,
    reset,
    isSuccess,
  } = useUpdateMutation<Room, UpdateRoomPayload>(
    (id: string) => API_ENDPOINTS.ROOM_DETAIL(id),
    {
      invalidateKeys: [API_ENDPOINTS.ROOMS],
    }
  );

  return {
    updateRoom: update,
    isUpdating,
    error,
    updatedRoom: data,
    reset,
    isSuccess,
  };
}

/**
 * Hook for deleting a room
 */
export function useDeleteRoom() {
  const {
    deleteResource,
    isDeleting,
    error,
    reset,
    isSuccess,
  } = useDeleteMutation<Room>(
    (id: string) => API_ENDPOINTS.ROOM_DETAIL(id),
    {
      invalidateKeys: [API_ENDPOINTS.ROOMS],
    }
  );

  return {
    deleteRoom: deleteResource,
    isDeleting,
    error,
    reset,
    isSuccess,
  };
}

