# Agent Handover Guide: Spaced Recall Tracker

Welcome! This guide gives you the exact context, conventions, and roadmap to pick up and complete the **Personal Learning & Spaced Recall Tracker** web application.

---

## 1. Project Mission & User Story
The user is tracking technical topics learned (e.g. from ChatGPT). 
The core UX philosophy:
> **"The user should ONLY think about: 'What did I learn today?' and 'What do I need to recall today?' Everything else must be automated."**
> **"The user should NEVER have to manually calculate or enter future recall dates."**

The user accesses this from **both Laptop and Mobile** and expects:
- **Instant multi-device real-time sync** via Supabase (100% free tier, PostgreSQL, WebSockets).
- **Offline / Local-First resilience**: Works out-of-the-box locally via LocalStorage/IndexedDB even before entering Supabase credentials.
- **PWA support**: Installable on mobile & desktop, service worker caching.
- **GitHub connected**: Automated CI/CD with GitHub Actions.

---

## 2. Technology Stack & Key Libraries
- **React 19 + Vite 6 + TypeScript (Strict)**
- **React Compiler (`babel-plugin-react-compiler`)**: Active in `vite.config.ts`. Automatic memoization. **Do NOT write manual `useMemo` or `useCallback` unless specifically required.**
- **TanStack Router (`@tanstack/react-router`)**: 100% type-safe routing.
- **TanStack Query v5 (`@tanstack/react-query`)**: Server state, query invalidation, caching.
- **Zustand (`zustand`)**: Lightweight UI state (theme, search palette, modal controls).
- **React Hook Form + Zod**: High-performance forms with strict validation (`topicFormSchema` in `src/types/index.ts`).
- **Framer Motion (`framer-motion`)**: Smooth list transitions, card shifts when marking complete, layout animations.
- **Sonner (`sonner`)**: Modern toast alerts with undo actions.
- **CMDK (`cmdk`)**: Raycast / Linear style `Ctrl + K` global command palette.
- **Radix UI**: `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-progress`, `@radix-ui/react-tooltip`.
- **Date Handling**: `date-fns`. All dates stored strictly as `YYYY-MM-DD` to avoid timezone bugs.

---

## 3. Directory Layout & Key Files
```
spaced-recall-tracker/
├── plan.md                       # Master implementation plan
├── agent.md                      # This handover guide
├── vite.config.ts                # Vite config (React Compiler + PWA + Vitest)
├── tsconfig.json                 # Strict TS config with @/* alias
├── tailwind.config.js            # Tailwind configuration
├── src/
│   ├── types/
│   │   └── index.ts              # Core types (Topic, RecallSession, Category, etc.) & Zod schemas
│   ├── services/
│   │   ├── spacedRecall.ts       # Pure spaced-repetition math & date calculations
│   │   ├── exportImport.ts       # JSON/CSV backup, restore, validation, bulk import
│   │   └── notifications.ts      # Web Notification API manager
│   ├── tests/
│   │   └── spacedRecall.test.ts  # Vitest unit tests for date math & leap years
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client & real-time connection
│   │   └── api.ts                # Unified data layer (Supabase + Local fallback)
│   ├── store/
│   │   └── useUIStore.ts         # Zustand UI store (theme, search open, modals)
│   ├── hooks/
│   │   ├── useTopics.ts          # Query hooks for topics & recall sessions
│   │   └── useCategories.ts      # Query hooks for categories & tags
│   ├── components/
│   │   ├── layout/               # AppLayout, Header, Sidebar, MobileNav
│   │   ├── dashboard/            # SummaryCards, TodayRecallList
│   │   ├── today/                # ProgressBar, OverdueSection, DueTodaySection, CompletedSection
│   │   ├── topics/               # TopicCard, TopicForm, ActiveRecallModal
│   │   ├── calendar/             # MonthView, WeekView, AgendaView, DayDetailModal
│   │   ├── common/               # CommandPalette, ConfirmDialog, Badge, Button
│   │   └── settings/             # IntervalScheduleEditor, NotificationSettings
│   ├── routes/                   # TanStack Router route definitions
│   ├── App.tsx                   # QueryClientProvider + RouterProvider + Toaster
│   └── index.css                 # Tailwind directives & CSS variables
├── supabase/
│   └── schema.sql                # PostgreSQL schema with RLS for Supabase SQL Editor
└── .github/
    └── workflows/
        ├── ci.yml                # CI: lint, test, typecheck, build
        └── deploy.yml            # CD: GitHub Pages deployment
```

