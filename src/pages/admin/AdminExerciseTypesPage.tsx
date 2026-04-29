import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText, IconButton,
  Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, CircularProgress, Snackbar, Alert, Divider,
  Collapse, Chip,
} from '@mui/material';
import type { AlertColor } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  getExerciseTypes, createExerciseType, updateExerciseType, deleteExerciseType,
} from '../../services/exerciseTypes';
import {
  getExerciseSubtypes, createExerciseSubtype, updateExerciseSubtype, deleteExerciseSubtype,
} from '../../services/exerciseSubtypes';
import type { ExerciseType, ExerciseSubtype } from '../../types';

const SEED_DATA = [
  { name: 'Dribbling', subtypes: ['Stationary dribbling (left/right hand)', 'Crossovers', 'Between the legs', 'Behind the back', 'Speed dribble (full court)', 'Cone dribbling drills', 'Change of pace drills'] },
  { name: 'Shooting', subtypes: ['Free throws', 'Mid-range shots', '3-point shooting', 'Catch & shoot', 'Off-the-dribble shots', 'Spot shooting (5 spots)', 'Game-speed shooting'] },
  { name: 'Layups & Finishing', subtypes: ['Basic layups (left/right)', 'Reverse layups', 'Euro step', 'Floaters', 'Contact finishing', 'Weak-hand finishing'] },
  { name: 'Passing', subtypes: ['Chest pass', 'Bounce pass', 'Overhead pass', 'Outlet pass', 'No-look pass', 'Passing on the move', 'Fast break passing drills'] },
  { name: 'Defense', subtypes: ['Defensive stance & slides', 'Closeouts', '1-on-1 defense', 'Help defense rotations', 'Steal/deflection drills', 'Rebounding positioning'] },
  { name: 'Footwork', subtypes: ['Pivoting (front/reverse)', 'Jab steps', 'Triple threat moves', 'Drop steps (post)', 'Spin moves', 'Ladder drills (agility)'] },
  { name: 'Conditioning / Fitness', subtypes: ['Suicides (line sprints)', 'Full-court runs', 'Shuttle runs', 'Jump training', 'Core workouts', 'Endurance drills'] },
  { name: 'Rebounding', subtypes: ['Box out drills', 'Offensive rebounding', 'Defensive rebounding', 'Timing & jumping drills'] },
  { name: 'Game Situations', subtypes: ['1v1', '2v2 / 3v3', 'Fast break drills', 'Pick & roll', 'End-of-game situations', 'Transition offense/defense'] },
  { name: 'Ball Handling & Decision Making', subtypes: ['Pressure dribbling', 'Read & react drills', 'Double team escape', 'Combo moves + finish'] },
];

