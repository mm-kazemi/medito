/**
 * Application Constants
 * پلتفرم مدیتو — ثابت‌های برنامه
 */

/* ============================================================
   APP
   ============================================================ */
export const APP_NAME = "مدیتو" as const;
export const APP_DESCRIPTION = "پلتفرم جامع جستجوی پزشک و رزرو آنلاین نوبت";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/* ============================================================
   API
   ============================================================ */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.example.com/v1";
export const API_TIMEOUT  = Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 10_000);

/* ============================================================
   ROUTES
   ============================================================ */
export const ROUTES = {
  HOME:           "/",
  DOCTORS:        "/doctors",
  DOCTOR_PROFILE: (slug: string) => `/doctors/${slug}`,
  BOOKING:        (doctorId: string) => `/booking/${doctorId}`,
  LOGIN:          "/login",
  REGISTER:       "/register",
  DASHBOARD:      "/dashboard",
  PROFILE:        "/dashboard/profile",
  SCHEDULE:       "/dashboard/schedule",
  APPOINTMENTS:   "/dashboard/appointments",
} as const;

/* ============================================================
   MEDICAL SPECIALTIES — تخصص‌های پزشکی
   ============================================================ */
export const SPECIALTIES = [
  { id: "general",        label: "پزشک عمومی",         icon: "🩺" },
  { id: "cardiology",     label: "قلب و عروق",          icon: "❤️" },
  { id: "dermatology",    label: "پوست و مو",           icon: "✨" },
  { id: "orthopedics",    label: "ارتوپدی",             icon: "🦴" },
  { id: "pediatrics",     label: "اطفال",               icon: "👶" },
  { id: "gynecology",     label: "زنان و زایمان",       icon: "🌸" },
  { id: "ophthalmology",  label: "چشم‌پزشکی",           icon: "👁️" },
  { id: "ent",            label: "گوش، حلق و بینی",    icon: "👂" },
  { id: "neurology",      label: "مغز و اعصاب",         icon: "🧠" },
  { id: "urology",        label: "اورولوژی",            icon: "💊" },
  { id: "gastrology",     label: "گوارش",               icon: "🫁" },
  { id: "endocrinology",  label: "غدد و متابولیسم",    icon: "⚗️" },
  { id: "psychiatry",     label: "روان‌پزشکی",          icon: "🧘" },
  { id: "oncology",       label: "انکولوژی",            icon: "🔬" },
  { id: "dentistry",      label: "دندان‌پزشکی",         icon: "🦷" },
] as const;

export type SpecialtyId = typeof SPECIALTIES[number]["id"];

/* ============================================================
   CITIES — شهرهای اصلی
   ============================================================ */
export const MAJOR_CITIES = [
  { id: "tehran",       label: "تهران",         province: "تهران" },
  { id: "mashhad",      label: "مشهد",          province: "خراسان رضوی" },
  { id: "isfahan",      label: "اصفهان",        province: "اصفهان" },
  { id: "tabriz",       label: "تبریز",         province: "آذربایجان شرقی" },
  { id: "shiraz",       label: "شیراز",         province: "فارس" },
  { id: "ahvaz",        label: "اهواز",         province: "خوزستان" },
  { id: "karaj",        label: "کرج",           province: "البرز" },
  { id: "qom",          label: "قم",            province: "قم" },
  { id: "Kermanshah",   label: "کرمانشاه",      province: "کرمانشاه" },
  { id: "rasht",        label: "رشت",           province: "گیلان" },
  { id: "urmia",        label: "ارومیه",        province: "آذربایجان غربی" },
  { id: "zahedan",      label: "زاهدان",        province: "سیستان و بلوچستان" },
] as const;

/* ============================================================
   INSURANCE — بیمه‌ها
   ============================================================ */
export const INSURANCE_TYPES = [
  { id: "tamin",      label: "تأمین اجتماعی" },
  { id: "khadamat",   label: "خدمات درمانی" },
  { id: "niroha",     label: "نیروهای مسلح" },
  { id: "salamat",    label: "سلامت" },
  { id: "private",    label: "خصوصی" },
] as const;

/* ============================================================
   PAGINATION
   ============================================================ */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE:     48,
  INITIAL_PAGE:      1,
} as const;

/* ============================================================
   RATING
   ============================================================ */
export const RATING = {
  MIN: 1,
  MAX: 5,
  STEP: 0.5,
} as const;

/* ============================================================
   VISIT TYPES — نوع ویزیت
   ============================================================ */
export const VISIT_TYPES = [
  { id: "in_person",   label: "حضوری",      icon: "🏥" },
  { id: "online",      label: "آنلاین",      icon: "💻" },
  { id: "home_visit",  label: "ویزیت در منزل", icon: "🏠" },
] as const;

/* ============================================================
   SORT OPTIONS — گزینه‌های مرتب‌سازی
   ============================================================ */
export const SORT_OPTIONS = [
  { id: "relevance",     label: "مرتبط‌ترین" },
  { id: "rating",        label: "بیشترین امتیاز" },
  { id: "reviews",       label: "بیشترین نظرات" },
  { id: "price_asc",     label: "کمترین قیمت ویزیت" },
  { id: "price_desc",    label: "بیشترین قیمت ویزیت" },
  { id: "soonest",       label: "زودترین نوبت" },
] as const;

export type SortOptionId = typeof SORT_OPTIONS[number]["id"];

/* ============================================================
   APPOINTMENT STATUS LABELS
   ============================================================ */
export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  pending:    "در انتظار تأیید",
  confirmed:  "تأیید شده",
  cancelled:  "لغو شده",
  completed:  "انجام شده",
  no_show:    "غیبت بیمار",
};

/* ============================================================
   TIME SLOTS — بازه‌های زمانی (دقیقه)
   ============================================================ */
export const APPOINTMENT_DURATIONS = [15, 20, 30, 45, 60] as const;
export type AppointmentDuration = typeof APPOINTMENT_DURATIONS[number];

/* ============================================================
   QUERY KEYS — React Query cache keys
   ============================================================ */
export const QUERY_KEYS = {
  DOCTORS:          "doctors",
  DOCTOR_PROFILE:   "doctor-profile",
  SPECIALTIES:      "specialties",
  APPOINTMENTS:     "appointments",
  TIME_SLOTS:       "time-slots",
  REVIEWS:          "reviews",
  USER_PROFILE:     "user-profile",
} as const;
