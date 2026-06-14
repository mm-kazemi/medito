/**
 * Button — UI Atom
 * src/components/ui/Button.tsx
 *
 * Variants : primary | outline | ghost | danger
 * Sizes    : sm | md | lg
 * States   : loading (spinner) · disabled · icon-only
 *
 * Fully RTL-ready. Extends native <button> props.
 * Never use the bare <button> element anywhere in the app —
 * always use this component.
 */

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------
   Variant & size maps
   ---------------------------------------------------------------- */
const VARIANT_CLASSES = {
  primary: [
    "bg-brand-600 text-white",
    "hover:bg-brand-700",
    "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
    "disabled:bg-brand-200 disabled:text-brand-50",
  ].join(" "),

  outline: [
    "border border-neutral-200 text-neutral-700 bg-neutral-0",
    "hover:bg-neutral-50 hover:border-neutral-300",
    "focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
    "disabled:border-neutral-100 disabled:text-neutral-300",
  ].join(" "),

  ghost: [
    "text-neutral-600 bg-transparent",
    "hover:bg-neutral-100 hover:text-neutral-900",
    "focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
    "disabled:text-neutral-300",
  ].join(" "),

  danger: [
    "bg-error-500 text-white",
    "hover:bg-red-700",
    "focus-visible:ring-2 focus-visible:ring-error-500 focus-visible:ring-offset-2",
    "disabled:bg-red-200 disabled:text-red-50",
  ].join(" "),
} as const;

const SIZE_CLASSES = {
  sm: "h-8  px-3   text-xs  gap-1.5 rounded-md",
  md: "h-10 px-4   text-sm  gap-2   rounded-lg",
  lg: "h-11 px-5   text-sm  gap-2   rounded-lg",
} as const;

const ICON_SIZE_CLASSES = {
  sm: "h-8  w-8  rounded-md",
  md: "h-10 w-10 rounded-lg",
  lg: "h-11 w-11 rounded-lg",
} as const;

const SPINNER_SIZE = {
  sm: 14,
  md: 16,
  lg: 17,
} as const;

/* ----------------------------------------------------------------
   Props
   ---------------------------------------------------------------- */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant. Default: "primary" */
  variant?: keyof typeof VARIANT_CLASSES;
  /** Size preset. Default: "md" */
  size?: keyof typeof SIZE_CLASSES;
  /** Shows a spinner and disables the button */
  loading?: boolean;
  /** When true, renders a square icon-only button (no px padding) */
  iconOnly?: boolean;
  /** Icon rendered before the label */
  startIcon?: React.ReactNode;
  /** Icon rendered after the label */
  endIcon?: React.ReactNode;
}

/* ----------------------------------------------------------------
   Component
   ---------------------------------------------------------------- */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      iconOnly = false,
      startIcon,
      endIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled ?? loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          /* Base */
          "relative inline-flex items-center justify-center",
          "font-medium select-none",
          "transition-colors duration-150",
          "outline-none",
          "disabled:cursor-not-allowed",
          /* Variant */
          VARIANT_CLASSES[variant],
          /* Size */
          iconOnly ? ICON_SIZE_CLASSES[size] : SIZE_CLASSES[size],
          /* Override opacity when loading — we show a spinner instead */
          loading && "opacity-80",
          className
        )}
        {...props}
      >
        {/* Spinner (replaces startIcon when loading) */}
        {loading ? (
          <Loader2
            size={SPINNER_SIZE[size]}
            className="animate-spin shrink-0"
            aria-hidden="true"
          />
        ) : (
          startIcon && (
            <span className="shrink-0 inline-flex" aria-hidden="true">
              {startIcon}
            </span>
          )
        )}

        {/* Label */}
        {!iconOnly && children && (
          <span className={cn(loading && "opacity-0 absolute")}>{children}</span>
        )}

        {/* Loading label (invisible, keeps button width) */}
        {loading && !iconOnly && (
          <span className="opacity-0 pointer-events-none" aria-hidden="true">
            {children}
          </span>
        )}

        {/* End icon */}
        {!loading && endIcon && (
          <span className="shrink-0 inline-flex" aria-hidden="true">
            {endIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
