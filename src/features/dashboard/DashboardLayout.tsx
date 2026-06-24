/**
 * DashboardLayout — Dashboard Feature
 * src/features/dashboard/DashboardLayout.tsx
 *
 * Desktop: fixed sidebar with nav links.
 * Mobile: horizontal scrollable tab bar pinned below main header.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";

const NAV_ITEMS = [
  { href: ROUTES.DASHBOARD,    label: "پیشخوان",         icon: LayoutDashboard },
  { href: ROUTES.APPOINTMENTS, label: "نوبت‌های من",     icon: CalendarDays },
  { href: ROUTES.SCHEDULE,     label: "تنظیمات مطب",    icon: Settings },
] as const;

/* ----------------------------------------------------------------
   NavLink
   ---------------------------------------------------------------- */
function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href:   string;
  label:  string;
  icon:   React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2.5",
        "text-sm font-medium transition-colors duration-150",
        active
          ? "bg-brand-50 text-brand-700"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
      )}
    >
      <Icon size={16} aria-hidden="true" className="shrink-0" />
      {label}
    </Link>
  );
}

/* ----------------------------------------------------------------
   DashboardLayout
   ---------------------------------------------------------------- */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-neutral-50">
      {/* ── Mobile tab bar ───────────────────────────────────── */}
      <nav
        aria-label="منوی داشبورد"
        className={cn(
          "lg:hidden sticky top-[3.5rem] z-20",
          "bg-neutral-0 border-b border-neutral-100",
          "flex overflow-x-auto gap-1 px-4 py-2",
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        )}
      >
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              "text-xs font-medium transition-colors duration-150 whitespace-nowrap",
              pathname === href
                ? "bg-brand-600 text-white"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* ── Main layout ──────────────────────────────────────── */}
      <div className="container-app py-6 flex gap-6 items-start">
        {/* ── Desktop sidebar ─────────────────────────────── */}
        <aside
          aria-label="منوی داشبورد"
          className={cn(
            "hidden lg:flex flex-col gap-1",
            "w-52 shrink-0 sticky top-[5.5rem]",
            "rounded-2xl border border-neutral-100 bg-neutral-0 p-3"
          )}
        >
          {NAV_ITEMS.map(({ href, label, icon }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={icon}
              active={pathname === href}
            />
          ))}
        </aside>

        {/* ── Page content ────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
