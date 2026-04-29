import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Avatar, Chip, Button,
  Paper, CircularProgress, List, ListItem, ListItemText, Divider,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HistoryIcon from '@mui/icons-material/History';
import { useAuthContext } from '../contexts/AuthContext';
import { getTrainingSessions } from '../services/trainingSessions';
import { getTrainingPlans } from '../services/trainingPlans';
import { getExercises } from '../services/exercises';
import { getExerciseTypes } from '../services/exerciseTypes';
import type { TrainingSession } from '../types';

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const time = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  return `Good ${time}, ${name}! 👋`;
}

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Trainee Dashboard ──────────────────────────────────────────────────────

interface TraineeDashboardProps {
  userId: string;
}

function TraineeDashboard({ userId }: TraineeDashboardProps) {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [planMap, setPlanMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const [allSessions, plans] = await Promise.all([
        getTrainingSessions(userId),
        getTrainingPlans(),
      ]);
      const sorted = [...allSessions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setSessions(sorted);
      setPlanMap(Object.fromEntries(plans.map((p) => [p.id, p.title])));
      setLoading(false);
    })();
  }, [userId]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>;
  }

  const weekStart = getWeekStart();
  const weeklySessions = sessions.filter((s) => new Date(s.date) >= weekStart);
  const weeklyExercises = weeklySessions.reduce((acc, s) => acc + s.exercises.filter((e) => e.completed).length, 0);
  const weeklyMinutes = weeklySessions.reduce(
    (acc, s) => acc + s.exercises.reduce((sum, e) => sum + (e.actualDuration ?? 0), 0),
    0
  );

  const recent = sessions.slice(0, 3);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Stats Row */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>This Week</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
          {[
            { label: 'Sessions', value: weeklySessions.length },
            { label: 'Minutes', value: weeklyMinutes },
            { label: 'Exercises', value: weeklyExercises },
          ].map(({ label, value }) => (
            <Paper key={label} elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Quick Start */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Quick Start</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<FitnessCenterIcon />}
            onClick={() => navigate('/exercises')}
            sx={{ py: 2 }}
          >
            Browse Exercises
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={() => navigate('/plans')}
            sx={{ py: 2 }}
          >
            Start a Plan
          </Button>
        </Box>
      </Box>

      {/* Recent Activity */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Recent Activity</Typography>
          <Link to="/history" style={{ textDecoration: 'none' }}>
            <Button size="small" startIcon={<HistoryIcon />}>View All</Button>
          </Link>
        </Box>
        {recent.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No training sessions yet. Let's get started!
            </Typography>
            <Button variant="contained" onClick={() => navigate('/plans')}>Browse Plans</Button>
          </Paper>
        ) : (
          <Paper variant="outlined" sx={{ borderRadius: 2 }}>
            <List disablePadding>
              {recent.map((s, i) => {
                const completed = s.exercises.filter((e) => e.completed).length;
                const total = s.exercises.length;
                const planName = s.planId ? (planMap[s.planId] ?? 'Unknown Plan') : 'Solo Exercise';
                return (
                  <Box key={s.id}>
                    {i > 0 && <Divider />}
                    <ListItem
                      component="div"
                      onClick={() => navigate(`/history/${s.id}`)}
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <ListItemText
                        primary={planName}
                        secondary={`${formatDate(s.date)} · ${completed}/${total} exercises`}
                      />
                    </ListItem>
                  </Box>
                );
              })}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────

function AdminDashboard() {
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
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Overview Stats */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Overview</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
          {[
            { label: 'Exercises', value: stats.exercises },
            { label: 'Plans', value: stats.plans },
            { label: 'Exercise Types', value: stats.types },
            { label: 'Users', value: '—' },
          ].map(({ label, value }) => (
            <Paper key={label} elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Quick Actions</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button variant="contained" size="large" onClick={() => navigate('/admin/exercises')} sx={{ py: 2 }}>
            Manage Exercises
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/admin/plans')} sx={{ py: 2 }}>
            Manage Plans
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/admin/exercise-types')} sx={{ py: 2 }}>
            Manage Exercise Types
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, firebaseUser } = useAuthContext();

  const avatarSrc = user?.profileImageUrl ?? firebaseUser?.photoURL ?? undefined;
  const initials = user?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Welcome Card */}
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={avatarSrc}
            sx={{ width: 56, height: 56, fontSize: 24, cursor: 'pointer', flexShrink: 0 }}
            onClick={() => navigate('/profile')}
          >
            {!avatarSrc && initials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {getGreeting(user?.name ?? 'Athlete')}
            </Typography>
            <Chip
              label={user?.role === 'admin' ? 'Admin' : 'Trainee'}
              color={user?.role === 'admin' ? 'primary' : 'default'}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Role-specific content */}
      {user?.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <TraineeDashboard userId={user?.id ?? ''} />
      )}
    </Box>
  );
}

