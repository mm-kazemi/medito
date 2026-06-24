/**
 * PatientDashboardClient — Patient Feature
 * src/features/patient/PatientDashboardClient.tsx
 *
 * Desktop: sticky sidebar (right) + content area (left).
 * Mobile:  sticky horizontal scrollable tab bar + content below.
 */

"use client";

import { useState } from "react";
import { Calendar, UserCheck, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppointmentsList } from "./AppointmentsList";
import { MyDoctors }        from "./MyDoctors";
import { AccountSettings }  from "./AccountSettings";
import { MOCK_PATIENT_PROFILE } from "@/lib/api/patient";

/* ----------------------------------------------------------------
   Nav config
   ---------------------------------------------------------------- */
type TabId = "appointments" | "doctors" | "settings";

const NAV_ITEMS: { id: TabId; label: string; Icon: typeof Calendar }[] = [
  { id: "appointments", label: "نوبت‌های من",    Icon: Calendar  },
  { id: "doctors",      label: "پزشکان من",     Icon: UserCheck },
  { id: "settings",     label: "تنظیمات حساب",  Icon: Settings  },
];

const TAB_CONTENT: Record<TabId, React.ReactNode> = {
  appointments: <AppointmentsList />,
  doctors:      <MyDoctors />,
  settings:     <AccountSettings />,
};

/* ----------------------------------------------------------------
   PatientDashboardClient
   ---------------------------------------------------------------- */
export function PatientDashboardClient() {
  const [activeTab, setActiveTab] = useState<TabId>("appointments");

  return (
    <div className="container-app py-6 lg:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">

        {/* ── Desktop sidebar ─────────────────────────────────── */}
        <aside
          aria-label="منوی داشبورد بیمار"
          className={cn(
            "hidden lg:flex lg:flex-col gap-2",
            "sticky top-[4.5rem]",
            "rounded-2xl border border-neutral-100 bg-neutral-0",
            "overflow-hidden p-3"
          )}
        >
          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <User size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-900 truncate">
                {MOCK_PATIENT_PROFILE.fullName}
              </p>
              <p className="text-xs text-neutral-400 truncate">
                {MOCK_PATIENT_PROFILE.phone}
              </p>
            </div>
          </div>

          <div className="h-px bg-neutral-100 mx-1 mb-1" aria-hidden="true" />

          {/* Nav links */}
          <nav>
            <ul className="flex flex-col gap-0.5">
              {NAV_ITEMS.map(({ id, label, Icon }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(id)}
                    aria-current={activeTab === id ? "page" : undefined}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl",
                      "text-sm font-medium transition-colors duration-150",
                      "outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                      activeTab === id
                        ? "bg-brand-50 text-brand-700"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    )}
                  >
                    <Icon size={15} aria-hidden="true" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* ── Main content ──────────────────────────────────────── */}
        <div className="flex flex-col gap-0 min-w-0">

          {/* Mobile sticky tabs */}
          <div
            className={cn(
              "lg:hidden sticky top-[3.75rem] z-10",
              "bg-neutral-0/95 backdrop-blur-sm",
              "-mx-4 px-4 pb-3 mb-4",
              "border-b border-neutral-100"
            )}
          >
            <div
              role="tablist"
              aria-label="بخش‌های داشبورد"
              className="flex gap-1 overflow-x-auto scrollbar-hide py-2"
            >
              {NAV_ITEMS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap",
                    "h-8 px-3.5 rounded-xl shrink-0",
                    "text-xs font-medium transition-colors duration-150",
                    "outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                    activeTab === id
                      ? "bg-brand-600 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  )}
                >
                  <Icon size={12} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div>{TAB_CONTENT[activeTab]}</div>
        </div>

      </div>
    </div>
  );
}
