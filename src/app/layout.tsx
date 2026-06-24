import type { Metadata, Viewport } from "next";
/* Font loaded as JS import — resolves correctly via Next.js bundler */
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import { Providers } from "./providers";

/* =================================================================
   SEO METADATA
   ================================================================= */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "مدیتو — جستجو و نوبت‌دهی آنلاین پزشک",
    template: "%s | مدیتو",
  },
  description:
    "پلتفرم جامع جستجوی پزشک، رزرو آنلاین نوبت و مشاوره پزشکی. بیش از ۱۰,۰۰۰ پزشک متخصص در سراسر ایران.",
  keywords: ["نوبت دهی آنلاین", "جستجوی پزشک", "رزرو نوبت پزشک", "متخصص"],
  authors: [{ name: "مدیتو" }],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "مدیتو",
    title: "مدیتو — جستجو و نوبت‌دهی آنلاین پزشک",
    description: "پلتفرم جامع جستجوی پزشک، رزرو آنلاین نوبت و مشاوره پزشکی.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14b8a6",
};

/* =================================================================
   ROOT LAYOUT
   ================================================================= */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      {/*
        body:
        - bg-neutral-0     → white background
        - text-neutral-900 → dark body text
        - antialiased      → smooth font rendering
        - min-h-dvh        → at least full viewport height; content can grow beyond it

        ⚠ h-dvh + overflow-hidden REMOVED:
        That "locked viewport" model was crushing <main> to near-zero on mobile
        whenever the Footer's tall grid claimed its natural height.
        The sticky Header is self-contained (sticky top-0 z-40 inside Header.tsx).
        Pages now use natural document scroll.
      */}
      <body className="bg-neutral-0 text-neutral-900 antialiased min-h-dvh flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
