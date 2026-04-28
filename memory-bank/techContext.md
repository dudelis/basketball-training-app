# Tech Context

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| UI Library | MUI v6 (Material UI) |
| Build Tool | Vite 8 |
| PWA | vite-plugin-pwa 1.2.0 (installed with --legacy-peer-deps) |
| Backend / DB | Firebase (Firestore) |
| Auth | Firebase Authentication |
| File Storage | Firebase Storage |
| Routing | React Router v6 |
| Hosting Target | Vercel or Netlify |

## Scripts
```bash
npm run dev       # Start dev server
npm run build     # tsc -b && vite build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Key Config Notes
- `vite-plugin-pwa` requires `--legacy-peer-deps` because it doesn't officially support Vite 8 yet
- TypeScript strict mode enabled (`"strict": true` in tsconfig.app.json)
- `moduleResolution: bundler`, `jsx: react-jsx`
- `noUnusedLocals: true`, `noUnusedParameters: true`
- No `any` types unless absolutely unavoidable

## Environment Variables
All Firebase config is in `.env` (gitignored). Template in `.env.example`.
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Firebase Entry Point
`src/firebase.ts` — exports `auth`, `db`, `storage`, and `default` app.
Always import Firebase services from this file.

## PWA Manifest (vite.config.ts)
- Name: "Basketball Training"
- Short name: "BBall Training"
- Theme color: `#1565C0`
- Background: `#ffffff`
- Display: `standalone`
- Icons: placeholder paths (to be replaced in Step 15)
