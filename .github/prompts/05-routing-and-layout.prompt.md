---
mode: agent
description: Step 05 – Set up React Router v6 with role-based protected routes, an app shell layout with bottom navigation, and a placeholder Dashboard page.
---

# Step 05 – Routing & App Shell Layout

Implement the full routing structure with role-based protection and the main app shell (layout with navigation). All page components can be simple placeholders with a title — they are implemented in later steps.

---

## Route Structure

Use **React Router v6** with the following routes:

### Public Routes (unauthenticated only)
| Path | Component |
|---|---|
| `/login` | `LoginPage` |
| `/register` | `RegisterPage` |

### Protected Routes (authenticated, any role)
| Path | Component |
|---|---|
| `/` | Redirect to `/dashboard` |
| `/dashboard` | `DashboardPage` |
| `/exercises` | `ExercisesPage` |
| `/plans` | `PlansPage` |
| `/my-plans` | `MyPlansPage` |
| `/history` | `HistoryPage` |
| `/profile` | `ProfilePage` |
| `/session/:sessionId` | `ActiveSessionPage` |

### Admin-Only Routes (role === 'admin')
| Path | Component |
|---|---|
| `/admin` | `AdminDashboardPage` |
| `/admin/exercise-types` | `AdminExerciseTypesPage` |
| `/admin/exercises` | `AdminExercisesPage` |
| `/admin/plans` | `AdminPlansPage` |

---

## `src/components/ProtectedRoute.tsx`

Create a `ProtectedRoute` component that:
- Uses `useAuthContext()` to get `user` and `loading`.
- Shows a centered `CircularProgress` while loading.
- Redirects to `/login` if unauthenticated.
- Accepts an optional `requiredRole?: UserRole` prop.
- If `requiredRole === 'admin'` and user is not admin, redirect to `/dashboard`.

```tsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

<ProtectedRoute requiredRole="admin">
  <AdminDashboardPage />
</ProtectedRoute>
```

---

## `src/components/AppLayout.tsx`

Create the main app shell layout:
- **Top AppBar** with:
  - App title ("🏀 BBall Training") on the left.
  - Light/Dark mode toggle icon button on the right.
  - Profile avatar/icon button that navigates to `/profile`.
- **Bottom Navigation** (MUI `BottomNavigation`) with tabs:
  - Dashboard (home icon) → `/dashboard`
  - Exercises (fitness icon) → `/exercises`
  - Plans (list icon) → `/plans`
  - My Plans (person icon) → `/my-plans`
  - History (history icon) → `/history`
- **Main content area** between AppBar and BottomNavigation with scroll, padded to avoid overlap.
- The bottom nav should highlight the active route.
- Admin users get an additional "Admin" tab → `/admin`.

---

## `src/App.tsx`

Rewrite `src/App.tsx` to use `BrowserRouter` and include all routes defined above, wrapped properly with `ProtectedRoute`.

---

## Placeholder Pages

Create minimal placeholder pages for all routes not yet implemented. Each placeholder should only render an MUI `Typography` heading with the page name:

- `src/pages/DashboardPage.tsx`
- `src/pages/ExercisesPage.tsx`
- `src/pages/PlansPage.tsx`
- `src/pages/MyPlansPage.tsx`
- `src/pages/HistoryPage.tsx`
- `src/pages/ProfilePage.tsx`
- `src/pages/ActiveSessionPage.tsx`
- `src/pages/admin/AdminDashboardPage.tsx`
- `src/pages/admin/AdminExerciseTypesPage.tsx`
- `src/pages/admin/AdminExercisesPage.tsx`
- `src/pages/admin/AdminPlansPage.tsx`

---

## Acceptance Criteria

- Authenticated users land on `/dashboard` after login.
- Unauthenticated users are redirected to `/login` from any protected route.
- Non-admin users are redirected to `/dashboard` when accessing `/admin/*`.
- Bottom navigation reflects the current active route.
- No TypeScript errors.
