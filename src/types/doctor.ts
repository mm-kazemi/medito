/**
 * Doctor Entity Types
 * src/types/doctor.ts
 *
 * Single source of truth for all doctor-related TypeScript types.
 * Used by mock API, DoctorCard, DoctorProfileHeader, SearchResults.
 */

import type { SpecialtyId } from "@/constants";

/* ----------------------------------------------------------------
   Availability slot
   ---------------------------------------------------------------- */
export interface TimeSlot {
  /** ISO date-time string, e.g. "2026-06-14T09:00:00" */
  datetime: string;
  /** Whether the slot is already booked */
  isBooked: boolean;
}

/* ----------------------------------------------------------------
   Doctor list-item entity (used in search results / cards)
   ---------------------------------------------------------------- */
export interface Doctor {
  id:             string;
  slug:           string;
  firstName:      string;
  lastName:       string;
  /** Full display name with title, e.g. "دکتر علی رضایی" */
  displayName:    string;
  /** Doctor's specialty ID — matches SPECIALTIES constant */
  specialtyId:   SpecialtyId;
  /** Persian display label for specialty */
  specialtyLabel: string;
  city:           string;
  /** Persian display label for city */
  cityLabel:      string;
  rating:         number;
  reviewCount:    number;
  /** Visit fee in Tomans */
  visitFee:       number;
  /** URL to the doctor's profile photo */
  photoUrl?:      string;
  /** Two-letter initials shown when no photo is available */
  initials:       string;
  /** Soft background color + text for the initials avatar (Tailwind classes) */
  avatarColor:    string;
  visitTypes:     Array<"in_person" | "online" | "home_visit">;
  isAvailable:    boolean;
  /** Next available slot (human-readable Persian string) */
  nextSlot?:      string;
  /** Short bio / description */
  bio?:           string;
  yearsExp:       number;
}

/* ----------------------------------------------------------------
   Patient review
   ---------------------------------------------------------------- */
export interface PatientReview {
  id:          string;
  patientName: string;
  rating:      number;
  date:        string;   // ISO date string
  comment:     string;
  visitType:   "in_person" | "online" | "home_visit";
}

/* ----------------------------------------------------------------
   Working hours for a single day
   ---------------------------------------------------------------- */
export interface WorkingDay {
  /** Day name in Persian, e.g. "شنبه" */
  day:    string;
  open:   string;  // e.g. "09:00"
  close:  string;  // e.g. "17:00"
  closed: boolean;
}

/* ----------------------------------------------------------------
   Clinic / office information
   ---------------------------------------------------------------- */
export interface ClinicInfo {
  name:        string;
  address:     string;
  cityLabel:   string;
  phone:       string;
  /** Geographic coordinates for the map marker */
  lat:         number;
  lng:         number;
  workingDays: WorkingDay[];
}

/* ----------------------------------------------------------------
   Education credential
   ---------------------------------------------------------------- */
export interface EducationEntry {
  degree:      string;   // e.g. "دکترای پزشکی عمومی"
  institution: string;   // e.g. "دانشگاه علوم پزشکی تهران"
  year?:       string;   // e.g. "۱۳۹۲"
}

/* ----------------------------------------------------------------
   Full doctor profile (extends Doctor with detail fields)
   ---------------------------------------------------------------- */
export interface DoctorProfile extends Doctor {
  /** Medical council (نظام پزشکی) number */
  councilNumber:  string;
  /** Full biography */
  fullBio:        string;
  /** Academic credentials */
  education:      EducationEntry[];
  /** List of services offered */
  services:       string[];
  /** Languages spoken */
  languages:      string[];
  /** Clinic / office location and hours */
  clinic:         ClinicInfo;
  /** Patient reviews */
  reviews:        PatientReview[];
}
