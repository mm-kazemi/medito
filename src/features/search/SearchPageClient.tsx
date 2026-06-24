/**
 * SearchPageClient — Search Feature
 * src/features/search/SearchPageClient.tsx
 *
 * Client island for the /doctors search page.
 *
 * Responsibilities:
 *   1. Call useSearchSync → bidirectional URL ↔ Redux sync
 *   2. Render the sticky page header (query breadcrumb + mobile filter button)
 *   3. RTL 2-column desktop grid:  sidebar (right) | results (left)
 *   4. Mobile: single column + FilterBottomSheet
 *
 * ⚠️  useSearchSync calls useSearchParams internally, which requires
 * this component tree to be wrapped in a <Suspense> boundary at the
 * call-site (doctors/page.tsx) to prevent the build-time prerender
 * error: "Missing Suspense boundary with useSearchParams".
 *
 * RTL grid columns (dir="rtl" on <html>):
 *   grid-cols-[280px_1fr]
 *     Column 1 (280px) → RIGHT side (sidebar)
 *     Column 2 (1fr)   → LEFT  side (results)
 */

"use client";

import { Suspense } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectSearchFilters,
  selectSearchQuery,
} from "@/store/slices/searchSlice";
import {
  openFilterSidebar,
  selectIsFilterSidebarOpen,
} from "@/store/slices/uiSlice";
import { useSearchSync }      from "@/hooks/useSearchSync";
import { FilterSidebar }      from "./FilterSidebar";
import { FilterBottomSheet }  from "./FilterBottomSheet";
import { SearchResults }      from "./SearchResults";
import { MapView }            from "./MapView";
import { ViewToggle }         from "./ViewToggle";
import { SkeletonDoctorList } from "@/components/common/Skeleton";
import {
  selectSearchViewMode,
} from "@/store/slices/uiSlice";

/* ----------------------------------------------------------------
   Inner component — uses useSearchSync (needs Suspense above)
   ---------------------------------------------------------------- */
function SearchPageInner() {
  /* Activate bidirectional URL ↔ Redux sync */
  useSearchSync();

  const dispatch          = useAppDispatch();
  const filters           = useAppSelector(selectSearchFilters);
  const query             = useAppSelector(selectSearchQuery);
  const isFilterSheetOpen = useAppSelector(selectIsFilterSidebarOpen);
  const viewMode          = useAppSelector(selectSearchViewMode);

  /* Active filter count for badges */
  const activeFilterCount = [
    filters.city        !== "",
    filters.specialty   !== "",
    filters.minRating   > 0,
    filters.isAvailable,
    filters.visitType   !== "",
  ].filter(Boolean).length;

  return (
    <>
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="container-app pt-5 pb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">

          <div>
            <h1 className="text-base font-bold text-neutral-900">
              {query ? `نتایج جستجو: «${query}»` : "جستجوی پزشک"}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              {filters.city ? `شهر: ${filters.city}` : "در همه شهرها"}
              {filters.specialty ? ` · ${filters.specialty}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ViewToggle />

            {/* Mobile filter button */}
            <Button
              id="btn-open-filters"
              variant="outline"
              size="md"
              aria-controls="filter-bottom-sheet"
              aria-expanded={isFilterSheetOpen}
              onClick={() => dispatch(openFilterSidebar())}
              className={cn(
                "lg:hidden gap-2",
                "hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              )}
            >
              <SlidersHorizontal size={15} aria-hidden="true" />
              <span>فیلترها</span>
              {activeFilterCount > 0 && (
                <span
                  className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-brand-500 text-white text-xs font-bold"
                  aria-label={`${activeFilterCount} فیلتر فعال`}
                >
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ── 2-column layout ─────────────────────────────────────── */}
      <div className="container-app pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

          {/* ── Desktop sidebar ──────────────────────────────────── */}
          <aside
            aria-label="فیلترهای جستجو"
            className={cn(
              "hidden lg:flex lg:flex-col",
              "sticky top-[4.5rem]",
              "rounded-2xl border border-neutral-100 bg-neutral-0",
              "overflow-hidden",
              "h-[calc(100dvh-5.5rem)]"
            )}
          >
            <div className="shrink-0 px-4 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-neutral-400" aria-hidden="true" />
                فیلترهای جستجو
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-brand-500 text-white text-xs font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </h2>
            </div>
            <FilterSidebar />
          </aside>

          {/* ── Results area ─────────────────────────────────────── */}
          <section aria-label="نتایج جستجو" className="flex flex-col gap-4">
            {viewMode === "list" ? <SearchResults /> : <MapView />}
          </section>

        </div>
      </div>

      {/* ── Mobile filter bottom sheet ──────────────────────────── */}
      <FilterBottomSheet />
    </>
  );
}

/* ----------------------------------------------------------------
   Public export — wrapped in Suspense for useSearchParams
   ---------------------------------------------------------------- */
export interface SearchPageClientProps {
  /** These props are no longer used for Redux init (useSearchSync
      reads the URL directly), but kept for potential SSR hints. */
  initialQuery?:    string;
  initialCity?:     string;
  initialSpecialty?: string;
}

export function SearchPageClient(_props: SearchPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="container-app pt-5 pb-12">
          <div className="w-48 h-5 rounded skeleton mb-4" aria-hidden="true" />
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar skeleton */}
            <div className="hidden lg:block h-96 rounded-2xl skeleton" />
            {/* Results skeleton */}
            <SkeletonDoctorList count={5} />
          </div>
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
