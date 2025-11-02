import React from 'react';
import { useUpdateMutation, useDeleteMutation } from './useSWRMutation';
import { API_ENDPOINTS } from '@/lib/constants';
import type { UpdateStayRecordPayload, CheckOutStayRecordPayload, StayRecord } from '@/types/stayRecord';
import { apiClient } from '@/lib/fetcher';
import { mutate } from 'swr';

/**
 * Hook for updating a stay record
 * Provides update functionality with automatic cache invalidation
 */
export function useUpdateStayRecord() {
  const {
    update,
    isUpdating,
    error,
    data,
    reset,
    isSuccess,
  } = useUpdateMutation<StayRecord, UpdateStayRecordPayload>(
    (id: string) => API_ENDPOINTS.STAY_RECORD_DETAIL(id),
    {
      invalidateKeys: [API_ENDPOINTS.STAY_RECORDS],
    }
  );

  return {
    updateStayRecord: update,
    isUpdating,
    error,
    updatedStayRecord: data,
    reset,
    isSuccess,
  };
}

/**
 * Hook for checking out a guest from stay record
 */
export function useCheckOutStayRecord() {
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [error, setError] = React.useState<Error>();
  
  const checkOutGuest = async (id: string, payload: CheckOutStayRecordPayload) => {
    setIsCheckingOut(true);
    setError(undefined);
    
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.STAY_RECORD_DETAIL(id)}/checkout`,
        payload
      );
      
      // Invalidate cache
      mutate(API_ENDPOINTS.STAY_RECORDS);
      mutate(API_ENDPOINTS.STAY_RECORD_DETAIL(id));
      
      return response.data.stayRecord || response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsCheckingOut(false);
    }
  };

  return {
    checkOutGuest,
    isCheckingOut,
    error,
    isSuccess: !error,
  };
}

/**
 * Hook for creating a stay record (check-in)
 */
export function useCreateStayRecord() {
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState<Error>();
  
  const createStayRecord = async (payload: any) => {
    setIsCreating(true);
    setError(undefined);
    
    try {
      const response = await apiClient.post(API_ENDPOINTS.STAY_RECORDS, payload);
      
      // Invalidate cache
      mutate(API_ENDPOINTS.STAY_RECORDS);
      
      return response.data.stayRecord || response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createStayRecord,
    isCreating,
    error,
    isSuccess: !error,
  };
}

/**
 * Hook for deleting a stay record
 */
export function useDeleteStayRecord() {
  const {
    deleteResource,
    isDeleting,
    error,
    reset,
    isSuccess,
  } = useDeleteMutation<StayRecord>(
    (id: string) => API_ENDPOINTS.STAY_RECORD_DETAIL(id),
    {
      invalidateKeys: [API_ENDPOINTS.STAY_RECORDS],
    }
  );

  return {
    deleteStayRecord: deleteResource,
    isDeleting,
    error,
    reset,
    isSuccess,
  };
}
