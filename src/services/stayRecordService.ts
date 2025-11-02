import { apiClient } from '@/lib/fetcher';
import { API_ENDPOINTS } from '@/lib/constants';
import type {
  StayRecord,
  CreateStayRecordPayload,
  UpdateStayRecordPayload,
  CheckOutStayRecordPayload,
  StayRecordSearchQuery,
  PaginatedStayRecordsResponse,
  StayRecordStats,
} from '@/types/stayRecord';

export const stayRecordService = {
  // Get all stay records with filters and pagination
  async getStayRecords(query: StayRecordSearchQuery = {}): Promise<PaginatedStayRecordsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key.includes('_date_')) {
          // Date fields
          params.set(key, String(value));
        } else {
          params.set(key, String(value));
        }
      }
    });

    const response = await apiClient.get(
      `${API_ENDPOINTS.STAY_RECORDS}?${params.toString()}`
    );
    
    // Transform backend response to match frontend type
    const data = response.data;
    return {
      stay_records: data.stay_records || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 10,
      total_pages: data.total_pages || 0,
    };
  },

  // Get stay record by ID
  async getStayRecordById(stayRecordId: string): Promise<StayRecord> {
    const response = await apiClient.get(`${API_ENDPOINTS.STAY_RECORD_DETAIL(stayRecordId)}`);
    return response.data.stayRecord || response.data;
  },

  // Create new stay record (check-in)
  async createStayRecord(stayRecordData: CreateStayRecordPayload): Promise<StayRecord> {
    const response = await apiClient.post(API_ENDPOINTS.STAY_RECORDS, stayRecordData);
    return response.data.stayRecord || response.data;
  },

  // Update stay record
  async updateStayRecord(
    stayRecordId: string,
    stayRecordData: UpdateStayRecordPayload
  ): Promise<StayRecord> {
    const response = await apiClient.put(
      API_ENDPOINTS.STAY_RECORD_DETAIL(stayRecordId),
      stayRecordData
    );
    return response.data.stayRecord || response.data;
  },

  // Check-out guest
  async checkOutGuest(
    stayRecordId: string,
    checkOutData: CheckOutStayRecordPayload
  ): Promise<StayRecord> {
    const response = await apiClient.post(
      `${API_ENDPOINTS.STAY_RECORD_DETAIL(stayRecordId)}/checkout`,
      checkOutData
    );
    return response.data.stayRecord || response.data;
  },

  // Delete stay record
  async deleteStayRecord(stayRecordId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.STAY_RECORD_DETAIL(stayRecordId));
  },

  // Get stay record statistics
  async getStayRecordStats(): Promise<StayRecordStats> {
    const response = await apiClient.get(`${API_ENDPOINTS.STAY_RECORDS}/stats/overview`);
    return response.data.stats || response.data;
  },
};

