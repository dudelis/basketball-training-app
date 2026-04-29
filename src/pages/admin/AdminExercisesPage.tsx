import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, CardMedia, CardActions,
  IconButton, Fab, Select, MenuItem, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  CircularProgress, Snackbar, Alert, Chip,
} from '@mui/material';
import type { AlertColor, SelectChangeEvent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { getExercises, deleteExercise } from '../../services/exercises';
import { getExerciseTypes } from '../../services/exerciseTypes';
import { getExerciseSubtypes } from '../../services/exerciseSubtypes';
import type { Exercise, ExerciseType, ExerciseSubtype } from '../../types';

export default function AdminExercisesPage() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [allSubtypes, setAllSubtypes] = useState<ExerciseSubtype[]>([]);
  const [filterTypeId, setFilterTypeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; exercise?: Exercise }>({ open: false });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false, message: '', severity: 'success',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [exs, types, subs] = await Promise.all([getExercises(), getExerciseTypes(), getExerciseSubtypes()]);
      setExercises(exs);
      setExerciseTypes(types.sort((a, b) => a.name.localeCompare(b.name)));
      setAllSubtypes(subs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function showSnackbar(message: string, severity: AlertColor = 'success') {
    setSnackbar({ open: true, message, severity });
  }

  async function handleDelete() {
    if (!deleteDialog.exercise) return;
    try {
      await deleteExercise(deleteDialog.exercise.id);
      showSnackbar('Exercise deleted.');
      setDeleteDialog({ open: false });
      await load();
    } catch {
      showSnackbar('Failed to delete exercise.', 'error');
    }
  }

  function getTypeName(typeId: string): string {
    return exerciseTypes.find((t) => t.id === typeId)?.name ?? '—';
  }

  function getSubtypeName(subtypeId?: string): string | null {
    if (!subtypeId) return null;
    return allSubtypes.find((s) => s.id === subtypeId)?.name ?? null;
  }

  const filtered = filterTypeId ? exercises.filter((e) => e.typeId === filterTypeId) : exercises;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Exercise Library</Typography>

      <FormControl size="small" sx={{ mb: 2, minWidth: 180 }}>
        <InputLabel>Filter by type</InputLabel>
        <Select
          value={filterTypeId}
          label="Filter by type"
          onChange={(e: SelectChangeEvent) => setFilterTypeId(e.target.value)}
        >
          <MenuItem value="">All types</MenuItem>
          {exerciseTypes.map((t) => (
            <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {filtered.map((exercise) => (
            <Card key={exercise.id}>
              {exercise.imageUrls?.[0] ? (
                <CardMedia component="img" height="140" image={exercise.imageUrls[0]} alt={exercise.title} />
              ) : (
                <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover' }}>
                  <FitnessCenterIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                </Box>
              )}
              <CardContent sx={{ pb: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{exercise.title}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                  <Chip label={getTypeName(exercise.typeId)} size="small" color="primary" variant="outlined" />
                  {getSubtypeName(exercise.subtypeId) && (
                    <Chip label={getSubtypeName(exercise.subtypeId)!} size="small" />
                  )}
                  <Chip label={`${exercise.defaultDurationMinutes} min`} size="small" variant="outlined" />
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton size="small" onClick={() => navigate(`/admin/exercises/${exercise.id}`)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => setDeleteDialog({ open: true, exercise })}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Typography variant="body2" color="text.secondary">No exercises found.</Typography>
          )}
        </Box>
      )}

      <Fab color="primary" sx={{ position: 'fixed', bottom: 80, right: 16 }} onClick={() => navigate('/admin/exercises/new')}>
        <AddIcon />
      </Fab>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false })}>
        <DialogTitle>Delete Exercise</DialogTitle>
        <DialogContent>
          <Typography>Delete "{deleteDialog.exercise?.title}"? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => void handleDelete()}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

