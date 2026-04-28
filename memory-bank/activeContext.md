# Active Context

## Current Status
**Last completed step: Step 07 – Exercise Library (Admin)**
**Next step: Step 08 – Training Plans (Admin)**

## What Was Just Done (Step 07)
- `src/components/MediaUpload.tsx` — reusable file upload component (existing URL chips + file picker)
- `src/pages/admin/AdminExerciseTypesPage.tsx` — full CRUD: list, FAB, add/edit dialog, delete confirm, snackbar
- `src/pages/admin/AdminExercisesPage.tsx` — card grid with type filter, FAB → new, edit/delete per card
- `src/pages/admin/AdminExerciseFormPage.tsx` — dual-mode create/edit form: title, type, description, duration, YouTube URL, video upload, up to 5 images
- `src/App.tsx` — added routes `/admin/exercises/new` and `/admin/exercises/:id`
- Verified in browser: admin role set in Firestore, Admin tab visible, exercise types CRUD works, new exercise form loads ✅

## Active Decisions / Notes
- MUI v6 system props must go inside `sx={}` — direct shorthand props cause TS2769
- `inputProps` removed in MUI v6 — use `slotProps={{ htmlInput: { ... } }}` instead
- sharedConfig pattern used for theme (avoids spreading computed Theme object)
- Firebase project: `basketball-training-app-a5360`
- User role must be set to `admin` in Firestore manually (Firebase Console) to access admin pages
- `firebase-admin` installed as devDependency (used for bootstrap scripting)

## What to Do Next
Read `.github/prompts/08-training-plans-admin.prompt.md` and implement step 08.
