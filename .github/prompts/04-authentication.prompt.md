---
mode: agent
description: Step 04 – Implement Firebase Authentication with email/password and Google sign-in. Create the useAuth hook, auth service, and Login/Register pages.
---

# Step 04 – Authentication

Implement user authentication using **Firebase Authentication**. Cover email/password and Google sign-in. Microsoft sign-in is optional — add it only if it does not introduce complexity.

---

## `src/services/auth.ts`

Create an auth service with the following functions using the Firebase Auth modular SDK:

```ts
signInWithEmail(email: string, password: string): Promise<void>
signUpWithEmail(email: string, password: string, name: string): Promise<void>
signInWithGoogle(): Promise<void>
signOut(): Promise<void>
```

Rules:
- `signUpWithEmail` must also call `createUserProfile()` from `src/services/users.ts` to create the Firestore user document with `role: 'trainee'` by default.
- After Google sign-in, check if a user profile already exists in Firestore. If not, create one with `role: 'trainee'`.
- Never expose Firebase Auth errors with raw error codes — map them to friendly messages.

---

## `src/hooks/useAuth.ts`

Create a custom React hook `useAuth` that:
- Subscribes to `onAuthStateChanged` from Firebase Auth.
- Fetches the `AppUser` profile from Firestore once the Firebase user is known.
- Returns:

```ts
{
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
```

- Use `useState` and `useEffect`.
- Unsubscribe from `onAuthStateChanged` on cleanup.

---

## `src/contexts/AuthContext.tsx`

Create a React context that wraps `useAuth` so the auth state is accessible throughout the app without prop drilling:

```ts
export const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) { ... }

export function useAuthContext(): ReturnType<typeof useAuth> { ... }
```

Wrap `<App />` with `<AuthProvider>` in `src/main.tsx`.

---

## `src/pages/LoginPage.tsx`

Create a login page with:
- MUI `Card` centered on screen, maximum width 420px.
- App logo/title at the top ("🏀 Basketball Training").
- `TextField` for email and password.
- "Sign In" `Button` (full width, contained).
- "Sign in with Google" `Button` with Google icon (outlined).
- Link/button to switch to the Register page.
- Display inline error messages using MUI `Alert`.
- Show a `CircularProgress` while loading.

---

## `src/pages/RegisterPage.tsx`

Create a registration page with:
- Same card layout as LoginPage.
- `TextField` fields: Name, Email, Password, Confirm Password.
- Client-side validation: passwords must match, all fields required.
- "Create Account" `Button`.
- Link to go back to Login.
- Display errors with MUI `Alert`.

---

## Routing (temporary)

In `src/App.tsx`, set up minimal routing using `react-router-dom`:
- `/login` → `<LoginPage />`
- `/register` → `<RegisterPage />`
- `/` → redirect to `/login` if unauthenticated, or placeholder dashboard if authenticated.

Full role-based routing is handled in Step 05.

---

## Acceptance Criteria

- Email/password login and registration work end-to-end.
- Google sign-in works.
- On sign-up, a user document is created in Firestore with `role: 'trainee'`.
- Auth state persists on page refresh.
- Errors show as friendly messages, not raw Firebase codes.
- No TypeScript errors.
