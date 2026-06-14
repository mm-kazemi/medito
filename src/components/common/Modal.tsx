/**
 * Modal / Dialog — Common Molecule
 * src/components/common/Modal.tsx
 *
 * Built on the native HTML <dialog> element for maximum accessibility:
 *  - Focus is trapped inside automatically by the browser
 *  - ESC key closes it natively
 *  - Rendered into the top layer (above all z-index stacks)
 *  - Screen readers announce it correctly via role="dialog"
 *
 * Features:
 *  - Click-outside-backdrop to close
 *  - Subtle backdrop blur
 *  - Smooth open/close CSS transition
 *  - Optional title + description (for aria-labelledby / aria-describedby)
 *  - Controlled via isOpen / onClose props
 *
 * Usage:
 *   <Modal isOpen={open} onClose={() => setOpen(false)} title="تأیید نوبت">
 *     ...content...
 *   </Modal>
 */

"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------
   Props
   ---------------------------------------------------------------- */
export interface ModalProps {
  /** Controls visibility */
  isOpen: boolean;
  /** Called when user closes (ESC, backdrop click, or close button) */
  onClose: () => void;
  /** Optional title — rendered in a header and used for aria-labelledby */
  title?: string;
  /** Optional subtitle / description */
  description?: string;
  /** Modal width preset */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Hide the built-in close (×) button */
  hideCloseButton?: boolean;
  /** Prevent backdrop click from closing */
  disableBackdropClose?: boolean;
  children: React.ReactNode;
  className?: string;
}

/* ----------------------------------------------------------------
   Size map
   ---------------------------------------------------------------- */
const SIZE_CLASSES = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  xl:   "max-w-2xl",
  full: "max-w-[95vw]",
} as const;

/* ----------------------------------------------------------------
   Component
   ---------------------------------------------------------------- */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  hideCloseButton = false,
  disableBackdropClose = false,
  children,
  className,
}: ModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const titleId   = React.useId();
  const descId    = React.useId();

  /* Open/close the native dialog */
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  /* Sync native "close" event (e.g. ESC key) back to parent */
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  /* Backdrop click — click lands on <dialog> itself (not its children) */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (disableBackdropClose) return;
    if (e.target === dialogRef.current) onClose();
  };

  /* Prevent scroll when open */
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      onClick={handleBackdropClick}
      className={cn(
        /* Reset browser <dialog> defaults */
        "p-0 m-auto border-0 outline-none bg-transparent",
        /* Sizing */
        "w-full",
        SIZE_CLASSES[size],
        /* Backdrop */
        "backdrop:bg-neutral-900/40 backdrop:backdrop-blur-sm",
        /* Container */
        "rounded-2xl overflow-hidden shadow-lg"
      )}
    >
      {/* Inner panel — stops click propagation so backdrop click works */}
      <div
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative flex flex-col bg-neutral-0 rounded-2xl",
          "max-h-[90dvh]",
          className
        )}
      >
        {/* Header */}
        {(title ?? !hideCloseButton) && (
          <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-neutral-100 shrink-0">
            <div>
              {title && (
                <h2
                  id={titleId}
                  className="text-sm font-semibold text-neutral-900 leading-snug"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="text-xs text-neutral-400 mt-0.5">
                  {description}
                </p>
              )}
            </div>

            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="بستن"
                className={cn(
                  "shrink-0 flex items-center justify-center",
                  "w-7 h-7 rounded-lg",
                  "text-neutral-400 hover:text-neutral-700",
                  "hover:bg-neutral-100",
                  "transition-colors duration-150",
                  "outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                )}
              >
                <X size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5">
          {children}
        </div>
      </div>
    </dialog>,
    document.body
  );
}
