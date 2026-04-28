# Active Context

## Current Status
**Last completed step: Step 06 – Theme and Dark Mode**
**Next step: Step 07 – Exercise Library (Admin)**

## What Was Just Done (Step 06)
- `src/theme/index.ts` — `lightTheme` and `darkTheme` with custom palette, Inter font, rounded corners, button/card/bottomNav overrides
- `src/contexts/ThemeContext.tsx` — ThemeProvider wraps MUI ThemeProvider; reads/persists mode from localStorage; `useThemeContext()` hook
- `src/main.tsx` — wrapped with ThemeProvider (outside AuthProvider) + CssBaseline
- `src/components/AppLayout.tsx` — connected toggle to `useThemeContext()`; removed props threading from App.tsx
- Both themes verified in browser, localStorage persistence confirmed

## Active Decisions / Notes
- MUI v6 system props must go inside `sx={}` — direct shorthand props cause TS2769
- sharedConfig pattern used for theme (avoids spreading computed Theme object)
- Firebase project: `basketball-training-app-a5360`

## What to Do Next
Read `.github/prompts/07-exercise-library.prompt.md` and implement step 07.
