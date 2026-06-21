/**
 * Doctors Mock API
 * src/lib/api/doctors.ts
 *
 * Simulates a real REST endpoint with:
 *   - A fixed pool of 12 mock doctors
 *   - Client-side filtering matching the Redux SearchFilters shape
 *   - Artificial network delay (600 ms) for realistic UX testing
 *   - fetchDoctorBySlug for individual profile pages (Phase 8)
 *
 * Replace with real HTTP calls in production.
 */

import type { SearchFilters } from "@/store/slices/searchSlice";
import type { Doctor, DoctorProfile } from "@/types/doctor";

/* ================================================================
   MOCK DATA POOL — 12 doctors covering multiple specialties/cities
   ================================================================ */
const MOCK_DOCTORS: Doctor[] = [
  {
    id:             "d-001",
    slug:           "dr-ali-rezaei",
    firstName:      "علی",
    lastName:       "رضایی",
    displayName:    "دکتر علی رضایی",
    specialtyId:    "cardiology",
    specialtyLabel: "قلب و عروق",
    city:           "tehran",
    cityLabel:      "تهران",
    rating:         4.8,
    reviewCount:    198,
    visitFee:       400_000,
    initials:       "ع.ر",
    avatarColor:    "bg-rose-100 text-rose-600",
    visitTypes:     ["in_person", "online"],
    isAvailable:    true,
    nextSlot:       "امروز، ساعت ۱۵:۳۰",
    yearsExp:       12,
  },
  {
    id:             "d-002",
    slug:           "dr-negar-mohammadi",
    firstName:      "نگار",
    lastName:       "محمدی",
    displayName:    "دکتر نگار محمدی",
    specialtyId:    "dermatology",
    specialtyLabel: "پوست و مو",
    city:           "tehran",
    cityLabel:      "تهران",
    rating:         4.9,
    reviewCount:    427,
    visitFee:       300_000,
    initials:       "ن.م",
    avatarColor:    "bg-purple-100 text-purple-600",
    visitTypes:     ["in_person"],
    isAvailable:    true,
    nextSlot:       "فردا، ساعت ۱۱:۰۰",
    yearsExp:       8,
  },
  {
    id:             "d-003",
    slug:           "dr-mohsen-karimi",
    firstName:      "محسن",
    lastName:       "کریمی",
    displayName:    "دکتر محسن کریمی",
    specialtyId:    "dentistry",
    specialtyLabel: "دندان‌پزشکی",
    city:           "mashhad",
    cityLabel:      "مشهد",
    rating:         4.7,
    reviewCount:    156,
    visitFee:       250_000,
    initials:       "م.ک",
    avatarColor:    "bg-amber-100 text-amber-700",
    visitTypes:     ["in_person"],
    isAvailable:    true,
    nextSlot:       "پس‌فردا، ساعت ۹:۰۰",
    yearsExp:       15,
  },
  {
    id:             "d-004",
    slug:           "dr-sara-ahmadi",
    firstName:      "سارا",
    lastName:       "احمدی",
    displayName:    "دکتر سارا احمدی",
    specialtyId:    "cardiology",
    specialtyLabel: "قلب و عروق",
    city:           "tehran",
    cityLabel:      "تهران",
    rating:         4.9,
    reviewCount:    312,
    visitFee:       350_000,
    initials:       "س.ا",
    avatarColor:    "bg-pink-100 text-pink-600",
    visitTypes:     ["in_person", "online"],
    isAvailable:    false,
    nextSlot:       "فردا، ساعت ۱۰:۰۰",
    yearsExp:       10,
  },
  {
    id:             "d-005",
    slug:           "dr-reza-hosseini",
    firstName:      "رضا",
    lastName:       "حسینی",
    displayName:    "دکتر رضا حسینی",
    specialtyId:    "neurology",
    specialtyLabel: "مغز و اعصاب",
    city:           "isfahan",
    cityLabel:      "اصفهان",
    rating:         4.6,
    reviewCount:    89,
    visitFee:       500_000,
    initials:       "ر.ح",
    avatarColor:    "bg-blue-100 text-blue-600",
    visitTypes:     ["in_person", "online"],
    isAvailable:    true,
    nextSlot:       "امروز، ساعت ۱۷:۰۰",
    yearsExp:       20,
  },
  {
    id:             "d-006",
    slug:           "dr-maryam-sadeghi",
    firstName:      "مریم",
    lastName:       "صادقی",
    displayName:    "دکتر مریم صادقی",
    specialtyId:    "pediatrics",
    specialtyLabel: "اطفال",
    city:           "tehran",
    cityLabel:      "تهران",
    rating:         4.8,
    reviewCount:    231,
    visitFee:       280_000,
    initials:       "م.ص",
    avatarColor:    "bg-green-100 text-green-700",
    visitTypes:     ["in_person", "home_visit"],
    isAvailable:    true,
    nextSlot:       "فردا، ساعت ۱۶:۰۰",
    yearsExp:       7,
  },
  {
    id:             "d-007",
    slug:           "dr-amir-taheri",
    firstName:      "امیر",
    lastName:       "طاهری",
    displayName:    "دکتر امیر طاهری",
    specialtyId:    "orthopedics",
    specialtyLabel: "ارتوپدی",
    city:           "tabriz",
    cityLabel:      "تبریز",
    rating:         4.5,
    reviewCount:    67,
    visitFee:       320_000,
    initials:       "ا.ط",
    avatarColor:    "bg-cyan-100 text-cyan-700",
    visitTypes:     ["in_person"],
    isAvailable:    false,
    nextSlot:       "شنبه، ساعت ۱۰:۰۰",
    yearsExp:       18,
  },
  {
    id:             "d-008",
    slug:           "dr-fatemeh-moradi",
    firstName:      "فاطمه",
    lastName:       "مرادی",
    displayName:    "دکتر فاطمه مرادی",
    specialtyId:    "gynecology",
    specialtyLabel: "زنان و زایمان",
    city:           "mashhad",
    cityLabel:      "مشهد",
    rating:         4.7,
    reviewCount:    175,
    visitFee:       300_000,
    initials:       "ف.م",
    avatarColor:    "bg-fuchsia-100 text-fuchsia-600",
    visitTypes:     ["in_person", "online"],
    isAvailable:    true,
    nextSlot:       "امروز، ساعت ۱۸:۰۰",
    yearsExp:       11,
  },
  {
    id:             "d-009",
    slug:           "dr-hasan-bahrami",
    firstName:      "حسن",
    lastName:       "بهرامی",
    displayName:    "دکتر حسن بهرامی",
    specialtyId:    "general",
    specialtyLabel: "پزشک عمومی",
    city:           "tehran",
    cityLabel:      "تهران",
    rating:         4.3,
    reviewCount:    412,
    visitFee:       150_000,
    initials:       "ح.ب",
    avatarColor:    "bg-teal-100 text-teal-700",
    visitTypes:     ["in_person", "online", "home_visit"],
    isAvailable:    true,
    nextSlot:       "همین الان",
    yearsExp:       5,
  },
  {
    id:             "d-010",
    slug:           "dr-zahra-nikpour",
    firstName:      "زهرا",
    lastName:       "نیک‌پور",
    displayName:    "دکتر زهرا نیک‌پور",
    specialtyId:    "ophthalmology",
    specialtyLabel: "چشم‌پزشکی",
    city:           "shiraz",
    cityLabel:      "شیراز",
    rating:         4.6,
    reviewCount:    103,
    visitFee:       380_000,
    initials:       "ز.ن",
    avatarColor:    "bg-sky-100 text-sky-700",
    visitTypes:     ["in_person"],
    isAvailable:    true,
    nextSlot:       "فردا، ساعت ۱۴:۰۰",
    yearsExp:       9,
  },
  {
    id:             "d-011",
    slug:           "dr-mehdi-nazari",
    firstName:      "مهدی",
    lastName:       "نظری",
    displayName:    "دکتر مهدی نظری",
    specialtyId:    "psychiatry",
    specialtyLabel: "روان‌پزشکی",
    city:           "tehran",
    cityLabel:      "تهران",
    rating:         4.9,
    reviewCount:    88,
    visitFee:       550_000,
    initials:       "م.ن",
    avatarColor:    "bg-violet-100 text-violet-700",
    visitTypes:     ["in_person", "online"],
    isAvailable:    true,
    nextSlot:       "پس‌فردا، ساعت ۱۱:۰۰",
    yearsExp:       14,
  },
  {
    id:             "d-012",
    slug:           "dr-kimia-rashidi",
    firstName:      "کیمیا",
    lastName:       "رشیدی",
    displayName:    "دکتر کیمیا رشیدی",
    specialtyId:    "ent",
    specialtyLabel: "گوش، حلق و بینی",
    city:           "karaj",
    cityLabel:      "کرج",
    rating:         4.4,
    reviewCount:    55,
    visitFee:       220_000,
    initials:       "ک.ر",
    avatarColor:    "bg-orange-100 text-orange-700",
    visitTypes:     ["in_person"],
    isAvailable:    false,
    nextSlot:       "شنبه، ساعت ۸:۰۰",
    yearsExp:       6,
  },
  /* ── Low-rating doctors (Fix #7) ───────────────────────── */
  {
    id:             "d-013",
    slug:           "dr-javad-nasiri",
    firstName:      "جواد",
    lastName:       "نصیری",
    displayName:    "دکتر جواد نصیری",
    specialtyId:    "general",
    specialtyLabel: "پزشک عمومی",
    city:           "tehran",
    cityLabel:      "تهران",
    rating:         2.5,
    reviewCount:    34,
    visitFee:       120_000,
    initials:       "ج.ن",
    avatarColor:    "bg-neutral-100 text-neutral-500",
    visitTypes:     ["in_person"],
    isAvailable:    true,
    nextSlot:       "همین الان",
    yearsExp:       2,
  },
  {
    id:             "d-014",
    slug:           "dr-shirin-esfahani",
    firstName:      "شیرین",
    lastName:       "اصفهانی",
    displayName:    "دکتر شیرین اصفهانی",
    specialtyId:    "dermatology",
    specialtyLabel: "پوست و مو",
    city:           "isfahan",
    cityLabel:      "اصفهان",
    rating:         2.8,
    reviewCount:    19,
    visitFee:       180_000,
    initials:       "ش.ا",
    avatarColor:    "bg-red-100 text-red-500",
    visitTypes:     ["in_person", "online"],
    isAvailable:    false,
    nextSlot:       "سه‌شنبه، ساعت ۱۰:۰۰",
    yearsExp:       3,
  },
  {
    id:             "d-015",
    slug:           "dr-kamran-kargar",
    firstName:      "کامران",
    lastName:       "کارگر",
    displayName:    "دکتر کامران کارگر",
    specialtyId:    "orthopedics",
    specialtyLabel: "ارتوپدی",
    city:           "mashhad",
    cityLabel:      "مشهد",
    rating:         3.1,
    reviewCount:    28,
    visitFee:       200_000,
    initials:       "ک.ک",
    avatarColor:    "bg-yellow-100 text-yellow-700",
    visitTypes:     ["in_person"],
    isAvailable:    true,
    nextSlot:       "فردا، ساعت ۱۳:۰۰",
    yearsExp:       4,
  },
  {
    id:             "d-016",
    slug:           "dr-leila-mohseni",
    firstName:      "لیلا",
    lastName:       "محسنی",
    displayName:    "دکتر لیلا محسنی",
    specialtyId:    "psychiatry",
    specialtyLabel: "روان‌پزشکی",
    city:           "tehran",
    cityLabel:      "تهران",
    rating:         3.4,
    reviewCount:    41,
    visitFee:       350_000,
    initials:       "ل.م",
    avatarColor:    "bg-slate-100 text-slate-500",
    visitTypes:     ["in_person", "online"],
    isAvailable:    true,
    nextSlot:       "یکشنبه، ساعت ۱۵:۰۰",
    yearsExp:       5,
  },
];

