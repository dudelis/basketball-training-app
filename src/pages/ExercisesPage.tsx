import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Select, MenuItem, FormControl,
  InputLabel, CircularProgress,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { getExercises } from '../services/exercises';
import { getExerciseTypes } from '../services/exerciseTypes';
import { getExerciseSubtypes } from '../services/exerciseSubtypes';
import ExerciseCard from '../components/ExerciseCard';
import type { Exercise, ExerciseType, ExerciseSubtype } from '../types';

export default function ExercisesPage() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [allSubtypes, setAllSubtypes] = useState<ExerciseSubtype[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterTypeId, setFilterTypeId] = useState('');
  const [filterSubtypeId, setFilterSubtypeId] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 300);
  }

  function handleTypeChange(value: string) {
    setFilterTypeId(value);
    setFilterSubtypeId(''); // reset subtype when type changes
  }

  function getType(typeId: string): ExerciseType | undefined {
    return exerciseTypes.find((t) => t.id === typeId);
  }

  const subtypesForFilter = allSubtypes.filter((s) => s.typeId === filterTypeId);

  const filtered = exercises.filter((e) => {
    if (filterTypeId && e.typeId !== filterTypeId) return false;
    if (filterSubtypeId && e.subtypeId !== filterSubtypeId) return false;
    if (debouncedSearch && !e.title.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Exercises</Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search" size="small" value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          sx={{ flex: 1, minWidth: 160 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterTypeId} label="Type"
            onChange={(e: SelectChangeEvent) => handleTypeChange(e.target.value)}
          >
            <MenuItem value="">All types</MenuItem>
            {exerciseTypes.map((t) => (
              <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {filterTypeId && subtypesForFilter.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Subtype</InputLabel>
            <Select
              value={filterSubtypeId} label="Subtype"
              onChange={(e: SelectChangeEvent) => setFilterSubtypeId(e.target.value)}
            >
              <MenuItem value="">All subtypes</MenuItem>
              {subtypesForFilter.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {filtered.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              exerciseType={getType(exercise.typeId)}
              onStart={() => navigate(`/session/exercise/${exercise.id}`)}
            />
          ))}
          {filtered.length === 0 && (
            <Typography variant="body2" color="text.secondary">No exercises found.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

