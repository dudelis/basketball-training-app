# Project Progress

## Steps Overview
| Step | Title | Status |
|------|-------|--------|
| 01 | Project Setup | ✅ Done |
| 02 | TypeScript Data Models | ✅ Done |
| 03 | Firebase Services | ✅ Done |
| 04 | Authentication | ✅ Done |
| 05 | Routing and Layout | ✅ Done |
| 06 | Theme and Dark Mode | ✅ Done |
| 07 | Exercise Library (Admin) | ✅ Done |
| 08 | Training Plans (Admin) | ✅ Done |
| 09 | Trainee Exercises and Custom Plans | ✅ Done |
| 10 | Timer System | ✅ Done |
| 11 | Active Session | ✅ Done |
| 12 | Training History | ⬜ Pending |
| 13 | Profile Management | ⬜ Pending |
| 14 | Dashboard | ⬜ Pending |
| 15 | PWA and Deployment | ⬜ Pending |

## Step Details

### ✅ Step 11 – Active Session
**Commit:** `47a368e` – (included with Step 10)
- `src/pages/ActiveSessionPage.tsx` — full training session flow
- Loads plan or single exercise from Firestore
- Shows MediaPanel (YouTube/images) + TimerDisplay side-by-side
- Tracks per-exercise results (done/skip)
- Session summary screen with exercise checklist
- Saves `TrainingSession` document to Firestore on completion
- Navigation guards: `beforeunload` + `popstate` when session is running

### ✅ Step 10 – Timer System
**Commit:** `47a368e` – "Step 10: Timer system"
- `src/hooks/useTimer.ts` — countdown with localStorage persistence (`bball_timer_v1`), beep on finish, Web Notifications, adjust ±1/5 min
- `src/components/TimerDisplay.tsx` — large countdown display, color states (green/orange/red/grey), Pause/Resume/Reset buttons, completion banner
- **Bug fix** (`525c6d1`): `adjust()` now triggers finish when paused timer is adjusted to 0 (extended condition to `running || paused`); React 18 Strict Mode handled via `finishedRef` guard

### ✅ Step 09 – Trainee Exercises and Custom Plans
**Commit:** `2b06f52` – "Step 09: Trainee Exercise Library and Custom Plans"
- `src/components/ExerciseCard.tsx`
- `src/pages/ExercisesPage.tsx`
- `src/pages/MyPlansPage.tsx`
- `src/pages/UserPlanFormPage.tsx`

### ✅ Step 08 – Training Plans (Admin)
**Commit:** `f5aff5b` – "Step 08: Training Plans Admin"
- `src/pages/admin/AdminPlansPage.tsx`
- `src/pages/admin/AdminPlanFormPage.tsx`
- `src/components/ExercisePickerDialog.tsx`
- `src/pages/PlansPage.tsx` (trainee view)

### ✅ Step 07 – Exercise Library (Admin)
**Commit:** `37a1b5c` – "Step 07: Exercise Library Admin"
- `src/components/MediaUpload.tsx`
- `src/pages/admin/AdminExerciseTypesPage.tsx`
- `src/pages/admin/AdminExercisesPage.tsx`
- `src/pages/admin/AdminExerciseFormPage.tsx`
- **Bug fix** (`525c6d1`): `createExercise()` strips `undefined` fields before `addDoc` (Firestore rejects undefined)

### ✅ Step 03 – Firebase Services
**Commit:** `4f23ac2` – "Step 03: Firebase service modules and Firestore security rules"
- Created `src/services/` with 6 modules: users, exerciseTypes, exercises, trainingPlans, userPlans, trainingSessions, storage
- All collections use named constants; all functions use async/await
- `firestore.rules` with RBAC: admin full access, trainees scoped to own data
- `firebase.json` + `firestore.indexes.json` generated via `firebase init firestore`
- Rules deployed to Firebase project `basketball-training-app-a5360`
- Build passes ✅
- **Bug fix** (`525c6d1`): `createTrainingPlan()` and `createTrainingSession()` strip `undefined` fields before `addDoc`

**Commit:** `0ab5b7a` – "Step 02: TypeScript data models"
- Populated `src/types/index.ts` with all 12 shared types
- AppUser, UserRole, ExerciseType, Exercise, PlanExercise, TrainingPlan, UserPlan, SessionExercise, TrainingSession, TimerStatus, TimerState
- No Firebase or React imports — pure TypeScript
- Build passes ✅
**Commit:** `00065fe` – "Step 01: Project setup - Vite + React + TS + MUI + Firebase + PWA"
- Vite 8 + React 19 + TypeScript scaffolded
- MUI v6, Firebase, React Router v6, vite-plugin-pwa installed
- Folder structure: components/, hooks/, pages/admin/, services/, types/, theme/
- src/firebase.ts created with auth, db, storage exports
- .env.example created; .env gitignored
- PWA manifest configured in vite.config.ts
- TypeScript strict mode enabled
- Build passes ✅

## Step Details

### ✅ Step 03 – Firebase Services
**Commit:** `4f23ac2` – "Step 03: Firebase service modules and Firestore security rules"
- Created `src/services/` with 6 modules: users, exerciseTypes, exercises, trainingPlans, userPlans, trainingSessions, storage
- All collections use named constants; all functions use async/await
- `firestore.rules` with RBAC: admin full access, trainees scoped to own data
- `firebase.json` + `firestore.indexes.json` generated via `firebase init firestore`
- Rules deployed to Firebase project `basketball-training-app-a5360`
- Build passes ✅


**Commit:** `0ab5b7a` – "Step 02: TypeScript data models"
- Populated `src/types/index.ts` with all 12 shared types
- AppUser, UserRole, ExerciseType, Exercise, PlanExercise, TrainingPlan, UserPlan, SessionExercise, TrainingSession, TimerStatus, TimerState
- No Firebase or React imports — pure TypeScript
- Build passes ✅
**Commit:** `00065fe` – "Step 01: Project setup - Vite + React + TS + MUI + Firebase + PWA"
- Vite 8 + React 19 + TypeScript scaffolded
- MUI v6, Firebase, React Router v6, vite-plugin-pwa installed
- Folder structure: components/, hooks/, pages/admin/, services/, types/, theme/
- src/firebase.ts created with auth, db, storage exports
- .env.example created; .env gitignored
- PWA manifest configured in vite.config.ts
- TypeScript strict mode enabled
- Build passes ✅
