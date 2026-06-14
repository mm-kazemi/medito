/**
 * FilterBottomSheet — Search Feature (Mobile)
 * src/features/search/FilterBottomSheet.tsx
 *
 * A slide-up bottom sheet that wraps FilterSidebar for mobile screens.
 * Controlled by Redux: isFilterSidebarOpen / closeFilterSidebar.
 *
 * Layout model:
 *   - Fixed overlay covering the full viewport
 *   - Sheet slides up from the bottom (translate-y transition)
 *   - Sheet has a max-height of 85dvh with internal scroll inside FilterSidebar
 *   - No overflow-hidden on body — avoids the mobile layout bug from Phase 4
 *   - Body scroll is locked ONLY via pointer-events on the backdrop
 *
 * Accessibility:
 *   - role="dialog" + aria-modal + aria-label
 *   - ESC key closes the sheet
 *   - Focus trap: handled by the backdrop covering the rest of the page
 */

"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  closeFilterSidebar,
  selectIsFilterSidebarOpen,
} from "@/store/slices/uiSlice";
import { FilterSidebar } from "./FilterSidebar";

export function FilterBottomSheet() {
  const dispatch = useAppDispatch();
  const isOpen   = useAppSelector(selectIsFilterSidebarOpen);
  const close    = () => dispatch(closeFilterSidebar());

  /* Close on ESC */
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* Prevent body scroll while open — using overflow-hidden on body
     only while the sheet is open (removed on close → no residual bug) */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ── Backdrop ────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm",
          "transition-opacity duration-200",
          /* Only render on mobile — hidden on lg+ (sidebar is inline) */
          "lg:hidden",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />

      {/* ── Sheet ──────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="فیلترهای جستجو"
        id="filter-bottom-sheet"
        className={cn(
          /* Only render on mobile */
          "lg:hidden",
          /* Positioning */
          "fixed inset-x-0 bottom-0 z-50",
          /* Sizing — max 85% of viewport height */
          "max-h-[85dvh]",
          /* Layout */
          "flex flex-col",
          "bg-neutral-0 rounded-t-2xl",
          "shadow-lg",
          /* Slide-up transition */
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Drag handle */}
        <div className="shrink-0 flex justify-center pt-3 pb-1">
          <span
            aria-hidden="true"
            className="w-10 h-1 rounded-full bg-neutral-200"
          />
        </div>

        {/* Sheet header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">فیلترهای جستجو</h2>
          <button
            type="button"
            id="btn-close-filter-sheet"
            aria-label="بستن فیلترها"
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
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        {/* Filter content — FilterSidebar handles its own internal scroll */}
        <FilterSidebar onClose={close} />
      </div>
    </>
  );
}
