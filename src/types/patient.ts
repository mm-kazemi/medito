/**
 * Patient Entity Types
 * src/types/patient.ts
 */

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface PatientAppointment {
  id:                string;
  doctorName:        string;
  doctorSpecialty:   string;
  doctorSlug:        string;
  doctorInitials:    string;
  doctorAvatarColor: string;
  doctorPhotoUrl?:   string;
  /** Persian Jalali date label, e.g. "۱۵ تیر ۱۴۰۵" */
  dateLabel:         string;
  /** ISO date for sorting, e.g. "2026-07-15" */
  date:              string;
  /** Persian time, e.g. "۱۴:۳۰" */
  time:              string;
  status:            AppointmentStatus;
  visitType:         "in_person" | "online" | "home_visit";
  visitFee:          number;
  clinicName?:       string;
}

export interface FavoriteDoctor {
  id:           string;
  slug:         string;
  displayName:  string;
  specialtyLabel: string;
  cityLabel:    string;
  rating:       number;
  initials:     string;
  avatarColor:  string;
  photoUrl?:    string;
}

export interface PatientProfile {
  fullName:    string;
  phone:       string;
  email?:      string;
  nationalId?: string;
}
