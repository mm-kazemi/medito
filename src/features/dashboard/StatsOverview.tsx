/**
 * StatsOverview — Dashboard Feature
 * src/features/dashboard/StatsOverview.tsx
 *
 * 3-card stat grid: today's appointments, total patients, monthly revenue.
 */

import { Calendar, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, toPersianNumerals } from "@/lib/utils";

const STATS = [
  {
    id:       "today",
    label:    "نوبت‌های امروز",
    value:    toPersianNumerals(8),
    sub:      "۳ نوبت باقی‌مانده",
    icon:     Calendar,
    iconBg:   "bg-brand-50 text-brand-600",
  },
  {
    id:       "patients",
    label:    "کل بیماران",
    value:    toPersianNumerals(247),
    sub:      "↑ ۱۲ نفر این ماه",
    icon:     Users,
    iconBg:   "bg-emerald-50 text-emerald-600",
  },
  {
    id:       "revenue",
    label:    "درآمد این ماه",
    value:    formatCurrency(18_400_000),
    sub:      "↑ ۸٪ نسبت به ماه قبل",
    icon:     TrendingUp,
    iconBg:   "bg-amber-50 text-amber-600",
  },
] as const;

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {STATS.map(({ id, label, value, sub, icon: Icon, iconBg }) => (
        <div
          key={id}
          className={cn(
            "flex items-start gap-4 p-5",
            "rounded-2xl border border-neutral-100 bg-neutral-0"
          )}
        >
          <span
            aria-hidden="true"
            className={cn("p-2.5 rounded-xl shrink-0", iconBg)}
          >
            <Icon size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-neutral-400 mb-1">{label}</p>
            <p className="text-xl font-bold text-neutral-900 tabular-nums leading-tight">
              {value}
            </p>
            <p className="text-[0.65rem] text-neutral-400 mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
