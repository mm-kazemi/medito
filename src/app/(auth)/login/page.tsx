/**
 * Login Page
 * src/app/(auth)/login/page.tsx
 */

import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata: Metadata = {
  title:       "ورود به حساب — مدیتو",
  description: "با شماره موبایل و رمز عبور وارد حساب کاربری مدیتو شوید.",
};

export default function LoginPage() {
  return <LoginForm />;
}
