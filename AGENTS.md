# AGENTS.md – دکترتو (Medito)

Doctor appointment booking platform. Persian/RTL UI. Next.js 15+ App Router.

<!-- BEGIN USER-SPECIFIED: Do not modify -->
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
<!-- END USER-SPECIFIED -->

---

## Agent Role

You are a **senior frontend engineer** optimizing for token efficiency and correctness. Priorities:

1. **Zero token waste** — Output only changed code. No prose, no pleasantries.
2. **Type safety** — `tsc --noEmit` must pass before any response ends.
3. **RTL correctness** — Logical CSS properties everywhere, no exceptions.
4. **Minimalist design** — Never add visual weight; remove it.
5. **State layer separation** — Server state → React Query. Client state → Redux.

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.2.9 (App Router, Turbopack) |
| Language | TypeScript | ^5 (strict) |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS | ^4 |
| Icons | lucide-react | ^1.18.0 |
| Server State | TanStack React Query | ^5.101.0 |
| Client State | Redux Toolkit | ^2.12.0 |
| Validation | Zod | ^4.4.3 |
| HTTP | Axios | ^1.17.0 |
| Font | Vazirmatn (variable) | ^5.2.8 |

---

## Key Commands

```bash
npm run dev          # Dev server → http://localhost:3000
npm run build        # Production build (validates types + routes)
npm run lint         # ESLint v9
npx tsc --noEmit     # Type check — run before finalizing any output
```

---

## Architecture

### Directory Map

```
src/
├── app/
│   ├── (main)/                     # Route group: public pages
│   │   ├── layout.tsx              # Header + Footer shell
│   │   ├── page.tsx                # Home
│   │   ├── doctors/
│   │   │   ├── page.tsx            # Search listing (Server Component)
│   │   │   └── [slug]/page.tsx     # Doctor profile (Server Component)
│   │   └── booking/[doctorId]/
│   ├── providers.tsx               # QueryClient + StoreProvider
│   └── layout.tsx                  # Root: dir="rtl", Vazirmatn, metadata
├── components/
│   ├── common/                     # Button, Input, Modal, Skeleton, Badge
│   └── layout/                     # Header, Footer, MobileDrawer
├── constants/index.ts              # ROUTES, QUERY_KEYS, SPECIALTIES, MAJOR_CITIES
├── features/
│   ├── doctors/                    # DoctorCard, DoctorProfileHeader, ClinicMap, DoctorProfileClient
│   ├── search/                     # FilterSidebar, FilterBottomSheet, SearchResults, SearchPageClient
│   ├── home/                       # HeroSearch, SpecialtyGrid
│   ├── auth/
│   ├── booking/
│   └── dashboard/
├── hooks/
│   ├── redux.ts                    # useAppDispatch, useAppSelector
│   └── useSearchSync.ts            # Bidirectional URL ↔ Redux sync
├── lib/
│   ├── api/doctors.ts              # fetchDoctors(), fetchDoctorBySlug()
│   └── utils/index.ts              # cn(), formatCurrency(), toPersianNumerals()
├── store/
│   ├── index.ts                    # RootState, AppDispatch
│   └── slices/                     # searchSlice, authSlice, uiSlice
└── types/
    └── doctor.ts                   # Doctor, DoctorProfile, PatientReview, ClinicInfo
```

### State Architecture

| State Type | Layer | Hook |
|------------|-------|------|
| Fetched / cached data | TanStack Query | `useQuery` / `useMutation` |
| UI + session (sync) | Redux Toolkit | `useAppSelector` / `useAppDispatch` |
| Shareable filter state | URL params ↔ Redux | `useSearchSync` → `router.replace` |

**Rule**: Never store fetched data in Redux. Never store UI state in React Query.

### Next.js 15+ Critical Differences

```tsx
// params is a Promise — ALWAYS await
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}

// generateMetadata — same pattern
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}

// useSearchParams — must live inside <Suspense>
// useParams — preferred for client components
```

---

## Code Style & Conventions

### Output Rules (Token Economy)

- Output **only changed functions/sections**. Mark unchanged parts with `// ... existing code ...`
- Never rewrite a whole file to change 3 lines.
- No explanatory prose unless asked.
- No JSDoc unless the function is a public utility in `lib/`.

### RTL — Mandatory Logical Properties

| ❌ Never use | ✅ Always use |
|-------------|--------------|
| `ml-` / `mr-` | `ms-` / `me-` |
| `pl-` / `pr-` | `ps-` / `pe-` |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `left-0` | `start-0` |
| `right-0` | `end-0` |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l-*` / `rounded-r-*` | `rounded-s-*` / `rounded-e-*` |
| `float-left` / `float-right` | `float-start` / `float-end` |

### Minimalist Design Tokens

```
Backgrounds:   bg-neutral-0  bg-neutral-50  bg-neutral-100
Text:          text-neutral-400 (muted)  text-neutral-600 (body)  text-neutral-900 (heading)
Borders:       border-neutral-100 (subtle)  border-neutral-200 (visible)
Primary:       bg-brand-500  bg-brand-600  text-brand-600  (teal, actions only)
Border radius: rounded-xl (cards)  rounded-2xl (panels/modals)  rounded-full (pills)
Shadows:       transition-only hover shadows — never static
Animations:    opacity + translate, 150ms duration
```

### Mandatory Patterns

```tsx
// ✅ cn() for all conditional classes
import { cn } from "@/lib/utils"
className={cn("base-class", condition && "conditional-class")}

