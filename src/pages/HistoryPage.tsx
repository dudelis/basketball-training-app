import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, CircularProgress, List, ListItemButton,
  ListItemText, Divider, Chip,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { getTrainingSessions } from '../services/trainingSessions';
import { getTrainingPlanById } from '../services/trainingPlans';
import { getUserPlanById } from '../services/userPlans';
import { useAuthContext } from '../contexts/AuthContext';
import type { TrainingSession } from '../types';

type EnrichedSession = TrainingSession & { planTitle: string };

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(iso));
}

function dateKey(iso: string): string {
  return iso.slice(0, 10);
}

function totalActual(session: TrainingSession): number {
  return session.exercises.reduce((sum, e) => sum + e.actualDuration, 0);
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [sessions, setSessions] = useState<EnrichedSession[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const raw = await getTrainingSessions(user.id);
      raw.sort((a, b) => b.date.localeCompare(a.date));

      const planTitleCache = new Map<string, string>();
      const enriched: EnrichedSession[] = await Promise.all(
        raw.map(async (s) => {
          let planTitle = 'Solo Exercise';
          if (s.planId) {
            if (planTitleCache.has(s.planId)) {
              planTitle = planTitleCache.get(s.planId)!;
            } else {
              const adminPlan = await getTrainingPlanById(s.planId);
              if (adminPlan) {
                planTitle = adminPlan.title;
              } else {
                const userPlan = await getUserPlanById(s.planId);
                planTitle = userPlan?.title ?? 'Unknown Plan';
              }
              planTitleCache.set(s.planId, planTitle);
            }
          }
          return { ...s, planTitle };
        })
      );
      setSessions(enriched);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + totalActual(s), 0);
  const totalExercises = sessions.reduce(
    (sum, s) => sum + s.exercises.filter((e) => e.completed).length, 0
  );

  // Group by date
  const groups = sessions.reduce<Map<string, EnrichedSession[]>>((map, s) => {
    const key = dateKey(s.date);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
    return map;
  }, new Map());

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Training History</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : sessions.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No training sessions yet. Start your first session!
        </Typography>
      ) : (
        <>
          {/* Summary stats */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
            <Paper sx={{ flex: 1, minWidth: 90, p: 1.5, textAlign: 'center' }}>
              <EmojiEventsIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{totalSessions}</Typography>
              <Typography variant="caption" color="text.secondary">Sessions</Typography>
            </Paper>
            <Paper sx={{ flex: 1, minWidth: 90, p: 1.5, textAlign: 'center' }}>
              <AccessTimeIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{totalMinutes}</Typography>
              <Typography variant="caption" color="text.secondary">Total min</Typography>
            </Paper>
            <Paper sx={{ flex: 1, minWidth: 90, p: 1.5, textAlign: 'center' }}>
              <FitnessCenterIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{totalExercises}</Typography>
              <Typography variant="caption" color="text.secondary">Exercises</Typography>
            </Paper>
          </Box>

          {/* Date-grouped sessions */}
          {[...groups.entries()].map(([key, daySessions]) => (
            <Box key={key} sx={{ mb: 2 }}>
              <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>
                {formatDate(daySessions[0].date)}
              </Typography>
              <Paper sx={{ mt: 0.5 }}>
                <List disablePadding>
                  {daySessions.map((s, i) => {
                    const completed = s.exercises.filter((e) => e.completed).length;
                    const total = s.exercises.length;
                    const mins = totalActual(s);
                    return (
                      <Box key={s.id}>
                        {i > 0 && <Divider />}
                        <ListItemButton onClick={() => navigate(`/history/${s.id}`)}>
                          <ListItemText
                            primary={s.planTitle}
                            slotProps={{ secondary: { component: 'div' } }}
                            secondary={
                              <Box component="span" sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                                <Chip
                                  label={`${completed}/${total} exercises`}
                                  size="small"
                                  icon={<FitnessCenterIcon />}
                                />
                                <Chip
                                  label={`${mins} min`}
                                  size="small"
                                  icon={<AccessTimeIcon />}
                                />
                              </Box>
                            }
                          />
                          <ChevronRightIcon color="action" />
                        </ListItemButton>
                      </Box>
                    );
                  })}
                </List>
              </Paper>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}
