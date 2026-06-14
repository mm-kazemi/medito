/**
 * Skeleton Loaders — Common Molecule
 * src/components/common/Skeleton.tsx
 *
 * Composable, shimmer-animated placeholder components for loading states.
 * The shimmer animation is defined in globals.css (.skeleton class).
 *
 * Exports:
 *  - Skeleton          → Base primitive (any shape via className)
 *  - SkeletonText      → Text line(s) placeholder
 *  - SkeletonAvatar    → Circular avatar placeholder
 *  - SkeletonButton    → Button placeholder
 *  - SkeletonCard      → Full doctor-card placeholder (composite)
 *
 * Usage:
 *   <SkeletonCard />                     // loading doctor card
 *   <SkeletonText lines={3} />           // loading paragraph
 *   <SkeletonAvatar size="lg" />         // loading profile photo
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/* ================================================================
   BASE SKELETON PRIMITIVE
   ================================================================ */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Explicit width (e.g. "w-32", "w-full") — defaults to w-full */
  width?: string;
  /** Explicit height (e.g. "h-4") — defaults to h-4 */
  height?: string;
  /** Whether to use rounded-full (circle) instead of rounded-md */
  rounded?: "sm" | "md" | "lg" | "full";
}

const ROUNDED = {
  sm:   "rounded",
  md:   "rounded-md",
  lg:   "rounded-lg",
  full: "rounded-full",
} as const;

export function Skeleton({
  width = "w-full",
  height = "h-4",
  rounded = "md",
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={cn(
        "skeleton",   // shimmer from globals.css
        width,
        height,
        ROUNDED[rounded],
        className
      )}
      {...props}
    />
  );
}

/* ================================================================
   SKELETON TEXT — multiple line placeholders
   ================================================================ */
export interface SkeletonTextProps {
  /** Number of lines. Default: 3 */
  lines?: number;
  /** Gap between lines */
  gap?: "tight" | "normal" | "loose";
  /** Last line width (as a tailwind width class) */
  lastLineWidth?: string;
  className?: string;
}

const GAP_CLASS = {
  tight:  "gap-1.5",
  normal: "gap-2",
  loose:  "gap-3",
} as const;

export function SkeletonText({
  lines = 3,
  gap = "normal",
  lastLineWidth = "w-3/5",
  className,
}: SkeletonTextProps) {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={cn("flex flex-col", GAP_CLASS[gap], className)}
    >
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 && lines > 1 ? lastLineWidth : "w-full"}
          height="h-3.5"
        />
      ))}
    </div>
  );
}

/* ================================================================
   SKELETON AVATAR — circular profile image placeholder
   ================================================================ */
export interface SkeletonAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const AVATAR_SIZE = {
  xs: "w-7  h-7",
  sm: "w-9  h-9",
  md: "w-11 h-11",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
} as const;

export function SkeletonAvatar({
  size = "md",
  className,
}: SkeletonAvatarProps) {
  return (
    <Skeleton
      width={AVATAR_SIZE[size].split(" ")[0]}
      height={AVATAR_SIZE[size].split(" ")[1]}
      rounded="full"
      className={cn(AVATAR_SIZE[size], className)}
    />
  );
}

/* ================================================================
   SKELETON BUTTON
   ================================================================ */
export interface SkeletonButtonProps {
  size?: "sm" | "md" | "lg";
  width?: string;
  className?: string;
}

const BUTTON_HEIGHT = {
  sm: "h-8",
  md: "h-10",
  lg: "h-11",
} as const;

export function SkeletonButton({
  size = "md",
  width = "w-24",
  className,
}: SkeletonButtonProps) {
  return (
    <Skeleton
      width={width}
      height={BUTTON_HEIGHT[size]}
      rounded="lg"
      className={className}
    />
  );
}

/* ================================================================
   SKELETON DOCTOR CARD — composite
   Matches the layout of the real DoctorCard (Phase 7).
   ================================================================ */
export interface SkeletonDoctorCardProps {
  className?: string;
}

export function SkeletonDoctorCard({ className }: SkeletonDoctorCardProps) {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={cn(
        "flex gap-4 p-4 rounded-xl border border-neutral-100 bg-neutral-0",
        className
      )}
    >
      {/* Avatar */}
      <SkeletonAvatar size="xl" className="shrink-0" />

      {/* Info */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Name */}
        <Skeleton width="w-2/5" height="h-4" />
        {/* Specialty */}
        <Skeleton width="w-1/3" height="h-3" />

        {/* Rating + badges row */}
        <div className="flex items-center gap-2">
          <Skeleton width="w-16" height="h-3" />
          <Skeleton width="w-20" height="h-3" />
        </div>

        {/* Address */}
        <Skeleton width="w-3/5" height="h-3" />

        {/* CTA */}
        <div className="flex items-center justify-between mt-1">
          <Skeleton width="w-24" height="h-3" />
          <SkeletonButton size="sm" width="w-28" />
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SKELETON SPECIALTIES CARD — for Phase 6 sidebar / homepage grid
   ================================================================ */
export function SkeletonSpecialtyCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-xl border border-neutral-100",
        className
      )}
    >
      <Skeleton width="w-8" height="h-8" rounded="lg" />
      <Skeleton width="w-14" height="h-3" />
      <Skeleton width="w-10" height="h-2.5" />
    </div>
  );
}

/* ================================================================
   SKELETON LIST — renders N doctor card skeletons
   ================================================================ */
export function SkeletonDoctorList({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      aria-label="در حال بارگذاری..."
      aria-live="polite"
      aria-busy="true"
      className={cn("flex flex-col gap-3", className)}
    >
      {Array.from({ length: count }, (_, i) => (
        <SkeletonDoctorCard key={i} />
      ))}
    </div>
  );
}
