/**
 * ViewToggle — Search Feature
 * src/features/search/ViewToggle.tsx
 *
 * Segmented control to switch between List and Map view modes.
 */

"use client";

import { LayoutList, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectSearchViewMode,
  setSearchViewMode,
  type SearchViewMode,
} from "@/store/slices/uiSlice";

const TABS: { value: SearchViewMode; label: string; Icon: typeof LayoutList }[] = [
  { value: "list", label: "نمایش لیست", Icon: LayoutList },
  { value: "map",  label: "نمایش نقشه", Icon: Map },
];

export function ViewToggle() {
  const dispatch = useAppDispatch();
  const mode     = useAppSelector(selectSearchViewMode);

  return (
    <div
      role="tablist"
      aria-label="نوع نمایش نتایج"
      className="flex items-center gap-0.5 p-1 rounded-xl bg-neutral-100"
    >
      {TABS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={mode === value}
          onClick={() => dispatch(setSearchViewMode(value))}
          className={cn(
            "flex items-center gap-1.5 h-7 px-3 rounded-lg",
            "text-xs font-medium select-none",
            "transition-colors duration-150 outline-none",
            "focus-visible:ring-2 focus-visible:ring-brand-500",
            mode === value
              ? "bg-neutral-0 text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          )}
        >
          <Icon size={13} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}
