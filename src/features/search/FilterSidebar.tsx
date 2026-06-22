/**
 * FilterSidebar — Search Feature
 * src/features/search/FilterSidebar.tsx
 *
 * All filter controls wired to Redux searchSlice.
 * Designed to work in TWO contexts:
 *   1. Desktop: rendered inline in the sidebar column
 *   2. Mobile:  rendered inside FilterBottomSheet
 *
 * Props:
 *   onClose? — called by the "اعمال فیلترها" button in mobile context
 *
 * RTL notes:
 *   - ms-*, me-*  → margin-inline-start / end
 *   - ps-*, pe-*  → padding-inline-start / end
 *   - start-*     → inset-inline-start (right side in RTL)
 */

"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setCity,
  setSpecialty,
  setFilters,
  resetFilters,
  selectSearchFilters,
} from "@/store/slices/searchSlice";
import { SPECIALTIES, MAJOR_CITIES } from "@/constants";
import type { SpecialtyId } from "@/constants";
import { cn } from "@/lib/utils";
import { RotateCcw, Check } from "lucide-react";

/* ----------------------------------------------------------------
   Rating options
   ---------------------------------------------------------------- */
const RATING_OPTIONS = [
  { value: 0,   label: "همه" },
  { value: 3,   label: "۳ ستاره و بالاتر" },
  { value: 4,   label: "۴ ستاره و بالاتر" },
  { value: 4.5, label: "۴.۵ ستاره و بالاتر" },
] as const;

const VISIT_TYPE_OPTIONS = [
  { value: "in_person",   label: "حضوری"         },
  { value: "online",      label: "آنلاین"         },
  { value: "home_visit",  label: "ویزیت در منزل"  },
] as const;

/* ----------------------------------------------------------------
   Sub-components
   ---------------------------------------------------------------- */

/** Section heading with a divider */
function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------
   FilterSidebar
   ---------------------------------------------------------------- */
export interface FilterSidebarProps {
  /** Called when the user taps "اعمال فیلترها" (mobile context) */
  onClose?: () => void;
}

