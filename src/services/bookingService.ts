import { apiClient } from '@/lib/fetcher';
import { API_ENDPOINTS } from '@/lib/constants';
import type {
  Booking,
  CreateBookingPayload,
  UpdateBookingPayload,
  BookingSearchQuery,
  PaginatedBookingsResponse,
  BookingStats,
  CheckInPayload,
  CheckOutPayload,
  BookingConfirmation,
} from '@/types/booking';

export const bookingService = {
  // Get all bookings with filters and pagination
  async getBookings(query: BookingSearchQuery = {}): Promise<PaginatedBookingsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });

    const response = await apiClient.get(
      `${API_ENDPOINTS.BOOKINGS}?${params.toString()}`
    );
    return response.data;
  },

  // Get booking by ID
  async getBookingById(bookingId: string): Promise<Booking> {
    const response = await apiClient.get(API_ENDPOINTS.BOOKING_DETAIL(bookingId));
    return response.data;
  },

  // Create new booking
  async createBooking(bookingData: CreateBookingPayload): Promise<BookingConfirmation> {
    const response = await apiClient.post(API_ENDPOINTS.CREATE_BOOKING, bookingData);
    return response.data;
  },

  // Update booking
  async updateBooking(bookingId: string, bookingData: UpdateBookingPayload): Promise<Booking> {
    const response = await apiClient.put(
      API_ENDPOINTS.BOOKING_DETAIL(bookingId),
      bookingData
    );
    return response.data;
  },

  // Cancel booking
  async cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
    const response = await apiClient.post(
      API_ENDPOINTS.CANCEL_BOOKING(bookingId),
      { reason }
    );
    return response.data;
  },

  // Check-in guest
  async checkInGuest(payload: CheckInPayload): Promise<Booking> {
    const response = await apiClient.post(
      `${API_ENDPOINTS.BOOKING_DETAIL(payload.booking_id)}/check-in`,
      payload
    );
    return response.data;
  },

  // Check-out guest
  async checkOutGuest(payload: CheckOutPayload): Promise<Booking> {
    const response = await apiClient.post(
      `${API_ENDPOINTS.BOOKING_DETAIL(payload.booking_id)}/check-out`,
      payload
    );
    return response.data;
  },

  // Get booking statistics
  async getBookingStats(dateFrom?: string, dateTo?: string): Promise<BookingStats> {
    const params = new URLSearchParams();
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);

    const response = await apiClient.get(
      `${API_ENDPOINTS.BOOKINGS}/stats?${params.toString()}`
    );
    return response.data;
  },

  // Get upcoming arrivals
  async getUpcomingArrivals(date?: string): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (date) params.set('date', date);

    const response = await apiClient.get(
      `${API_ENDPOINTS.BOOKINGS}/arrivals?${params.toString()}`
    );
    return response.data;
  },

  // Get upcoming departures
  async getUpcomingDepartures(date?: string): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (date) params.set('date', date);

    const response = await apiClient.get(
      `${API_ENDPOINTS.BOOKINGS}/departures?${params.toString()}`
    );
    return response.data;
  },

  // Send booking confirmation email
  async sendConfirmationEmail(bookingId: string): Promise<void> {
    await apiClient.post(
      `${API_ENDPOINTS.BOOKING_DETAIL(bookingId)}/send-confirmation`
    );
  },

  // Process payment for booking
  async processPayment(
    bookingId: string,
    paymentData: {
      amount: number;
      payment_method: string;
      payment_reference?: string;
    }
  ): Promise<{ success: boolean; transaction_id: string }> {
    const response = await apiClient.post(
      `${API_ENDPOINTS.BOOKING_DETAIL(bookingId)}/payment`,
      paymentData
    );
    return response.data;
  },

  // Get booking invoice
  async getBookingInvoice(bookingId: string): Promise<Blob> {
    const response = await apiClient.get(
      `${API_ENDPOINTS.BOOKING_DETAIL(bookingId)}/invoice`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },
}; 