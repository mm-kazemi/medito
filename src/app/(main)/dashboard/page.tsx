/**
 * Dashboard Page
 * src/app/(main)/dashboard/page.tsx
 *
 * Doctor overview: stats + recent appointments.
 * Wrapped in DashboardLayout (sidebar + mobile tabs).
 */

import type { Metadata } from "next";
import { DashboardLayout } from "@/features/dashboard/DashboardLayout";
import { StatsOverview } from "@/features/dashboard/StatsOverview";
import { AppointmentsList } from "@/features/dashboard/AppointmentsList";

export const metadata: Metadata = {
  title: "پیشخوان — مدیتو",
  description: "مدیریت نوبت‌ها، بیماران، و تنظیمات مطب",
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Page title */}
        <div>
          <h1 className="text-base font-bold text-neutral-900">پیشخوان</h1>
          <p className="text-xs text-neutral-400 mt-0.5">خوش آمدید، وضعیت امروز خود را مرور کنید.</p>
        </div>

        {/* Stats */}
        <StatsOverview />

        {/* Recent appointments */}
        <AppointmentsList />
      </div>
    </DashboardLayout>
  );
}