/* ================================================================
   FETCH FUNCTION
   ================================================================ */

/** Simulated 600 ms network delay */
const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Normalise Persian text for substring search */
const normalise = (s: string) =>
  s.trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Fetch doctors matching the given filters.
 * Mirrors what a real API endpoint would do server-side.
 * React Query caches the result keyed on the serialised filters.
 */
export async function fetchDoctors(
  filters: Partial<SearchFilters>
): Promise<Doctor[]> {
  await sleep(600);

  let results = [...MOCK_DOCTORS];

  /* Text query — matches display name or specialty label */
  if (filters.query) {
    const q = normalise(filters.query);
    results = results.filter(
      (d) =>
        normalise(d.displayName).includes(q) ||
        normalise(d.specialtyLabel).includes(q)
    );
  }

  /* City filter */
  if (filters.city) {
    results = results.filter((d) => d.city === filters.city);
  }

  /* Specialty filter */
  if (filters.specialty) {
    results = results.filter((d) => d.specialtyId === filters.specialty);
  }

  /* Minimum rating */
  if (filters.minRating && filters.minRating > 0) {
    results = results.filter((d) => d.rating >= filters.minRating!);
  }

  /* Availability toggle */
  if (filters.isAvailable) {
    results = results.filter((d) => d.isAvailable);
  }

  /* Visit type */
  if (filters.visitType) {
    results = results.filter((d) =>
      d.visitTypes.includes(
        filters.visitType as "in_person" | "online" | "home_visit"
      )
    );
  }

  return results;
}

