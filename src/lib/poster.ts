import { apiClient } from './fetcher';
import type { AxiosResponse } from 'axios';

// Generic mutation function for SWR mutations
export async function poster<T = any>(
  url: string,
  { arg }: { arg: { method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'; data?: any } }
): Promise<T> {
  const { method, data } = arg;
  
  let response: AxiosResponse<T>;
  
  switch (method) {
    case 'POST':
      response = await apiClient.post(url, data);
      break;
    case 'PUT':
      response = await apiClient.put(url, data);
      break;
    case 'PATCH':
      response = await apiClient.patch(url, data);
      break;
    case 'DELETE':
      response = await apiClient.delete(url);
      break;
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
  
  return response.data;
}

// Specific mutation functions for common operations
export const createResource = <T = any>(url: string, data: any): Promise<T> =>
  poster<T>(url, { arg: { method: 'POST', data } });

export const updateResource = <T = any>(url: string, data: any): Promise<T> =>
  poster<T>(url, { arg: { method: 'PUT', data } });

export const patchResource = <T = any>(url: string, data: any): Promise<T> =>
  poster<T>(url, { arg: { method: 'PATCH', data } });

export const deleteResource = <T = any>(url: string): Promise<T> =>
  poster<T>(url, { arg: { method: 'DELETE' } });

// Form data poster for file uploads
export async function postFormData<T = any>(url: string, formData: FormData): Promise<T> {
  const response = await apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
} 