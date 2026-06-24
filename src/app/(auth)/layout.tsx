/**
 * Auth Layout — App Shell
 * src/app/(auth)/layout.tsx
 *
 * Centered card layout for login/register pages.
 * No header/footer — clean, distraction-free.
 */

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { APP_NAME, ROUTES } from "@/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      {/* Top bar — logo + back link */}
      <header className="shrink-0 h-14 flex items-center px-6">
        <Link
          href={ROUTES.HOME}
          aria-label="بازگشت به صفحه اصلی"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:text-brand-600 transition-colors duration-150"
        >
          <ArrowRight size={16} aria-hidden="true" />
          {APP_NAME}
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </main>

      {/* Minimal footer note */}
      <footer className="shrink-0 py-4 text-center">
        <p className="text-xs text-neutral-400">
          © {new Date().getFullYear()} {APP_NAME}. تمامی حقوق محفوظ است.
        </p>
      </footer>
    </div>
  );
}