export default function AdminExerciseTypesPage() {
  const [types, setTypes] = useState<ExerciseType[]>([]);
  const [subtypes, setSubtypes] = useState<ExerciseSubtype[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [dialog, setDialog] = useState<{
    open: boolean;
    mode: 'add-type' | 'edit-type' | 'add-subtype' | 'edit-subtype';
    name: string;
    id?: string;
    typeId?: string;
  }>({ open: false, mode: 'add-type', name: '' });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean; label?: string; id?: string; kind?: 'type' | 'subtype';
  }>({ open: false });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false, message: '', severity: 'success',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, s] = await Promise.all([getExerciseTypes(), getExerciseSubtypes()]);
      setTypes(t.sort((a, b) => a.name.localeCompare(b.name)));
      setSubtypes(s);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function showSnackbar(message: string, severity: AlertColor = 'success') {
    setSnackbar({ open: true, message, severity });
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      for (const { name, subtypes: subs } of SEED_DATA) {
        const typeId = await createExerciseType(name);
        for (const subName of subs) {
          await createExerciseSubtype(subName, typeId);
        }
      }
      showSnackbar('Default types and subtypes seeded successfully.');
      await load();
    } catch {
      showSnackbar('Seeding failed.', 'error');
    } finally {
      setSeeding(false);
    }
  }

  async function handleSave() {
    const name = dialog.name.trim();
    if (!name) return;
    try {
      if (dialog.mode === 'add-type') {
        await createExerciseType(name);
        showSnackbar('Type added.');
      } else if (dialog.mode === 'edit-type' && dialog.id) {
        await updateExerciseType(dialog.id, name);
        showSnackbar('Type updated.');
      } else if (dialog.mode === 'add-subtype' && dialog.typeId) {
        await createExerciseSubtype(name, dialog.typeId);
        showSnackbar('Subtype added.');
      } else if (dialog.mode === 'edit-subtype' && dialog.id) {
        await updateExerciseSubtype(dialog.id, name);
        showSnackbar('Subtype updated.');
      }
      setDialog((d) => ({ ...d, open: false }));
      await load();
    } catch {
      showSnackbar('Something went wrong.', 'error');
    }
  }

  async function handleDelete() {
    if (!deleteDialog.id) return;
    try {
      if (deleteDialog.kind === 'type') await deleteExerciseType(deleteDialog.id);
      else await deleteExerciseSubtype(deleteDialog.id);
      showSnackbar('Deleted.');
      setDeleteDialog({ open: false });
      await load();
    } catch {
      showSnackbar('Something went wrong.', 'error');
    }
  }

  const subtypesFor = (typeId: string) => subtypes.filter((s) => s.typeId === typeId);

  const dialogTitle = {
    'add-type': 'Add Exercise Type',
    'edit-type': 'Edit Exercise Type',
    'add-subtype': 'Add Subtype',
    'edit-subtype': 'Edit Subtype',
  }[dialog.mode];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Exercise Types</Typography>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <List disablePadding>
          {types.map((type, idx) => {
            const subs = subtypesFor(type.id);
            const isExpanded = expanded[type.id] ?? true;
            return (
              <Box key={type.id}>
                {idx > 0 && <Divider />}
                {/* Type row */}
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() =>
                        setDialog({ open: true, mode: 'add-subtype', name: '', typeId: type.id })
                      } title="Add subtype">
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() =>
                        setDialog({ open: true, mode: 'edit-type', name: type.name, id: type.id })
                      }>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() =>
                        setDeleteDialog({ open: true, label: type.name, id: type.id, kind: 'type' })
                      }>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() =>
                        setExpanded((e) => ({ ...e, [type.id]: !isExpanded }))
                      }>
                        {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{type.name}</Typography>
                        <Chip label={subs.length} size="small" />
                      </Box>
                    }
                  />
                </ListItem>

                {/* Subtypes */}
                <Collapse in={isExpanded}>
                  <List disablePadding sx={{ pl: 3 }}>
                    {subs.map((sub) => (
                      <ListItem
                        key={sub.id}
                        secondaryAction={
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" onClick={() =>
                              setDialog({ open: true, mode: 'edit-subtype', name: sub.name, id: sub.id })
                            }>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() =>
                              setDeleteDialog({ open: true, label: sub.name, id: sub.id, kind: 'subtype' })
                            }>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        }
                        sx={{ py: 0.5 }}
                      >
                        <ListItemText
                          primary={<Typography variant="body2">{sub.name}</Typography>}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          })}
          {types.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                No exercise types yet. Seed the default basketball types or add one manually.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={seeding ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
                onClick={() => void handleSeed()}
                disabled={seeding}
                sx={{ borderRadius: 3, px: 4 }}
              >
                {seeding ? 'Seeding…' : 'Seed Default Types'}
              </Button>
            </Box>
          )}
        </List>
      )}

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => setDialog({ open: true, mode: 'add-type', name: '' })}
      >
        <AddIcon />
      </Fab>

      {/* Add / Edit dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog((d) => ({ ...d, open: false }))} fullWidth maxWidth="xs">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus fullWidth label="Name"
            value={dialog.name}
            onChange={(e) => setDialog((d) => ({ ...d, name: e.target.value }))}
            sx={{ mt: 1 }}
            onKeyDown={(e) => { if (e.key === 'Enter') void handleSave(); }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog((d) => ({ ...d, open: false }))}>Cancel</Button>
          <Button variant="contained" onClick={() => void handleSave()} disabled={!dialog.name.trim()}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false })}>
        <DialogTitle>Delete {deleteDialog.kind === 'type' ? 'Type' : 'Subtype'}</DialogTitle>
        <DialogContent>
          <Typography>Delete "{deleteDialog.label}"? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => void handleDelete()}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open} autoHideDuration={3000}
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

