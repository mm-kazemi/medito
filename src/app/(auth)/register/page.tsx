/**
 * Register Page
 * src/app/(auth)/register/page.tsx
 */

import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/RegisterForm";

export const metadata: Metadata = {
  title:       "ثبت‌نام — دکترتو",
  description: "حساب بیمار یا پزشک در پلتفرم دکترتو ایجاد کنید.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
