---
mode: agent
description: Step 08 – Build the admin predefined training plans management pages with exercise ordering and duration configuration.
---

# Step 08 – Training Plans (Admin)

Implement the admin interface for creating and managing **predefined training plans**. These plans are created by admins and are visible to all trainees.

---

## `src/pages/admin/AdminPlansPage.tsx`

A list page for admins to view and manage predefined plans.

### UI
- Page title: "Training Plans"
- MUI `Card` list (full width on mobile).
- Each card shows:
  - Plan title
  - Number of exercises
  - Total duration (sum of `durationMinutes` for all exercises)
  - Optional description
  - Edit and Delete icon buttons
- FAB to add a new plan → navigates to `/admin/plans/new`.

### Behavior
- On mount, load all plans from `getTrainingPlans()`.
- Delete shows a confirmation `Dialog`.
- Show `Snackbar` feedback for all actions.
- Show `CircularProgress` while loading.

---

## `src/pages/admin/AdminPlanFormPage.tsx`

A form page for creating and editing a single predefined plan. Route: `/admin/plans/new` and `/admin/plans/:id`.

### Fields

| Field | Component | Notes |
|---|---|---|
| Title | `TextField` | Required |
| Description | `TextField` multiline | Optional |

### Exercise List Builder

Below the basic fields, display a list of exercises added to the plan.

Each row in the list shows:
- Exercise title (resolved from id)
- Duration field (`TextField` number, in minutes)
- Up / Down arrow icon buttons for reordering
- Remove icon button

Below the list, an "Add Exercise" button opens an MUI `Dialog` to pick from the exercise library:
- Show all exercises in a searchable list (filter by name or type).
- Selecting one adds it to the plan with its `defaultDurationMinutes` pre-filled.

### Behavior
- Reordering updates the `order` property of each `PlanExercise`.
- On submit, call `createTrainingPlan()` or `updateTrainingPlan()` with the full plan data.
- `totalDurationMinutes` is calculated automatically as the sum of all exercise durations.
- Navigate to `/admin/plans` on success.
- "Cancel" navigates back without saving.
- Show validation: at least 1 exercise required, title required.

---

## `src/components/ExercisePickerDialog.tsx`

A reusable dialog for selecting exercises from the library.

Props:
```ts
{
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  excludeIds?: string[];  // already added exercises
}
```

- Search bar to filter exercises by title.
- Filter by exercise type via MUI `Select`.
- List of exercises with title, type, and default duration.
- Clicking an exercise calls `onSelect` and closes the dialog.

---

## `src/pages/PlansPage.tsx` (Trainee View)

Implement the trainee-facing plans list page:

- Page title: "Training Plans"
- Shows all predefined plans as MUI `Card` list.
- Each card: title, description, total duration, number of exercises.
- "Start" button navigates to `/session/plan/:planId` (Active Session, Step 11).
- No edit or delete controls visible to trainees.

---

## Acceptance Criteria

- Admins can create, edit, delete predefined plans.
- Plans can have exercises added, reordered, and removed.
- Trainees see plans but cannot edit them.
- No TypeScript errors.
