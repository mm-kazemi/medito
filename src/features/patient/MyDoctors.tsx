/**
 * MyDoctors — Patient Feature
 * src/features/patient/MyDoctors.tsx
 *
 * Favorite / saved doctors list.
 */

"use client";

import Link from "next/link";
import { Star, MapPin, Heart } from "lucide-react";
import { cn, toPersianNumerals } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/Button";
import { MOCK_FAVORITE_DOCTORS } from "@/lib/api/patient";
import type { FavoriteDoctor } from "@/types/patient";

/* ----------------------------------------------------------------
   FavoriteDoctorCard
   ---------------------------------------------------------------- */
function FavoriteDoctorCard({ doctor }: { doctor: FavoriteDoctor }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4",
        "rounded-2xl border border-neutral-100 bg-neutral-0",
        "transition-all duration-150 hover:border-neutral-200 hover:shadow-sm"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl shrink-0",
          "flex items-center justify-center",
          "text-sm font-bold select-none",
          doctor.avatarColor
        )}
        aria-hidden="true"
      >
        {doctor.initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900 leading-snug truncate">
          {doctor.displayName}
        </p>
        <p className="text-xs text-neutral-500 mt-0.5">{doctor.specialtyLabel}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
            <MapPin size={10} aria-hidden="true" />
            {doctor.cityLabel}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-neutral-600">
            <Star size={10} className="text-amber-400 fill-amber-400" aria-hidden="true" />
            <span className="font-semibold tabular-nums">
              {toPersianNumerals(doctor.rating.toFixed(1))}
            </span>
          </span>
        </div>
      </div>

      {/* CTA */}
      <Link href={ROUTES.BOOKING(doctor.slug)}>
        <Button variant="outline" size="sm">
          رزرو نوبت
        </Button>
      </Link>
    </div>
  );
}

/* ----------------------------------------------------------------
   MyDoctors
   ---------------------------------------------------------------- */
export function MyDoctors() {
  if (MOCK_FAVORITE_DOCTORS.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-neutral-200 rounded-2xl">
        <Heart size={28} className="text-neutral-200" aria-hidden="true" />
        <p className="text-sm text-neutral-400">هنوز پزشکی ذخیره نکرده‌اید.</p>
        <Link href={ROUTES.DOCTORS}>
          <Button variant="outline" size="sm">جستجوی پزشک</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-sm font-semibold text-neutral-800">پزشکان ذخیره‌شده</h2>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 tabular-nums">
          {toPersianNumerals(MOCK_FAVORITE_DOCTORS.length)}
        </span>
      </div>
      <ul className="flex flex-col gap-3">
        {MOCK_FAVORITE_DOCTORS.map((doc) => (
          <li key={doc.id}>
            <FavoriteDoctorCard doctor={doc} />
          </li>
        ))}
      </ul>
    </div>
  );
}
