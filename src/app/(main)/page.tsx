/**
 * Home Page — Phase 5
 * src/app/(main)/page.tsx
 *
 * Sections:
 *  1. Hero & Search  — headline + HeroSearch (Redux-wired)
 *  2. Stats          — horizontal social-proof strip
 *  3. Featured Specialties — 8-tile grid
 *  4. Featured Doctors     — horizontal scroll with mock cards
 *  5. Doctor CTA banner    — "پزشک هستید؟"
 *
 * Mobile-first layout rules:
 *  - Hero uses min-h-[calc(100dvh-3.5rem)] so the search bar fills the
 *    initial viewport on mobile exactly (3.5rem = h-14 header).
 *  - On mobile the headline is concise (2 lines max) and the HeroSearch
 *    shows a single large input — see HeroSearch.tsx for details.
 *  - All sections below the hero scroll naturally; no fixed heights.
 *  - Generous padding on mobile (px-4), wider on desktop (container-app).
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Star, MapPin, Clock, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroSearch } from "@/features/home/HeroSearch";
import { SPECIALTIES } from "@/constants";

export const metadata: Metadata = {
  title: "مدیتو — جستجو و نوبت‌دهی آنلاین پزشک",
  description:
    "پزشک مناسب خود را پیدا کنید. بیش از ۱۰٬۰۰۰ پزشک متخصص در سراسر ایران.",
};

/* ----------------------------------------------------------------
   Mock data — replaced by API in Phase 7
   ---------------------------------------------------------------- */
const STATS = [
  { value: "۱۰٬۰۰۰+",  label: "پزشک متخصص",    id: "stat-doctors"     },
  { value: "۵۰۰٬۰۰۰+", label: "نوبت رزرو شده", id: "stat-bookings"    },
  { value: "۱۰۰+",      label: "شهر",            id: "stat-cities"     },
  { value: "۴.۸",       label: "میانگین رضایت",  id: "stat-rating"     },
] as const;

const FEATURED_DOCTORS = [
  {
    id:        "dr-ahmadi",
    name:      "دکتر سارا احمدی",
    specialty: "قلب و عروق",
    city:      "تهران",
    rating:    4.9,
    reviews:   312,
    price:     "۳۵۰٬۰۰۰",
    nextSlot:  "فردا، ساعت ۱۰:۰۰",
    avatar:    "سا",
    avatarBg:  "bg-rose-100 text-rose-700",
    badge:     "ظرفیت محدود",
  },
  {
    id:        "dr-rezaei",
    name:      "دکتر علی رضایی",
    specialty: "مغز و اعصاب",
    city:      "اصفهان",
    rating:    4.8,
    reviews:   198,
    price:     "۴۰۰٬۰۰۰",
    nextSlot:  "امروز، ساعت ۱۵:۳۰",
    avatar:    "عر",
    avatarBg:  "bg-blue-100 text-blue-700",
    badge:     "نوبت فوری",
  },
  {
    id:        "dr-mohammadi",
    name:      "دکتر نگار محمدی",
    specialty: "پوست و مو",
    city:      "تهران",
    rating:    4.9,
    reviews:   427,
    price:     "۳۰۰٬۰۰۰",
    nextSlot:  "فردا، ساعت ۱۱:۰۰",
    avatar:    "نم",
    avatarBg:  "bg-purple-100 text-purple-700",
    badge:     null,
  },
  {
    id:        "dr-karimi",
    name:      "دکتر محسن کریمی",
    specialty: "دندان‌پزشکی",
    city:      "مشهد",
    rating:    4.7,
    reviews:   156,
    price:     "۲۵۰٬۰۰۰",
    nextSlot:  "پس‌فردا، ساعت ۹:۰۰",
    avatar:    "مک",
    avatarBg:  "bg-amber-100 text-amber-700",
    badge:     null,
  },
] as const;

/* First 8 specialties for the grid */
const GRID_SPECIALTIES = SPECIALTIES.slice(0, 8);

/* ----------------------------------------------------------------
   Page
   ---------------------------------------------------------------- */
