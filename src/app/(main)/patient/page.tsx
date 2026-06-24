/**
 * Patient Dashboard Page
 * src/app/(main)/patient/page.tsx
 */

import type { Metadata } from "next";
import { PatientDashboardClient } from "@/features/patient/PatientDashboardClient";

export const metadata: Metadata = {
  title: "داشبورد بیمار — مدیتو",
  description: "مدیریت نوبت‌ها، پزشکان ذخیره‌شده و تنظیمات حساب",
};

export default function PatientPage() {
  return <PatientDashboardClient />;
}
