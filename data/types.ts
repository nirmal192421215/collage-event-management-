// ============================================================
// SMART COLLEGE EVENTS — TYPESCRIPT TYPE DEFINITIONS
// ============================================================

export type UserRole = 'student' | 'admin' | 'faculty';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  year?: string;
  rollNumber?: string;
  phone?: string;
  joinedAt: string;
  eventsRegistered: string[];
  eventsAttended: string[];
  certificates: Certificate[];
  badges: Badge[];
}

export type EventCategory =
  | 'Technology'
  | 'Cultural'
  | 'Sports'
  | 'Academic'
  | 'Workshop'
  | 'Seminar'
  | 'Placement Training'
  | 'Hackathon'
  | 'Other';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: EventCategory;
  status: EventStatus;
  date: string; // ISO string
  endDate: string;
  venue: string;
  venueAddress?: string;
  organizer: string;
  organizerEmail: string;
  organizerPhone?: string;
  capacity: number;
  registeredCount: number;
  price: number; // 0 = free
  image?: string;
  tags: string[];
  registrations: Registration[];
  attendees: string[]; // user IDs
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  paymentQrCode?: string;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  department?: string;
  registeredAt: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  attended: boolean;
  qrCode?: string;
  paymentScreenshot?: string;
}

export interface Certificate {
  id: string;
  eventId: string;
  eventTitle: string;
  issuedAt: string;
  type: 'participation' | 'winner' | 'organizer';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
}

export interface Notification {
  id: string;
  userId?: string; // undefined = broadcast
  title: string;
  message: string;
  type: 'event_reminder' | 'registration' | 'announcement' | 'attendance' | 'certificate';
  eventId?: string;
  read: boolean;
  createdAt: string;
}

export interface Analytics {
  totalEvents: number;
  totalRegistrations: number;
  totalAttendance: number;
  attendanceRate: number;
  eventsByCategory: { category: EventCategory; count: number }[];
  registrationsByMonth: { month: string; count: number }[];
  topEvents: { eventId: string; title: string; registrations: number }[];
}
