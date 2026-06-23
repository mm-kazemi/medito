/**
 * Booking Feature — Barrel Export
 * Phase 9: Persian calendar, time-slot selection, appointment confirmation
 */

export { DateSelector, generateUpcomingDays }   from "./DateSelector";
export type { DateItem, DateSelectorProps }      from "./DateSelector";

export { TimeSlotSelector, generateSlotsForDay } from "./TimeSlotSelector";
export type { TimeSlot, TimeSlotSelectorProps }  from "./TimeSlotSelector";

export { BookingSummary }                        from "./BookingSummary";
export type { BookingFormValues, BookingSummaryProps } from "./BookingSummary";

export { BookingPageClient }                     from "./BookingPageClient";
export type { BookingPageClientProps }           from "./BookingPageClient";