export function FilterSidebar({ onClose }: FilterSidebarProps) {
  const dispatch = useAppDispatch();
  const filters  = useAppSelector(selectSearchFilters);

  /* Count active filters (excluding empty/default values) */
  const activeCount = [
    filters.city        !== "",
    filters.specialty   !== "",
    filters.minRating   > 0,
    filters.isAvailable,
    filters.visitType   !== "",
  ].filter(Boolean).length;

  /* Toggle a specialty pill */
  const toggleSpecialty = (id: SpecialtyId) => {
    dispatch(setSpecialty(filters.specialty === id ? "" : id));
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Scrollable filter body ─────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-5 flex flex-col items-stretch gap-6">

        {/* ── City ─────────────────────────────────────────────── */}
        <FilterSection title="شهر">
          <div className="relative">
            <select
              id="filter-city"
              value={filters.city}
              onChange={(e) => dispatch(setCity(e.target.value))}
              className={cn(
                "w-full h-10 ps-3 pe-8 rounded-lg appearance-none",
                "text-sm text-neutral-900 bg-neutral-0",
                "border border-neutral-200",
                "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15",
                "outline-none transition-colors duration-150",
                "cursor-pointer"
              )}
              aria-label="فیلتر بر اساس شهر"
            >
              <option value="">همه شهرها</option>
              {MAJOR_CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.label}
                </option>
              ))}
            </select>
            {/* Chevron icon — positioned at inline-end */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-neutral-400"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </FilterSection>

        {/* Divider */}
        <div className="h-px bg-neutral-100" aria-hidden="true" />

        {/* ── Specialties ───────────────────────────────────────── */}
        <FilterSection title="تخصص پزشکی">
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="انتخاب تخصص"
          >
            {SPECIALTIES.map((spec) => {
              const isActive = filters.specialty === spec.id;
              return (
                <button
                  key={spec.id}
                  type="button"
                  id={`filter-specialty-${spec.id}`}
                  onClick={() => toggleSpecialty(spec.id as SpecialtyId)}
                  aria-pressed={isActive}
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full",
                    "text-xs font-medium",
                    "border transition-colors duration-150 select-none",
                    isActive
                      ? "bg-brand-500 text-white border-brand-500"
                      : "bg-neutral-0 text-neutral-600 border-neutral-200 hover:border-brand-300 hover:text-brand-600"
                  )}
                >
                  <span aria-hidden="true">{spec.icon}</span>
                  {spec.label}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Divider */}
        <div className="h-px bg-neutral-100" aria-hidden="true" />

        {/* ── Rating ────────────────────────────────────────────── */}
        <FilterSection title="حداقل امتیاز">
          <div
            className="flex flex-col gap-2"
            role="radiogroup"
            aria-label="حداقل امتیاز"
          >
            {RATING_OPTIONS.map((opt) => {
              const isSelected = filters.minRating === opt.value;
              return (
                <label
                  key={opt.value}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer",
                    "border transition-colors duration-150 select-none",
                    isSelected
                      ? "border-brand-300 bg-brand-50"
                      : "border-neutral-200 bg-neutral-0 hover:border-neutral-300"
                  )}
                >
                  <input
                    type="radio"
                    name="min-rating"
                    id={`filter-rating-${opt.value}`}
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => dispatch(setFilters({ minRating: opt.value }))}
                    className="sr-only"
                  />
                  {/* Custom radio indicator */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                      isSelected
                        ? "border-brand-500 bg-brand-500"
                        : "border-neutral-300 bg-neutral-0"
                    )}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      isSelected ? "text-brand-700 font-medium" : "text-neutral-700"
                    )}
                  >
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
        </FilterSection>

        {/* Divider */}
        <div className="h-px bg-neutral-100" aria-hidden="true" />

        {/* ── Visit Type ────────────────────────────────────────── */}
        <FilterSection title="نوع ویزیت">
          <div
            className="flex flex-col gap-2"
            role="group"
            aria-label="نوع ویزیت"
          >
            {VISIT_TYPE_OPTIONS.map((opt) => {
              const isSelected = filters.visitType === opt.value;
              return (
                <label
                  key={opt.value}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer",
                    "border transition-colors duration-150 select-none",
                    isSelected
                      ? "border-brand-300 bg-brand-50"
                      : "border-neutral-200 bg-neutral-0 hover:border-neutral-300"
                  )}
                >
                  <input
                    type="checkbox"
                    id={`filter-visit-${opt.value}`}
                    checked={isSelected}
                    onChange={() =>
                      dispatch(
                        setFilters({
                          visitType: isSelected ? "" : (opt.value as typeof filters.visitType),
                        })
                      )
                    }
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors duration-150",
                      isSelected
                        ? "border-brand-500 bg-brand-500"
                        : "border-neutral-300 bg-neutral-0"
                    )}
                  >
                    {isSelected && (
                      <Check size={10} className="text-white" strokeWidth={3} />
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      isSelected ? "text-brand-700 font-medium" : "text-neutral-700"
                    )}
                  >
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
        </FilterSection>

        {/* Divider */}
        <div className="h-px bg-neutral-100" aria-hidden="true" />

        {/* ── Availability toggle ───────────────────────────────── */}
        <FilterSection title="دسترسی">
          <label
            htmlFor="filter-availability"
            className={cn(
              "flex items-center justify-between gap-3 px-3 py-3 rounded-lg cursor-pointer",
              "border transition-colors duration-150 select-none",
              filters.isAvailable
                ? "border-brand-300 bg-brand-50"
                : "border-neutral-200 bg-neutral-0 hover:border-neutral-300"
            )}
          >
            <span
              className={cn(
                "text-sm",
                filters.isAvailable ? "text-brand-700 font-medium" : "text-neutral-700"
              )}
            >
              فقط نوبت‌های آزاد
            </span>
            {/* Toggle switch */}
            <span aria-hidden="true" className="shrink-0">
              <input
                type="checkbox"
                id="filter-availability"
                checked={filters.isAvailable}
                onChange={(e) =>
                  dispatch(setFilters({ isAvailable: e.target.checked }))
                }
                className="sr-only"
              />
              <span
                className={cn(
                  "relative inline-block w-10 h-[22px] rounded-full transition-colors duration-200 shrink-0",
                  filters.isAvailable
                    ? "bg-brand-500"
                    : "bg-neutral-200"
                )}
              >
                <span
                  className={cn(
                    "absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm",
                    "transition-[inset-inline-start] duration-200 ease-in-out",
                    filters.isAvailable ? "start-[20px]" : "start-[3px]"
                  )}
                />
              </span>
            </span>
          </label>
        </FilterSection>

      </div>

      {/* ── Footer: Reset + Apply ──────────────────────────────── */}
      <div className="shrink-0 border-t border-neutral-100 px-4 py-4 flex items-center gap-3">
        {/* Reset button */}
        <button
          type="button"
          id="btn-reset-filters"
          onClick={() => dispatch(resetFilters())}
          disabled={activeCount === 0}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg",
            "text-sm font-medium",
            "border border-neutral-200",
            "transition-colors duration-150 select-none",
            activeCount > 0
              ? "text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300"
              : "text-neutral-300 cursor-not-allowed"
          )}
        >
          <RotateCcw size={13} aria-hidden="true" />
          حذف فیلترها
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-500 text-white text-xs font-bold">
              {activeCount}
            </span>
          )}
        </button>

        {/* Apply button (mobile context only — onClose present) */}
        {onClose && (
          <button
            type="button"
            id="btn-apply-filters"
            onClick={onClose}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5",
              "h-10 rounded-lg",
              "text-sm font-semibold text-white",
              "bg-brand-600 hover:bg-brand-700",
              "transition-colors duration-150 select-none",
              "outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            )}
          >
            اعمال فیلترها
          </button>
        )}
      </div>
    </div>
  );
}
