---
mode: agent
description: Step 12 – Build the Training History page showing past sessions with completion stats and a session detail view.
---

# Step 12 – Training History

Implement the trainee's training history page showing all past sessions, completion stats, and a detail view for each session.

---

## `src/pages/HistoryPage.tsx`

### UI

- Page title: "Training History"
- Summary stats row at the top (MUI `Paper` cards in a row):
  - Total sessions completed
  - Total training time (sum of all `actualDuration` across all sessions)
  - Total exercises completed
- Date-grouped list of sessions below:
  - Group header: date (formatted as "Monday, 28 April 2026")
  - Each session entry shows:
    - Plan title (or "Solo Exercise" if `planId` is undefined)
    - Number of exercises completed vs total (e.g. "4/5 exercises")
    - Total actual duration
    - Chevron icon → navigates to session detail
- Empty state: "No training sessions yet. Start your first session!"
- Show `CircularProgress` while loading.

### Data Loading

- Call `getTrainingSessions(userId)` to load sessions for the authenticated user.
- Sort sessions by `date` descending (most recent first).
- Group by calendar date for display.
- To resolve plan titles: call `getTrainingPlanById()` or `getUserPlans()` as needed (can batch or use a local cache).

---

## `src/pages/SessionDetailPage.tsx`

Route: `/history/:sessionId`

### UI

- Page title: "Session Details"
- Date and plan name at the top.
- List of exercises with:
  - Exercise title (resolved from `exerciseId`)
  - Planned duration vs. actual duration
  - Completion status: green checkmark (completed) or grey dash (skipped)
- Total session stats: total planned time, total actual time.
- "Back" button or AppBar back arrow.

### Data Loading

- Call `getTrainingSessionById(sessionId)`.
- Resolve all `exerciseId` values to `Exercise` objects using `getExerciseById()` (can run in parallel with `Promise.all`).

---

## Update History Route

Add the detail route in `src/App.tsx`:
```
/history/:sessionId  →  <SessionDetailPage />
```
Wrap with `<ProtectedRoute>`.

---

## Acceptance Criteria

- History shows all saved sessions for the authenticated user, sorted newest first.
- Sessions are grouped by date.
- Summary stats (total sessions, total time, exercises completed) are accurate.
- Session detail shows per-exercise breakdown.
- Exercise names are resolved from Firestore.
- No TypeScript errors.
