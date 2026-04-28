# Active Context

## Current Status
**Last completed step: Step 04 – Authentication**
**Next step: Step 05 – Routing and Layout**

## What Was Just Done (Step 04)
- `src/services/auth.ts` — signInWithEmail, signUpWithEmail, signInWithGoogle, signOut; friendly error messages mapped from Firebase error codes
- `src/hooks/useAuth.ts` — subscribes to onAuthStateChanged, fetches AppUser from Firestore, returns full auth state + actions
- `src/contexts/AuthContext.tsx` — AuthProvider wraps the app; useAuthContext hook for consumers
- `src/pages/LoginPage.tsx` — MUI Card, email/password form, Google sign-in, error Alert, link to Register
- `src/pages/RegisterPage.tsx` — name/email/password/confirm form, client-side validation, error Alert, link to Login
- `src/App.tsx` — BrowserRouter + Routes: /login, /register, / (redirects to /login if unauthenticated)
- `src/main.tsx` — wrapped with AuthProvider
- Build passes ✅

## Active Decisions / Notes
- MUI v6 system props (display, fontWeight, etc.) must go inside `sx={}`, not as direct props — causes TS2769 otherwise
- Using `--legacy-peer-deps` for npm installs
- Firebase project: `basketball-training-app-a5360`

## What to Do Next
Read `.github/prompts/05-routing-and-layout.prompt.md` and implement step 05.
