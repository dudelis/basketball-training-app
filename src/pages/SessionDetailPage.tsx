import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, CircularProgress, List, ListItem,
  ListItemText, Divider, IconButton, Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getTrainingSessionById } from '../services/trainingSessions';
import { getExerciseById } from '../services/exercises';
import { getTrainingPlanById } from '../services/trainingPlans';
import { getUserPlanById } from '../services/userPlans';
import type { TrainingSession, Exercise } from '../types';

type ResolvedExercise = {
  exerciseId: string;
  title: string;
  plannedDuration: number;
  actualDuration: number;
  completed: boolean;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(iso));
}

export default function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [exercises, setExercises] = useState<ResolvedExercise[]>([]);
  const [planTitle, setPlanTitle] = useState('Solo Exercise');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    void (async () => {
      setLoading(true);
      try {
        const s = await getTrainingSessionById(sessionId);
        if (!s) { setNotFound(true); return; }
        setSession(s);

        const [exerciseResults, title] = await Promise.all([
          Promise.all(
            s.exercises.map(async (se) => {
              const ex: Exercise | null = await getExerciseById(se.exerciseId);
              return {
                exerciseId: se.exerciseId,
                title: ex?.title ?? 'Unknown Exercise',
                plannedDuration: se.plannedDuration,
                actualDuration: se.actualDuration,
                completed: se.completed,
              };
            })
          ),
          s.planId
            ? getTrainingPlanById(s.planId).then((p) =>
                p ? p.title : getUserPlanById(s.planId!).then((u) => u?.title ?? 'Unknown Plan')
              )
            : Promise.resolve('Solo Exercise'),
        ]);

        setExercises(exerciseResults);
        setPlanTitle(title);
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  const totalPlanned = exercises.reduce((sum, e) => sum + e.plannedDuration, 0);
  const totalActual = exercises.reduce((sum, e) => sum + e.actualDuration, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => navigate('/history')} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Session Details</Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : notFound || !session ? (
        <Typography color="text.secondary">Session not found.</Typography>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{planTitle}</Typography>
            <Typography variant="body2" color="text.secondary">{formatDate(session.date)}</Typography>
          </Paper>

          <Paper sx={{ mb: 2 }}>
            <List disablePadding>
              {exercises.map((e, i) => (
                <Box key={e.exerciseId + i}>
                  {i > 0 && <Divider />}
                  <ListItem
                    secondaryAction={
                      e.completed
                        ? <CheckCircleIcon color="success" />
                        : <RemoveCircleOutlinedIcon sx={{ color: 'text.disabled' }} />
                    }
                  >
                    <ListItemText
                      primary={e.title}
                      slotProps={{ secondary: { component: 'div' } }}
                      secondary={
                        <Box component="span" sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                          <Chip
                            label={`Planned: ${e.plannedDuration} min`}
                            size="small"
                            variant="outlined"
                            icon={<AccessTimeIcon />}
                          />
                          <Chip
                            label={`Actual: ${e.actualDuration} min`}
                            size="small"
                            icon={<AccessTimeIcon />}
                            color={e.completed ? 'success' : 'default'}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Session Totals</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Planned time</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{totalPlanned} min</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Actual time</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{totalActual} min</Typography>
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}
