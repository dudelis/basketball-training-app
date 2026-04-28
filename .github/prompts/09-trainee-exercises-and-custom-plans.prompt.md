---
mode: agent
description: Step 09 – Implement the trainee exercise library browsing page and the custom user plan creation and management pages.
---

# Step 09 – Trainee Exercise Library & Custom Plans

Implement the trainee-facing **exercise library** browsing page and the **custom user plans** management pages.

---

## `src/pages/ExercisesPage.tsx`

The exercise library page for trainees.

### UI
- Page title: "Exercises"
- Filter row at the top:
  - Search `TextField` (filter by title, debounced 300ms)
  - Exercise type `Select` (filter by category)
- Exercise cards grid (1 column mobile, 2 column tablet+).
- Each card (`src/components/ExerciseCard.tsx`) shows:
  - Thumbnail image (first image URL, or YouTube thumbnail if `youtubeUrl` is set, or a basketball placeholder icon)
  - Title
  - Type badge (MUI `Chip`)
  - Default duration (e.g. "10 min")
  - "Start" button → navigates to `/session/exercise/:exerciseId` (solo execution)
- Show `CircularProgress` while loading.

### `src/components/ExerciseCard.tsx`

Reusable exercise card component:
```ts
type ExerciseCardProps = {
  exercise: Exercise;
  exerciseType?: ExerciseType;
  onStart?: () => void;
  onAddToPlan?: () => void;  // optional: used on custom plan builder
};
```

---

## `src/pages/MyPlansPage.tsx`

The page where trainees see and manage their custom plans.

### UI
- Page title: "My Plans"
- List of user plans as MUI `Card` items.
- Each card: title, number of exercises, total duration, Edit and Delete icon buttons.
- FAB to create a new plan → navigates to `/my-plans/new`.
- Empty state message if no plans exist ("No custom plans yet. Create your first one!").

### Behavior
- Load plans filtered by the authenticated user's id.
- Delete: confirmation dialog → call `deleteUserPlan(id)`.
- Show `Snackbar` feedback.

---

## `src/pages/UserPlanFormPage.tsx`

Form page for creating/editing a custom user plan. Route: `/my-plans/new` and `/my-plans/:id`.

### Fields
| Field | Component |
|---|---|
| Plan Title | `TextField` (required) |

### Exercise List Builder

Same UX pattern as the admin plan form (Step 08):
- List of added exercises with duration field and remove button.
- Reorder with up/down arrows.
- "Add Exercise" button opens `ExercisePickerDialog`.

### Behavior
- On submit, call `createUserPlan()` or `updateUserPlan()` with:
  - `userId` from the authenticated user
  - `createdAt` set to current ISO timestamp (on create only)
  - `editable: true`
- Navigate to `/my-plans` on success.
- "Start Plan" button (on edit mode only): navigates to `/session/plan/:planId`.

---

## Start Button on My Plans

Each plan card should also have a "Start" button that navigates to `/session/plan/:planId`.

---

## Acceptance Criteria

- Trainees can browse and filter the exercise library.
- Trainees can create, edit, delete their own custom plans.
- Trainees cannot see or access other users' plans.
- "Start" button is available on both predefined plans and custom plans.
- No TypeScript errors.
