/**
 * AppointmentsList — Dashboard Feature
 * src/features/dashboard/AppointmentsList.tsx
 *
 * Minimalist list of recent appointments with status badges.
 */

import { cn } from "@/lib/utils";
import { toPersianNumerals } from "@/lib/utils";

/* ----------------------------------------------------------------
   Types & mock data
   ---------------------------------------------------------------- */
type ApptStatus = "confirmed" | "pending" | "cancelled" | "completed";

interface Appointment {
  id:          string;
  patientName: string;
  date:        string;   // Persian label
  time:        string;   // HH:MM
  status:      ApptStatus;
  visitType:   "حضوری" | "آنلاین";
}

const MOCK_APPTS: Appointment[] = [
  { id: "a1", patientName: "علی احمدی",       date: "شنبه ۱۲ آبان",      time: "09:00", status: "confirmed",  visitType: "حضوری" },
  { id: "a2", patientName: "فاطمه محمدی",     date: "شنبه ۱۲ آبان",      time: "09:30", status: "confirmed",  visitType: "آنلاین" },
  { id: "a3", patientName: "محمد حسینی",      date: "شنبه ۱۲ آبان",      time: "10:00", status: "pending",    visitType: "حضوری" },
  { id: "a4", patientName: "زهرا کریمی",      date: "یکشنبه ۱۳ آبان",   time: "11:00", status: "confirmed",  visitType: "حضوری" },
  { id: "a5", patientName: "رضا موسوی",       date: "یکشنبه ۱۳ آبان",   time: "14:30", status: "cancelled",  visitType: "آنلاین" },
  { id: "a6", patientName: "مریم رضایی",      date: "دوشنبه ۱۴ آبان",   time: "10:30", status: "completed",  visitType: "حضوری" },
];

const STATUS_CONFIG: Record<ApptStatus, { label: string; className: string }> = {
  confirmed:  { label: "تأیید شده",   className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending:    { label: "در انتظار",   className: "bg-amber-50 text-amber-700 border-amber-200" },
  cancelled:  { label: "لغو شده",     className: "bg-neutral-100 text-neutral-500 border-neutral-200" },
  completed:  { label: "انجام شده",   className: "bg-brand-50 text-brand-700 border-brand-200" },
};

/* ----------------------------------------------------------------
   AppointmentsList
   ---------------------------------------------------------------- */
export function AppointmentsList() {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-neutral-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-neutral-900">آخرین نوبت‌ها</h2>
        <span className="text-xs text-neutral-400">
          {toPersianNumerals(MOCK_APPTS.length)} نوبت
        </span>
      </div>

      {/* List */}
      <ul role="list" className="divide-y divide-neutral-50">
        {MOCK_APPTS.map((appt) => {
          const { label, className } = STATUS_CONFIG[appt.status];
          return (
            <li
              key={appt.id}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-neutral-50 transition-colors duration-100"
            >
              {/* Patient initial */}
              <div
                aria-hidden="true"
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-500 shrink-0"
              >
                {appt.patientName[0]}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  {appt.patientName}
                </p>
                <p className="text-[0.65rem] text-neutral-400">
                  {appt.date} · ساعت {toPersianNumerals(appt.time.replace(/^0/, ""))} · {appt.visitType}
                </p>
              </div>

              {/* Status badge */}
              <span
                className={cn(
                  "shrink-0 text-[0.6rem] font-semibold px-2 py-0.5 rounded-full border",
                  className
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
