# 🏀 Basketball Training App

A mobile-first Progressive Web App for basketball training. Trainers create structured plans and manage the exercise library; trainees execute sessions with a timer and track their history.

## Tech Stack

- **Frontend**: React 18 + TypeScript, MUI v9, Vite
- **Backend**: Firebase (Firestore, Auth, Storage)
- **PWA**: vite-plugin-pwa (installable, offline-capable)

## Local Development

```bash
npm install        # install dependencies
npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview production build
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase project values:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Never commit `.env` — it is gitignored.

## Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Google and Email/Password providers
3. Enable **Firestore** → start in production mode
4. Deploy security rules: `firebase deploy --only firestore:rules`
5. (Optional) Enable **Storage** for photo uploads — requires Blaze plan

## Deployment

### Vercel

Import the repo, add environment variables in the dashboard, and deploy.  
SPA routing is handled via `vercel.json`.

### Netlify

Import the repo, add environment variables in the dashboard, and deploy.  
Build config and redirects are in `netlify.toml`.

---

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
