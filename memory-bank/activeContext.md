# Active Context

## Current Status
**Last completed step: Step 05 – Routing and Layout**
**Next step: Step 06 – Theme and Dark Mode**

## What Was Just Done (Step 05)
- `src/components/ProtectedRoute.tsx` — auth guard with optional `requiredRole` prop; redirects unauthenticated → /login, non-admin → /dashboard
- `src/components/AppLayout.tsx` — fixed AppBar (title, theme toggle placeholder, profile icon) + fixed BottomNavigation (5 tabs + Admin tab for admins); active route highlighted
- 11 placeholder pages created: DashboardPage, ExercisesPage, PlansPage, MyPlansPage, HistoryPage, ProfilePage, ActiveSessionPage + 4 admin pages
- `src/App.tsx` rewritten — full route structure, public routes redirect authenticated users to /dashboard
- Build passes ✅, layout verified in browser

## Active Decisions / Notes
- MUI v6 system props must go inside `sx={}` — direct shorthand props cause TS2769
- Theme toggle button wired up in AppLayout (onToggleTheme/isDarkMode props) but no-op until Step 06
- `isDarkMode` state lives in App.tsx and will be connected to ThemeProvider in Step 06
- Firebase project: `basketball-training-app-a5360`

## What to Do Next
Read `.github/prompts/06-theme-and-dark-mode.prompt.md` and implement step 06.
