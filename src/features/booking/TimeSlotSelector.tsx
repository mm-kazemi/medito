/**
 * TimeSlotSelector — Booking Feature
 * src/features/booking/TimeSlotSelector.tsx
 *
 * Grid of time-slot pills for the selected date.
 * States: available | selected | booked (disabled).
 */

"use client";

import { cn } from "@/lib/utils";
import { toPersianNumerals } from "@/lib/utils";

/* ----------------------------------------------------------------
   Types
   ---------------------------------------------------------------- */
export interface TimeSlot {
  id:       string;
  time:     string;   // e.g. "09:00"
  isBooked: boolean;
}

/* ----------------------------------------------------------------
   Mock time-slot generator per day key
   ---------------------------------------------------------------- */
const ALL_TIMES = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00",
];

// Deterministic "booked" slots so the UI looks realistic
const BOOKED_PATTERN: Record<string, string[]> = {
  "day-0": ["09:30","10:30","15:00"],
  "day-1": ["09:00","11:00","14:30","16:00"],
  "day-2": ["10:00","12:00","15:30"],
  "day-3": ["09:30","11:30","14:00","17:00"],
  "day-4": ["09:00","10:00","12:30","16:30"],
  "day-5": ["10:30","14:30","15:00"],
};

export function generateSlotsForDay(dayKey: string): TimeSlot[] {
  const booked = BOOKED_PATTERN[dayKey] ?? [];
  return ALL_TIMES.map((t) => ({
    id:       `${dayKey}-${t}`,
    time:     t,
    isBooked: booked.includes(t),
  }));
}

/* ----------------------------------------------------------------
   TimeSlotSelector
   ---------------------------------------------------------------- */
export interface TimeSlotSelectorProps {
  slots:      TimeSlot[];
  selectedId: string;
  onSelect:   (id: string, time: string) => void;
}

function toDisplay(time: string) {
  // "09:30" → "۹:۳۰"
  return toPersianNumerals(time.replace(/^0/, ""));
}

export function TimeSlotSelector({ slots, selectedId, onSelect }: TimeSlotSelectorProps) {
  if (slots.length === 0) {
    return (
      <p className="text-sm text-neutral-400 py-6 text-center">
        نوبتی برای این روز موجود نیست.
      </p>
    );
  }

  const available = slots.filter((s) => !s.isBooked).length;

  return (
    <div>
      <p className="text-xs text-neutral-400 mb-4">
        {toPersianNumerals(available)} نوبت آزاد موجود است
      </p>

      <div
        role="group"
        aria-label="انتخاب ساعت"
        className="grid grid-cols-4 sm:grid-cols-5 gap-2"
      >
        {slots.map((slot) => {
          const isSelected = slot.id === selectedId;

          return (
            <button
              key={slot.id}
              type="button"
              id={`slot-${slot.id}`}
              aria-pressed={isSelected}
              aria-disabled={slot.isBooked}
              disabled={slot.isBooked}
              onClick={() => !slot.isBooked && onSelect(slot.id, slot.time)}
              className={cn(
                "h-10 rounded-xl text-xs font-semibold",
                "transition-all duration-150 select-none",
                slot.isBooked
                  ? "bg-neutral-100 text-neutral-300 cursor-not-allowed line-through"
                  : isSelected
                    ? "bg-brand-600 text-white shadow-sm shadow-brand-200"
                    : "bg-neutral-0 border border-neutral-200 text-neutral-700 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50"
              )}
            >
              {slot.isBooked
                ? <span aria-label="رزرو شده">—</span>
                : toDisplay(slot.time)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
