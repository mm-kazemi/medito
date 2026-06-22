/**
 * DoctorCard — Doctors Feature
 * src/features/doctors/DoctorCard.tsx
 *
 * Whole card is a <Link>. Mobile: avatar + info side-by-side, CTA below
 * behind a hairline divider. Desktop: single flex-row with CTA column.
 */

"use client";

import Link from "next/link";
import { Star, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, toPersianNumerals } from "@/lib/utils";
import type { Doctor } from "@/types/doctor";
import { ROUTES } from "@/constants";

/* ----------------------------------------------------------------
   Avatar
   ---------------------------------------------------------------- */
function DoctorAvatar({ doctor }: { doctor: Doctor }) {
  if (doctor.photoUrl) {
    return (
      <img
        src={doctor.photoUrl}
        alt={doctor.displayName}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0"
        loading="lazy"
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={cn(
        "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shrink-0",
        "flex items-center justify-center",
        "text-sm font-bold select-none",
        doctor.avatarColor
      )}
    >
      {doctor.initials}
    </div>
  );
}

/* ----------------------------------------------------------------
   Rating badge — nowrap prevents flexbox wrapping issues
   ---------------------------------------------------------------- */
function RatingBadge({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap shrink-0">
      <Star size={11} className="text-amber-400 fill-amber-400" aria-hidden="true" />
      <span className="text-xs font-semibold text-neutral-700 tabular-nums">
        {toPersianNumerals(rating.toFixed(1))}
      </span>
      <span className="text-xs text-neutral-400 tabular-nums">
        ({toPersianNumerals(count)} نظر)
      </span>
    </span>
  );
}

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
        "group flex flex-col gap-3 p-4",
        "sm:flex-row sm:gap-4 sm:p-5",
        "rounded-2xl border border-neutral-100 bg-neutral-0",
        "transition-all duration-200",
        "hover:shadow-md hover:shadow-neutral-200/60 hover:border-neutral-200 hover:-translate-y-0.5",
        className
      )}
    >
      {/* ── Top: Avatar + Info ──────────────────────────────────── */}
      <div className="flex gap-3 min-w-0">
        {/* Avatar */}
        <span className="shrink-0" aria-hidden="true">
          <DoctorAvatar doctor={doctor} />
        </span>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">

          {/* Row 1: Name + availability badge */}
          <div className="flex items-start justify-between gap-2">
            <span className="font-semibold text-neutral-900 text-sm leading-snug">
              {doctor.displayName}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 shrink-0",
                "text-[0.625rem] font-medium px-1.5 py-0.5 rounded-full",
                doctor.isAvailable
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-neutral-100 text-neutral-500"
              )}
            >
              {doctor.isAvailable
                ? <CheckCircle2 size={9} aria-hidden="true" />
                : <XCircle size={9} aria-hidden="true" />}
              {doctor.isAvailable ? "نوبت خالی" : "ظرفیت محدود"}
            </span>
          </div>

          {/* Row 2: Specialty · Rating — nowrap keeps them on one line */}
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs text-neutral-500 font-medium truncate">
              {doctor.specialtyLabel}
            </span>
            <span aria-hidden="true" className="text-neutral-300 shrink-0">·</span>
            <RatingBadge rating={doctor.rating} count={doctor.reviewCount} />
          </div>

          {/* Row 3: City + slot */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
              <MapPin size={10} aria-hidden="true" />
              {doctor.cityLabel}
            </span>
            {doctor.nextSlot && (
              <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
                <Clock size={10} aria-hidden="true" />
                {doctor.nextSlot}
              </span>
            )}
          </div>

          {/* Row 4: Visit type pills */}
          <div className="flex items-center gap-1 flex-wrap">
            {doctor.visitTypes.map((type) => (
              <span
                key={type}
                className="text-[0.6rem] font-medium px-1.5 py-0.5 rounded-full border border-neutral-200 text-neutral-500"
              >
                {VISIT_TYPE_LABELS[type]}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* ── Bottom / Side: CTA ─────────────────────────────────── */}
      <div className={cn(
        "flex items-center justify-between gap-3",
        "pt-2.5 border-t border-neutral-100",
        "sm:flex-col sm:items-center sm:justify-center",
        "sm:border-t-0 sm:border-s sm:border-neutral-100",
        "sm:ps-4 sm:pt-0 sm:shrink-0"
      )}>
        {/* Visit fee */}
        <div className="sm:text-center">
          <p className="text-[0.625rem] text-neutral-400">ویزیت</p>
          <p className="text-sm font-bold text-neutral-800 tabular-nums">
            {formatCurrency(doctor.visitFee)}
          </p>
        </div>

        {/* Book button */}
        <Link
          href={ROUTES.BOOKING(doctor.id)}
          id={`book-btn-${doctor.id}`}
          aria-label={`رزرو نوبت ${doctor.displayName}`}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "inline-flex items-center justify-center shrink-0",
            "h-8 sm:h-9 px-3 sm:px-4 rounded-xl",
            "text-xs font-semibold text-white whitespace-nowrap",
            "bg-brand-600 hover:bg-brand-700",
            "transition-colors duration-150 select-none"
          )}
        >
          رزرو نوبت
        </Link>
      </div>
    </Link>
  );
}
