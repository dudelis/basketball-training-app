import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, CircularProgress,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';
import { getExercises } from '../../services/exercises';
import { getTrainingPlans } from '../../services/trainingPlans';
import { getExerciseTypes } from '../../services/exerciseTypes';

interface StatCardProps {
  label: string;
  value: number | string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Paper>
  );
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}

function ActionCard({ icon, title, subtitle, onClick }: ActionCardProps) {
  return (
    <Paper
      elevation={2}
      onClick={onClick}
      sx={{
        p: 2.5,
        borderRadius: 2,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        '&:hover': { bgcolor: 'action.hover' },
        transition: 'background-color 0.15s',
      }}
    >
      <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
      </Box>
    </Paper>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ exercises: 0, plans: 0, types: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const [exercises, plans, types] = await Promise.all([
        getExercises(),
        getTrainingPlans(),
        getExerciseTypes(),
      ]);
      setStats({ exercises: exercises.length, plans: plans.length, types: types.length });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>Admin Dashboard</Typography>

      {/* Overview stats */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Overview</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
          <StatCard label="Exercises" value={stats.exercises} />
          <StatCard label="Plans" value={stats.plans} />
          <StatCard label="Types" value={stats.types} />
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Manage Content</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <ActionCard
            icon={<FitnessCenterIcon fontSize="large" />}
            title="Exercises"
            subtitle={`${stats.exercises} exercises in library`}
            onClick={() => navigate('/admin/exercises')}
          />
          <ActionCard
            icon={<ListAltIcon fontSize="large" />}
            title="Training Plans"
            subtitle={`${stats.plans} predefined plans`}
            onClick={() => navigate('/admin/plans')}
          />
          <ActionCard
            icon={<CategoryIcon fontSize="large" />}
            title="Exercise Types"
            subtitle={`${stats.types} categories`}
            onClick={() => navigate('/admin/exercise-types')}
          />
        </Box>
      </Box>

      <Button variant="outlined" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </Button>
    </Box>
  );
}

