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
| 12 | Training History | ✅ Done |
| 13 | Profile Management | ✅ Done |
| 14 | Dashboard | ✅ Done |
| 15 | PWA and Deployment | ✅ Done |

## Post-Step Improvements
| Item | Commit | Status |
|------|--------|--------|
| Fix duplicate ProfilePage export | `59f4885` | ✅ Done |
| Admin Dashboard page | `4fdea7d` | ✅ Done |
| Two-table ExerciseType/Subtype model | `63914a3` | ✅ Done |
| Mobile bottom nav fix (5 items/role) | `016414e` | ✅ Done |
| Seed button UX + Reset & Reseed | `bd3946a` | ✅ Done |

## Step Details

### ✅ Step 15 – PWA & Deployment
**Commit:** `e3d69f1`
- Full VitePWA config: manifest, workbox, runtime caching, `navigateFallback: '/offline.html'`
- Placeholder icons: `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/apple-touch-icon.png`
- `public/offline.html` — branded offline fallback page
- `vercel.json` + `netlify.toml` confirmed correct
- `README.md` rewritten with deployment instructions
- Production build passes ✅

### ✅ Step 14 – Dashboard
**Commit:** `6b3c715`
- `src/pages/DashboardPage.tsx` — role-aware dashboard
- `TraineeDashboard`: weekly stats (sessions/minutes/exercises), Quick Start buttons, Recent Activity list
- `AdminDashboard`: 4 stat cards + 3 quick action buttons

### ✅ Step 13 – Profile Management
- `src/pages/ProfilePage.tsx` — edit name, view email/role, avatar, upload button (non-functional pending Blaze plan)
- `src/services/users.ts` — `updateUserProfile()`

### ✅ Step 12 – Training History
- `src/pages/HistoryPage.tsx` — list of past sessions, duration/exercise count, detail expand

### ✅ Step 11 – Active Session
**Commit:** `47a368e` (included with Step 10)
- `src/pages/ActiveSessionPage.tsx` — full session flow
- Loads plan or single exercise from Firestore
- MediaPanel + TimerDisplay side-by-side
- Per-exercise results (done/skip), session summary, saves `TrainingSession` to Firestore
- Navigation guards: `beforeunload` + `popstate` when session running

### ✅ Step 10 – Timer System
**Commit:** `47a368e`
- `src/hooks/useTimer.ts` — countdown with localStorage persistence (`bball_timer_v1`), beep, Web Notifications, adjust ±1/5 min
- `src/components/TimerDisplay.tsx` — large countdown, color states (green/orange/red/grey), Pause/Resume/Reset, completion banner
- **Bug fix** (`525c6d1`): `adjust()` triggers finish when paused timer adjusted to 0; React 18 Strict Mode handled via `finishedRef` guard

### ✅ Step 09 – Trainee Exercises and Custom Plans
**Commit:** `2b06f52`
- `src/components/ExerciseCard.tsx`
- `src/pages/ExercisesPage.tsx` — type + subtype filter (updated in `63914a3`)
- `src/pages/MyPlansPage.tsx`
- `src/pages/UserPlanFormPage.tsx`

### ✅ Step 08 – Training Plans (Admin)
**Commit:** `f5aff5b`
- `src/pages/admin/AdminPlansPage.tsx`
- `src/pages/admin/AdminPlanFormPage.tsx`
- `src/components/ExercisePickerDialog.tsx`
- `src/pages/PlansPage.tsx` (trainee view)

### ✅ Step 07 – Exercise Library (Admin)
**Commit:** `37a1b5c`
- `src/pages/admin/AdminExerciseTypesPage.tsx` — rewritten in `63914a3` with two-table hierarchy + Reset & Reseed
- `src/pages/admin/AdminExercisesPage.tsx` — rewritten in `63914a3` with subtype chip
- `src/pages/admin/AdminExerciseFormPage.tsx` — rewritten in `63914a3` with cascading type→subtype selects
- `src/services/exerciseSubtypes.ts` — new service added in `63914a3`
- **Bug fix** (`525c6d1`): `createExercise()` strips `undefined` fields before `addDoc`

### ✅ Step 03 – Firebase Services
**Commit:** `4f23ac2`
- `src/services/` — users, exerciseTypes, exerciseSubtypes, exercises, trainingPlans, userPlans, trainingSessions, storage
- `firestore.rules` with RBAC — updated in `63914a3` to include `exerciseSubtypes`
- Rules deployed to Firebase project `basketball-training-app-a5360`

### ✅ Steps 01–06
- `00065fe` — Project setup (Vite 8, React 19, TS, MUI, Firebase, PWA)
- `0ab5b7a` — TypeScript data models (12 shared types in `src/types/index.ts`; `ExerciseSubtype` added in `63914a3`)
- Auth, routing, layout, theme all complete

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
