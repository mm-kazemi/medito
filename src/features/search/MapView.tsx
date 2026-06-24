/**
 * MapView — Search Feature
 * src/features/search/MapView.tsx
 *
 * Map view that respects the same Redux searchSlice filters as SearchResults.
 * Dynamically imports MapViewLeaflet (SSR disabled) to avoid window errors.
 */

"use client";

import dynamic from "next/dynamic";
import { AlertCircle, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { QUERY_KEYS } from "@/constants";
import { useAppSelector } from "@/hooks/redux";
import { selectSearchFilters, selectSortBy } from "@/store/slices/searchSlice";
import { fetchDoctors } from "@/lib/api/doctors";

/* ----------------------------------------------------------------
   Dynamic import — Leaflet requires browser APIs (no SSR)
   ---------------------------------------------------------------- */
const LeafletMap = dynamic(() => import("./MapViewLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-neutral-50">
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-7 h-7 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"
          aria-hidden="true"
        />
        <p className="text-xs text-neutral-400">در حال بارگذاری نقشه…</p>
      </div>
    </div>
  ),
});

/* ----------------------------------------------------------------
   MapView
   ---------------------------------------------------------------- */
export function MapView() {
  const filters = useAppSelector(selectSearchFilters);
  const sortBy  = useAppSelector(selectSortBy);

  const { data, isLoading, isError, error } = useQuery({
    queryKey:  [QUERY_KEYS.DOCTORS, filters, sortBy] as const,
    queryFn:   () => fetchDoctors(filters),
    staleTime: 30_000,
  });

  const containerCls = cn(
    "rounded-2xl overflow-hidden border border-neutral-100",
    "h-[calc(100dvh-14rem)] lg:h-[calc(100dvh-9.5rem)]"
  );

  /* ── Loading ──────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className={cn(containerCls, "bg-neutral-100 animate-pulse")} />
    );
  }

  /* ── Error ────────────────────────────────────────────────── */
  if (isError) {
    return (
      <div
        role="alert"
        className={cn(
          "flex items-start gap-3 p-4 rounded-2xl",
          "border border-rose-100 bg-rose-50"
        )}
      >
        <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-rose-700">
          {error instanceof Error ? error.message : "خطا در بارگذاری نقشه"}
        </p>
      </div>
    );
  }

  const doctors = data ?? [];
  const withCoords = doctors.filter((d) => d.lat != null);

  /* ── Empty (no coords) ────────────────────────────────────── */
  if (withCoords.length === 0) {
    return (
      <div
        className={cn(
          containerCls,
          "flex flex-col items-center justify-center",
          "border-dashed border-neutral-200 bg-neutral-50"
        )}
      >
        <MapPin size={24} className="text-neutral-300 mb-3" aria-hidden="true" />
        <p className="text-sm text-neutral-500">هیچ پزشکی با موقعیت جغرافیایی یافت نشد</p>
      </div>
    );
  }

  /* ── Map ──────────────────────────────────────────────────── */
  return (
    <div className={containerCls}>
      <LeafletMap doctors={doctors} />
    </div>
  );
}
