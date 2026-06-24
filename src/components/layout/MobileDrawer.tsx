/**
 * MobileDrawer — App Shell
 * src/components/layout/MobileDrawer.tsx
 *
 * A slide-in navigation panel from the inline-start side (right in RTL).
 * Controlled by Redux uiSlice: isMobileDrawerOpen / closeMobileDrawer.
 *
 * Accessibility:
 *  - role="dialog" + aria-modal="true" on the panel
 *  - aria-label for screen readers
 *  - Focus lock: when open, a transparent overlay covers the rest of the page
 *  - ESC key closes the drawer
 *  - Backdrop click closes the drawer
 *
 * RTL notes:
 *  - Panel slides in from the RIGHT (inline-start in RTL)
 *    → translate-x uses positive values for RTL
 *  - `inset-y-0 start-0` positions the panel at the right edge in RTL
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { closeMobileDrawer, selectIsMobileDrawerOpen } from "@/store/slices/uiSlice";
import { selectIsAuthenticated, selectCurrentUser }    from "@/store/slices/authSlice";

/* ----------------------------------------------------------------
   Navigation items — must match Header.tsx
   ---------------------------------------------------------------- */
const NAV_LINKS = [
  { href: "/doctors",    label: "پزشکان",        icon: "🩺" },
  { href: "/specialties", label: "تخصص‌ها",      icon: "🏷️" },
  { href: "/hospitals",  label: "بیمارستان‌ها",  icon: "🏥" },
  { href: "/about",      label: "درباره ما",      icon: "ℹ️" },
] as const;

/* ----------------------------------------------------------------
   Component
   ---------------------------------------------------------------- */
export function MobileDrawer() {
  const dispatch        = useAppDispatch();
  const isOpen          = useAppSelector(selectIsMobileDrawerOpen);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user            = useAppSelector(selectCurrentUser);
  const pathname        = usePathname();

  /* Close on ESC */
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeMobileDrawer());
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, dispatch]);

  /* Prevent body scroll when open */
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* Close drawer whenever the route changes */
  React.useEffect(() => {
    dispatch(closeMobileDrawer());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const close = () => dispatch(closeMobileDrawer());

  return (
    <>
      {/* ── Backdrop ────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm",
          "transition-opacity duration-200",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* ── Drawer Panel ────────────────────────────────────────── */}
      {/*
          RTL: panel slides in from the RIGHT (inline-start = right).
          We anchor it at start-0 (right:0 in RTL) and translate it off-screen
          to the right (+translate-x) when closed.
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="منوی ناوبری"
        id="mobile-nav-drawer"
        className={cn(
          "fixed inset-y-0 start-0 z-50",
          "w-72 max-w-[85vw]",
          "flex flex-col bg-neutral-0",
          "shadow-lg",
          "transition-transform duration-250 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="مدیتو — صفحه اصلی"
          >
            <span
              className="w-7 h-7 rounded-md bg-brand-500 flex items-center justify-center text-white text-xs font-bold select-none"
              aria-hidden="true"
            >
              د
            </span>
            <span className="text-sm font-bold text-neutral-900 tracking-tight">
              مدیتو
            </span>
          </Link>

          <button
            type="button"
            id="btn-close-mobile-drawer"
            aria-label="بستن منو"
            onClick={close}
            className={cn(
              "flex items-center justify-center",
              "w-8 h-8 rounded-lg",
              "text-neutral-400 hover:text-neutral-700",
              "hover:bg-neutral-100",
              "transition-colors duration-150",
              "outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            )}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Nav links — scrollable */}
        <nav
          aria-label="ناوبری موبایل"
          className="flex-1 overflow-y-auto overscroll-contain py-3 px-3"
        >
          <ul role="list" className="flex flex-col gap-0.5">
            {NAV_LINKS.map(({ href, label, icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    id={`mobile-nav-${href.replace("/", "")}`}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between gap-3",
                      "px-3 py-2.5 rounded-lg",
                      "text-sm font-medium",
                      "transition-colors duration-150",
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-base leading-none" aria-hidden="true">
                        {icon}
                      </span>
                      {label}
                    </span>
                    <ChevronLeft
                      size={14}
                      className="text-neutral-300 shrink-0"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Auth section — pinned to bottom */}
        <div className="shrink-0 border-t border-neutral-100 p-4 flex flex-col gap-2">
          {isAuthenticated && user ? (
            /* Logged-in */
            <Link
              href="/dashboard"
              id="mobile-btn-dashboard"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                "text-sm font-medium text-neutral-700",
                "hover:bg-neutral-100 transition-colors duration-150"
              )}
            >
              <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold shrink-0">
                {user.name.charAt(0)}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-neutral-900 truncate">
                  {user.name}
                </span>
                <span className="text-xs text-neutral-400">مشاهده پروفایل</span>
              </div>
            </Link>
          ) : (
            /* Guest */
            <>
              <Link
                href="/register"
                id="mobile-btn-register"
                className={cn(
                  "flex items-center justify-center",
                  "h-10 rounded-lg",
                  "text-sm font-semibold text-white",
                  "bg-brand-600 hover:bg-brand-700",
                  "transition-colors duration-150 select-none"
                )}
              >
                ثبت‌نام رایگان
              </Link>
              <Link
                href="/login"
                id="mobile-btn-login"
                className={cn(
                  "flex items-center justify-center",
                  "h-10 rounded-lg",
                  "text-sm font-medium text-neutral-600",
                  "border border-neutral-200",
                  "hover:bg-neutral-50 hover:border-neutral-300",
                  "transition-colors duration-150 select-none"
                )}
              >
                ورود به حساب
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