/* ================================================================
   MOCK PROFILES — full detail data (Phase 8)
   Keyed by slug. Falls back to base Doctor fields if not found.
   ================================================================ */
const MOCK_PROFILES: Record<string, DoctorProfile> = {
  "dr-ali-rezaei": {
    ...(MOCK_DOCTORS[0] as Doctor),
    councilNumber: "۱۲۳۴۵۶",
    fullBio:
      "دکتر علی رضایی، متخصص قلب و عروق با بیش از ۱۲ سال سابقه بالینی، فارغ‌التحصیل دانشگاه علوم پزشکی تهران است. ایشان در زمینه نارسایی قلبی، آریتمی و پیشگیری از بیماری‌های قلبی-عروقی تجربه گسترده‌ای دارند و در مجلات معتبر بین‌المللی مقالات متعددی به چاپ رسانده‌اند.",
    education: [
      {
        degree: "دکترای پزشکی عمومی",
        institution: "دانشگاه علوم پزشکی تهران",
        year: "۱۳۸۶",
      },
      {
        degree: "تخصص قلب و عروق",
        institution: "دانشگاه علوم پزشکی شهید بهشتی",
        year: "۱۳۹۲",
      },
      {
        degree: "فلوشیپ اکوکاردیوگرافی",
        institution: "بیمارستان قلب تهران",
        year: "۱۳۹۴",
      },
    ],
    services: [
      "نوار قلب (ECG)",
      "اکوکاردیوگرافی",
      "تست ورزش",
      "هولتر مانیتورینگ",
      "مشاوره نارسایی قلبی",
      "آنژیوگرافی (ارجاع)",
      "پیشگیری از بیماری قلبی",
    ],
    languages: ["فارسی", "انگلیسی"],
    clinic: {
      name: "کلینیک تخصصی قلب آریا",
      address: "تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۲۴۸",
      cityLabel: "تهران",
      phone: "۰۲۱-۸۸۷۱۲۳۴۵",
      lat: 35.7575,
      lng: 51.4075,
      workingDays: [
        { day: "شنبه",   open: "09:00", close: "13:00", closed: false },
        { day: "یکشنبه", open: "09:00", close: "13:00", closed: false },
        { day: "دوشنبه", open: "14:00", close: "18:00", closed: false },
        { day: "سه‌شنبه",open: "09:00", close: "13:00", closed: false },
        { day: "چهارشنبه", open: "14:00", close: "18:00", closed: false },
        { day: "پنج‌شنبه",open: "09:00", close: "12:00", closed: false },
        { day: "جمعه",   open: "",      close: "",       closed: true  },
      ],
    },
    reviews: [
      {
        id: "r-001",
        patientName: "محمد ص.",
        rating: 5,
        date: "2026-05-10",
        comment:
          "دکتر رضایی بسیار دقیق و صبور هستند. توضیحات کاملی درباره وضعیتم دادند و برنامه درمانی خوبی ترتیب دادند. قطعاً توصیه می‌کنم.",
        visitType: "in_person",
      },
      {
        id: "r-002",
        patientName: "فاطمه ع.",
        rating: 5,
        date: "2026-04-22",
        comment:
          "رفتار بسیار محترمانه‌ای دارند. نوبت به موقع بود و وقت کافی برای بررسی گذاشتند. ممنون از تیم کلینیک.",
        visitType: "in_person",
      },
      {
        id: "r-003",
        patientName: "علی ح.",
        rating: 4,
        date: "2026-03-15",
        comment:
          "ویزیت آنلاین سریع و مفید بود. فقط کاش امکان ارسال نتایج آزمایش هم وجود داشت.",
        visitType: "online",
      },
    ],
  },

  "dr-negar-mohammadi": {
    ...(MOCK_DOCTORS[1] as Doctor),
    councilNumber: "۲۳۴۵۶۷",
    fullBio:
      "دکتر نگار محمدی، متخصص پوست و مو با ۸ سال تجربه بالینی، در زمینه درماتولوژی زیبایی، درمان آکنه، بیماری‌های مزمن پوستی و تریکولوژی تخصص دارند. رویکرد ایشان مبتنی بر پزشکی شواهدمحور و ارائه راهکارهای عملی برای هر بیمار است.",
    education: [
      {
        degree: "دکترای پزشکی عمومی",
        institution: "دانشگاه علوم پزشکی اصفهان",
        year: "۱۳۹۰",
      },
      {
        degree: "تخصص پوست و مو",
        institution: "دانشگاه علوم پزشکی تهران",
        year: "۱۳۹۶",
      },
    ],
    services: [
      "درمان آکنه و جوش",
      "پسوریازیس و اگزما",
      "ریزش مو و آلوپسی",
      "تشخیص و درمان خال‌های پوستی",
      "لیزر پوست",
      "مزوتراپی",
      "بوتاکس و فیلر (ارجاع)",
    ],
    languages: ["فارسی", "انگلیسی"],
    clinic: {
      name: "مطب دکتر محمدی",
      address: "تهران، سعادت‌آباد، خیابان علامه طباطبایی، پلاک ۱۲",
      cityLabel: "تهران",
      phone: "۰۲۱-۲۲۳۴۵۶۷۸",
      lat: 35.7800,
      lng: 51.3700,
      workingDays: [
        { day: "شنبه",     open: "10:00", close: "14:00", closed: false },
        { day: "یکشنبه",   open: "10:00", close: "14:00", closed: false },
        { day: "دوشنبه",   open: "15:00", close: "19:00", closed: false },
        { day: "سه‌شنبه",  open: "10:00", close: "14:00", closed: false },
        { day: "چهارشنبه", open: "15:00", close: "19:00", closed: false },
        { day: "پنج‌شنبه", open: "",      close: "",       closed: true  },
        { day: "جمعه",     open: "",      close: "",       closed: true  },
      ],
    },
    reviews: [
      {
        id: "r-004",
        patientName: "زهرا ک.",
        rating: 5,
        date: "2026-05-28",
        comment:
          "دکتر محمدی خیلی دقیق مشکل پوستم رو بررسی کردند و درمان مناسبی تجویز کردند. بعد از ۶ هفته تفاوت قابل توجهی داشتم.",
        visitType: "in_person",
      },
      {
        id: "r-005",
        patientName: "مهدی ر.",
        rating: 5,
        date: "2026-05-01",
        comment:
          "بهترین متخصص پوستی هستند که تا به حال رفتم. خوش‌برخورد، حرفه‌ای و در تشخیص عالی.",
        visitType: "in_person",
      },
      {
        id: "r-006",
        patientName: "سارا ن.",
        rating: 4,
        date: "2026-04-10",
        comment: "معاینه کامل و دقیق. منتظری برای نوبت کمی طولانی بود.",
        visitType: "in_person",
      },
    ],
  },
};

