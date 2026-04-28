---
mode: agent
description: Step 07 – Build the Admin exercise types and exercise library management pages with full CRUD using Firestore and Firebase Storage for media uploads.
---

# Step 07 – Exercise Library (Admin)

Implement the admin interface for managing **exercise types** (categories) and **exercises** (the library). All data is persisted in Firestore. Media uploads go to Firebase Storage.

---

## `src/pages/admin/AdminExerciseTypesPage.tsx`

A page for admins to manage exercise categories.

### UI
- Page title: "Exercise Types"
- Inline list of all exercise types with their names.
- Each row has an edit icon button and a delete icon button.
- A floating action button (FAB) or inline button to "Add Type".
- An inline text field / dialog for add and edit — no separate page needed.
- Delete shows an MUI `Dialog` confirmation before deleting.

### Behavior
- On mount, load all exercise types from `getExerciseTypes()`.
- Add calls `createExerciseType(name)` then refreshes the list.
- Edit calls `updateExerciseType(id, name)` then refreshes.
- Delete calls `deleteExerciseType(id)` then refreshes.
- Show `CircularProgress` while loading.
- Show MUI `Snackbar` with success/error feedback after each action.

---

## `src/pages/admin/AdminExercisesPage.tsx`

A list page for admins to view and manage exercises.

### UI
- Page title: "Exercise Library"
- MUI `Card` grid (responsive: 1 column on mobile, 2 on tablet).
- Each card shows:
  - Exercise title
  - Exercise type name (resolved from `ExerciseType.id`)
  - Default duration
  - Thumbnail (first image if available, or a placeholder icon)
  - Edit and Delete icon buttons
- FAB to add a new exercise → navigates to `/admin/exercises/new`
- Filter row: filter by exercise type (MUI `Select`).

### Behavior
- On mount, load exercises and exercise types in parallel.
- Delete shows a confirmation dialog.
- Show `Snackbar` feedback.

---

## `src/pages/admin/AdminExerciseFormPage.tsx`

A form page for creating and editing a single exercise. Route: `/admin/exercises/new` and `/admin/exercises/:id`.

### Fields
| Field | Component | Notes |
|---|---|---|
| Title | `TextField` | Required |
| Exercise Type | `Select` | Loads from `getExerciseTypes()` |
| Description | `TextField` multiline | Optional |
| Default Duration (min) | `TextField` number | Required, min 1 |
| YouTube URL | `TextField` | Optional, validate URL format |
| Upload Video | `Button` + file input | Optional, upload to Firebase Storage |
| Upload Images | `Button` + multiple file input | Optional, up to 5 images |

### Behavior
- On edit mode, pre-fill all fields with existing data.
- Media that was previously uploaded shows a thumbnail/filename with a delete icon.
- On submit:
  - Upload any new files first, get download URLs.
  - Call `createExercise()` or `updateExercise()` with all data.
  - Navigate back to `/admin/exercises` on success.
- Show validation errors inline.
- Show `Snackbar` on error.
- "Cancel" button navigates back without saving.

---

## Supporting Components

### `src/components/MediaUpload.tsx`

A reusable component for uploading files:
- Props: `label`, `accept` (MIME types), `multiple`, `existingUrls`, `onUpload(files: File[])`, `onRemoveExisting(url: string)`
- Shows existing uploaded files as thumbnail chips with a remove button.
- Shows a file picker button for new uploads.

---

## Acceptance Criteria

- Admins can add, edit, and delete exercise types.
- Admins can add, edit, and delete exercises with full media support.
- Images and videos upload to Firebase Storage and their URLs are saved in Firestore.
- Non-admin users cannot access these pages (enforced by `ProtectedRoute`).
- No TypeScript errors.
