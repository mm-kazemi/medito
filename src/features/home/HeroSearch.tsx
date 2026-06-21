/**
 * HeroSearch — Home Page Client Island
 * src/features/home/HeroSearch.tsx
 *
 * Controlled search bar wired to Redux searchSlice.
 * Submits to /doctors with correct URL Search Params.
 *
 * Desktop: [🔍 query input] | [📍 searchable city combobox] | [Search button]
 * Mobile:  Large query input + optional collapsible city selector
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setQuery,
  setCity,
  selectSearchQuery,
  selectSearchCity,
} from "@/store/slices/searchSlice";
import { MAJOR_CITIES } from "@/constants";

const POPULAR_SEARCHES = [
  "متخصص قلب",
  "دندان‌پزشک",
  "چشم‌پزشک",
  "اطفال",
  "پوست و مو",
] as const;

/* ----------------------------------------------------------------
   Searchable city combobox — self-contained, minimal
   ---------------------------------------------------------------- */
function CityCombobox({
  value,
  onChange,
  inputClassName,
}: {
  value: string;
  onChange: (id: string) => void;
  inputClassName?: string;
}) {
  const selectedCity = MAJOR_CITIES.find((c) => c.id === value);
  const [inputVal, setInputVal] = useState(selectedCity?.label ?? "");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Sync label when Redux value changes externally */
  useEffect(() => {
    setInputVal(MAJOR_CITIES.find((c) => c.id === value)?.label ?? "");
  }, [value]);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        /* Reset text to selected label if no match */
        setInputVal(MAJOR_CITIES.find((c) => c.id === value)?.label ?? "");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [value]);

  const filtered = MAJOR_CITIES.filter((c) =>
    c.label.includes(inputVal) || inputVal === ""
  );

  const handleSelect = (id: string, label: string) => {
    onChange(id);
    setInputVal(label);
    setOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setInputVal("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-neutral-400"
      >
        <MapPin size={14} />
      </span>
      <input
        id="search-desktop-city"
        type="text"
        value={inputVal}
        placeholder="شهر…"
        autoComplete="off"
        className={cn(
          "w-full h-11 ps-9",
          value ? "pe-7" : "pe-3",
          "text-sm bg-transparent text-neutral-900",
          "placeholder:text-neutral-400 outline-none",
          inputClassName
        )}
        aria-label="شهر"
        aria-expanded={open}
        aria-haspopup="listbox"
        onChange={(e) => {
          setInputVal(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {/* Clear button */}
      {value && (
        <button
          type="button"
          aria-label="پاک کردن شهر"
          onClick={handleClear}
          className="absolute inset-y-0 end-2 flex items-center text-neutral-400 hover:text-neutral-600"
        >
          <X size={12} />
        </button>
      )}
      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <ul
          role="listbox"
          aria-label="انتخاب شهر"
          className={cn(
            "absolute z-50 mt-1 w-full",
            "bg-neutral-0 border border-neutral-200 rounded-xl shadow-md",
            "max-h-52 overflow-y-auto py-1"
          )}
        >
          <li>
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              onClick={() => handleSelect("", "")}
              className={cn(
                "w-full px-4 py-2 text-sm text-start",
                "hover:bg-neutral-50 transition-colors duration-100",
                value === "" ? "text-brand-600 font-medium" : "text-neutral-500"
              )}
            >
              همه شهرها
            </button>
          </li>
          {filtered.map((city) => (
            <li key={city.id}>
              <button
                type="button"
                role="option"
                aria-selected={value === city.id}
                onClick={() => handleSelect(city.id, city.label)}
                className={cn(
                  "w-full px-4 py-2 text-sm text-start",
                  "hover:bg-neutral-50 transition-colors duration-100",
                  value === city.id
                    ? "text-brand-600 font-medium bg-brand-50"
                    : "text-neutral-700"
                )}
              >
                {city.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
   HeroSearch
   ---------------------------------------------------------------- */
export function HeroSearch() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const query    = useAppSelector(selectSearchQuery);
  const city     = useAppSelector(selectSearchCity);

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

        {/* ── Desktop search bar ─────────────────────────────────── */}
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

          {/* City combobox — #2 fix */}
          <div className="relative w-40 shrink-0">
            <CityCombobox
              value={city}
              onChange={(id) => dispatch(setCity(id))}
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
              "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset outline-none"
            )}
          >
            جستجو
          </button>
        </div>

        {/* ── Mobile search bar ──────────────────────────────────── */}
        <div className="sm:hidden flex flex-col gap-2">
          <div className={cn(
            "flex items-center gap-3",
            "bg-neutral-0 border border-neutral-200 rounded-xl",
            "shadow-sm px-4 h-14"
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

          {showCity && (
            <div className={cn(
              "bg-neutral-0 border border-neutral-200 rounded-xl px-1 py-1"
            )}>
              <CityCombobox
                value={city}
                onChange={(id) => { dispatch(setCity(id)); setShowCity(false); }}
                inputClassName="h-12"
              />
            </div>
          )}

          <button
            id="btn-search-hero-mobile"
            type="submit"
            className={cn(
              "w-full h-13 rounded-xl",
              "text-base font-semibold text-white",
              "bg-brand-600 hover:bg-brand-700 active:bg-brand-800",
              "transition-colors duration-150 select-none",
              "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset outline-none"
            )}
          >
            جستجوی پزشک
          </button>
        </div>
      </form>

      {/* ── Popular searches ───────────────────────────────────── */}
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
