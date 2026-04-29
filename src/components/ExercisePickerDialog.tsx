import { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, List, ListItemButton, ListItemText, Select, MenuItem,
  FormControl, InputLabel, Box, CircularProgress, Chip, Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { getExercises } from '../services/exercises';
import { getExerciseTypes } from '../services/exerciseTypes';
import type { Exercise, ExerciseType } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  excludeIds?: string[];
};

export default function ExercisePickerDialog({ open, onClose, onSelect, excludeIds = [] }: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterTypeId, setFilterTypeId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [exs, types] = await Promise.all([getExercises(), getExerciseTypes()]);
      setExercises(exs);
      setExerciseTypes(types);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setSearch('');
      setFilterTypeId('');
      void load();
    }
  }, [open, load]);

  function getTypeName(typeId: string): string {
    return exerciseTypes.find((t) => t.id === typeId)?.name ?? '—';
  }

  const filtered = exercises.filter((e) => {
    if (excludeIds.includes(e.id)) return false;
    if (filterTypeId && e.typeId !== filterTypeId) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Exercise</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search" size="small" value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 140 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filterTypeId} label="Type"
              onChange={(e: SelectChangeEvent) => setFilterTypeId(e.target.value)}
            >
              <MenuItem value="">All types</MenuItem>
              {exerciseTypes.map((t) => (
                <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List disablePadding>
            {filtered.map((exercise) => (
              <ListItemButton
                key={exercise.id}
                onClick={() => { onSelect(exercise); onClose(); }}
                divider
              >
                <ListItemText
                  primary={exercise.title}
                  secondary={
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                      <Chip label={getTypeName(exercise.typeId)} size="small" />
                      <Chip label={`${exercise.defaultDurationMinutes} min`} size="small" variant="outlined" />
                    </Box>
                  }
                />
              </ListItemButton>
            ))}
            {filtered.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No exercises found.
              </Typography>
            )}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
