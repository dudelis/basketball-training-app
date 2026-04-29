import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Stack, CircularProgress,
  IconButton, List, ListItem, ListItemText, Snackbar, Alert,
  FormHelperText, Divider,
} from '@mui/material';
import type { AlertColor } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getUserPlanById, createUserPlan, updateUserPlan } from '../services/userPlans';
import { getExercises } from '../services/exercises';
import { useAuthContext } from '../contexts/AuthContext';
import ExercisePickerDialog from '../components/ExercisePickerDialog';
import type { PlanExercise, Exercise } from '../types';

type PlanExerciseRow = PlanExercise & { title: string };

export default function UserPlanFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [rows, setRows] = useState<PlanExerciseRow[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [exerciseMap, setExerciseMap] = useState<Map<string, Exercise>>(new Map());
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false, message: '', severity: 'success',
  });

  useEffect(() => {
    void getExercises().then((exs) => {
      setExerciseMap(new Map(exs.map((e) => [e.id, e])));
    });

    if (id) {
      void (async () => {
        setLoading(true);
        const plan = await getUserPlanById(id);
        if (plan) {
          setTitle(plan.title);
          setRows(
            [...plan.exercises]
              .sort((a, b) => a.order - b.order)
              .map((pe) => ({ ...pe, title: '' }))
          );
        }
        setLoading(false);
      })();
    }
  }, [id]);

  useEffect(() => {
    if (exerciseMap.size === 0) return;
    setRows((prev) =>
      prev.map((r) => ({ ...r, title: exerciseMap.get(r.exerciseId)?.title ?? r.exerciseId }))
    );
  }, [exerciseMap]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required.';
    if (rows.length === 0) errs.exercises = 'Add at least one exercise.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function addExercise(exercise: Exercise) {
    setRows((prev) => [
      ...prev,
      { exerciseId: exercise.id, title: exercise.title, durationMinutes: exercise.defaultDurationMinutes, order: prev.length },
    ]);
    setErrors((e) => ({ ...e, exercises: '' }));
  }

  function updateDuration(index: number, value: string) {
    const num = parseInt(value, 10);
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, durationMinutes: isNaN(num) ? 1 : Math.max(1, num) } : r))
    );
  }

  function moveRow(index: number, direction: 'up' | 'down') {
    setRows((prev) => {
      const next = [...prev];
      const swapWith = direction === 'up' ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= next.length) return prev;
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next.map((r, i) => ({ ...r, order: i }));
    });
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index).map((r, i) => ({ ...r, order: i })));
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    const planExercises: PlanExercise[] = rows.map((r, i) => ({
      exerciseId: r.exerciseId,
      durationMinutes: r.durationMinutes,
      order: i,
    }));
    try {
      if (id) {
        await updateUserPlan(id, { title: title.trim(), exercises: planExercises });
      } else {
        await createUserPlan({
          userId: user?.id ?? '',
          title: title.trim(),
          exercises: planExercises,
          createdAt: new Date().toISOString(),
          editable: true,
        });
      }
      navigate('/my-plans');
    } catch {
      setSnackbar({ open: true, message: 'Failed to save plan. Please try again.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); void handleSubmit(); }}
      sx={{ maxWidth: 600, pb: 4 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">{id ? 'Edit Plan' : 'New Plan'}</Typography>
        {id && (
          <Button
            variant="outlined" startIcon={<PlayArrowIcon />}
            onClick={() => navigate(`/session/plan/${id}`)}
          >
            Start Plan
          </Button>
        )}
      </Box>

      <Stack spacing={2}>
        <TextField
          label="Plan Title" value={title} onChange={(e) => setTitle(e.target.value)}
          required fullWidth error={!!errors.title} helperText={errors.title}
        />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Exercises ({rows.length})
          </Typography>

          {rows.length > 0 && (
            <List disablePadding sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
              {rows.map((row, idx) => (
                <Box key={`${row.exerciseId}-${idx}`}>
                  {idx > 0 && <Divider />}
                  <ListItem
                    sx={{ gap: 1, py: 1 }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton size="small" onClick={() => moveRow(idx, 'up')} disabled={idx === 0}>
                          <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => moveRow(idx, 'down')} disabled={idx === rows.length - 1}>
                          <ArrowDownwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => removeRow(idx)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={row.title || row.exerciseId}
                      secondary={
                        <TextField
                          size="small" type="number" label="Min"
                          value={row.durationMinutes}
                          onChange={(e) => updateDuration(idx, e.target.value)}
                          slotProps={{ htmlInput: { min: 1 } }}
                          sx={{ width: 80, mt: 0.5 }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}

          {errors.exercises && <FormHelperText error>{errors.exercises}</FormHelperText>}

          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setPickerOpen(true)} size="small">
            Add Exercise
          </Button>
        </Box>

        {rows.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Total: {rows.reduce((s, r) => s + r.durationMinutes, 0)} minutes
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 1 }}>
          <Button variant="outlined" onClick={() => navigate('/my-plans')} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting
              ? <CircularProgress size={20} color="inherit" />
              : id ? 'Save Changes' : 'Create Plan'}
          </Button>
        </Box>
      </Stack>

      <ExercisePickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={addExercise}
        excludeIds={rows.map((r) => r.exerciseId)}
      />

      <Snackbar
        open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
