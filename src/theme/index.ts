import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

const sharedConfig = {
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
          textTransform: 'none' as const,
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
};

export const lightTheme: Theme = createTheme({
  ...sharedConfig,
  palette: {
    mode: 'light',
    primary: { main: '#1565C0' },
    secondary: { main: '#FF6F00' },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
});

export const darkTheme: Theme = createTheme({
  ...sharedConfig,
  palette: {
    mode: 'dark',
    primary: { main: '#42A5F5' },
    secondary: { main: '#FFB300' },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
});
