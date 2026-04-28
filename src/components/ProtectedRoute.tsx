import { Box, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import type { UserRole } from '../types';

type Props = {
  children: ReactNode;
  requiredRole?: UserRole;
};

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
