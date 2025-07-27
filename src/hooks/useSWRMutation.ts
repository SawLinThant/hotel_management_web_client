import useSWRMutation from 'swr/mutation';
import { poster, createResource, updateResource, deleteResource } from '@/lib/poster';
import { mutate } from 'swr';

// Generic mutation hook for creating resources
export function useCreateMutation<TData = any, TPayload = any>(
  endpoint: string,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    invalidateKeys?: string[];
  }
) {
  const {
    trigger,
    isMutating,
    error,
    data,
    reset,
  } = useSWRMutation(
    endpoint,
    async (url: string, { arg }: { arg: TPayload }) => {
      const result = await createResource<TData>(url, arg);
      
      // Invalidate related cache keys
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach(key => mutate(key));
      }
      
      // Call success callback
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    },
    {
      onError: options?.onError,
    }
  );

  return {
    create: trigger,
    isCreating: isMutating,
    error,
    data,
    reset,
    isSuccess: !!data && !error,
  };
}

// Generic mutation hook for updating resources
export function useUpdateMutation<TData = any, TPayload = any>(
  getEndpoint: (id: string) => string,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    invalidateKeys?: string[];
  }
) {
  const {
    trigger,
    isMutating,
    error,
    data,
    reset,
  } = useSWRMutation(
    'update-resource',
    async (key: string, { arg }: { arg: { id: string; data: TPayload } }) => {
      const endpoint = getEndpoint(arg.id);
      const result = await updateResource<TData>(endpoint, arg.data);
      
      // Invalidate related cache keys
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach(key => mutate(key));
      }
      
      // Invalidate the specific resource cache
      mutate(endpoint);
      
      // Call success callback
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    },
    {
      onError: options?.onError,
    }
  );

  return {
    update: trigger,
    isUpdating: isMutating,
    error,
    data,
    reset,
    isSuccess: !!data && !error,
  };
}

// Generic mutation hook for deleting resources
export function useDeleteMutation<TData = any>(
  getEndpoint: (id: string) => string,
  options?: {
    onSuccess?: (id: string) => void;
    onError?: (error: Error) => void;
    invalidateKeys?: string[];
  }
) {
  const {
    trigger,
    isMutating,
    error,
    data,
    reset,
  } = useSWRMutation(
    'delete-resource',
    async (key: string, { arg }: { arg: string }) => {
      const endpoint = getEndpoint(arg);
      const result = await deleteResource<TData>(endpoint);
      
      // Invalidate related cache keys
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach(key => mutate(key));
      }
      
      // Remove the specific resource from cache
      mutate(endpoint, undefined, { revalidate: false });
      
      // Call success callback
      if (options?.onSuccess) {
        options.onSuccess(arg);
      }
      
      return result;
    },
    {
      onError: options?.onError,
    }
  );

  return {
    deleteResource: trigger,
    isDeleting: isMutating,
    error,
    data,
    reset,
    isSuccess: !error && isMutating === false && data !== undefined,
  };
}

// Hook for bulk operations
export function useBulkMutation<TPayload = any>(
  endpoint: string,
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    invalidateKeys?: string[];
  }
) {
  const {
    trigger,
    isMutating,
    error,
    data,
    reset,
  } = useSWRMutation(
    endpoint,
    async (url: string, { arg }: { arg: TPayload }) => {
      const result = await poster(url, { arg: { method: 'PATCH', data: arg } });
      
      // Invalidate related cache keys
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach(key => mutate(key));
      }
      
      // Call success callback
      if (options?.onSuccess) {
        options.onSuccess();
      }
      
      return result;
    },
    {
      onError: options?.onError,
    }
  );

  return {
    bulkUpdate: trigger,
    isUpdating: isMutating,
    error,
    data,
    reset,
    isSuccess: !!data && !error,
  };
} 