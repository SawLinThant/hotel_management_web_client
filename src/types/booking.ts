import { BookingStatus } from '@/lib/constants';
import { Room } from './room';
import { User } from './user';

// Base booking interface
export interface Booking {
  id: string;
  room_id: string;
  guest_id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  status: BookingStatus;
  total_amount: number;
  paid_amount: number;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  // Relations (if populated)
  room?: Room;
  guest?: User;
}

// Guest information for booking
export interface GuestInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
  nationality?: string;
  passport_number?: string;
  id_card_number?: string;
}

// Booking creation payload
export interface CreateBookingPayload {
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  guest_info: GuestInfo;
  special_requests?: string;
  payment_method?: 'cash' | 'card' | 'online' | 'bank_transfer';
}

// Booking update payload
export interface UpdateBookingPayload {
  check_in_date?: string;
  check_out_date?: string;
  guests?: number;
  status?: BookingStatus;
  special_requests?: string;
  paid_amount?: number;
}

// Booking filters for listing
export interface BookingFilters {
  status?: BookingStatus;
  room_id?: string;
  guest_id?: string;
  check_in_from?: string;
  check_in_to?: string;
  check_out_from?: string;
  check_out_to?: string;
  created_from?: string;
  created_to?: string;
  min_amount?: number;
  max_amount?: number;
}

// Booking search query
export interface BookingSearchQuery extends BookingFilters {
  page?: number;
  limit?: number;
  sort_by?: 'check_in_date' | 'check_out_date' | 'total_amount' | 'created_at';
  sort_order?: 'asc' | 'desc';
  search?: string;
}

// Paginated bookings response
export interface PaginatedBookingsResponse {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Booking statistics
export interface BookingStats {
  total_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  checked_in_bookings: number;
  checked_out_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  average_booking_value: number;
  occupancy_rate: number;
}

// Check-in/Check-out payload
export interface CheckInPayload {
  booking_id: string;
  notes?: string;
  actual_check_in_time?: string;
}

export interface CheckOutPayload {
  booking_id: string;
  notes?: string;
  actual_check_out_time?: string;
  additional_charges?: Array<{
    description: string;
    amount: number;
  }>;
}

// Booking confirmation response
export interface BookingConfirmation {
  booking: Booking;
  confirmation_code: string;
  payment_required: boolean;
  payment_amount?: number;
  payment_due_date?: string;
} 