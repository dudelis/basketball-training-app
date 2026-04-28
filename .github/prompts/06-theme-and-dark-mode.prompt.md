---
mode: agent
description: Step 06 – Configure the MUI theme with light/dark mode, custom palette, typography, and a ThemeContext for the toggle.
---

# Step 06 – MUI Theme & Dark Mode

Configure the MUI theme with a custom palette and set up a global light/dark mode toggle that persists the user's preference in `localStorage`.

---

## `src/theme/index.ts`

Define both light and dark MUI themes:

```ts
import { createTheme, Theme } from '@mui/material/styles';

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',     // deep blue
    },
    secondary: {
      main: '#FF6F00',     // amber/orange (basketball accent)
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 64,
        },
      },
    },
  },
});

export const darkTheme: Theme = createTheme({
  ...lightTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#42A5F5',     // lighter blue for dark mode
    },
    secondary: {
      main: '#FFB300',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
});
```

---

## `src/contexts/ThemeContext.tsx`

Create a React context for theme management:

```ts
type ThemeContextType = {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read initial value from localStorage, default to 'light'
  // Persist changes to localStorage on toggle
  // Wrap children with MUI ThemeProvider using the active theme
}

export function useThemeContext(): ThemeContextType { ... }
```

---

## Integration

In `src/main.tsx`, wrap the app with both `<AuthProvider>` and `<ThemeProvider>`:

```tsx
<ThemeProvider>
  <CssBaseline />
  <AuthProvider>
    <App />
  </AuthProvider>
</ThemeProvider>
```

---

## Dark Mode Toggle

In `src/components/AppLayout.tsx` (created in Step 05), connect the theme toggle icon button to `useThemeContext().toggleTheme()`:
- Use `Brightness4Icon` (moon) when in light mode.
- Use `Brightness7Icon` (sun) when in dark mode.

---

## Acceptance Criteria

- Light and dark modes both render without visual errors.
- Theme preference is restored from `localStorage` on page refresh.
- Toggle button switches the theme globally.
- MUI `CssBaseline` is applied for consistent baseline styles.
- No TypeScript errors.
