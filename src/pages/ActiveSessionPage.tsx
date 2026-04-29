import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Chip, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  IconButton, Paper, List, ListItem, ListItemText,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getTrainingPlanById } from '../services/trainingPlans';
import { getUserPlanById } from '../services/userPlans';
import { getExerciseById } from '../services/exercises';
import { getExerciseTypes } from '../services/exerciseTypes';
import { createTrainingSession } from '../services/trainingSessions';
import { useAuthContext } from '../contexts/AuthContext';
import TimerDisplay from '../components/TimerDisplay';
import type { Exercise, ExerciseType, SessionExercise } from '../types';

const TIMER_KEY = 'bball_timer_v1';

type SessionItem = { exercise: Exercise; plannedSeconds: number };
type Phase = 'loading' | 'running' | 'summary';

function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return m ? m[1] : null;
}

function MediaPanel({ exercise, imgIndex, onPrevImg, onNextImg }: {
  exercise: Exercise; imgIndex: number; onPrevImg: () => void; onNextImg: () => void;
}) {
  if (exercise.youtubeUrl) {
    const vid = getYoutubeId(exercise.youtubeUrl);
    return (
      <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: 2, overflow: 'hidden', bgcolor: 'black' }}>
        <iframe
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          src={`https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={exercise.title}
        />
      </Box>
    );
  }
  if (exercise.videoUrl) {
    return (
      <Box component="video" controls src={exercise.videoUrl}
        sx={{ width: '100%', borderRadius: 2, maxHeight: 300 }}
      />
    );
  }
  if (exercise.imageUrls && exercise.imageUrls.length > 0) {
    const images = exercise.imageUrls;
    return (
      <Box sx={{ position: 'relative', textAlign: 'center' }}>
        <Box
          component="img"
          src={images[imgIndex]}
          alt={exercise.title}
          sx={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 2 }}
        />
        {images.length > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 1 }}>
            <IconButton size="small" onClick={onPrevImg} disabled={imgIndex === 0}>
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption">{imgIndex + 1} / {images.length}</Typography>
            <IconButton size="small" onClick={onNextImg} disabled={imgIndex === images.length - 1}>
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  }
  return (
    <Box sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
      <FitnessCenterIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
    </Box>
  );
}

export default function ActiveSessionPage() {
  const { planId, exerciseId } = useParams<{ planId?: string; exerciseId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [phase, setPhase] = useState<Phase>('loading');
  const [items, setItems] = useState<SessionItem[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SessionExercise[]>([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [savingSessionId, setSavingSessionId] = useState<string | null>(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Load data
  useEffect(() => {
    void (async () => {
      try {
        const [types] = await Promise.all([getExerciseTypes()]);
        setExerciseTypes(types);

        let planExercises: { exerciseId: string; durationMinutes: number; order: number }[] = [];
        let resolvedPlanId: string | undefined;

        if (planId) {
          resolvedPlanId = planId;
          const plan = await getTrainingPlanById(planId) ?? await getUserPlanById(planId);
          if (!plan) { setLoadError('Plan not found.'); return; }
          planExercises = [...plan.exercises].sort((a, b) => a.order - b.order);
        } else if (exerciseId) {
          planExercises = [{ exerciseId, durationMinutes: 0, order: 0 }];
        }

        const exerciseResults = await Promise.all(
          planExercises.map((pe) => getExerciseById(pe.exerciseId))
        );

        const loaded: SessionItem[] = planExercises
          .map((pe, i) => {
            const ex = exerciseResults[i];
            if (!ex) return null;
            const secs = pe.durationMinutes > 0
              ? pe.durationMinutes * 60
              : ex.defaultDurationMinutes * 60;
            return { exercise: ex, plannedSeconds: secs };
          })
          .filter((item): item is SessionItem => item !== null);

        if (loaded.length === 0) { setLoadError('No exercises found.'); return; }

        setSavingSessionId(resolvedPlanId ?? null);
        localStorage.removeItem(TIMER_KEY);
        setItems(loaded);
        setPhase('running');
      } catch {
        setLoadError('Failed to load session data.');
      }
    })();
  }, [planId, exerciseId]);

  // Navigation guard — browser close/refresh
  useEffect(() => {
    if (phase !== 'running') return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [phase]);

  // Navigation guard — back button
  useEffect(() => {
    if (phase !== 'running') return;
    window.history.pushState(null, '', window.location.href);
    const handler = () => {
      window.history.pushState(null, '', window.location.href);
      setShowLeaveDialog(true);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [phase]);

  const handleExerciseComplete = useCallback((actualSeconds: number) => {
    const current = items[currentIndex];
    if (!current) return;

    const result: SessionExercise = {
      exerciseId: current.exercise.id,
      plannedDuration: Math.round(current.plannedSeconds / 60),
      actualDuration: Math.round(actualSeconds / 60),
      completed: actualSeconds > 0,
    };

    setResults((prev) => {
      const updated = [...prev, result];
      if (currentIndex < items.length - 1) {
        localStorage.removeItem(TIMER_KEY);
        setCurrentIndex((i) => i + 1);
        setImgIndex(0);
      } else {
        setPhase('summary');
      }
      return updated;
    });
  }, [items, currentIndex]);

  async function handleSaveSession() {
    if (!user) return;
    await createTrainingSession({
      userId: user.id,
      planId: savingSessionId ?? undefined,
      date: new Date().toISOString(),
      exercises: results,
    });
    navigate('/history');
  }

  function getTypeName(typeId: string) {
    return exerciseTypes.find((t) => t.id === typeId)?.name;
  }

  // ── Loading ──
  if (phase === 'loading') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 6, gap: 2 }}>
        {loadError ? (
          <Typography color="error">{loadError}</Typography>
        ) : (
          <CircularProgress />
        )}
      </Box>
    );
  }

  const current = items[currentIndex];
  const progress = (currentIndex / items.length) * 100;

  // ── Summary ──
  if (phase === 'summary') {
    const totalActual = results.reduce((s, r) => s + r.actualDuration, 0);
    const totalPlanned = results.reduce((s, r) => s + r.plannedDuration, 0);
    return (
      <Box sx={{ maxWidth: 600, pb: 4 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>Session Complete! 🎉</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {totalActual} of {totalPlanned} minutes completed
        </Typography>
        <List disablePadding sx={{ mb: 3 }}>
          {results.map((r, i) => {
            const ex = items[i]?.exercise;
            return (
              <ListItem key={i} disablePadding sx={{ py: 0.5 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {r.completed
                        ? <CheckCircleIcon fontSize="small" color="success" />
                        : <CancelIcon fontSize="small" color="disabled" />}
                      <Typography variant="body2">{ex?.title ?? r.exerciseId}</Typography>
                    </Box>
                  }
                  secondary={`${r.actualDuration} min (planned ${r.plannedDuration} min)`}
                />
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={() => void handleSaveSession()}>
            Save Session
          </Button>
          <Button variant="outlined" onClick={() => navigate(planId ? '/plans' : '/exercises')}>
            Discard
          </Button>
        </Box>
      </Box>
    );
  }

  // ── Running ──
  return (
    <Box sx={{ pb: 4 }}>
      {/* Progress */}
      {items.length > 1 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Exercise {currentIndex + 1} of {items.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 1 }} />
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Exercise info panel */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{current.exercise.title}</Typography>
            {getTypeName(current.exercise.typeId) && (
              <Chip label={getTypeName(current.exercise.typeId)} size="small" />
            )}
          </Box>
          {current.exercise.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {current.exercise.description}
            </Typography>
          )}
          <MediaPanel
            exercise={current.exercise}
            imgIndex={imgIndex}
            onPrevImg={() => setImgIndex((i) => Math.max(0, i - 1))}
            onNextImg={() => setImgIndex((i) => Math.min((current.exercise.imageUrls?.length ?? 1) - 1, i + 1))}
          />
        </Box>

        {/* Timer panel */}
        <Paper elevation={1} sx={{ flex: '0 0 auto', p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <TimerDisplay
            key={currentIndex}
            initialSeconds={current.plannedSeconds}
            onComplete={handleExerciseComplete}
          />
        </Paper>
      </Box>

      {/* Leave confirmation dialog */}
      <Dialog open={showLeaveDialog} onClose={() => setShowLeaveDialog(false)}>
        <DialogTitle>Leave session?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to leave? Your session won't be saved.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLeaveDialog(false)}>Stay</Button>
          <Button color="error" onClick={() => navigate(-1)}>Leave</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
