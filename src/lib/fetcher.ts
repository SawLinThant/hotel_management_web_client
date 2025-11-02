import axios from 'axios';
import { API_BASE_URL } from './constants';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('API Request: Added auth token to headers', {
          url: config.url,
          method: config.method,
          hasToken: !!token,
          tokenLength: token?.length,
        });
      } else {
        console.warn('API Request: No auth token found in localStorage', {
          url: config.url,
          method: config.method,
        });
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login or refresh token
      console.warn('401 Unauthorized - Clearing auth token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        // You can add redirect logic here
        // window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // Handle forbidden
      console.error('403 Forbidden - User may not have required role or permissions');
    }
    return Promise.reject(error);
  }
);

// SWR fetcher function for GET requests
export const fetcher = async (url: string) => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    // Transform axios error for SWR
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      // Create a custom error object
      const customError = new Error(message);
      (customError as any).status = status;
      (customError as any).info = error.response?.data;
      
      throw customError;
    }
    
    throw error;
  }
};

// Fetcher with query parameters
export const fetcherWithParams = (url: string, params?: Record<string, any>) => {
  return fetcher(url + (params ? '?' + new URLSearchParams(params).toString() : ''));
};

// SWR error type
export interface SWRError extends Error {
  status?: number;
  info?: any;
} 