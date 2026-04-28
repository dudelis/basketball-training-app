# System Patterns & Conventions

## Folder Structure
```
src/
  components/       # Reusable UI components (PascalCase filenames)
  hooks/            # Custom React hooks (e.g. useAuth.ts, useTimer.ts)
  pages/            # Page-level components (e.g. Dashboard.tsx)
    admin/          # Admin-only pages
  services/         # Firebase service modules (e.g. auth.ts, exercises.ts)
  types/            # All shared TypeScript types → index.ts
  theme/            # MUI theme config → index.ts
  firebase.ts       # Firebase app init + service exports
  main.tsx          # App entry point
  App.tsx           # Root component
```

## Naming Conventions
- Component files: PascalCase (e.g. `ExerciseCard.tsx`)
- One component per file
- Custom hooks: camelCase with `use` prefix (e.g. `useAuth.ts`)
- Service files: camelCase (e.g. `exercises.ts`)

## Code Conventions
- All code in TypeScript — no `any` unless absolutely unavoidable
- Use `async/await` throughout — no `.then().catch()` chains
- Export Firebase app instance from `src/firebase.ts` and import everywhere
- No hardcoded Firebase config — use `.env` variables prefixed with `VITE_`
- All shared types/interfaces in `src/types/index.ts`

## Auth & Roles
- Roles: `admin` | `trainee`
- Role stored in Firestore user document
- Firestore security rules enforce RBAC (not just frontend routing)

## Theme
- MUI ThemeProvider with light/dark toggle
- Theme defined in `src/theme/index.ts`
