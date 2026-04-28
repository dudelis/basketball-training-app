---
mode: agent
description: Step 15 – Configure vite-plugin-pwa with a full manifest, service worker, and offline fallback. Prepare the app for Vercel or Netlify deployment.
---

# Step 15 – PWA Configuration & Deployment

Finalize the app as a production-ready **Progressive Web App** and prepare deployment configuration for Vercel or Netlify.

---

## PWA Configuration (`vite.config.ts`)

Update the `vite-plugin-pwa` configuration with a complete manifest and service worker strategy:

```ts
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
  manifest: {
    name: 'Basketball Training',
    short_name: 'BBall Training',
    description: 'Track your basketball training sessions with timer and plan management.',
    theme_color: '#1565C0',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait-primary',
    icons: [
      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        // Cache Google Fonts
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
      {
        // Cache Firebase Storage media
        urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'firebase-storage-cache',
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
        },
      },
    ],
  },
})
```

---

## PWA Icons

Create placeholder PNG icons in `public/`:
- `public/pwa-192x192.png` — a simple basketball emoji on blue background (or use a placeholder generator comment in code).
- `public/pwa-512x512.png`
- `public/favicon.ico`
- `public/apple-touch-icon.png`

> Note: In a real project these would be proper designed icons. For now, use any 192×192 and 512×512 solid-color PNG as placeholders and note where to replace them.

---

## Offline Fallback

Create `public/offline.html` — a minimal HTML page shown when the user is offline and a cached page is not available:
- Simple message: "You're offline. Please check your connection."
- Same brand color (`#1565C0`) heading.
- No external resources.

Register it in the Workbox config:
```ts
offlineFallback: '/offline.html'
```

---

## `vercel.json`

Create a `vercel.json` at the project root for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## `netlify.toml`

Create a `netlify.toml` at the project root for SPA routing and build config:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## `README.md` – Deployment Section

Append a deployment section to `README.md` with:
- Local development: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Environment variable setup instructions.
- Firebase project setup steps (brief).
- Vercel and Netlify one-click deploy instructions.

---

## Final Checklist

Verify the following before considering the app complete:
- [ ] `npm run build` completes without errors.
- [ ] `npm run preview` serves the app correctly.
- [ ] Lighthouse PWA score is ≥ 90.
- [ ] The app can be installed from the browser on mobile.
- [ ] All protected routes enforce authentication.
- [ ] Firestore security rules are deployed (`firebase deploy --only firestore:rules`).
- [ ] `.env` is not committed to git.
- [ ] TypeScript strict mode: no errors.

---

## Acceptance Criteria

- `vite-plugin-pwa` is fully configured with manifest and Workbox.
- `vercel.json` and `netlify.toml` are present.
- App builds successfully for production.
- PWA is installable on mobile devices.
- Offline fallback page renders when offline.
