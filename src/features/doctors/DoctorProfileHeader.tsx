/**
 * DoctorProfileHeader — Doctors Feature
 * src/features/doctors/DoctorProfileHeader.tsx
 *
 * Large avatar hero section at the top of the doctor profile page.
 *
 * Displays:
 *   - Avatar (large, 80×80) with initials fallback
 *   - Full name + Medical council number (شماره نظام پزشکی)
 *   - Specialty + years of experience badge
 *   - Aggregated star rating + review count
 *   - Visit type chips (حضوری / آنلاین / ویزیت در منزل)
 *   - Availability indicator
 *
 * Design: Subtle gradient hero band, clean divider below.
 */

import { Star, Award, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toPersianNumerals } from "@/lib/utils";
import type { DoctorProfile } from "@/types/doctor";

/* ----------------------------------------------------------------
   Constants
   ---------------------------------------------------------------- */
const VISIT_LABELS: Record<string, string> = {
  in_person:  "حضوری",
  online:     "آنلاین",
  home_visit: "ویزیت در منزل",
};

/* ----------------------------------------------------------------
   Avatar
   ---------------------------------------------------------------- */
function LargeAvatar({ profile }: { profile: DoctorProfile }) {
  if (profile.photoUrl) {
    return (
      <img
        src={profile.photoUrl}
        alt={profile.displayName}
        className="w-20 h-20 rounded-2xl object-cover shrink-0 ring-4 ring-white shadow-md"
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={cn(
        "w-20 h-20 rounded-2xl shrink-0",
        "flex items-center justify-center",
        "text-xl font-bold select-none",
        "ring-4 ring-white shadow-md",
        profile.avatarColor
      )}
    >
      {profile.initials}
    </div>
  );
}

/* ----------------------------------------------------------------
   Star row helper
   ---------------------------------------------------------------- */
function StarRow({ rating, count }: { rating: number; count: number }) {
  const fullStars  = Math.floor(rating);
  const hasHalf    = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-2">
      {/* Star icons */}
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => {
          const filled =
            i < fullStars || (i === fullStars && hasHalf);
          return (
            <Star
              key={i}
              size={14}
              className={cn(
                filled
                  ? "text-amber-400 fill-amber-400"
                  : "text-neutral-200 fill-neutral-200"
              )}
            />
          );
        })}
      </div>

      <span
        aria-label={`امتیاز ${rating} از ۵`}
        className="text-sm font-bold text-neutral-800 tabular-nums"
      >
        {toPersianNumerals(rating.toFixed(1))}
      </span>
      <span className="text-xs text-neutral-400 tabular-nums">
        ({toPersianNumerals(count)} نظر بیمار)
      </span>
    </div>
  );
}

/* ----------------------------------------------------------------
   DoctorProfileHeader
   ---------------------------------------------------------------- */
export interface DoctorProfileHeaderProps {
  profile: DoctorProfile;
}

export function DoctorProfileHeader({ profile }: DoctorProfileHeaderProps) {
  return (
    <header className="bg-neutral-0 border-b border-neutral-100">
      {/* Hero band */}
      <div
        className={cn(
          "container-app py-8",
          "flex flex-col sm:flex-row items-start sm:items-center gap-5"
        )}
      >
        {/* Avatar */}
        <LargeAvatar profile={profile} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name + council */}
          <div className="flex items-start gap-3 flex-wrap mb-1">
            <h1 className="text-xl font-bold text-neutral-900 leading-tight">
              {profile.displayName}
            </h1>
            <span
              title="شماره نظام پزشکی"
              className={cn(
                "inline-flex items-center gap-1",
                "text-xs font-medium text-neutral-500",
                "bg-neutral-100 px-2 py-0.5 rounded-full mt-0.5"
              )}
            >
              <Award size={11} aria-hidden="true" />
              نظام {profile.councilNumber}
            </span>
          </div>

          {/* Specialty + exp */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-sm text-brand-600 font-semibold">
              {profile.specialtyLabel}
            </span>
            <span aria-hidden="true" className="text-neutral-200">·</span>
            <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
              <Clock size={11} aria-hidden="true" />
              {toPersianNumerals(profile.yearsExp)} سال سابقه
            </span>
          </div>

          {/* Rating */}
          <StarRow rating={profile.rating} count={profile.reviewCount} />

          {/* Visit types + availability */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {profile.visitTypes.map((type) => (
              <span
                key={type}
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full",
                  "border border-neutral-200 text-neutral-600"
                )}
              >
                {VISIT_LABELS[type]}
              </span>
            ))}

            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full",
                profile.isAvailable
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-neutral-100 text-neutral-500"
              )}
            >
              {profile.isAvailable ? (
                <CheckCircle2 size={11} aria-hidden="true" />
              ) : (
                <XCircle size={11} aria-hidden="true" />
              )}
              {profile.isAvailable ? "نوبت خالی موجود" : "ظرفیت محدود"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
