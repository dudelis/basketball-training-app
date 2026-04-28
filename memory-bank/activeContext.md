# Active Context

## Current Status
**Last completed step: Step 03 – Firebase Services**
**Next step: Step 04 – Authentication**

## What Was Just Done (Step 03)
- Created `src/services/` folder with 6 service modules:
  - `users.ts` – createUserProfile, getUserProfile, updateUserProfile
  - `exerciseTypes.ts` – CRUD for exercise type categories
  - `exercises.ts` – CRUD for exercises
  - `trainingPlans.ts` – CRUD for admin training plans
  - `userPlans.ts` – CRUD for trainee custom plans (userId-scoped)
  - `trainingSessions.ts` – create/read training sessions (userId-scoped)
  - `storage.ts` – profile image, exercise video/image upload + deleteFile
- Created `firestore.rules` with RBAC security rules
- Created `firebase.json` + `firestore.indexes.json` via `firebase init firestore`
- Deployed Firestore rules to Firebase project `basketball-training-app-a5360`
- `.firebaserc` is gitignored
- Build passes ✅

## Active Decisions / Notes
- Using `--legacy-peer-deps` for npm installs due to vite-plugin-pwa/Vite 8 incompatibility
- React version is 19 (Vite scaffold default) — prompt specified 18, but 19 works fine
- Firebase project: `basketball-training-app-a5360`
- `.env` is filled with real Firebase credentials

## What to Do Next
Read `.github/prompts/04-authentication.prompt.md` and implement step 04.
