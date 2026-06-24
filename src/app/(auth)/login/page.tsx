/**
 * Login Page
 * src/app/(auth)/login/page.tsx
 */

import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata: Metadata = {
  title:       "ورود به حساب — دکترتو",
  description: "با شماره موبایل و رمز عبور وارد حساب کاربری دکترتو شوید.",
};

export default function LoginPage() {
  return <LoginForm />;
}
