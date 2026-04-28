# Basketball Training App – Copilot Instructions

## Project Overview

This is a **mobile-first Progressive Web App (PWA)** for basketball training.

- **Trainers (Admins)** create structured training plans and manage the exercise library.
- **Trainees** execute training sessions with a timer, create custom plans, and track history.

## Tech Stack (non-negotiable)

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + TypeScript |
| UI library | MUI v6 (Material UI) |
| Build tool | Vite |
| PWA | vite-plugin-pwa |
| Backend / DB | Firebase (Firestore) |
| Auth | Firebase Authentication |
| File storage | Firebase Storage |
| Hosting target | Vercel or Netlify |

## Project Conventions

- **All code in TypeScript** – no `any` unless absolutely unavoidable, prefer explicit types.
- **Component files**: one component per file, PascalCase filenames (e.g. `ExerciseCard.tsx`).
- **Firebase services**: isolated in `src/services/` (e.g. `src/services/auth.ts`, `src/services/exercises.ts`).
- **Shared types**: all TypeScript types/interfaces in `src/types/index.ts`.
- **Custom hooks**: in `src/hooks/` (e.g. `useAuth.ts`, `useTimer.ts`).
- **Pages**: in `src/pages/` (e.g. `src/pages/Dashboard.tsx`).
- **Reusable UI components**: in `src/components/`.
- **Admin-only pages**: in `src/pages/admin/`.
- Use `async/await` throughout – no `.then().catch()` chains.
- Export Firebase app instance from `src/firebase.ts` and import it everywhere.
- **No hardcoded Firebase config** – use `.env` variables prefixed with `VITE_`.

## Roles

- `admin` – full access: exercise CRUD, plan CRUD, media upload, user management.
- `trainee` – limited access: view/run predefined plans, manage own custom plans and history.

## Firestore Security

Firestore security rules must enforce role-based access at the backend level.  
Never rely solely on frontend routing for access control.

## Design Principles

- Mobile-first, large touch targets.
- Light and dark theme via MUI `ThemeProvider` with a toggle.
- Clean, minimalistic, teen-friendly UI.
- Minimal friction to start a workout.
