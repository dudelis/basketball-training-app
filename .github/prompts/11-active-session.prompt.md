---
mode: agent
description: Step 11 – Build the Active Training Session page that runs exercises one by one with the timer, shows media, and records the training session to Firestore on completion.
---

# Step 11 – Training Execution (Active Session)

Implement the **Active Training Session** screen where trainees execute a plan or a single exercise with the timer.

---

## Routes

| Route | Behavior |
|---|---|
| `/session/plan/:planId` | Load a predefined `TrainingPlan` or `UserPlan` and execute its exercises |
| `/session/exercise/:exerciseId` | Load a single exercise and run it ad-hoc |

Both routes use `src/pages/ActiveSessionPage.tsx`.

---

## `src/pages/ActiveSessionPage.tsx`

### Page Initialization

1. Read the route params to determine mode: `plan` or `exercise`.
2. Load the plan/exercise data from Firestore.
3. Build an internal list of `SessionExercise[]` with `plannedDuration` set to:
   - The plan's per-exercise duration (for plan mode).
   - The exercise's `defaultDurationMinutes` (for solo mode).
4. Set `currentIndex = 0` to track which exercise is active.

### Layout

The page has two sections:

#### Exercise Info Panel (top / left on desktop)
- Exercise title (large heading).
- Type badge (MUI `Chip`).
- Description text.
- Media area:
  - If `youtubeUrl` is present: embed an `<iframe>` YouTube player.
  - Else if `videoUrl` is present: render an HTML `<video>` player.
  - Else if `imageUrls` has items: render an image carousel (use MUI `Box` with navigation arrows or a simple index).
  - Otherwise: a basketball placeholder graphic.

#### Timer Panel (bottom / right on desktop)
- Use `<TimerDisplay>` from Step 10 with `initialSeconds` from `plannedDuration * 60`.
- Show exercise progress: "Exercise 2 of 5".
- Progress bar (MUI `LinearProgress`) showing overall session progress.

### Exercise Completion Flow

When the timer finishes or the user manually clicks "Mark as Done" / "Skip":

1. Record the actual duration for that exercise.
2. Mark as `completed: true` (if "Mark as Done") or `completed: false` (if "Skip").
3. If more exercises remain, advance to the next exercise (`currentIndex++`) and reset the timer.
4. If all exercises are done, go to the **Session Summary** step.

### Session Summary

After all exercises are finished, show a summary screen (inline, no route change):
- "Session Complete! 🎉" heading.
- List of exercises with planned vs. actual duration and completion status.
- Total time spent.
- "Save Session" button: calls `createTrainingSession()` and navigates to `/history`.
- "Discard" button: navigates back to the plan or exercises page without saving.

---

## Behavior Notes

- Show `CircularProgress` while loading exercise/plan data.
- If the plan has only 1 exercise, skip the progress bar.
- On browser back / navigation away mid-session, show an MUI `Dialog` confirmation: "Are you sure you want to leave? Your session won't be saved."
- The page should work in landscape orientation on mobile without UI overflow.

---

## Acceptance Criteria

- Trainees can run a full plan end-to-end.
- Trainees can run a single exercise.
- Timer works correctly with all controls.
- YouTube and video embeds display inline.
- Session data is saved to Firestore via `createTrainingSession()` on "Save Session".
- No TypeScript errors.
