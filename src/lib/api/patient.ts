/**
 * Patient Mock API
 * src/lib/api/patient.ts
 */

import type { PatientAppointment, FavoriteDoctor, PatientProfile } from "@/types/patient";

export const MOCK_PATIENT_PROFILE: PatientProfile = {
  fullName:   "علی محمدی",
  phone:      "۰۹۱۲۳۴۵۶۷۸۹",
  email:      "ali.mohammadi@example.com",
  nationalId: "۰۰۱۲۳۴۵۶۷۸",
};

export const MOCK_APPOINTMENTS: PatientAppointment[] = [
  /* ── Upcoming ─────────────────────────────────────────────── */
  {
    id:                "apt-001",
    doctorName:        "دکتر علی رضایی",
    doctorSpecialty:   "قلب و عروق",
    doctorSlug:        "dr-ali-rezaei",
    doctorInitials:    "ع.ر",
    doctorAvatarColor: "bg-rose-100 text-rose-600",
    dateLabel:         "۱۵ تیر ۱۴۰۵",
    date:              "2026-07-06",
    time:              "۱۵:۳۰",
    status:            "confirmed",
    visitType:         "in_person",
    visitFee:          400_000,
    clinicName:        "کلینیک تخصصی قلب آریا",
  },
  {
    id:                "apt-002",
    doctorName:        "دکتر نگار محمدی",
    doctorSpecialty:   "پوست و مو",
    doctorSlug:        "dr-negar-mohammadi",
    doctorInitials:    "ن.م",
    doctorAvatarColor: "bg-purple-100 text-purple-600",
    dateLabel:         "۲۲ تیر ۱۴۰۵",
    date:              "2026-07-13",
    time:              "۱۱:۰۰",
    status:            "pending",
    visitType:         "online",
    visitFee:          300_000,
  },
  /* ── Past ─────────────────────────────────────────────────── */
  {
    id:                "apt-003",
    doctorName:        "دکتر مریم صادقی",
    doctorSpecialty:   "اطفال",
    doctorSlug:        "dr-maryam-sadeghi",
    doctorInitials:    "م.ص",
    doctorAvatarColor: "bg-green-100 text-green-700",
    dateLabel:         "۳۰ خرداد ۱۴۰۵",
    date:              "2026-06-20",
    time:              "۱۶:۰۰",
    status:            "completed",
    visitType:         "in_person",
    visitFee:          280_000,
    clinicName:        "مطب دکتر صادقی",
  },
  {
    id:                "apt-004",
    doctorName:        "دکتر رضا حسینی",
    doctorSpecialty:   "مغز و اعصاب",
    doctorSlug:        "dr-reza-hosseini",
    doctorInitials:    "ر.ح",
    doctorAvatarColor: "bg-blue-100 text-blue-600",
    dateLabel:         "۲۶ اردیبهشت ۱۴۰۵",
    date:              "2026-05-16",
    time:              "۱۷:۰۰",
    status:            "completed",
    visitType:         "in_person",
    visitFee:          500_000,
    clinicName:        "درمانگاه نور اصفهان",
  },
  {
    id:                "apt-005",
    doctorName:        "دکتر مهدی نظری",
    doctorSpecialty:   "روان‌پزشکی",
    doctorSlug:        "dr-mehdi-nazari",
    doctorInitials:    "م.ن",
    doctorAvatarColor: "bg-violet-100 text-violet-700",
    dateLabel:         "۱۸ اسفند ۱۴۰۴",
    date:              "2026-03-09",
    time:              "۱۰:۰۰",
    status:            "cancelled",
    visitType:         "online",
    visitFee:          550_000,
  },
];

export const MOCK_FAVORITE_DOCTORS: FavoriteDoctor[] = [
  {
    id:             "d-001",
    slug:           "dr-ali-rezaei",
    displayName:    "دکتر علی رضایی",
    specialtyLabel: "قلب و عروق",
    cityLabel:      "تهران",
    rating:         4.8,
    initials:       "ع.ر",
    avatarColor:    "bg-rose-100 text-rose-600",
  },
  {
    id:             "d-002",
    slug:           "dr-negar-mohammadi",
    displayName:    "دکتر نگار محمدی",
    specialtyLabel: "پوست و مو",
    cityLabel:      "تهران",
    rating:         4.9,
    initials:       "ن.م",
    avatarColor:    "bg-purple-100 text-purple-600",
  },
  {
    id:             "d-006",
    slug:           "dr-maryam-sadeghi",
    displayName:    "دکتر مریم صادقی",
    specialtyLabel: "اطفال",
    cityLabel:      "تهران",
    rating:         4.8,
    initials:       "م.ص",
    avatarColor:    "bg-green-100 text-green-700",
  },
];
