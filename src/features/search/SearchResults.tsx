/**
 * SearchResults — Search Feature
 * src/features/search/SearchResults.tsx
 *
 * TanStack Query powered doctor listing.
 *
 * States:
 *   loading  → SkeletonDoctorList (5 cards)
 *   error    → friendly error banner
 *   empty    → "هیچ پزشکی یافت نشد" empty state
 *   data     → list of DoctorCard components
 *
 * Query key: [QUERY_KEYS.DOCTORS, filters, sortBy]
 *   — Re-fetches automatically whenever filters or sort change.
 *
 * staleTime: 30 s — avoids re-fetching on every re-render;
 *   realistic for a real API that doesn't change in real-time.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { QUERY_KEYS } from "@/constants";
import { useAppSelector } from "@/hooks/redux";
import { selectSearchFilters, selectSortBy } from "@/store/slices/searchSlice";
import { fetchDoctors } from "@/lib/api/doctors";
import { SkeletonDoctorList } from "@/components/common/Skeleton";
import { DoctorCard } from "@/features/doctors/DoctorCard";
import { toPersianNumerals } from "@/lib/utils";

/* ----------------------------------------------------------------
   Sub-components
   ---------------------------------------------------------------- */

/** Sort bar — shown above the results */
function SortBar({ count }: { count: number }) {
  return (
    <div
      className="flex items-center justify-between gap-3 pb-3 border-b border-neutral-100"
      aria-live="polite"
    >
      <p className="text-xs text-neutral-500">
        <span className="font-semibold text-neutral-800 tabular-nums">
          {toPersianNumerals(count)}
        </span>{" "}
        پزشک یافت شد
      </p>
    </div>
  );
}

/** Error banner */
function ErrorState({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 p-4 rounded-2xl",
        "border border-rose-100 bg-rose-50"
      )}
    >
      <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-rose-700 mb-0.5">خطا در بارگذاری</p>
        <p className="text-xs text-rose-600">{message}</p>
      </div>
    </div>
  );
}

/** Empty state */
function EmptyState({ query }: { query: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "py-20 px-4 text-center",
        "border border-dashed border-neutral-200 rounded-2xl",
        "bg-neutral-50"
      )}
    >
      <span
        className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4"
        aria-hidden="true"
      >
        <SearchX size={24} className="text-neutral-400" />
      </span>
      <p className="text-sm font-semibold text-neutral-700 mb-1">
        هیچ پزشکی یافت نشد
      </p>
      <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
        {query
          ? `نتیجه‌ای برای «${query}» پیدا نشد.`
          : "با فیلترهای انتخاب‌شده پزشکی در سیستم ثبت نشده است."}{" "}
        فیلترها را تغییر دهید یا جستجوی جدیدی انجام دهید.
      </p>
    </div>
  );
}

/* ----------------------------------------------------------------
   SearchResults
   ---------------------------------------------------------------- */
export function SearchResults() {
  const filters = useAppSelector(selectSearchFilters);
  const sortBy  = useAppSelector(selectSortBy);

  const { data, isLoading, isError, error } = useQuery({
    queryKey:  [QUERY_KEYS.DOCTORS, filters, sortBy] as const,
    queryFn:   () => fetchDoctors(filters),
    staleTime: 30_000,
  });

  /* ── Loading ──────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-9 flex items-center">
          <div className="w-32 h-3.5 rounded skeleton" aria-hidden="true" />
        </div>
        <SkeletonDoctorList count={5} />
      </div>
    );
  }

  /* ── Error ────────────────────────────────────────────────── */
  if (isError) {
    const msg = error instanceof Error
      ? error.message
      : "خطای ناشناخته رخ داده است. لطفاً دوباره تلاش کنید.";
    return <ErrorState message={msg} />;
  }

  const doctors = data ?? [];

  /* ── Empty ────────────────────────────────────────────────── */
  if (doctors.length === 0) {
    return <EmptyState query={filters.query} />;
  }

  /* ── Results ──────────────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-4">
      <SortBar count={doctors.length} />

      <ul
        className="flex flex-col gap-3"
        aria-label="لیست پزشکان"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {doctors.map((doctor) => (
          <li key={doctor.id}>
            <DoctorCard doctor={doctor} />
          </li>
        ))}
      </ul>
    </div>
  );
}
