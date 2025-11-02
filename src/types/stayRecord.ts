import { Booking } from './booking';

// Stay record status
export type StayRecordStatus = 'checked_in' | 'checked_out' | 'completed';

// Base stay record interface
export interface StayRecord {
  id: string;
  booking_id: string;
  actual_check_in_time?: string;
  actual_check_out_time?: string;
  notes?: string;
  additional_charges?: Array<{
    description: string;
    amount: number;
  }>;
  created_at: string;
  updated_at: string;
  // Relations (if populated)
  booking?: Booking;
}

// Stay record creation payload (check-in)
export interface CreateStayRecordPayload {
  booking_id: string;
  actual_check_in_time?: string;
  notes?: string;
  room_condition?: string;
  amenities_used?: string[];
  incidents?: string[];
}

// Stay record update payload
export interface UpdateStayRecordPayload {
  actual_check_in_time?: string;
  actual_check_out_time?: string;
  notes?: string;
  room_condition?: string;
  amenities_used?: string[];
  incidents?: string[];
}

// Stay record checkout payload
export interface CheckOutStayRecordPayload {
  actual_check_out_time?: string;
  notes?: string;
  room_condition?: string;
  incidents?: string[];
}

// Stay record filters for listing
export interface StayRecordFilters {
  booking_id?: string;
  guest_id?: string;
  room_id?: string;
  check_in_date_from?: string;
  check_in_date_to?: string;
  check_out_date_from?: string;
  check_out_date_to?: string;
  has_incidents?: boolean;
}

// Stay record search query
export interface StayRecordSearchQuery extends StayRecordFilters {
  page?: number;
  limit?: number;
  sort_by?: 'check_in_time' | 'check_out_time' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// Paginated stay records response
export interface PaginatedStayRecordsResponse {
  stay_records: StayRecord[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Stay record statistics
export interface StayRecordStats {
  total_stay_records: number;
  active_stays: number;
  completed_stays: number;
  check_ins_today: number;
  check_outs_today: number;
  average_stay_duration: number;
  total_revenue: number;
}