/**
 * Fetch a single doctor's full profile by slug.
 * Falls back to a minimal profile built from the base Doctor list record
 * if no full profile data is available for that slug.
 */
export async function fetchDoctorBySlug(
  slug: string
): Promise<DoctorProfile | null> {
  await sleep(800);

  /* Try exact match in full profiles first */
  if (MOCK_PROFILES[slug]) return MOCK_PROFILES[slug];

  /* Fall back to base list record and fabricate minimal profile data */
  const base = MOCK_DOCTORS.find((d) => d.slug === slug);
  if (!base) return null;

  const fallbackProfile: DoctorProfile = {
    ...base,
    councilNumber: "------",
    fullBio:
      `${base.displayName} با ${base.yearsExp} سال سابقه در حوزه ${base.specialtyLabel} فعالیت می‌کنند.`,
    education: [
      {
        degree: `تخصص ${base.specialtyLabel}`,
        institution: "دانشگاه علوم پزشکی ایران",
      },
    ],
    services: [`خدمات ${base.specialtyLabel}`],
    languages: ["فارسی"],
    clinic: {
      name: `مطب دکتر ${base.lastName}`,
      address: `${base.cityLabel}، آدرس نمونه`,
      cityLabel: base.cityLabel,
      phone: "۰۲۱-۰۰۰۰۰۰۰۰",
      lat: 35.6892,
      lng: 51.3890,
      workingDays: [
        { day: "شنبه",     open: "09:00", close: "13:00", closed: false },
        { day: "یکشنبه",   open: "09:00", close: "13:00", closed: false },
        { day: "دوشنبه",   open: "09:00", close: "13:00", closed: false },
        { day: "سه‌شنبه",  open: "09:00", close: "13:00", closed: false },
        { day: "چهارشنبه", open: "09:00", close: "13:00", closed: false },
        { day: "پنج‌شنبه", open: "09:00", close: "12:00", closed: false },
        { day: "جمعه",     open: "",      close: "",       closed: true  },
      ],
    },
    reviews: [],
  };

  return fallbackProfile;
}
