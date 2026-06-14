/**
 * Input — UI Atom
 * src/components/ui/Input.tsx
 *
 * Features:
 *  - Optional label + helper text
 *  - start/end icon slots (positioned correctly for RTL)
 *  - Error state with message
 *  - Disabled state
 *  - Character count (optional)
 *  - Extends native <input> props
 *
 * RTL note: "start" = right side in RTL, "end" = left side in RTL.
 * We use ps-/pe- (padding-inline-start/end) so the icon padding
 * automatically mirrors under dir="rtl".
 */

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------
   Props
   ---------------------------------------------------------------- */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Visible label rendered above the input */
  label?: string;
  /** Small helper text rendered below the input */
  helper?: string;
  /** Error message — replaces helper text and applies error styling */
  error?: string;
  /** Icon rendered at the inline-start of the input (right in RTL) */
  startIcon?: React.ReactNode;
  /** Icon rendered at the inline-end of the input (left in RTL) */
  endIcon?: React.ReactNode;
  /** Wraps the input in a container div. Usually left at default (true). */
  withWrapper?: boolean;
  /** Input size variant */
  inputSize?: "sm" | "md" | "lg";
}

/* ----------------------------------------------------------------
   Size map
   ---------------------------------------------------------------- */
const INPUT_SIZE = {
  sm: "h-8  text-xs rounded-md",
  md: "h-10 text-sm rounded-lg",
  lg: "h-11 text-sm rounded-lg",
} as const;

const ICON_INSET = {
  sm: "top-2   text-neutral-400 [&>svg]:h-3.5 [&>svg]:w-3.5",
  md: "top-2.5 text-neutral-400 [&>svg]:h-4   [&>svg]:w-4",
  lg: "top-3   text-neutral-400 [&>svg]:h-4   [&>svg]:w-4",
} as const;

const ICON_PADDING = {
  sm: "ps-8  pe-3",
  md: "ps-10 pe-3",
  lg: "ps-10 pe-3",
} as const;

const ICON_PADDING_END = {
  sm: "ps-3  pe-8",
  md: "ps-3  pe-10",
  lg: "ps-3  pe-10",
} as const;

const ICON_PADDING_BOTH = {
  sm: "ps-8  pe-8",
  md: "ps-10 pe-10",
  lg: "ps-10 pe-10",
} as const;

/* ----------------------------------------------------------------
   Component
   ---------------------------------------------------------------- */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helper,
      error,
      startIcon,
      endIcon,
      withWrapper = true,
      inputSize = "md",
      className,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? React.useId();
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const hasError = Boolean(error);

    /* Compute padding class based on which icons are present */
    const paddingClass =
      startIcon && endIcon
        ? ICON_PADDING_BOTH[inputSize]
        : startIcon
          ? ICON_PADDING[inputSize]
          : endIcon
            ? ICON_PADDING_END[inputSize]
            : "px-3";

    const inputElement = (
      <div className="relative">
        {/* Start icon (inline-start = right in RTL) */}
        {startIcon && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 start-3 flex items-center",
              ICON_INSET[inputSize],
              hasError && "text-error-500"
            )}
          >
            {startIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? errorId : helper ? helperId : undefined
          }
          className={cn(
            /* Base */
            "w-full font-sans bg-neutral-0 text-neutral-900",
            "border border-neutral-200",
            "placeholder:text-neutral-400",
            "transition-colors duration-150 outline-none",
            /* Size */
            INPUT_SIZE[inputSize],
            /* Padding (icon-aware) */
            paddingClass,
            /* Focus */
            "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15",
            /* Error */
            hasError &&
              "border-error-500 focus:border-error-500 focus:ring-error-500/15",
            /* Disabled */
            "disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />

        {/* End icon (inline-end = left in RTL) */}
        {endIcon && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 end-3 flex items-center",
              ICON_INSET[inputSize],
              hasError && "text-error-500"
            )}
          >
            {endIcon}
          </span>
        )}

        {/* Error icon at end when no endIcon provided */}
        {hasError && !endIcon && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 end-3 flex items-center",
              ICON_INSET[inputSize],
              "text-error-500"
            )}
          >
            <AlertCircle />
          </span>
        )}
      </div>
    );

    if (!withWrapper) return inputElement;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-xs font-medium",
              hasError ? "text-error-500" : "text-neutral-700",
              disabled && "text-neutral-300"
            )}
          >
            {label}
          </label>
        )}

        {inputElement}

        {/* Helper / Error message */}
        {hasError ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-error-500 flex items-center gap-1"
          >
            {error}
          </p>
        ) : helper ? (
          <p id={helperId} className="text-xs text-neutral-400">
            {helper}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
