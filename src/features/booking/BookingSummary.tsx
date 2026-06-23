/**
 * BookingSummary — Booking Feature
 * src/features/booking/BookingSummary.tsx
 *
 * Summary card + patient info form (react-hook-form + zod).
 * Calls onConfirm(data) on valid submit.
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Phone, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { Doctor } from "@/types/doctor";

/* ----------------------------------------------------------------
   Zod schema
   ---------------------------------------------------------------- */
const bookingSchema = z.object({
  fullName: z
    .string()
    .min(3, "نام باید حداقل ۳ حرف باشد")
    .max(60, "نام بیش از حد طولانی است"),
  phone: z
    .string()
    .regex(/^(09\d{9}|۰۹[\u06F0-\u06F9]{9})$/, "شماره موبایل معتبر وارد کنید"),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

/* ----------------------------------------------------------------
   Props
   ---------------------------------------------------------------- */
export interface BookingSummaryProps {
  doctor:      Doctor;
  dateLabel:   string;   // e.g. "شنبه ۱۲ آبان"
  timeLabel:   string;   // e.g. "۱۰:۰۰"
  onConfirm:   (data: BookingFormValues) => void;
  isSubmitting: boolean;
}

/* ----------------------------------------------------------------
   Inline field wrapper
   ---------------------------------------------------------------- */
function Field({
  label,
  error,
  children,
}: {
  label:    string;
  error?:   string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-neutral-600">{label}</label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-rose-500">{error}</p>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
   BookingSummary
   ---------------------------------------------------------------- */
export function BookingSummary({
  doctor,
  dateLabel,
  timeLabel,
  onConfirm,
  isSubmitting,
}: BookingSummaryProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onConfirm)}
      noValidate
      className="flex flex-col gap-6"
      id="booking-form"
    >
      {/* ── Appointment summary card ─────────────────────────── */}
      <div className={cn(
        "rounded-2xl border border-neutral-100 bg-neutral-50 p-4",
        "flex flex-col gap-3"
      )}>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
          خلاصه نوبت
        </p>

        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            aria-hidden="true"
            className={cn(
              "w-10 h-10 rounded-xl shrink-0",
              "flex items-center justify-center",
              "text-xs font-bold select-none",
              doctor.avatarColor
            )}
          >
            {doctor.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">{doctor.displayName}</p>
            <p className="text-xs text-neutral-500">{doctor.specialtyLabel}</p>
          </div>
        </div>

        <div className="h-px bg-neutral-200" aria-hidden="true" />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Calendar size={13} className="text-neutral-400 shrink-0" aria-hidden="true" />
            <span>{dateLabel || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Clock size={13} className="text-neutral-400 shrink-0" aria-hidden="true" />
            <span>{timeLabel ? `ساعت ${timeLabel}` : "—"}</span>
          </div>
        </div>

        <div className="h-px bg-neutral-200" aria-hidden="true" />

        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">هزینه ویزیت</span>
          <span className="text-sm font-bold text-neutral-900 tabular-nums">
            {formatCurrency(doctor.visitFee)}
          </span>
        </div>
      </div>

      {/* ── Patient info form ────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
          اطلاعات بیمار
        </p>

        <Field label="نام و نام خانوادگی" error={errors.fullName?.message}>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-neutral-400"
            >
              <User size={14} />
            </span>
            <input
              id="patient-fullname"
              type="text"
              autoComplete="name"
              placeholder="مثال: علی احمدی"
              {...register("fullName")}
              className={cn(
                "w-full h-11 ps-9 pe-3 rounded-xl text-sm",
                "border bg-neutral-0 text-neutral-900",
                "placeholder:text-neutral-400 outline-none",
                "transition-colors duration-150",
                errors.fullName
                  ? "border-rose-300 focus:border-rose-400"
                  : "border-neutral-200 focus:border-brand-500"
              )}
            />
          </div>
        </Field>

        <Field label="شماره موبایل" error={errors.phone?.message}>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-neutral-400"
            >
              <Phone size={14} />
            </span>
            <input
              id="patient-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              dir="ltr"
              {...register("phone")}
              className={cn(
                "w-full h-11 ps-9 pe-3 rounded-xl text-sm",
                "border bg-neutral-0 text-neutral-900",
                "placeholder:text-neutral-400 outline-none",
                "transition-colors duration-150",
                "text-start",
                errors.phone
                  ? "border-rose-300 focus:border-rose-400"
                  : "border-neutral-200 focus:border-brand-500"
              )}
            />
          </div>
        </Field>
      </div>

      {/* ── Desktop submit (inline, hidden on mobile) ────────── */}
      <button
        type="submit"
        form="booking-form"
        id="btn-confirm-booking-desktop"
        disabled={isSubmitting || !dateLabel || !timeLabel}
        aria-label="تأیید و ثبت نوبت"
        className={cn(
          "hidden lg:flex items-center justify-center gap-2",
          "w-full h-12 rounded-xl",
          "text-sm font-bold text-white",
          "transition-colors duration-150 select-none",
          isSubmitting || !dateLabel || !timeLabel
            ? "bg-neutral-300 cursor-not-allowed"
            : "bg-brand-600 hover:bg-brand-700 active:bg-brand-800"
        )}
      >
        {isSubmitting ? "در حال ثبت…" : "تأیید و ثبت نوبت"}
      </button>

      {(!dateLabel || !timeLabel) && (
        <p className="hidden lg:block text-xs text-neutral-400 text-center -mt-3">
          لطفاً تاریخ و ساعت نوبت را انتخاب کنید.
        </p>
      )}
    </form>
  );
}
