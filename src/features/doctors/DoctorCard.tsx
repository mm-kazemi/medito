/**
 * DoctorCard — Doctors Feature
 * src/features/doctors/DoctorCard.tsx
 *
 * Minimalist premium card for a single doctor result.
 *
 * Layout (RTL):
 *   [Avatar]  [Name / Specialty / Meta]  [Book button]
 *
 * States:
 *   - Normal: clean white card with neutral border
 *   - Hover:  subtle shadow elevation + border tightens
 *   - Available / Unavailable: badge shown below next slot
 *
 * Design tokens used:
 *   bg-neutral-0, border-neutral-100, text-neutral-*
 *   brand-500 (CTA), rose-* (rating star)
 *
 * Accessibility:
 *   - article element with aria-label = doctor name
 *   - Book button has descriptive aria-label
 */

"use client";

import Link from "next/link";
import { Star, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, toPersianNumerals } from "@/lib/utils";
import type { Doctor } from "@/types/doctor";
import { ROUTES } from "@/constants";

/* ----------------------------------------------------------------
   Avatar component
   ---------------------------------------------------------------- */
function DoctorAvatar({ doctor }: { doctor: Doctor }) {
  if (doctor.photoUrl) {
    return (
      <img
        src={doctor.photoUrl}
        alt={doctor.displayName}
        className="w-16 h-16 rounded-2xl object-cover shrink-0"
        loading="lazy"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "w-16 h-16 rounded-2xl shrink-0",
        "flex items-center justify-center",
        "text-base font-bold select-none",
        doctor.avatarColor
      )}
    >
      {doctor.initials}
    </div>
  );
}

/* ----------------------------------------------------------------
   Star rating display
   ---------------------------------------------------------------- */
function RatingBadge({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <Star
        size={12}
        className="text-amber-400 fill-amber-400 shrink-0"
        aria-hidden="true"
      />
      <span className="text-xs font-semibold text-neutral-700 tabular-nums">
        {toPersianNumerals(rating.toFixed(1))}
      </span>
      <span className="text-xs text-neutral-400 tabular-nums">
        ({toPersianNumerals(count)} نظر)
      </span>
    </span>
  );
}

/* ----------------------------------------------------------------
   Visit type pills
   ---------------------------------------------------------------- */
const VISIT_TYPE_LABELS: Record<string, string> = {
  in_person:  "حضوری",
  online:     "آنلاین",
  home_visit: "ویزیت در منزل",
};

/* ----------------------------------------------------------------
   DoctorCard
   ---------------------------------------------------------------- */
export interface DoctorCardProps {
  doctor: Doctor;
  className?: string;
}

export function DoctorCard({ doctor, className }: DoctorCardProps) {
  const profileHref = ROUTES.DOCTOR_PROFILE(doctor.slug);

  return (
    <Link
      href={profileHref}
      aria-label={`مشاهده پروفایل ${doctor.displayName}`}
      className={cn(
        "group relative flex flex-col sm:flex-row gap-3 p-4 sm:p-5",
        "rounded-2xl border border-neutral-100 bg-neutral-0",
        "transition-all duration-200",
        "hover:shadow-md hover:shadow-neutral-200/70",
        "hover:border-neutral-200 hover:-translate-y-0.5",
        className
      )}
    >
      {/* ── Avatar + Info row (mobile: side by side) ────────────── */}
      <div className="flex flex-row sm:contents gap-3">
        <span className="shrink-0" aria-hidden="true">
          <DoctorAvatar doctor={doctor} />
        </span>

        {/* ── Info ──────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">

        {/* Row 1: Name + availability badge */}
        <div className="flex items-start justify-between gap-2">
          <span className={cn(
            "font-bold text-neutral-900 text-sm leading-tight",
          )}>
            {doctor.displayName}
          </span>

          {/* Availability badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 shrink-0",
              "text-[0.65rem] font-medium px-2 py-0.5 rounded-full",
              doctor.isAvailable
                ? "bg-emerald-50 text-emerald-700"
                : "bg-neutral-100 text-neutral-500"
            )}
          >
            {doctor.isAvailable ? (
              <CheckCircle2 size={10} aria-hidden="true" />
            ) : (
              <XCircle size={10} aria-hidden="true" />
            )}
            {doctor.isAvailable ? "نوبت خالی" : "ظرفیت محدود"}
          </span>
        </div>

        {/* Row 2: Specialty + rating */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-neutral-500 font-medium">
            {doctor.specialtyLabel}
          </span>
          <span aria-hidden="true" className="text-neutral-200">·</span>
          <RatingBadge rating={doctor.rating} count={doctor.reviewCount} />
        </div>

        {/* Row 3: City + next slot */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
            <MapPin size={11} aria-hidden="true" />
            {doctor.cityLabel}
          </span>
          {doctor.nextSlot && (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
              <Clock size={11} aria-hidden="true" />
              {doctor.nextSlot}
            </span>
          )}
        </div>

        {/* Row 4: Visit types */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {doctor.visitTypes.map((type) => (
            <span
              key={type}
              className={cn(
                "text-[0.65rem] font-medium px-2 py-0.5 rounded-full",
                "border border-neutral-200 text-neutral-500"
              )}
            >
              {VISIT_TYPE_LABELS[type]}
            </span>
          ))}
        </div>

        </div>{/* end info */}
      </div>{/* end mobile flex row */}

      {/* ── CTA column ───────────────────────────────────────────── */}
      <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center shrink-0 sm:border-s sm:border-neutral-100 sm:ps-4 pt-1 sm:pt-0 border-t border-neutral-100 sm:border-t-0">

        {/* Visit fee */}
        <div className="text-start sm:text-center mb-0 sm:mb-2">
          <p className="text-[0.65rem] text-neutral-400 mb-0.5">ویزیت</p>
          <p className="text-sm font-bold text-neutral-800 tabular-nums">
            {formatCurrency(doctor.visitFee)}
          </p>
        </div>

        {/* Book appointment button */}
        <Link
          href={ROUTES.BOOKING(doctor.id)}
          id={`book-btn-${doctor.id}`}
          aria-label={`رزرو نوبت ${doctor.displayName}`}
          className={cn(
            "inline-flex items-center justify-center",
            "h-9 px-4 rounded-xl",
            "text-xs font-semibold text-white",
            "bg-brand-600 hover:bg-brand-700",
            "transition-colors duration-150 select-none whitespace-nowrap",
            "outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          )}
        >
          رزرو نوبت
        </Link>
      </div>
    </Link>
  );
}
