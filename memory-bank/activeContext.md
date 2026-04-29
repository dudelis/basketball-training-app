# Active Context

## Current Status
**Last completed step: Step 11 – Active Session (+ bug fixes)**
**Next step: Step 12 – Training History**

## What Was Just Done (Steps 08–11 + Bug Fixes)

### Step 08 – Training Plans (Admin) (`f5aff5b`)
- `src/pages/admin/AdminPlansPage.tsx` — list, FAB, delete confirm
- `src/pages/admin/AdminPlanFormPage.tsx` — create/edit form with ExercisePickerDialog
- `src/components/ExercisePickerDialog.tsx` — search + select exercises into a plan
- `src/pages/PlansPage.tsx` — trainee view of all plans

### Step 09 – Trainee Exercise Library & Custom Plans (`2b06f52`)
- `src/components/ExerciseCard.tsx` — reusable card with thumbnail, duration, type chip
- `src/pages/ExercisesPage.tsx` — grid with search + type filter, Start button per exercise
- `src/pages/MyPlansPage.tsx` — trainee's own plans list
- `src/pages/UserPlanFormPage.tsx` — create/edit custom plan form

### Step 10 – Timer System (`47a368e`)
- `src/hooks/useTimer.ts` — countdown with localStorage persistence, beep, Web Notifications, adjust ±1/5 min
- `src/components/TimerDisplay.tsx` — large countdown, color states (green/orange/red), Pause/Resume/Reset, completion banner

### Step 11 – Active Session (committed as part of Step 10 / `47a368e`)
- `src/pages/ActiveSessionPage.tsx` — full session flow: loads plan/exercise from Firestore, MediaPanel + TimerDisplay, tracks results per exercise, session summary, saves TrainingSession to Firestore

### Bug Fixes (`525c6d1`)
- **Firestore `undefined` field rejection**: `createExercise`, `createTrainingPlan`, `createTrainingSession` stripped of undefined fields before `addDoc` — Firestore rejects `undefined` (unlike `null`)
- **Timer stuck at 00:00 when paused**: `useTimer.adjust()` now calls `triggerFinish()` when `prev.status === 'paused'` in addition to `'running'` when `newRemaining <= 0`
- React 18 Strict Mode double-invocation handled via `finishedRef` guard in `triggerFinish()`

## Active Decisions / Notes
- MUI v6 system props must go inside `sx={}` — direct shorthand props cause TS2769
- `inputProps` removed in MUI v6 — use `slotProps={{ htmlInput: { ... } }}` instead
- Firebase project: `basketball-training-app-a5360`
- User role must be set to `admin` in Firestore manually (Firebase Console) to access admin pages
- Firestore rejects `undefined` field values — always strip before writing: `Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))`
- React 18 Strict Mode double-invokes state updaters in dev — never mutate refs inside a `setState` updater; use the `triggerFinish()` side-effect-queuing pattern
- Timer STORAGE_KEY is `'bball_timer_v1'`; `ActiveSessionPage` clears it on mount for fresh sessions
- `HistoryPage` is currently a stub (Step 12 not yet implemented)

## TODOs (deferred)

- **Profile photo upload** (`src/pages/ProfilePage.tsx`): Upload Photo button is present but non-functional. Requires Firebase Storage (Blaze plan). Once upgraded, implement `uploadProfileImage(userId, file)` call in `handleSave` and enable the file input overlay on the button. See `src/services/storage.ts` — `uploadProfileImage` is already implemented.

## What to Do Next
Read `.github/prompts/14-dashboard.prompt.md` and implement step 14.
