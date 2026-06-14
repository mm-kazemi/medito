/**
 * Main Layout — App Shell
 * src/app/(main)/layout.tsx
 *
 * Wraps all (main) group routes with:
 *   <Header />        — sticky top-0, renders once
 *   <main>            — natural block; document scrolls
 *   <Footer />        — follows content naturally
 *   <MobileDrawer />  — fixed overlay, outside flow
 *
 * Layout model (Phase 5+):
 *   Natural document scroll — body is min-h-dvh, not h-dvh/overflow-hidden.
 *   The Header is sticky (top-0 z-40) inside its own component.
 *   <main> has no flex/height constraints — it is a plain block that grows
 *   with its content, exactly like every conventional web page.
 *
 *   This fixes the Phase 4 mobile bug where the footer's tall grid was
 *   consuming the entire viewport and hiding the main content.
 */

import * as React from "react";
import { Header }       from "@/components/layout/Header";
import { Footer }       from "@/components/layout/Footer";
import { MobileDrawer } from "@/components/layout/MobileDrawer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      {/* Sticky app header — position handled inside Header.tsx */}
      <Header />

      {/* Page content — plain block, grows with content, document scrolls */}
      <main>
        {children}
      </main>

      {/* Footer — sits below page content naturally */}
      <Footer />

      {/* Mobile navigation drawer — fixed overlay, rendered once at shell level */}
      <MobileDrawer />
    </>
  );
}
