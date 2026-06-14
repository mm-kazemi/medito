/**
 * DoctorProfileClient — Doctors Feature
 * src/features/doctors/DoctorProfileClient.tsx
 *
 * "use client" island for the individual doctor profile page.
 * Uses TanStack Query to fetch the full DoctorProfile by slug.
 *
 * Sections:
 *   1. DoctorProfileHeader  — avatar, name, rating, visit types
 *   2. Bio & Education      — biography + credential timeline
 *   3. Services             — offered services as minimal pills
 *   4. Clinic Info + Map    — address, phone, hours + OSM iframe
 *   5. Patient Reviews      — minimal review cards
 *   6. Sticky Booking CTA   — mobile-sticky bottom bar + desktop inline CTA
 *
 * Loading:   Skeleton layout matching the real page structure.
 * Not found: 404-style empty state with back link.
 */

"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  Phone,
  Clock,
  GraduationCap,
  Star,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPersianDate } from "@/lib/utils";
import { QUERY_KEYS, ROUTES } from "@/constants";
import { fetchDoctorBySlug } from "@/lib/api/doctors";
import { DoctorProfileHeader } from "./DoctorProfileHeader";
import { ClinicMap } from "./ClinicMap";
import { Skeleton, SkeletonAvatar, SkeletonText } from "@/components/common/Skeleton";
import type { DoctorProfile, PatientReview } from "@/types/doctor";

/* ================================================================
   Section wrapper — consistent spacing & divider
   ================================================================ */
