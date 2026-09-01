# Master Implementation Plan: Personal Learning & Spaced Recall Tracker

## 1. Project Overview & Objective
Build a production-quality personal learning management Progressive Web App (PWA) that automates technical topic tracking and spaced-recall scheduling. The application serves primarily ONE user across Laptop and Mobile with real-time sync, zero manual calculation of recall dates, and 100% free serverless architecture.

## 2. Core Technologies & Architecture
- **Framework**: React 19 + Vite 6 + TypeScript (Strict mode)
- **Compiler**: React Compiler (`babel-plugin-react-compiler`) for automatic component & hook memoization (no manual `useMemo` or `useCallback`).
- **Routing**: TanStack Router (`@tanstack/react-router`) for 100% type-safe routing and search parameter validation.
- **Server State & Data Fetching**: TanStack Query v5 (`@tanstack/react-query`) for caching, optimistic updates, and background refetching.
- **UI State**: Zustand (`zustand`) for modal states, theme, search dialog, and temporary filter preferences.
- **Forms**: React Hook Form (`react-hook-form`) + Zod schema validation (`zod`, `@hookform/resolvers`).
- **UI / UX Libraries**:
  - Tailwind CSS (Linear / Notion / Todoist dark & light aesthetic)
  - Lucide React icons
  - Framer Motion (`framer-motion`) for smooth card shifts & transitions
  - Sonner (`sonner`) for stacked toast notifications with undo actions
  - CMDK (`cmdk`) for Raycast/Linear-style `Ctrl + K` global command palette
  - Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-progress`, `@radix-ui/react-tooltip`)
  - Canvas-confetti (`canvas-confetti`) for celebration upon completing recalls
- **Backend & Database**:
  - Supabase (`@supabase/supabase-js`) PostgreSQL with Row Level Security (RLS) and Realtime WebSockets for multi-device laptop <-> mobile sync.
  - Built-in Local Storage / IndexedDB fallback so the app works seamlessly even without cloud credentials.
- **Date Handling**: `date-fns` with strict `YYYY-MM-DD` ISO calendar math in UTC to prevent timezone/DST off-by-one errors.
- **PWA**: `vite-plugin-pwa` + Workbox service worker for offline caching and installability on Android/iOS/Desktop.
- **Testing**: Vitest (`vitest`) unit tests for recall date math, leap years, reschedule/skip workflows, and backup validation.
- **CI/CD**: GitHub Actions workflows (`.github/workflows/ci.yml` and `deploy.yml`).

---

## 3. Data Model & Database Schema (`supabase/schema.sql`)

### Entities:
1. **Topic**:
   - `id`: UUID (Primary Key)
   - `user_id`: UUID (references `auth.users`)
   - `title`: string (required, indexed)
   - `description`: string (optional markdown notes)
   - `notes`: string (key takeaways / code snippets)
   - `learned_at`: string (`YYYY-MM-DD`)
   - `category_id`: UUID (references `categories`)
   - `difficulty`: `'easy' | 'medium' | 'hard'`
   - `chatgpt_url`: string (optional, opens in new tab with `noopener`)
   - `questions`: JSONB `[{ id, question, answer, correctCount, incorrectCount }]`
   - `archived`: boolean (default false)
   - `created_at`, `updated_at`: timestamps

2. **RecallSession**:
   - `id`: UUID (Primary Key)
   - `topic_id`: UUID (references `topics`, ON DELETE CASCADE)
   - `user_id`: UUID (references `auth.users`)
   - `interval_days`: number (0, 1, 3, 5, 9, 15, 25, 40, 60, 90, 120, 180, 365)
   - `recall_index`: number (0 for Day 0, 1 for Day 1...)
   - `scheduled_date`: string (`YYYY-MM-DD`, indexed)
   - `completed_at`: timestamp with time zone (null until completed)
   - `status`: `'upcoming' | 'due' | 'completed' | 'overdue' | 'skipped' | 'rescheduled'`
   - `rescheduled_from`: string (`YYYY-MM-DD`, null until rescheduled)
   - `notes`: string (optional)

3. **Category**:
   - `id`: UUID (Primary Key)
   - `user_id`: UUID (references `auth.users`)
   - `name`: string (unique per user)
   - `color`: string
   - `order`: number

4. **Tag** & **TopicTag**:
   - Tags table + junction table for many-to-many topic tagging.

5. **Settings**:
   - `id`: UUID / 'user_settings'
   - `recall_intervals`: `[0, 1, 3, 5, 9, 15, 25, 40, 60, 90, 120, 180, 365]`
   - `notification_enabled`: boolean
   - `notification_time`: string ("10:00")
   - `notification_frequency`: 'daily' | 'weekdays'
   - `remind_overdue`: boolean
   - `remind_due_today`: boolean
   - `theme`: 'light' | 'dark' | 'system'
   - `week_start_day`: 0 | 1

---

## 4. Spaced Recall Calculation Rules (Pure Function: `src/services/spacedRecall.ts`)
- **Default Intervals**: `[0, 1, 3, 5, 9, 15, 25, 40, 60, 90, 120, 180, 365]` days.
- **Example**: Learned `2026-09-01`:
  - Day 0 -> `2026-09-01`
  - Day 1 -> `2026-09-02`
  - Day 3 -> `2026-09-04`
  - Day 5 -> `2026-09-06`
  - Day 9 -> `2026-09-10`
  - Day 15 -> `2026-09-16`
  - Day 25 -> `2026-09-26`
  - Day 40 -> `2026-10-11`
- **Status Evaluation**:
  - `completedAt != null` or status is `'completed'` -> `'completed'`
  - `status === 'skipped'` -> `'skipped'`
  - `status === 'rescheduled'` -> `'rescheduled'`
  - `scheduledDate < today` -> `'overdue'`
  - `scheduledDate === today` -> `'due'`
  - `scheduledDate > today` -> `'upcoming'`
- **Missed Recall Handling**:
  - **Complete Now**: Keeps original `scheduledDate`, sets `completedAt = current_timestamp`, status = `'completed'`.
  - **Reschedule**: Sets `rescheduledFrom = scheduledDate`, updates `scheduledDate = newDate`, recalculates status.
  - **Skip**: Sets status = `'skipped'`, leaves following scheduled sessions intact.
- **Schedule Customization**:
  - Intervals editable in Settings. Modifying intervals recalculates future non-completed sessions without ever altering past completed history.

---

## 5. Application Screens & Routing (TanStack Router)

1. **Dashboard (`/`)**:
   - Greeting ("Good morning 👋", date, streak flame)
   - Summary cards: 🔁 Due Today, ⚠️ Overdue, ✅ Completed Today, 📚 Total Topics, 🔥 Learning Streak
   - "Today's Recall" Priority Section:
     - Topic cards with recall indicator ("Recall 4/13 — Day 5")
     - Buttons: [Open ChatGPT], [✓ Mark Recalled], [⚡ Active Recall], [Edit]
   - Quick "+ Add Topic" action

2. **Dedicated Today Page (`/today`)**:
   - Progress bar (e.g. "2 / 4 completed") with visual fill
   - 🔴 **Overdue Section**: Overdue items with Complete Now, Reschedule, Skip
   - 🟡 **Due Today Section**: Checkboxes to complete
   - 🟢 **Completed Today Section**: Strikethrough completed items with undo toast

3. **Add Topic Flow (`/topics/new` or Modal)**:
   - Form fields: Title (required), Learned Date (default today), Category, Tags, ChatGPT URL, Notes/Description, Difficulty
   - **Interactive Live Preview**: Shows Day 0, Day 1, Day 3... dates dynamically as the user types
   - Optional Active Recall questions list
   - Save creates topic + generates recall sessions immediately

4. **Active Recall Mode (Self-Quiz Flashcard Modal)**:
   - Displays topic prompt or questions one-by-one before opening ChatGPT
   - "Show Answer", "Mark Correct", "Mark Incorrect", "Add Question"

5. **Topic Details Page (`/topics/$topicId`)**:
   - Topic metadata, notes, and ChatGPT launcher button
   - Full Recall History Table: Recall # | Scheduled | Completed | Status | Actions
   - Ability to edit individual recall dates, add/remove recall sessions

6. **Topics Directory (`/topics`)**:
   - Search bar (fuzzy indexing title, description, notes, tags)
   - Filters: Category, Tag, Status (Due, Overdue, Completed, In Progress), Difficulty
   - Sort: Recently Learned, Oldest, Next Recall, Alphabetical
   - Card/Table view with progress bars

7. **Calendar Page (`/calendar`)**:
   - Month, Week, and Agenda views
   - Status indicators (🔴 Overdue, 🟡 Due, 🟢 Completed, 🔵 Upcoming)
   - Clicking a date opens modal with topics scheduled for that day

8. **Learning Log (`/log`)**:
   - Chronological timeline of learned topics grouped by month & day
   - Stats: Topics learned this week, month, year, total

9. **Statistics Page (`/stats`)**:
   - Topics learned, recalls completed vs missed, completion rate percentage
   - Current streak & longest streak
   - 7-day recall forecast
   - Topics by category distribution chart

10. **Settings Page (`/settings`)**:
    - Spaced Recall Schedule editor: add, remove, edit, reorder intervals
    - Notification preferences (toggle, time, overdue/due reminders)
    - Theme switcher (Light, Dark, System)
    - Supabase configuration inputs

11. **Backup & Restore Page (`/backup`)**:
    - Full JSON Export (`learning-backup-YYYY-MM-DD.json`)
    - JSON Pre-import Inspection ("127 topics, 14 categories, 1,342 recall sessions")
    - Restore options: "Replace" (with auto safety backup) or "Merge"
    - CSV Export & Bulk CSV Import (auto-generating recall schedules)

12. **Command Palette (`Ctrl + K` / `Cmd + K`)**:
    - Global CMDK modal for instant navigation and topic lookup

---

## 6. Implementation Checklist
- [x] Create project scaffolding & `package.json`
- [x] Configure Tailwind CSS & PostCSS
- [x] Configure Vite with React Compiler & PWA plugins
- [x] Define TypeScript interfaces & Zod schemas (`src/types/index.ts`)
- [x] Implement pure spaced-recall date engine (`src/services/spacedRecall.ts`)
- [x] Write unit tests (`src/tests/spacedRecall.test.ts`)
- [x] Implement JSON/CSV Export & Import engine (`src/services/exportImport.ts`)
- [x] Implement Browser Notification Manager (`src/services/notifications.ts`)
- [ ] Implement Unified Data Layer: `src/lib/api.ts`, `src/lib/supabase.ts`, `src/lib/localDb.ts`
- [ ] Create TanStack Query hooks (`useTopics`, `useRecallSessions`, `useCategories`, `useSettings`)
- [ ] Create Zustand store for UI preferences (`src/store/useUIStore.ts`)
- [ ] Build Layout & Navigation (`AppLayout`, `Header`, `Sidebar`, `MobileNav`)
- [ ] Build Dashboard components & Today's priority recall list
- [ ] Build Dedicated Today page with progress bar & overdue handling
- [ ] Build Add/Edit Topic flow with React Hook Form + live schedule preview
- [ ] Build Active Recall self-quiz modal
- [ ] Build Topic Details page with full recall history table
- [ ] Build Topics Directory with filters, sorting, and pagination
- [ ] Build Calendar page (Month, Week, Agenda views)
- [ ] Build Learning Log timeline & Statistics dashboard
- [ ] Build Settings page (interval schedule editor & notifications)
- [ ] Build Backup & Restore page (JSON/CSV export & restore preview)
- [ ] Build CMDK Command Palette (`Ctrl + K`)
- [ ] Configure TanStack Router routes & root router
- [ ] Write PostgreSQL Supabase schema (`supabase/schema.sql`)
- [ ] Configure GitHub Actions CI (`ci.yml`) & CD (`deploy.yml`)
- [ ] Test complete workflow and verify build