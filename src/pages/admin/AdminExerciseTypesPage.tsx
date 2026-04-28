import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText, IconButton,
  Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, CircularProgress, Snackbar, Alert, Divider,
} from '@mui/material';
import type { AlertColor } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getExerciseTypes, createExerciseType, updateExerciseType, deleteExerciseType,
} from '../../services/exerciseTypes';
import type { ExerciseType } from '../../types';

export default function AdminExerciseTypesPage() {
  const [types, setTypes] = useState<ExerciseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<{
    open: boolean; mode: 'add' | 'edit'; name: string; id?: string;
  }>({ open: false, mode: 'add', name: '' });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type?: ExerciseType }>({ open: false });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false, message: '', severity: 'success',
  });

  const loadTypes = useCallback(async () => {
    setLoading(true);
    try { setTypes(await getExerciseTypes()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadTypes(); }, [loadTypes]);

  function showSnackbar(message: string, severity: AlertColor = 'success') {
    setSnackbar({ open: true, message, severity });
  }

  async function handleSave() {
    const name = dialog.name.trim();
    if (!name) return;
    try {
      if (dialog.mode === 'add') {
        await createExerciseType(name);
        showSnackbar('Exercise type added.');
      } else if (dialog.id) {
        await updateExerciseType(dialog.id, name);
        showSnackbar('Exercise type updated.');
      }
      setDialog((d) => ({ ...d, open: false }));
      await loadTypes();
    } catch {
      showSnackbar('Something went wrong.', 'error');
    }
  }

  async function handleDelete() {
    if (!deleteDialog.type) return;
    try {
      await deleteExerciseType(deleteDialog.type.id);
      showSnackbar('Exercise type deleted.');
      setDeleteDialog({ open: false });
      await loadTypes();
    } catch {
      showSnackbar('Something went wrong.', 'error');
    }
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Exercise Types</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <List disablePadding>
            {types.map((type, idx) => (
              <Box key={type.id}>
                {idx > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() =>
                        setDialog({ open: true, mode: 'edit', name: type.name, id: type.id })
                      }>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() =>
                        setDeleteDialog({ open: true, type })
                      }>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText primary={type.name} />
                </ListItem>
              </Box>
            ))}
          </List>
          {types.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No exercise types yet. Add one to get started.
            </Typography>
          )}
        </>
      )}

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => setDialog({ open: true, mode: 'add', name: '' })}
      >
        <AddIcon />
      </Fab>

      {/* Add / Edit dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog((d) => ({ ...d, open: false }))} fullWidth maxWidth="xs">
        <DialogTitle>{dialog.mode === 'add' ? 'Add Exercise Type' : 'Edit Exercise Type'}</DialogTitle>
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
          <Button variant="contained" onClick={() => void handleSave()} disabled={!dialog.name.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false })}>
        <DialogTitle>Delete Exercise Type</DialogTitle>
        <DialogContent>
          <Typography>Delete "{deleteDialog.type?.name}"? This cannot be undone.</Typography>
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

