import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ExercisesPage from './pages/ExercisesPage';
import PlansPage from './pages/PlansPage';
import MyPlansPage from './pages/MyPlansPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import ActiveSessionPage from './pages/ActiveSessionPage';
import UserPlanFormPage from './pages/UserPlanFormPage';
import SessionDetailPage from './pages/SessionDetailPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminExerciseTypesPage from './pages/admin/AdminExerciseTypesPage';
import AdminExercisesPage from './pages/admin/AdminExercisesPage';
import AdminPlansPage from './pages/admin/AdminPlansPage';
import AdminExerciseFormPage from './pages/admin/AdminExerciseFormPage';
import AdminPlanFormPage from './pages/admin/AdminPlanFormPage';
import { Box, CircularProgress } from '@mui/material';

function AppRoutes() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Navigate to="/dashboard" replace />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      {[
        { path: '/dashboard', element: <DashboardPage /> },
        { path: '/exercises', element: <ExercisesPage /> },
        { path: '/plans', element: <PlansPage /> },
        { path: '/my-plans', element: <MyPlansPage /> },
        { path: '/history', element: <HistoryPage /> },
        { path: '/history/:sessionId', element: <SessionDetailPage /> },
        { path: '/profile', element: <ProfilePage /> },
        { path: '/session/:sessionId', element: <ActiveSessionPage /> },
        { path: '/session/exercise/:exerciseId', element: <ActiveSessionPage /> },
        { path: '/session/plan/:planId', element: <ActiveSessionPage /> },
        { path: '/my-plans/new', element: <UserPlanFormPage /> },
        { path: '/my-plans/:id', element: <UserPlanFormPage /> },
      ].map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <AppLayout>{element}</AppLayout>
            </ProtectedRoute>
          }
        />
      ))}

      {/* Admin-only routes */}
      {[
        { path: '/admin', element: <AdminDashboardPage /> },
        { path: '/admin/exercise-types', element: <AdminExerciseTypesPage /> },
        { path: '/admin/exercises', element: <AdminExercisesPage /> },
        { path: '/admin/exercises/new', element: <AdminExerciseFormPage /> },
        { path: '/admin/exercises/:id', element: <AdminExerciseFormPage /> },
        { path: '/admin/plans', element: <AdminPlansPage /> },
        { path: '/admin/plans/new', element: <AdminPlanFormPage /> },
        { path: '/admin/plans/:id', element: <AdminPlanFormPage /> },
      ].map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute requiredRole="admin">
              <AppLayout>{element}</AppLayout>
            </ProtectedRoute>
          }
        />
      ))}

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
