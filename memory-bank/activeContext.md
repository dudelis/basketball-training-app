# Active Context

## Current Status
**Last completed step: Step 02 – TypeScript Data Models**
**Next step: Step 03 – Firebase Services**

## What Was Just Done (Step 02)
- Populated `src/types/index.ts` with all shared types
- Types: AppUser, UserRole, ExerciseType, Exercise, PlanExercise, TrainingPlan, UserPlan, SessionExercise, TrainingSession, TimerStatus, TimerState
- No Firebase or React imports — pure TypeScript
- Build passes ✅

## Active Decisions / Notes
- Using `--legacy-peer-deps` for npm installs due to vite-plugin-pwa/Vite 8 incompatibility
- React version is 19 (Vite scaffold default) — prompt specified 18, but 19 works fine
- `.env` has empty Firebase values — needs to be filled with real Firebase project config before running auth/db features

## What to Do Next
Read `.github/prompts/03-firebase-services.prompt.md` and implement step 03.
**Note:** Step 03 requires Firebase project credentials — user needs to provide `.env` values before Firebase services can be tested. Firebase skill may also be needed.
