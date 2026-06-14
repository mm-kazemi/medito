/**
 * Footer — App Shell
 * src/components/layout/Footer.tsx
 *
 * Clean, minimal footer. Server Component — no client hooks needed.
 *
 * Sections:
 *  - Brand column: logo + tagline
 *  - Quick links columns
 *  - Social icons
 *  - Copyright bar
 *
 * RTL notes:
 *  - `me-*` = margin-inline-end (left margin in RTL)
 *  - Text alignment and flex direction are handled by dir="rtl" on <html>
 */


import Link from "next/link";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------
   Data
   ---------------------------------------------------------------- */
const FOOTER_LINKS = [
  {
    heading: "خدمات",
    links: [
      { label: "جستجوی پزشک",   href: "/doctors"    },
      { label: "تخصص‌ها",        href: "/specialties" },
      { label: "بیمارستان‌ها",   href: "/hospitals"   },
      { label: "مشاوره آنلاین",  href: "/consult"     },
    ],
  },
  {
    heading: "دکترتو",
    links: [
      { label: "درباره ما",      href: "/about"   },
      { label: "تماس با ما",     href: "/contact" },
      { label: "بلاگ",           href: "/blog"    },
      { label: "فرصت‌های شغلی",  href: "/careers" },
    ],
  },
  {
    heading: "پشتیبانی",
    links: [
      { label: "حریم خصوصی",    href: "/privacy"  },
      { label: "قوانین و مقررات", href: "/terms"   },
      { label: "سوالات متداول",  href: "/faq"      },
      { label: "راهنمای استفاده", href: "/help"    },
    ],
  },
] as const;

/* Social icon paths — inline SVGs to avoid an extra icon library dep */
const SOCIAL_LINKS = [
  {
    id:    "social-instagram",
    label: "اینستاگرام",
    href:  "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
  {
    id:    "social-twitter",
    label: "توییتر / X",
    href:  "https://twitter.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id:    "social-linkedin",
    label: "لینکدین",
    href:  "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect width="4" height="12" x="2" y="9"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
] as const;

/* ----------------------------------------------------------------
   Component
   ---------------------------------------------------------------- */
export function Footer() {
  const year = "۱۴۰۳";

  return (
    <footer className="shrink-0 border-t border-neutral-100 bg-neutral-50" aria-label="پاورقی">

      {/* ── Main footer grid ──────────────────────────────────── */}
      <div className="container-app py-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              id="footer-logo-link"
              className="flex items-center gap-2 w-fit"
              aria-label="دکترتو — صفحه اصلی"
            >
              <span
                className="w-7 h-7 rounded-md bg-brand-500 flex items-center justify-center text-white text-xs font-bold select-none shrink-0"
                aria-hidden="true"
              >
                د
              </span>
              <span className="text-sm font-bold text-neutral-900 tracking-tight">
                دکترتو
              </span>
            </Link>

            <p className="text-xs text-neutral-500 leading-relaxed max-w-[200px]">
              پلتفرم جامع جستجوی پزشک و رزرو آنلاین نوبت در سراسر ایران.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ id, label, href, icon }) => (
                <a
                  key={id}
                  id={id}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center justify-center",
                    "w-8 h-8 rounded-lg",
                    "text-neutral-400 hover:text-neutral-700",
                    "border border-neutral-200 hover:border-neutral-300",
                    "hover:bg-neutral-0",
                    "transition-colors duration-150"
                  )}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading} className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">
                {heading}
              </h3>
              <ul role="list" className="flex flex-col gap-2">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-xs text-neutral-500 hover:text-brand-600 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* ── Copyright bar ─────────────────────────────────────── */}
      <div className="border-t border-neutral-100">
        <div className="container-app py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-400">
            © {year} دکترتو — تمام حقوق محفوظ است.
          </p>
          <nav aria-label="لینک‌های قانونی" className="flex items-center gap-4">
            {[
              { label: "حریم خصوصی", href: "/privacy" },
              { label: "قوانین",      href: "/terms"   },
              { label: "تماس با ما",  href: "/contact" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

    </footer>
  );
}
