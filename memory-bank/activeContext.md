# Active Context

## Current Status
**All 15 steps complete. Post-step improvements in progress.**
**Last session: Data model refactor + mobile nav fix + exercise type seeding**

## What Was Just Done (This Session)

### Fixed Duplicate ProfilePage Export (`59f4885`)
- Old version of `ProfilePage` was appended rather than replaced; removed stale duplicate function

### Step 14 – Dashboard (`6b3c715`)
- `src/pages/DashboardPage.tsx` — role-aware: TraineeDashboard (weekly stats, Quick Start, recent activity) + AdminDashboard (stat cards + quick action buttons)

### Step 15 – PWA & Deployment (`e3d69f1`)
- Full VitePWA config in `vite.config.ts` (manifest, workbox, runtime caching, navigateFallback)
- Placeholder icons: `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/apple-touch-icon.png`
- `public/offline.html` — branded offline fallback
- `README.md` rewritten with deployment instructions

### Admin Dashboard Page (`4fdea7d`)
- `src/pages/admin/AdminDashboardPage.tsx` — stats row (exercises/plans/types) + ActionCards for nav

### Two-Table Type/Subtype Data Model (`63914a3`)
- `src/types/index.ts`: Added `ExerciseSubtype` type; `subtypeId?: string` on `Exercise`
- `src/services/exerciseSubtypes.ts`: New CRUD service for `exerciseSubtypes` Firestore collection
- `src/services/exerciseTypes.ts`: Reverted to clean single-collection (no parentId)
- `src/pages/admin/AdminExerciseTypesPage.tsx`: Hierarchical collapsible list; seed + reset/reseed button; add/edit/delete both levels
- `src/pages/admin/AdminExercisesPage.tsx`: Shows type + subtype chip
- `src/pages/admin/AdminExerciseFormPage.tsx`: Cascading type → subtype selects
- `src/pages/ExercisesPage.tsx`: Type + conditional subtype filter
- `firestore.rules`: Added `exerciseSubtypes` collection (read: authenticated, write: admin)

### Mobile Bottom Nav Fix (`016414e`)
- Reduced from 6 to 5 items per role
- Admins: Dashboard → Exercises → Plans → History → Admin
- Trainees: Dashboard → Exercises → Plans → My Plans → History

### Exercise Type Seeding (`bd3946a`)
- Added **Reset & Reseed** button (orange, header, visible when data exists) with confirmation dialog
- Wipes all existing `exerciseTypes` + `exerciseSubtypes` then recreates from `SEED_DATA`
- Fixed `Game Situations` subtypes: `2v2` and `3v3` are now separate entries
- All 10 types + subtypes seeded and verified in Firestore

## Active Decisions / Notes
- MUI v9 (not v6) — `secondaryTypographyProps` removed; system props must go inside `sx={}`
- `inputProps` removed in MUI v9 — use `slotProps={{ htmlInput: { ... } }}`
- Firebase project: `basketball-training-app-a5360`
- User role must be set to `admin` in Firestore manually (Firebase Console)
- Firestore rejects `undefined` field values — always strip before writing
- React 18 Strict Mode: never mutate refs inside `setState` updater; use `triggerFinish()` pattern
- Timer STORAGE_KEY: `'bball_timer_v1'`; `ActiveSessionPage` clears it on mount
- Two Firestore collections for taxonomy: `exerciseTypes` (root) and `exerciseSubtypes` (with `typeId` FK)
- Bottom nav limited to 5 items max — admins and trainees have different sets

## TODOs (deferred)

- **Profile photo upload** (`src/pages/ProfilePage.tsx`): Upload button present but non-functional. Requires Firebase Storage (Blaze plan). Once upgraded: call `uploadProfileImage(userId, file)` in `handleSave`, enable file input overlay. `src/services/storage.ts` already implemented.
- **PWA icons**: Placeholder PNGs in `public/`. Replace with real branded icons before production launch.
- **Google profile photo**: Not displaying — likely CORS or Firebase Auth photo URL issue. Investigate after Storage upgrade.

## What to Do Next
All 15 prompt steps are done. Remaining work:
- Replace placeholder PWA icons with real assets
- Upgrade Firebase to Blaze plan → enable Storage → wire up profile photo upload
- Consider adding HistoryPage detail view (per-session breakdown)
- Consider adding exercise search/filter improvements
