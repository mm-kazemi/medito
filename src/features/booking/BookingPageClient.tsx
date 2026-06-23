/**
 * BookingPageClient — Booking Feature
 * src/features/booking/BookingPageClient.tsx
 *
 * "use client" island for the booking flow.
 * Fetches the doctor by id (falls back to slug look-up via profile API).
 * Manages date + time selection state locally.
 *
 * Layout (desktop): left column = date/time pickers, right column = summary
 * Layout (mobile): stacked sections, sticky CTA bottom bar
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toPersianNumerals } from "@/lib/utils";
import { QUERY_KEYS, ROUTES } from "@/constants";
import { fetchDoctorBySlug } from "@/lib/api/doctors";
import { Skeleton, SkeletonText } from "@/components/common/Skeleton";
import { DateSelector, generateUpcomingDays } from "./DateSelector";
import { TimeSlotSelector, generateSlotsForDay } from "./TimeSlotSelector";
import { BookingSummary } from "./BookingSummary";
import type { BookingFormValues } from "./BookingSummary";

/* ----------------------------------------------------------------
   Skeleton
   ---------------------------------------------------------------- */
function BookingSkeleton() {
  return (
    <div className="container-app py-8 flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="flex flex-col gap-6">
        <Skeleton width="w-40" height="h-5" />
        <div className="flex gap-2">
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} width="w-14" height="h-20" rounded="lg" />
          ))}
        </div>
        <SkeletonText lines={3} />
      </div>
      <Skeleton width="w-full" height="h-64" rounded="lg" />
    </div>
  );
}

/* ----------------------------------------------------------------
   BookingPageClient
   ---------------------------------------------------------------- */
export interface BookingPageClientProps {
  /** Doctor ID (from URL param) — used as slug for the mock API */
  doctorId: string;
}

const DAYS = generateUpcomingDays();

