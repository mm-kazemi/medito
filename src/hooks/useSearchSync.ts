/**
 * useSearchSync — Custom Hook
 * src/hooks/useSearchSync.ts
 *
 * Bidirectional synchronisation between Redux `searchSlice` and
 * the browser URL Search Params.
 *
 * ┌──────────────────────────────────────────────────────┐
 * │  URL Params  ──(mount)──▶  Redux                     │
 * │  Redux       ──(change)──▶  URL Params (replace)     │
 * └──────────────────────────────────────────────────────┘
 *
 * URL param ↔ Redux field mapping:
 *   ?q=         ↔  filters.query
 *   ?city=      ↔  filters.city
 *   ?specialty= ↔  filters.specialty
 *   ?rating=    ↔  filters.minRating  (number, 0 = omitted)
 *   ?available= ↔  filters.isAvailable ("1" = true, absent = false)
 *   ?visit=     ↔  filters.visitType
 *   ?sort=      ↔  sortBy
 *
 * Anti-loop design:
 *   A `syncingFromUrl` ref is set to `true` during the
 *   initial URL→Redux hydration. The Redux→URL effect checks
 *   this flag and skips the first push to avoid an echo.
 *
 * Usage:
 *   Call once at the top of SearchPageClient.
 *   The hook has no return value — it's purely a side-effect.
 */

"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setFilters,
  setSortBy,
  selectSearchFilters,
  selectSortBy,
} from "@/store/slices/searchSlice";
import type { SearchFilters } from "@/store/slices/searchSlice";
import type { SpecialtyId, SortOptionId } from "@/constants";

/* ----------------------------------------------------------------
   Serialise Redux state → URLSearchParams string
   ---------------------------------------------------------------- */
function filtersToParams(
  filters: SearchFilters,
  sortBy: SortOptionId
): URLSearchParams {
  const p = new URLSearchParams();

  if (filters.query)              p.set("q",         filters.query);
  if (filters.city)               p.set("city",      filters.city);
  if (filters.specialty)          p.set("specialty", filters.specialty);
  if (filters.minRating > 0)      p.set("rating",    String(filters.minRating));
  if (filters.isAvailable)        p.set("available", "1");
  if (filters.visitType)          p.set("visit",     filters.visitType);
  if (sortBy !== "relevance")     p.set("sort",      sortBy);

  return p;
}

/* ----------------------------------------------------------------
   Parse URLSearchParams → partial SearchFilters update
   ---------------------------------------------------------------- */
function paramsToFilters(
  params: URLSearchParams
): Partial<SearchFilters> & { sortBy?: SortOptionId } {
  const update: Partial<SearchFilters> & { sortBy?: SortOptionId } = {};

  const q         = params.get("q");
  const city      = params.get("city");
  const specialty = params.get("specialty");
  const rating    = params.get("rating");
  const available = params.get("available");
  const visit     = params.get("visit");
  const sort      = params.get("sort");

  if (q)         update.query       = q;
  if (city)      update.city        = city;
  if (specialty) update.specialty   = specialty as SpecialtyId | "";
  if (rating)    update.minRating   = parseFloat(rating);
  if (available) update.isAvailable = available === "1";
  if (visit)     update.visitType   = visit as SearchFilters["visitType"];
  if (sort)      update.sortBy      = sort as SortOptionId;

  return update;
}

/* ----------------------------------------------------------------
   The hook
   ---------------------------------------------------------------- */
export function useSearchSync() {
  const dispatch     = useAppDispatch();
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const filters      = useAppSelector(selectSearchFilters);
  const sortBy       = useAppSelector(selectSortBy);

  /**
   * Flag: true while we are hydrating Redux from the URL on mount.
   * Prevents the Redux→URL effect from immediately echoing back.
   */
  const syncingFromUrl = useRef(true);

  /* ── Effect 1: URL → Redux (mount only) ──────────────────── */
  useEffect(() => {
    const parsed  = paramsToFilters(searchParams);
    const { sortBy: parsedSort, ...parsedFilters } = parsed;

    if (Object.keys(parsedFilters).length > 0) {
      dispatch(setFilters(parsedFilters));
    }
    if (parsedSort) {
      dispatch(setSortBy(parsedSort));
    }

    // Allow the Redux→URL effect to run after the next render
    // (by which time the Redux update has been committed).
    const id = setTimeout(() => {
      syncingFromUrl.current = false;
    }, 0);

    return () => clearTimeout(id);
    // Intentionally runs only on mount — searchParams reference is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Effect 2: Redux → URL (on every filter/sort change) ─── */
  useEffect(() => {
    // Skip the very first run to avoid echoing the URL→Redux hydration
    if (syncingFromUrl.current) return;

    const params       = filtersToParams(filters, sortBy);
    const paramsString = params.toString();
    const newUrl       = paramsString ? `${pathname}?${paramsString}` : pathname;

    // Skip if URL hasn't changed to avoid spurious router updates
    const currentSearch = window.location.search;
    const newSearch     = paramsString ? `?${paramsString}` : "";
    if (currentSearch === newSearch) return;

    router.replace(newUrl, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy]);
}
