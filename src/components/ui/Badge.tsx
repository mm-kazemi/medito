/**
 * Badge — UI Atom
 * src/components/ui/Badge.tsx
 *
 * Small status label used on doctor cards, appointment states,
 * specialty tags, availability indicators, etc.
 *
 * Variants: default · brand · success · warning · error · outline
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------
   Variant map
   ---------------------------------------------------------------- */
const VARIANT_CLASSES = {
  default: "bg-neutral-100 text-neutral-600",
  brand:   "bg-brand-50   text-brand-700   border border-brand-200",
  success: "bg-green-50   text-green-700   border border-green-200",
  warning: "bg-amber-50   text-amber-700   border border-amber-200",
  error:   "bg-red-50     text-red-700     border border-red-200",
  outline: "bg-transparent text-neutral-600 border border-neutral-200",
} as const;

const SIZE_CLASSES = {
  sm: "px-2   py-0.5 text-xs rounded",
  md: "px-2.5 py-0.5 text-xs rounded-md",
  lg: "px-3   py-1   text-xs rounded-md",
} as const;

/* ----------------------------------------------------------------
   Props
   ---------------------------------------------------------------- */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof VARIANT_CLASSES;
  size?: keyof typeof SIZE_CLASSES;
  /** Optional leading dot indicator */
  dot?: boolean;
}

/* ----------------------------------------------------------------
   Component
   ---------------------------------------------------------------- */
export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium select-none",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            variant === "success" && "bg-green-500",
            variant === "warning" && "bg-amber-500",
            variant === "error"   && "bg-red-500",
            variant === "brand"   && "bg-brand-500",
            (variant === "default" || variant === "outline") && "bg-neutral-400"
          )}
        />
      )}
      {children}
    </span>
  );
}
