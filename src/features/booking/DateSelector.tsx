/**
 * DateSelector — Booking Feature
 * src/features/booking/DateSelector.tsx
 *
 * Horizontal scrollable strip of the next 10 days.
 * Displays mock Jalali day-name + date.
 * Highlights selected day; disabled days show no slots.
 */

"use client";

import { cn } from "@/lib/utils";
import { toPersianNumerals } from "@/lib/utils";

/* ----------------------------------------------------------------
   Mock Jalali dates for the next 10 days starting from today.
   In production: replace with a real Jalali library (e.g. jalaali-js).
   ---------------------------------------------------------------- */
const JALALI_DAYS = [
  "شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه",
] as const;

const JALALI_MONTHS = [
  "فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور",
  "مهر","آبان","آذر","دی","بهمن","اسفند",
] as const;

export interface DateItem {
  key:          string;
  dayName:      string;
  dayNum:       string;  // Persian numeral
  monthName:    string;
  hasSlots:     boolean;
}

/** Generates a mock list of 10 upcoming days from a fixed base date */
export function generateUpcomingDays(): DateItem[] {
  // Base: 1 Aban 1403 (roughly today in demo context)
  const BASE_DAY_INDEX = 0; // شنبه
  const BASE_DAY_NUM   = 12;
  const BASE_MONTH_IDX = 7; // آبان

  return Array.from({ length: 10 }, (_, i) => {
    const dayNum     = BASE_DAY_NUM + i;
    const monthIdx   = BASE_MONTH_IDX + (dayNum > 30 ? 1 : 0);
    const adjustedDay = dayNum > 30 ? dayNum - 30 : dayNum;
    const dayNameIdx  = (BASE_DAY_INDEX + i) % 7;
    const dayName     = JALALI_DAYS[dayNameIdx]!;
    // جمعه has no slots (mock closed day)
    const hasSlots    = dayName !== "جمعه";

    return {
      key:       `day-${i}`,
      dayName,
      dayNum:    toPersianNumerals(adjustedDay),
      monthName: JALALI_MONTHS[monthIdx % 12]!,
      hasSlots,
    };
  });
}

export interface DateSelectorProps {
  days:        DateItem[];
  selectedKey: string;
  onSelect:    (key: string) => void;
}

export function DateSelector({ days, selectedKey, onSelect }: DateSelectorProps) {
  return (
    <div
      role="group"
      aria-label="انتخاب تاریخ"
      className={cn(
        "flex gap-2 overflow-x-auto pb-2",
        "scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      )}
    >
      {days.map((day) => {
        const isSelected = day.key === selectedKey;
        const isDisabled = !day.hasSlots;

        return (
          <button
            key={day.key}
            type="button"
            id={`date-${day.key}`}
            aria-pressed={isSelected}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => !isDisabled && onSelect(day.key)}
            className={cn(
              "flex flex-col items-center gap-1 shrink-0",
              "w-14 py-3 rounded-2xl",
              "text-center select-none",
              "transition-all duration-150",
              isSelected
                ? "bg-brand-600 text-white shadow-sm shadow-brand-200"
                : isDisabled
                  ? "bg-neutral-50 text-neutral-300 cursor-not-allowed"
                  : "bg-neutral-0 border border-neutral-100 text-neutral-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            )}
          >
            <span className="text-[0.65rem] font-medium leading-none">{day.dayName}</span>
            <span className={cn(
              "text-lg font-bold leading-tight tabular-nums",
              isSelected ? "text-white" : isDisabled ? "text-neutral-300" : "text-neutral-900"
            )}>
              {day.dayNum}
            </span>
            <span className={cn(
              "text-[0.55rem] leading-none",
              isSelected ? "text-brand-100" : "text-neutral-400"
            )}>
              {day.monthName}
            </span>
            {isDisabled && (
              <span className="text-[0.5rem] text-neutral-300 leading-none">تعطیل</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