function Section({
  title,
  icon,
  children,
  className,
}: {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("py-8 border-b border-neutral-100 last:border-0", className)}>
      {title && (
        <h2 className="flex items-center gap-2 text-sm font-bold text-neutral-900 mb-5">
          {icon && (
            <span className="text-neutral-400" aria-hidden="true">
              {icon}
            </span>
          )}
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

/* ================================================================
   Bio & Education section
   ================================================================ */
function BioSection({ profile }: { profile: DoctorProfile }) {
  return (
    <>
      {/* Biography */}
      <Section title="درباره پزشک" icon={<GraduationCap size={16} />}>
        <p className="text-sm text-neutral-600 leading-8">{profile.fullBio}</p>

        {/* Services */}
        {profile.services.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
              خدمات ارائه‌شده
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.services.map((svc) => (
                <span
                  key={svc}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-full",
                    "border border-neutral-200 text-neutral-700",
                    "bg-neutral-50"
                  )}
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Education timeline */}
      <Section title="تحصیلات و مدارک" icon={<GraduationCap size={16} />}>
        <ol className="relative border-s border-neutral-200 ps-5 flex flex-col gap-5">
          {profile.education.map((entry, i) => (
            <li key={i} className="relative">
              {/* Timeline dot */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -start-[1.18rem] top-1",
                  "w-3 h-3 rounded-full",
                  "bg-brand-500 ring-4 ring-brand-50"
                )}
              />
              <p className="text-sm font-semibold text-neutral-900 leading-tight">
                {entry.degree}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {entry.institution}
                {entry.year ? ` · ${entry.year}` : ""}
              </p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

/* ================================================================
   Clinic Info + Map section
   ================================================================ */
function ClinicSection({ profile }: { profile: DoctorProfile }) {
  const { clinic } = profile;

  return (
    <Section title="آدرس و اطلاعات تماس" icon={<MapPin size={16} />}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info column */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-neutral-400 mb-1">نام مطب / کلینیک</p>
            <p className="text-sm font-semibold text-neutral-800">{clinic.name}</p>
          </div>

          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-neutral-400 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-neutral-700 leading-6">{clinic.address}</p>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={14} className="text-neutral-400 shrink-0" aria-hidden="true" />
            <a
              href={`tel:${clinic.phone}`}
              className="text-sm text-brand-600 hover:underline font-medium tabular-nums"
              dir="ltr"
            >
              {clinic.phone}
            </a>
          </div>

          {/* Working hours */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-neutral-400 shrink-0" aria-hidden="true" />
              <p className="text-xs font-semibold text-neutral-500">ساعات کاری</p>
            </div>
            <div className="rounded-xl border border-neutral-100 overflow-hidden">
              {clinic.workingDays.map((day, i) => (
                <div
                  key={day.day}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 text-xs",
                    i % 2 === 0 ? "bg-neutral-0" : "bg-neutral-50"
                  )}
                >
                  <span className="font-medium text-neutral-700">{day.day}</span>
                  {day.closed ? (
                    <span className="text-neutral-400">تعطیل</span>
                  ) : (
                    <span className="font-medium text-neutral-600 tabular-nums" dir="ltr">
                      {day.open} — {day.close}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map column */}
        <ClinicMap clinic={clinic} height="340px" />
      </div>
    </Section>
  );
}

/* ================================================================
   Patient Reviews section
   ================================================================ */
const VISIT_LABEL_MAP: Record<string, string> = {
  in_person:  "ویزیت حضوری",
  online:     "ویزیت آنلاین",
  home_visit: "ویزیت در منزل",
};

function ReviewCard({ review }: { review: PatientReview }) {
  return (
    <article
      aria-label={`نظر ${review.patientName}`}
      className={cn(
        "flex flex-col gap-3 p-4",
        "rounded-2xl border border-neutral-100 bg-neutral-50"
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Anonymous avatar */}
          <div
            aria-hidden="true"
            className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-500 shrink-0"
          >
            {review.patientName[0]}
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-800">{review.patientName}</p>
            <p className="text-[0.65rem] text-neutral-400">
              {formatPersianDate(review.date)} · {VISIT_LABEL_MAP[review.visitType]}
            </p>
          </div>
        </div>

        {/* Star rating */}
        <div className="flex items-center gap-0.5" aria-label={`${review.rating} ستاره`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={11}
              className={
                i < review.rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-neutral-200 fill-neutral-200"
              }
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-xs text-neutral-600 leading-6">{review.comment}</p>
    </article>
  );
}

function ReviewsSection({ profile }: { profile: DoctorProfile }) {
  if (profile.reviews.length === 0) return null;

  return (
    <Section title="نظرات بیماران" icon={<Star size={16} />}>
      <div className="flex flex-col gap-3">
        {profile.reviews.map((rev) => (
          <ReviewCard key={rev.id} review={rev} />
        ))}
      </div>
    </Section>
  );
}

/* ================================================================
   Skeleton loading state
   ================================================================ */
function ProfileSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="bg-neutral-0 border-b border-neutral-100">
        <div className="container-app py-8 flex items-center gap-5">
          <SkeletonAvatar size="xl" className="!w-20 !h-20 rounded-2xl" />
          <div className="flex-1 flex flex-col gap-3">
            <Skeleton width="w-40" height="h-5" />
            <Skeleton width="w-28" height="h-4" />
            <Skeleton width="w-48" height="h-3" />
            <div className="flex gap-2">
              <Skeleton width="w-16" height="h-6" rounded="full" />
              <Skeleton width="w-16" height="h-6" rounded="full" />
            </div>
          </div>
        </div>
      </div>

      {/* Body skeleton */}
      <div className="container-app py-8 flex flex-col gap-10">
        <SkeletonText lines={4} />
        <SkeletonText lines={3} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonText lines={5} />
          <Skeleton width="w-full" height="h-64" rounded="lg" />
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Not found state
   ================================================================ */
function NotFound() {
  return (
    <div className="container-app py-24 flex flex-col items-center text-center gap-4">
      <p className="text-4xl font-bold text-neutral-200">۴۰۴</p>
      <p className="text-base font-semibold text-neutral-700">پزشک یافت نشد</p>
      <p className="text-sm text-neutral-400 max-w-xs">
        پروفایل پزشک مورد نظر وجود ندارد یا لینک اشتباه است.
      </p>
      <Link
        href={ROUTES.DOCTORS}
        className={cn(
          "inline-flex items-center gap-2 mt-2",
          "text-sm font-medium text-brand-600 hover:text-brand-700",
          "transition-colors duration-150"
        )}
      >
        <ArrowRight size={14} aria-hidden="true" />
        بازگشت به جستجوی پزشکان
      </Link>
    </div>
  );
}

/* ================================================================
   Sticky Booking CTA bar
   ================================================================ */
function StickyBookingBar({ profile }: { profile: DoctorProfile }) {
  const bookHref = ROUTES.BOOKING(profile.id);

  return (
    <>
      {/* Mobile sticky bottom bar */}
      <div
        className={cn(
          "lg:hidden",
          "fixed bottom-0 inset-x-0 z-40",
          "bg-neutral-0/95 backdrop-blur-sm",
          "border-t border-neutral-100",
          "px-4 py-3 safe-area-inset-bottom"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.65rem] text-neutral-400">هزینه ویزیت</p>
            <p className="text-sm font-bold text-neutral-900 tabular-nums">
              {formatCurrency(profile.visitFee)}
            </p>
          </div>

          <Link
            href={bookHref}
            id="mobile-book-btn"
            aria-label={`دریافت نوبت از ${profile.displayName}`}
            className={cn(
              "inline-flex items-center gap-2",
              "h-11 px-6 rounded-xl",
              "bg-brand-600 hover:bg-brand-700",
              "text-sm font-bold text-white",
              "transition-colors duration-150",
              "outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            )}
          >
            <Calendar size={15} aria-hidden="true" />
            دریافت نوبت
          </Link>
        </div>
      </div>

      {/* Spacer so bottom content isn't hidden behind the bar */}
      <div className="lg:hidden h-20" aria-hidden="true" />
    </>
  );
}

/* ================================================================
   Main Client Component
   ================================================================ */
export interface DoctorProfileClientProps {
  slug: string;
}

export function DoctorProfileClient({ slug }: DoctorProfileClientProps) {
  const { data: profile, isLoading, isError } = useQuery({
    queryKey:  [QUERY_KEYS.DOCTOR_PROFILE, slug] as const,
    queryFn:   () => fetchDoctorBySlug(slug),
    staleTime: 60_000,
  });

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !profile) return <NotFound />;

  return (
    <div>
      {/* ── Header ──────────────────────────────────────── */}
      <DoctorProfileHeader profile={profile} />

      {/* ── Main two-column layout ─────────────────────── */}
      <div className="container-app py-2">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">

          {/* ── Left / main content column ─────────────── */}
          <div>
            <BioSection   profile={profile} />
            <ClinicSection profile={profile} />
            <ReviewsSection profile={profile} />
          </div>

          {/* ── Right / sidebar column (desktop) ────────── */}
          <aside
            aria-label="رزرو نوبت"
            className={cn(
              "hidden lg:flex lg:flex-col gap-4",
              "sticky top-[4.5rem]",
              "rounded-2xl border border-neutral-100 bg-neutral-0 p-5"
            )}
          >
            {/* Fee */}
            <div>
              <p className="text-xs text-neutral-400 mb-0.5">هزینه ویزیت</p>
              <p className="text-xl font-bold text-neutral-900 tabular-nums">
                {formatCurrency(profile.visitFee)}
              </p>
            </div>

            {/* Next slot */}
            {profile.nextSlot && (
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-neutral-400 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[0.65rem] text-neutral-400">اولین نوبت خالی</p>
                  <p className="text-sm font-semibold text-emerald-700">
                    {profile.nextSlot}
                  </p>
                </div>
              </div>
            )}

            {/* CTA */}
            <Link
              href={ROUTES.BOOKING(profile.id)}
              id="desktop-book-btn"
              aria-label={`دریافت نوبت از ${profile.displayName}`}
              className={cn(
                "flex items-center justify-center gap-2 w-full",
                "h-11 rounded-xl",
                "bg-brand-600 hover:bg-brand-700",
                "text-sm font-bold text-white",
                "transition-colors duration-150",
                "outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              )}
            >
              <Calendar size={15} aria-hidden="true" />
              دریافت نوبت
            </Link>

            {/* Languages */}
            {profile.languages.length > 0 && (
              <div className="pt-2 border-t border-neutral-100">
                <p className="text-xs text-neutral-400 mb-2">زبان‌های مراجعه</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.languages.map((lang) => (
                    <span
                      key={lang}
                      className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* ── Mobile sticky booking bar ───────────────────── */}
      <StickyBookingBar profile={profile} />
    </div>
  );
}
