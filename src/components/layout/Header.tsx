/**
 * Header — App Shell
 * src/components/layout/Header.tsx
 *
 * Desktop layout (RTL — right is the "start"):
 *   [Logo]    [Nav links — center]    [ورود  |  ثبت‌نام]
 *
 * Mobile layout:
 *   [Logo]                            [☰ hamburger]
 *
 * RTL notes:
 *   - `ms-*` = margin-inline-start   (= margin-right in RTL)
 *   - `me-*` = margin-inline-end     (= margin-left  in RTL)
 *   - `ps-*` = padding-inline-start  (= padding-right in RTL)
 *   - `pe-*` = padding-inline-end    (= padding-left  in RTL)
 *   - `start-*` / `end-*`            → CSS `inset-inline-*`
 *
 * Active link detection uses usePathname (Client hook).
 * Redux dispatch uses useAppDispatch / openMobileDrawer.
 */

"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { openMobileDrawer }      from "@/store/slices/uiSlice";
import { selectIsAuthenticated, selectCurrentUser } from "@/store/slices/authSlice";

/* ----------------------------------------------------------------
   Navigation items
   ---------------------------------------------------------------- */
const NAV_LINKS = [
  { href: "/doctors", label: "پزشکان"       },
  { href: "/doctors", label: "تخصص‌ها"      },
  { href: "/",        label: "بیمارستان‌ها"  },
  { href: "/",        label: "درباره ما"     },
] as const;

/* ----------------------------------------------------------------
   NavLink — single nav item with active state
   ---------------------------------------------------------------- */
function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "text-xs font-medium transition-colors duration-150",
        "px-2 py-1 rounded-md",
        isActive
          ? "text-brand-600 bg-brand-50"
          : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

/* ----------------------------------------------------------------
   Header
   ---------------------------------------------------------------- */
export function Header() {
  const dispatch        = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user            = useAppSelector(selectCurrentUser);

  return (
    <header
      className={cn(
        "shrink-0 h-14 bg-neutral-0",
        "border-b border-neutral-100",
        "sticky top-0 z-40",
        /* Subtle shadow only on scroll — achieved with a CSS class */
        "shadow-xs"
      )}
    >
      <div className="container-app h-full flex items-center justify-between gap-4">

        {/* ── Logo (inline-start = right in RTL) ─────────────────── */}
        <Link
          href="/"
          id="logo-link"
          className="flex items-center gap-2 shrink-0"
          aria-label="مدیتو — صفحه اصلی"
        >
          <span
            className={cn(
              "w-7 h-7 rounded-md bg-brand-500",
              "flex items-center justify-center",
              "text-white text-xs font-bold shrink-0",
              "select-none"
            )}
            aria-hidden="true"
          >
            د
          </span>
          <span className="text-sm font-bold text-neutral-900 tracking-tight">
            مدیتو
          </span>
        </Link>

        {/* ── Desktop Nav (center) ────────────────────────────────── */}
        <nav
          aria-label="ناوبری اصلی"
          className="hidden md:flex items-center gap-1 flex-1 justify-center"
        >
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* ── Desktop Auth (inline-end = left in RTL) ─────────────── */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {isAuthenticated && user ? (
            /* Logged-in: show user's name */
            <Link
              href="/dashboard"
              id="btn-dashboard-header"
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                "text-xs font-medium text-neutral-700",
                "hover:bg-neutral-100 transition-colors duration-150"
              )}
            >
              <span
                className={cn(
                  "w-6 h-6 rounded-full bg-brand-100 text-brand-700",
                  "flex items-center justify-center text-xs font-bold shrink-0"
                )}
              >
                {user.name.charAt(0)}
              </span>
              {user.name}
            </Link>
          ) : (
            /* Guest: Login + Register */
            <>
              <Link
                href="/login"
                id="btn-login-header"
                className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-md",
                  "text-xs font-medium text-neutral-600",
                  "hover:text-neutral-900 hover:bg-neutral-100",
                  "transition-colors duration-150"
                )}
              >
                ورود
              </Link>

              <Link
                href="/register"
                id="btn-register-header"
                className={cn(
                  "inline-flex items-center justify-center",
                  "h-8 px-3 rounded-md",
                  "text-xs font-medium text-white",
                  "bg-brand-600 hover:bg-brand-700",
                  "transition-colors duration-150 select-none"
                )}
              >
                ثبت‌نام رایگان
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Hamburger ────────────────────────────────────── */}
        <button
          type="button"
          id="btn-mobile-menu"
          aria-label="باز کردن منو"
          aria-haspopup="dialog"
          onClick={() => dispatch(openMobileDrawer())}
          className={cn(
            "md:hidden",
            "flex items-center justify-center",
            "w-9 h-9 rounded-lg shrink-0",
            "text-neutral-500 hover:text-neutral-900",
            "hover:bg-neutral-100",
            "transition-colors duration-150",
            "outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          )}
        >
          <Menu size={18} aria-hidden="true" />
        </button>

      </div>
    </header>
  );
}
