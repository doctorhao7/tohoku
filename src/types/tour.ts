export type TohokuPrefecture = 
  | 'Aomori'
  | 'Iwate'
  | 'Miyagi'
  | 'Akita'
  | 'Yamagata'
  | 'Fukushima';

export type ActivityCategory = 
  | 'Nature & Trekking'
  | 'Spiritual & Temples'
  | 'Onsen & Heritage'
  | 'Culinary & Crafts';

export interface TimeSlot {
  id: string;
  time: string; // e.g. "08:30 - 12:00"
  label: string; // e.g. "Morning Mist Departure"
  capacity: number;
  bookedSeats: number;
  priceJPY: number;
  isActive: boolean;
}

export interface DaySchedule {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

export interface TourActivity {
  id: string;
  title: string;
  titleJp: string;
  prefecture: TohokuPrefecture;
  prefectureJp: string;
  category: ActivityCategory;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  maxGroupSize: number;
  basePriceJPY: number;
  ratingScore: number;
  reviewsCount: number;
  meetingPoint: string;
  meetingPointAddress: string;
  meetingPointCoordinates: { lat: number; lng: number };
  heroImage: string;
  galleryImages: string[];
  videoClipUrl: string;
  videoPoster: string;
  videoTitle: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  whatToBring: string[];
  schedules: DaySchedule[];
  activeViewersCount?: number;
}

export interface GuestDetails {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  specialRequests?: string;
  dietaryNotes?: string;
}

export interface Reservation {
  id: string; // e.g. "THK-8921-X"
  tourId: string;
  tourTitle: string;
  tourTitleJp: string;
  prefecture: TohokuPrefecture;
  date: string;
  timeSlotId: string;
  timeSlotLabel: string;
  slotTime: string;
  leadGuest: GuestDetails;
  adultsCount: number;
  childrenCount: number;
  totalSeats: number;
  unitPriceJPY: number;
  totalPriceJPY: number;
  status: 'confirmed' | 'checked_in' | 'cancelled';
  createdAt: string;
  confirmationEmailSent: boolean;
  emailSentAt: string;
  qrCodeToken: string;
  meetingPoint: string;
}

export interface AutomatedEmailLog {
  id: string;
  reservationId: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  type: 'booking_confirmation' | 'pre_trip_reminder' | 'schedule_update' | 'cancellation_notice';
  sentAt: string;
  status: 'delivered' | 'opened';
  tourTitle: string;
  date: string;
  time: string;
}

export interface LiveBookingNotification {
  id: string;
  guestName: string;
  tourTitle: string;
  seats: number;
  prefecture: TohokuPrefecture;
  timestamp: string;
}
