import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد",
};

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 bg-neutral-50">
      <p
        className="text-7xl font-bold text-brand-100 mb-4 select-none"
        aria-hidden="true"
      >
        ۴۰۴
      </p>
      <h1 className="text-xl font-bold text-neutral-900 mb-2">
        صفحه مورد نظر پیدا نشد
      </h1>
      <p className="text-sm text-neutral-500 mb-8 text-center max-w-xs leading-relaxed">
        متأسفانه صفحه‌ای که دنبالش می‌گردید وجود ندارد یا حذف شده است.
      </p>
      <Link
        href="/"
        id="btn-go-home"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors duration-150"
      >
        بازگشت به صفحه اصلی
      </Link>
    </main>
  );
}
