---
mode: agent
description: Step 01 – Scaffold the project with Vite, React 18, TypeScript, MUI v6, vite-plugin-pwa, and Firebase SDK. Sets up the folder structure, environment variables, and base configuration.
---

# Step 01 – Project Setup

Scaffold a new **React 18 + TypeScript** project using **Vite** with the following configuration. Do not generate any feature code yet — only the project skeleton.

## 1. Initialize the Project

Run the Vite scaffolding command for React + TypeScript, then install all required dependencies:

**Dependencies:**
- `react`, `react-dom`
- `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
- `firebase` (latest v9+ modular SDK)
- `react-router-dom` v6
- `vite-plugin-pwa`

**Dev dependencies:**
- `typescript`, `@types/react`, `@types/react-dom`
- `vite`

## 2. Folder Structure

Create the following empty folders and placeholder `index.ts` files where noted:

```
src/
  components/        # Reusable UI components
  hooks/             # Custom React hooks
  pages/             # Page-level components
    admin/           # Admin-only pages
  services/          # Firebase service modules
  types/             # TypeScript types (create src/types/index.ts)
  theme/             # MUI theme configuration (create src/theme/index.ts)
```

## 3. Environment Variables

Create a `.env.example` file at the project root with the following keys (empty values):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Also create a `.env` file (copy of `.env.example`) and add `.env` to `.gitignore`.

## 4. Firebase Entry Point

Create `src/firebase.ts` that reads environment variables and exports the initialized Firebase app, Auth, Firestore, and Storage instances:

```ts
// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
```

## 5. Vite Config

Update `vite.config.ts` to register `vite-plugin-pwa` with a minimal manifest:
- App name: "Basketball Training"
- Short name: "BBall Training"
- Theme color: `#1565C0`
- Background color: `#ffffff`
- Display: `standalone`
- Icons: placeholder paths (to be replaced later)

## 6. TypeScript Config

Ensure `tsconfig.json` has:
- `"strict": true`
- `"jsx": "react-jsx"`
- `"moduleResolution": "bundler"` or `"node"`

## 7. Entry Point

Keep `src/main.tsx` and `src/App.tsx` minimal — just render `<App />` with a placeholder `<h1>Basketball Training App</h1>`.

## Acceptance Criteria

- `npm run dev` starts without errors
- TypeScript compilation has no errors
- Folder structure matches the layout above
- `.env` is in `.gitignore`
- `src/firebase.ts` exports `auth`, `db`, `storage`