// ✅ Button component — never bare <button>
import { Button } from "@/components/common/Button"

// ✅ Type imports
import type { Doctor } from "@/types/doctor"

// ✅ Route and query key constants
import { ROUTES, QUERY_KEYS } from "@/constants"
href={ROUTES.BOOKING(doctor.id)}

// ✅ Typed Redux hooks
import { useAppDispatch, useAppSelector } from "@/hooks/redux"

// ✅ Persian numerals for all displayed numbers
import { toPersianNumerals, formatCurrency } from "@/lib/utils"
toPersianNumerals(4.8)     // → "۴.۸"
formatCurrency(400_000)    // → "۴۰۰٬۰۰۰ تومان"
```

### React Query Pattern

```tsx
const { data, isLoading, isError } = useQuery({
  queryKey:  [QUERY_KEYS.DOCTORS, filters] as const,
  queryFn:   () => fetchDoctors(filters),
  staleTime: 60_000,
})
```

### File Header

```tsx
/**
 * ComponentName — Feature Name
 * src/path/to/file.tsx
 *
 * One-line purpose.
 */
```

---

## Boundaries

### ✅ Always

- Run `npx tsc --noEmit`; fix every error before finishing.
- Use logical CSS properties (see RTL table).
- Import `ROUTES` and `QUERY_KEYS` from `@/constants` — never hardcode.
- Wrap `useSearchParams` consumers in `<Suspense>`.
- Export new components from the feature's `index.ts` barrel.
- Ensure git commits list only human authors.

### ⚠️ Ask First

- Adding npm dependencies.
- New Redux slices or restructuring the store.
- Changing `QUERY_KEYS` values (breaks cache).
- Changing `Doctor` / `DoctorProfile` type shape (cascades broadly).
- Modifying `(main)/layout.tsx` or `app/layout.tsx`.
- Any auth, session, or payment logic.

### 🚫 Never

- Use physical CSS properties (`ml-`, `mr-`, `pl-`, `pr-`, `left-*`, `right-*`, `text-left`, `text-right`).
- Use bare `<button>` — always `<Button>` from `@/components/common/Button`.
- Store fetched/cached data in Redux.
- Store UI-only state in React Query.
- Access `params` synchronously in App Router pages.
- Hardcode colors, routes, or query key strings.
- Add decorative shadows or heavy visual decoration.
- Rewrite a whole file when changing a small section.
- List AI agents as commit authors or co-authors.
- Modify content inside `<!-- BEGIN USER-SPECIFIED -->` blocks.

---

## Critical Files

| What | Where |
|------|-------|
| Root layout (dir, font, metadata) | `src/app/layout.tsx` |
| All providers | `src/app/providers.tsx` |
| Main shell (Header + Footer) | `src/app/(main)/layout.tsx` |
| Routes + Query keys + Specialties | `src/constants/index.ts` |
| Redux store root | `src/store/index.ts` |
| Search slice (filter state) | `src/store/slices/searchSlice.ts` |
| UI slice (sidebar open/close) | `src/store/slices/uiSlice.ts` |
| Typed Redux hooks | `src/hooks/redux.ts` |
| URL ↔ Redux sync hook | `src/hooks/useSearchSync.ts` |
| Domain types | `src/types/doctor.ts` |
| Mock API | `src/lib/api/doctors.ts` |
| Utilities | `src/lib/utils/index.ts` |

---

## Common Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `params` TS error on page | Sync access on Promise | `const { slug } = await params` |
| Build error on `useSearchParams` | Missing Suspense | Wrap consumer in `<Suspense>` |
| RTL layout broken | Physical CSS property | Replace with logical equivalent |
| Tailwind class ignored | Specificity conflict | Use `cn()` with `twMerge` |
| `MOCK_DOCTORS[n]` spread type error | Array index returns `T \| undefined` | `...(MOCK_DOCTORS[n] as Doctor)` |
| Font not rendering | Missing import | Import `@fontsource-variable/vazirmatn` in root layout |
| Query stale after filter change | `queryKey` missing dependency | Include all filter fields in `queryKey` array |
| Map iframe CORS warning | Cross-origin OSM embed | Expected; add `referrerPolicy="no-referrer-when-downgrade"` |

---

## When You're Stuck

1. **Type error** → `npx tsc --noEmit 2>&1 | head -30` — fix the first error only, re-run.
2. **RTL mystery** → Inspect element; replace any physical property with its logical counterpart.
3. **Query not updating** → Verify all filter fields are in the `queryKey` array.
4. **Next.js API unclear** → Read `node_modules/next/dist/docs/` — do not assume from training data.
5. **Pattern unclear** → Find an existing similar component in `src/features/` before inventing.
6. **Big change needed** → If touching >3 files, state the plan first.

---

<!-- BEGIN USER-SPECIFIED: Do not modify -->
## Git Authorship

Only humans are listed as commit authors or co-authors. No AI agents, assistants, or tools appear in author fields. This maintains proper attribution, legal accountability, and copyright clarity.
<!-- END USER-SPECIFIED -->
