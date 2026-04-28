# Active Context

## Current Status
**Last completed step: Step 01 – Project Setup**
**Next step: Step 02 – TypeScript Data Models**

## What Was Just Done (Step 01)
- Scaffolded Vite + React 19 + TypeScript project
- Installed all required dependencies (MUI v6, Firebase, React Router v6, vite-plugin-pwa)
- Created full folder structure under `src/`
- Created `src/firebase.ts` with Auth, Firestore, Storage exports
- Created `.env.example` and `.env` (gitignored)
- Configured `vite-plugin-pwa` with Basketball Training PWA manifest
- Enabled TypeScript strict mode
- Simplified `App.tsx` and `main.tsx` to minimal placeholder
- Build passes with zero errors ✅

## Active Decisions / Notes
- Using `--legacy-peer-deps` for npm installs due to vite-plugin-pwa/Vite 8 incompatibility
- React version is 19 (Vite scaffold default) — prompt specified 18, but 19 works fine
- `.env` has empty Firebase values — needs to be filled with real Firebase project config before running auth/db features

## What to Do Next
Read `.github/prompts/02-typescript-data-models.prompt.md` and implement step 02.
