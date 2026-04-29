import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, CardActions,
  IconButton, Fab, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Snackbar, Alert,
} from '@mui/material';
import type { AlertColor } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { getTrainingPlans, deleteTrainingPlan } from '../../services/trainingPlans';
import type { TrainingPlan } from '../../types';

export default function AdminPlansPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; plan?: TrainingPlan }>({ open: false });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false, message: '', severity: 'success',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try { setPlans(await getTrainingPlans()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function showSnackbar(message: string, severity: AlertColor = 'success') {
    setSnackbar({ open: true, message, severity });
  }

  async function handleDelete() {
    if (!deleteDialog.plan) return;
    try {
      await deleteTrainingPlan(deleteDialog.plan.id);
      showSnackbar('Plan deleted.');
      setDeleteDialog({ open: false });
      await load();
    } catch {
      showSnackbar('Failed to delete plan.', 'error');
    }
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Training Plans</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardContent sx={{ pb: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{plan.title}</Typography>
                {plan.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {plan.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FitnessCenterIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {plan.exercises.length} exercise{plan.exercises.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {plan.totalDurationMinutes ?? 0} min
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton size="small" onClick={() => navigate(`/admin/plans/${plan.id}`)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => setDeleteDialog({ open: true, plan })}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
          {plans.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No training plans yet. Create one to get started.
            </Typography>
          )}
        </Box>
      )}

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => navigate('/admin/plans/new')}
      >
        <AddIcon />
      </Fab>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false })}>
        <DialogTitle>Delete Plan</DialogTitle>
        <DialogContent>
          <Typography>Delete "{deleteDialog.plan?.title}"? This cannot be undone.</Typography>
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