---

## 4. Crucial Business Logic & Rules
1. **Spaced Recall Intervals**:
   - Default: `[0, 1, 3, 5, 9, 15, 25, 40, 60, 90, 120, 180, 365]`
   - Pure generator: `generateRecallSessions(topicId, learnedDate, intervals)` in `src/services/spacedRecall.ts`.
2. **Date Safety**:
   - Always use `YYYY-MM-DD` strings.
   - Never use JavaScript `new Date("2026-09-01")` directly without UTC parsing because local timezone offsets can shift the day to Aug 31. Use `addDaysToDateString()` in `spacedRecall.ts`.
3. **Missed Recall Handling**:
   - If a recall date is past and not completed, its status is `'overdue'`.
   - **Complete Now**: sets `completedAt = current timestamp`, preserves original `scheduledDate`, status = `'completed'`.
   - **Reschedule**: sets `rescheduledFrom = scheduledDate`, `scheduledDate = newDate`.
   - **Skip**: status = `'skipped'`, does not delete future recalls.
   - Modifying interval schedule in Settings must **never modify historical completed sessions**.
4. **Data Layer (`src/lib/api.ts`)**:
   - Check if `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured.
   - If configured, read/write to Supabase with real-time subscriptions.
   - If not configured or offline, read/write to LocalStorage/IndexedDB with initial sample seed data so the user can immediately use the app!
5. **Windows Encoding Rule**:
   - When writing files via PowerShell, always use UTF-8 WITHOUT BOM (`New-Object System.Text.UTF8Encoding $false`). Standard PowerShell 5 `Set-Content -Encoding utf8` writes a BOM that breaks JSON parsers.
6. **Component Modularity & File Organization Rule (CRITICAL)**:
   - **Always split components whenever they approach or exceed ~250-300 lines of code**, or whenever modularity feels needed for readability and reusability.
   - **Use subfolders to group related files** (e.g., `src/components/today/`, `src/components/topics/TopicForm/`, `src/components/topics/TopicDetail/`, `src/components/topics/ActiveRecall/`, `src/components/calendar/`, etc.). Keep each subcomponent focused and single-purpose.

---

## 5. Next Steps to Complete the App
1. Create `src/lib/supabase.ts` and `src/lib/api.ts` (Hybrid Supabase + Local storage with initial seed topics).
2. Create `src/store/useUIStore.ts` (Zustand: theme, active modal, cmdk search state).
3. Create TanStack Query hooks in `src/hooks/useTopics.ts`.
4. Create the UI components:
   - `AppLayout.tsx`, `Header.tsx`, `Sidebar.tsx`, `MobileNav.tsx`
   - `DashboardView.tsx` with summary cards and today's recall list
   - `TodayView.tsx` with progress bar, overdue options, due items, completed items with undo
   - `TopicForm.tsx` (React Hook Form + live schedule preview)
   - `ActiveRecallModal.tsx` (step-by-step quiz mode)
   - `TopicDetailView.tsx` with full recall history table & edit actions
   - `TopicsListView.tsx` with filters, search, sorting
   - `CalendarView.tsx` with month/week/agenda views
   - `LearningLogView.tsx` & `StatsView.tsx`
   - `SettingsView.tsx` with interval editor
   - `BackupView.tsx` with JSON export/import and CSV bulk import
   - `CommandPalette.tsx` (CMDK `Ctrl+K`)
5. Configure TanStack Router routes and wire into `src/App.tsx`.
6. Write `supabase/schema.sql`.
7. Write `.github/workflows/ci.yml` and `deploy.yml`.
8. Verify everything builds cleanly with `npm run build` and tests pass with `npm run test`.