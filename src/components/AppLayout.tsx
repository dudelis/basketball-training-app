import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HistoryIcon from '@mui/icons-material/History';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import type { ReactNode } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';

type Props = {
  children: ReactNode;
};

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
  { label: 'Exercises', icon: <FitnessCenterIcon />, path: '/exercises' },
  { label: 'Plans', icon: <ListAltIcon />, path: '/plans' },
  { label: 'My Plans', icon: <BookmarkIcon />, path: '/my-plans' },
  { label: 'History', icon: <HistoryIcon />, path: '/history' },
];

const ADMIN_NAV_ITEM = {
  label: 'Admin',
  icon: <AdminPanelSettingsIcon />,
  path: '/admin',
};

export default function AppLayout({ children }: Props) {
  const { user } = useAuthContext();
  const { mode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = user?.role === 'admin' ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS;

  const currentNavIndex = navItems.findIndex((item) =>
    location.pathname.startsWith(item.path)
  );
  const navValue = currentNavIndex === -1 ? 0 : currentNavIndex;

  function handleNavChange(_: React.SyntheticEvent, newValue: number) {
    navigate(navItems[newValue].path);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            🏀 BBall Training
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/profile')}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Offset for fixed AppBar */}
      <Toolbar />

      <Box component="main" sx={{ flexGrow: 1, overflowY: 'auto', pb: 8, px: 2, pt: 2 }}>
        {children}
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation value={navValue} onChange={handleNavChange}>
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
