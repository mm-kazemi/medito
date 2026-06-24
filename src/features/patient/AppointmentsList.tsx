/**
 * AppointmentsList — Patient Feature
 * src/features/patient/AppointmentsList.tsx
 *
 * Divides mock appointments into Upcoming and Past sections.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar, Clock, MapPin, Video, Home,
  CheckCircle2, XCircle, AlertCircle, ClipboardCheck,
} from "lucide-react";
import { cn, formatCurrency, toPersianNumerals } from "@/lib/utils";
import { ROUTES, APPOINTMENT_STATUS_LABELS } from "@/constants";
import { Button } from "@/components/ui/Button";
import { MOCK_APPOINTMENTS } from "@/lib/api/patient";
import type { PatientAppointment, AppointmentStatus } from "@/types/patient";

/* ----------------------------------------------------------------
   Constants
   ---------------------------------------------------------------- */
const TODAY = "2026-06-25";

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  confirmed: { label: APPOINTMENT_STATUS_LABELS["confirmed"] ?? "تأیید شده",        cls: "bg-emerald-50 text-emerald-700", Icon: CheckCircle2   },
  pending:   { label: APPOINTMENT_STATUS_LABELS["pending"]   ?? "در انتظار تأیید",  cls: "bg-amber-50  text-amber-700",   Icon: AlertCircle    },
  completed: { label: APPOINTMENT_STATUS_LABELS["completed"] ?? "انجام شده",        cls: "bg-sky-50    text-sky-700",     Icon: ClipboardCheck },
  cancelled: { label: APPOINTMENT_STATUS_LABELS["cancelled"] ?? "لغو شده",          cls: "bg-rose-50   text-rose-600",    Icon: XCircle        },
};

const VISIT_ICON: Record<string, typeof Video> = {
  online:     Video,
  home_visit: Home,
  in_person:  MapPin,
};

const VISIT_LABEL: Record<string, string> = {
  in_person:  "حضوری",
  online:     "آنلاین",
  home_visit: "ویزیت در منزل",
};

/* ----------------------------------------------------------------
   AppointmentCard
   ---------------------------------------------------------------- */
function AppointmentCard({
  apt,
  onCancel,
}: {
  apt: PatientAppointment;
  onCancel?: (id: string) => void;
}) {
  const cfg     = STATUS_CONFIG[apt.status];
  const VisitIc = VISIT_ICON[apt.visitType] ?? MapPin;
  const canCancel = onCancel && (apt.status === "confirmed" || apt.status === "pending");

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-4 sm:p-5",
        "rounded-2xl border border-neutral-100 bg-neutral-0",
        apt.status === "cancelled" && "opacity-60"
      )}
    >
      {/* ── Top row: avatar + doctor info + status ───────────── */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={cn(
            "w-11 h-11 rounded-xl shrink-0",
            "flex items-center justify-center",
            "text-xs font-bold select-none",
            apt.doctorAvatarColor
          )}
          aria-hidden="true"
        >
          {apt.doctorInitials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={ROUTES.DOCTOR_PROFILE(apt.doctorSlug)}
              className="text-sm font-semibold text-neutral-900 hover:text-brand-600 transition-colors leading-snug"
            >
              {apt.doctorName}
            </Link>
            {/* Status badge */}
            <span
              className={cn(
                "inline-flex items-center gap-1 shrink-0",
                "text-[0.625rem] font-medium px-2 py-0.5 rounded-full",
                cfg.cls
              )}
            >
              <cfg.Icon size={9} aria-hidden="true" />
              {cfg.label}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">{apt.doctorSpecialty}</p>
        </div>
      </div>

      {/* ── Meta row: date · time · visit type ───────────────── */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
          <Calendar size={12} aria-hidden="true" />
          {apt.dateLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
          <Clock size={12} aria-hidden="true" />
          ساعت {apt.time}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
          <VisitIc size={12} aria-hidden="true" />
          {VISIT_LABEL[apt.visitType]}
        </span>
        {apt.clinicName && (
          <span className="text-xs text-neutral-400 truncate">{apt.clinicName}</span>
        )}
      </div>

      {/* ── Bottom row: fee + cancel ──────────────────────────── */}
      {canCancel && (
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <p className="text-xs text-neutral-400">
            ویزیت:{" "}
            <span className="font-semibold text-neutral-700 tabular-nums">
              {formatCurrency(apt.visitFee)}
            </span>
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel(apt.id)}
            className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
          >
            لغو نوبت
          </Button>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
   Section header
   ---------------------------------------------------------------- */
function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-sm font-semibold text-neutral-800">{title}</h2>
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 tabular-nums">
        {toPersianNumerals(count)}
      </span>
    </div>
  );
}

/* ----------------------------------------------------------------
   AppointmentsList
   ---------------------------------------------------------------- */
export function AppointmentsList() {
  const [cancelledIds, setCancelledIds] = useState<Set<string>>(new Set());

  const appointments = MOCK_APPOINTMENTS.map((a) =>
    cancelledIds.has(a.id) ? { ...a, status: "cancelled" as const } : a
  );

  const upcoming = appointments.filter(
    (a) => a.date >= TODAY && a.status !== "cancelled"
  );
  const past = appointments.filter(
    (a) => a.date < TODAY || a.status === "cancelled"
  );

  const handleCancel = (id: string) =>
    setCancelledIds((prev) => new Set(prev).add(id));

  return (
    <div className="flex flex-col gap-8">
      {/* Upcoming */}
      <div>
        <SectionHeader title="نوبت‌های پیش‌رو" count={upcoming.length} />
        {upcoming.length === 0 ? (
          <p className="text-sm text-neutral-400 py-6 text-center border border-dashed border-neutral-200 rounded-2xl">
            نوبت آینده‌ای ندارید.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {upcoming.map((apt) => (
              <li key={apt.id}>
                <AppointmentCard apt={apt} onCancel={handleCancel} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Past */}
      <div>
        <SectionHeader title="نوبت‌های گذشته" count={past.length} />
        {past.length === 0 ? (
          <p className="text-sm text-neutral-400 py-6 text-center border border-dashed border-neutral-200 rounded-2xl">
            سابقه‌ای ثبت نشده است.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {past.map((apt) => (
              <li key={apt.id}>
                <AppointmentCard apt={apt} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
