/**
 * HeroSearch — Home Page Client Island
 * src/features/home/HeroSearch.tsx
 *
 * Controlled search bar wired to Redux searchSlice.
 * Adapts between Desktop and Mobile layouts:
 *
 *   Desktop: [🔍 Name/Specialty input] | [📍 City input] | [Search button]
 *            — all in one horizontal pill
 *
 *   Mobile:  A single large touch-optimised input ("پزشک یا تخصص…")
 *            with a full-width search button below.
 *            City input is hidden behind an optional expand toggle.
 *
 * On submit: navigates to /doctors with query params.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setQuery,
  setCity,
  selectSearchQuery,
  selectSearchCity,
} from "@/store/slices/searchSlice";

const POPULAR_SEARCHES = [
  "متخصص قلب",
  "دندان‌پزشک",
  "چشم‌پزشک",
  "اطفال",
  "پوست و مو",
] as const;

export function HeroSearch() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const query    = useAppSelector(selectSearchQuery);
  const city     = useAppSelector(selectSearchCity);

  /* Mobile: show/hide city field */
  const [showCity, setShowCity] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q",    query.trim());
    if (city.trim())  params.set("city", city.trim());
    router.push(`/doctors${params.size ? `?${params}` : ""}`);
  };

  const handlePopularSearch = (term: string) => {
    dispatch(setQuery(term));
    router.push(`/doctors?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} noValidate>

        {/* ── Desktop search bar — hidden on mobile ──────────────── */}
        <div className={cn(
          "hidden sm:flex items-center",
          "bg-neutral-0 border border-neutral-200 rounded-xl",
          "shadow-sm p-1.5 gap-0"
        )}>
          {/* Query input */}
          <div className="relative flex-1">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-neutral-400"
            >
              <Search size={16} />
            </span>
            <input
              id="search-desktop-query"
              type="search"
              value={query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
              placeholder="نام پزشک، تخصص یا بیماری…"
              autoComplete="off"
              className={cn(
                "w-full h-11 ps-10 pe-3",
                "text-sm bg-transparent text-neutral-900",
                "placeholder:text-neutral-400",
                "outline-none"
              )}
              aria-label="جستجوی پزشک"
            />
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-neutral-200 shrink-0" aria-hidden="true" />

          {/* City input */}
          <div className="relative w-36 shrink-0">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-neutral-400"
            >
              <MapPin size={14} />
            </span>
            <input
              id="search-desktop-city"
              type="text"
              value={city}
              onChange={(e) => dispatch(setCity(e.target.value))}
              placeholder="شهر…"
              autoComplete="off"
              className={cn(
                "w-full h-11 ps-9 pe-3",
                "text-sm bg-transparent text-neutral-900",
                "placeholder:text-neutral-400",
                "outline-none"
              )}
              aria-label="شهر"
            />
          </div>

          {/* Search button */}
          <button
            id="btn-search-hero-desktop"
            type="submit"
            className={cn(
              "h-11 px-6 rounded-lg shrink-0",
              "text-sm font-semibold text-white",
              "bg-brand-600 hover:bg-brand-700",
              "transition-colors duration-150 select-none",
              "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 outline-none"
            )}
          >
            جستجو
          </button>
        </div>

        {/* ── Mobile search bar — shown only on mobile ──────────── */}
        <div className="sm:hidden flex flex-col gap-2">
          {/* Primary query input — large touch target */}
          <div className={cn(
            "flex items-center gap-3",
            "bg-neutral-0 border border-neutral-200 rounded-xl",
            "shadow-sm px-4",
            "h-14"
          )}>
            <Search size={18} className="text-neutral-400 shrink-0" aria-hidden="true" />
            <input
              id="search-mobile-query"
              type="search"
              value={query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
              placeholder="پزشک یا تخصص…"
              autoComplete="off"
              className={cn(
                "flex-1 h-full",
                "text-base bg-transparent text-neutral-900",
                "placeholder:text-neutral-400",
                "outline-none"
              )}
              aria-label="جستجوی پزشک"
            />
            {/* Optional city expand toggle */}
            <button
              type="button"
              onClick={() => setShowCity((v) => !v)}
              aria-expanded={showCity}
              aria-label={showCity ? "پنهان کردن شهر" : "انتخاب شهر"}
              className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 rounded-md"
            >
              <MapPin size={16} aria-hidden="true" />
              {showCity
                ? <ChevronUp size={12} className="mx-auto mt-0.5" aria-hidden="true" />
                : <ChevronDown size={12} className="mx-auto mt-0.5" aria-hidden="true" />
              }
            </button>
          </div>

          {/* City input — collapsible */}
          {showCity && (
            <div className={cn(
              "flex items-center gap-3",
              "bg-neutral-0 border border-neutral-200 rounded-xl",
              "px-4 h-12"
            )}>
              <MapPin size={16} className="text-neutral-400 shrink-0" aria-hidden="true" />
              <input
                id="search-mobile-city"
                type="text"
                value={city}
                onChange={(e) => dispatch(setCity(e.target.value))}
                placeholder="نام شهر…"
                autoComplete="off"
                className="flex-1 h-full text-sm bg-transparent text-neutral-900 placeholder:text-neutral-400 outline-none"
                aria-label="شهر"
              />
            </div>
          )}

          {/* Search button — full width, large touch target */}
          <button
            id="btn-search-hero-mobile"
            type="submit"
            className={cn(
              "w-full h-13 rounded-xl",
              "text-base font-semibold text-white",
              "bg-brand-600 hover:bg-brand-700 active:bg-brand-800",
              "transition-colors duration-150 select-none",
              "focus-visible:ring-2 focus-visible:ring-brand-500 outline-none"
            )}
          >
            جستجوی پزشک
          </button>
        </div>
      </form>

      {/* ── Popular searches ──────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-2 mt-4 justify-center"
        aria-label="جستجوهای محبوب"
      >
        <span className="text-xs text-neutral-400 shrink-0">جستجوهای محبوب:</span>
        {POPULAR_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => handlePopularSearch(term)}
            className={cn(
              "text-xs text-neutral-600 hover:text-brand-600",
              "px-2.5 py-1 rounded-full",
              "border border-neutral-200 hover:border-brand-200",
              "bg-neutral-0 hover:bg-brand-50",
              "transition-colors duration-150",
              "select-none"
            )}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
