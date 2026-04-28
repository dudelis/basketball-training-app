# Project Progress

## Steps Overview
| Step | Title | Status |
|------|-------|--------|
| 01 | Project Setup | ✅ Done |
| 02 | TypeScript Data Models | ✅ Done |
| 03 | Firebase Services | ✅ Done |
| 04 | Authentication | ✅ Done |
| 05 | Routing and Layout | ✅ Done |
| 06 | Theme and Dark Mode | ⬜ Pending |
| 07 | Exercise Library (Admin) | ⬜ Pending |
| 08 | Training Plans (Admin) | ⬜ Pending |
| 09 | Trainee Exercises and Custom Plans | ⬜ Pending |
| 10 | Timer System | ⬜ Pending |
| 11 | Active Session | ⬜ Pending |
| 12 | Training History | ⬜ Pending |
| 13 | Profile Management | ⬜ Pending |
| 14 | Dashboard | ⬜ Pending |
| 15 | PWA and Deployment | ⬜ Pending |

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