export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          1. HERO & SEARCH
          Mobile: fills viewport below the header (min-h-[calc(100dvh-3.5rem)])
          Desktop: generous vertical padding, headline is larger
          ══════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="hero-heading"
        className={cn(
          /* Mobile: fill the viewport so the search is the first thing seen */
          "min-h-[calc(100dvh-3.5rem)]",
          "flex flex-col items-center justify-center",
          "bg-neutral-50 border-b border-neutral-100",
          "px-4 py-12 sm:py-20"
        )}
      >
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">



          {/* Headline — concise on mobile (2 lines), larger on desktop */}
          <h1
            id="hero-heading"
            className={cn(
              "text-2xl sm:text-4xl font-bold text-neutral-900",
              "text-center leading-snug mb-3"
            )}
          >
            پزشک مناسب خود را{" "}
            <span className="text-brand-600">آنلاین پیدا کنید</span>
          </h1>

          {/* Subtitle — hidden on smallest screens to reduce clutter */}
          <p className="hidden sm:block text-sm text-neutral-500 text-center max-w-md mb-8 leading-relaxed">
            بیش از ۱۰٬۰۰۰ پزشک متخصص در سراسر ایران — نوبت بگیرید، نظرات بخوانید، با اطمینان تصمیم بگیرید.
          </p>
          <p className="sm:hidden text-xs text-neutral-400 text-center mb-6 leading-relaxed">
            بیش از ۱۰٬۰۰۰ پزشک در سراسر ایران
          </p>

          {/* Redux-wired search bar (client island) */}
          <HeroSearch />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. STATS — social proof strip
          ══════════════════════════════════════════════════════════ */}
      <section aria-label="آمار پلتفرم" className="border-b border-neutral-100 bg-neutral-50">
        <div className="container-app py-6">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.id}
                id={stat.id}
                className="text-center py-4 px-3 rounded-2xl bg-neutral-0 border border-neutral-100"
              >
                <dt className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight tabular-nums tracking-tight">
                  {stat.value}
                </dt>
                <dd className="text-xs text-neutral-400 mt-1 font-medium">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. FEATURED SPECIALTIES — 4×2 / 8×1 grid
          ══════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="specialties-heading"
        className="border-b border-neutral-100 bg-neutral-0"
      >
        <div className="container-app py-8 sm:py-10">

          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 id="specialties-heading" className="text-sm font-bold text-neutral-900">
                جستجو بر اساس تخصص
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5 hidden sm:block">
                از میان صدها تخصص پزشکی انتخاب کنید
              </p>
            </div>
            <Link
              href="/specialties"
              id="link-all-specialties"
              className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors duration-150 shrink-0 ms-4"
            >
              همه تخصص‌ها
              <ChevronLeft size={12} aria-hidden="true" />
            </Link>
          </div>

          {/* Specialty grid */}
          <ul
            role="list"
            className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3"
          >
            {GRID_SPECIALTIES.map((spec) => (
              <li key={spec.id}>
                <Link
                  href={`/doctors?specialty=${spec.id}`}
                  id={`specialty-${spec.id}`}
                  className={cn(
                    "flex flex-col items-center gap-1.5",
                    "p-2 sm:p-3 rounded-xl",
                    "border border-neutral-100 bg-neutral-0",
                    "hover:border-brand-200 hover:bg-brand-50",
                    "hover:-translate-y-0.5",
                    "transition-all duration-150 group"
                  )}
                >
                  <span className="text-2xl leading-none" aria-hidden="true">
                    {spec.icon}
                  </span>
                  <span className={cn(
                    "text-xs font-medium text-neutral-700",
                    "group-hover:text-brand-700",
                    "text-center leading-tight"
                  )}>
                    {spec.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. FEATURED DOCTORS — horizontal scroll on mobile
          ══════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="doctors-heading"
        className="border-b border-neutral-100 bg-neutral-0"
      >
        <div className="container-app py-8 sm:py-10">

          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 id="doctors-heading" className="text-sm font-bold text-neutral-900">
                پزشکان برتر
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5 hidden sm:block">
                پزشکانی با بالاترین رضایت بیماران
              </p>
            </div>
            <Link
              href="/doctors"
              id="link-all-doctors"
              className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors duration-150 shrink-0 ms-4"
            >
              مشاهده همه
              <ChevronLeft size={12} aria-hidden="true" />
            </Link>
          </div>

          {/* Horizontal scroll container */}
          <div
            className={cn(
              /* Mobile: horizontal scroll */
              "-mx-4 px-4 sm:mx-0 sm:px-0",
              "flex gap-3 overflow-x-auto",
              "snap-x snap-mandatory",
              /* Hide scrollbar */
              "scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
              /* Desktop: grid */
              "sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-x-visible"
            )}
            role="list"
            aria-label="پزشکان برتر"
          >
            {FEATURED_DOCTORS.map((doctor) => (
              <Link
                key={doctor.id}
                href={`/doctors/${doctor.id}`}
                role="listitem"
                aria-label={`مشاهده پروفایل ${doctor.name}`}
                className={cn(
                  /* Mobile snap card */
                  "snap-start shrink-0 w-[80vw] max-w-[280px]",
                  /* Desktop: normal */
                  "sm:w-auto sm:max-w-none sm:shrink",
                  /* Card styles */
                  "flex flex-col gap-3 p-4 rounded-xl",
                  "border border-neutral-100 bg-neutral-0",
                  "hover:border-neutral-200 hover:shadow-md hover:-translate-y-1",
                  "transition-all duration-150"
                )}
              >
                {/* Avatar + name row */}
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={cn(
                    "w-12 h-12 rounded-full shrink-0",
                    "flex items-center justify-center",
                    "text-sm font-bold select-none",
                    doctor.avatarBg
                  )}>
                    {doctor.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {doctor.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">{doctor.specialty}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1">
                      <Star
                        size={11}
                        className="text-amber-400 fill-amber-400 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-xs font-medium text-neutral-700 tabular-nums">
                        {doctor.rating}
                      </span>
                      <span className="text-xs text-neutral-400">
                        ({doctor.reviews} نظر)
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  {doctor.badge && (
                    <span className="shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100">
                      {doctor.badge}
                    </span>
                  )}
                </div>

                {/* Info pills */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <MapPin size={11} className="shrink-0 text-neutral-400" aria-hidden="true" />
                    {doctor.city}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Clock size={11} className="shrink-0 text-neutral-400" aria-hidden="true" />
                    {doctor.nextSlot}
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-100 mt-auto">
                  <div>
                    <span className="text-xs text-neutral-400">ویزیت </span>
                    <span className="text-xs font-semibold text-neutral-900 tabular-nums">
                      {doctor.price}
                    </span>
                    <span className="text-xs text-neutral-400"> تومان</span>
                  </div>
                  <Link
                    href={`/doctors/${doctor.id}`}
                    id={`btn-book-${doctor.id}`}
                    className={cn(
                      "inline-flex items-center justify-center",
                      "h-8 px-3 rounded-lg",
                      "text-xs font-semibold",
                      "text-brand-700 border border-brand-200 bg-brand-50",
                      "hover:bg-brand-100 hover:border-brand-300",
                      "transition-colors duration-150 select-none"
                    )}
                  >
                    رزرو نوبت
                  </Link>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. DOCTOR CTA BANNER
          ══════════════════════════════════════════════════════════ */}
      <section aria-labelledby="cta-heading" className="bg-neutral-50">
        <div className="container-app py-8 sm:py-10">
          <div className={cn(
            "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
            "p-6 rounded-2xl border border-neutral-100 bg-neutral-0"
          )}>
            <div>
              <h2 id="cta-heading" className="text-base font-bold text-neutral-900">
                پزشک هستید؟
              </h2>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                پروفایل خود را ثبت کنید، نوبت آنلاین بگیرید و با بیماران بیشتری ارتباط برقرار کنید.
              </p>
            </div>
            <Link
              href="/register?role=doctor"
              id="btn-doctor-register"
              className={cn(
                "inline-flex items-center justify-center",
                "px-5 py-2.5 rounded-xl",
                "text-sm font-semibold text-brand-700",
                "border border-brand-300 bg-brand-50",
                "hover:bg-brand-100 hover:border-brand-400",
                "transition-colors duration-150 select-none shrink-0"
              )}
            >
              ثبت‌نام به عنوان پزشک
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