export function BookingPageClient({ doctorId }: BookingPageClientProps) {
  const router = useRouter();

  // Fetch doctor profile (slug == id in our mock, or fall back)
  const { data: profile, isLoading, isError } = useQuery({
    queryKey:  [QUERY_KEYS.DOCTOR_PROFILE, doctorId] as const,
    queryFn:   () => fetchDoctorBySlug(doctorId),
    staleTime: 60_000,
  });

  const [selectedDayKey, setSelectedDayKey] = useState<string>("day-0");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [selectedTime,   setSelectedTime]   = useState<string>("");
  const [isSubmitting,   setIsSubmitting]   = useState(false);

  const slots = generateSlotsForDay(selectedDayKey);

  // Build human-readable date label from selected day
  const selectedDay = DAYS.find((d) => d.key === selectedDayKey);
  const dateLabel   = selectedDay
    ? `${selectedDay.dayName} ${selectedDay.dayNum} ${selectedDay.monthName}`
    : "";
  const timeLabel   = selectedTime
    ? toPersianNumerals(selectedTime.replace(/^0/, ""))
    : "";

  const canSubmit = !!selectedSlotId && !isSubmitting;

  const handleConfirm = async (_data: BookingFormValues) => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    // Redirect to a success state (placeholder)
    router.push(`/?booked=1&doctor=${doctorId}`);
  };

  if (isLoading) return <BookingSkeleton />;
  if (isError || !profile) {
    return (
      <div className="container-app py-24 flex flex-col items-center gap-4 text-center">
        <p className="text-4xl font-bold text-neutral-200">۴۰۴</p>
        <p className="text-sm text-neutral-500">پزشک یافت نشد.</p>
        <Link href={ROUTES.DOCTORS} className="text-sm text-brand-600 hover:underline">
          بازگشت به جستجو
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-neutral-50">
      {/* ── Page header bar ──────────────────────────────────── */}
      <div className="bg-neutral-0 border-b border-neutral-100 sticky top-[3.5rem] z-30">
        <div className="container-app h-12 flex items-center gap-3">
          <Link
            href={ROUTES.DOCTOR_PROFILE(doctorId)}
            aria-label="بازگشت به پروفایل پزشک"
            className="text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900 truncate">
              رزرو نوبت — {profile.displayName}
            </p>
          </div>
          <span className="text-xs text-neutral-400 shrink-0">{profile.specialtyLabel}</span>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────── */}
      <div className={cn(
        "container-app py-6 pb-28 lg:pb-10",
        "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start"
      )}>

        {/* ── Left / main column ───────────────────────────── */}
        <div className="flex flex-col gap-8">

          {/* Date picker */}
          <section aria-labelledby="section-date">
            <h2
              id="section-date"
              className="text-sm font-bold text-neutral-900 mb-4 flex items-center gap-2"
            >
              <CalendarCheck size={15} className="text-neutral-400" aria-hidden="true" />
              انتخاب تاریخ
            </h2>
            <DateSelector
              days={DAYS}
              selectedKey={selectedDayKey}
              onSelect={(key) => {
                setSelectedDayKey(key);
                setSelectedSlotId("");
                setSelectedTime("");
              }}
            />
          </section>

          {/* Time slot grid */}
          <section aria-labelledby="section-time">
            <h2
              id="section-time"
              className="text-sm font-bold text-neutral-900 mb-4"
            >
              انتخاب ساعت
            </h2>
            <TimeSlotSelector
              slots={slots}
              selectedId={selectedSlotId}
              onSelect={(id, time) => {
                setSelectedSlotId(id);
                setSelectedTime(time);
              }}
            />
          </section>

          {/* Summary form (mobile: shown inline; desktop: in sidebar) */}
          <div className="lg:hidden">
            <h2 className="text-sm font-bold text-neutral-900 mb-4">اطلاعات بیمار</h2>
            <BookingSummary
              doctor={profile}
              dateLabel={dateLabel}
              timeLabel={timeLabel}
              onConfirm={handleConfirm}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        {/* ── Right / sidebar (desktop only) ──────────────── */}
        <aside
          aria-label="خلاصه نوبت و فرم"
          className={cn(
            "hidden lg:block",
            "sticky top-[6.5rem]",
            "rounded-2xl border border-neutral-100 bg-neutral-0 p-5"
          )}
        >
          <BookingSummary
            doctor={profile}
            dateLabel={dateLabel}
            timeLabel={timeLabel}
            onConfirm={handleConfirm}
            isSubmitting={isSubmitting}
          />
        </aside>
      </div>

      {/* ── Mobile sticky CTA bar ────────────────────────────── */}
      <div
        className={cn(
          "lg:hidden",
          "fixed bottom-0 inset-x-0 z-40",
          "bg-neutral-0/95 backdrop-blur-sm border-t border-neutral-100",
          "px-4 py-3"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Mini summary */}
          <div className="flex-1 min-w-0">
            {selectedSlotId ? (
              <>
                <p className="text-xs text-neutral-400 truncate">{dateLabel}</p>
                <p className="text-sm font-bold text-neutral-900">ساعت {timeLabel}</p>
              </>
            ) : (
              <p className="text-xs text-neutral-400">تاریخ و ساعت را انتخاب کنید</p>
            )}
          </div>

          {/* Submit triggers the booking-form */}
          <button
            type="submit"
            form="booking-form"
            id="btn-confirm-booking-mobile"
            disabled={!canSubmit}
            aria-label="تأیید و ثبت نوبت"
            className={cn(
              "inline-flex items-center gap-2 shrink-0",
              "h-11 px-5 rounded-xl",
              "text-sm font-bold text-white select-none",
              "transition-colors duration-150",
              canSubmit
                ? "bg-brand-600 hover:bg-brand-700 active:bg-brand-800"
                : "bg-neutral-300 cursor-not-allowed"
            )}
          >
            <CalendarCheck size={15} aria-hidden="true" />
            {isSubmitting ? "در حال ثبت…" : "تأیید نوبت"}
          </button>
        </div>
      </div>
    </div>
  );
}
