import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, CardActions, IconButton,
  Fab, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Snackbar, Alert,
} from '@mui/material';
import type { AlertColor } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { getUserPlans, deleteUserPlan } from '../services/userPlans';
import { useAuthContext } from '../contexts/AuthContext';
import type { UserPlan } from '../types';

export default function MyPlansPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; plan?: UserPlan }>({ open: false });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false, message: '', severity: 'success',
  });

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try { setPlans(await getUserPlans(user.id)); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  function showSnackbar(message: string, severity: AlertColor = 'success') {
    setSnackbar({ open: true, message, severity });
  }

  async function handleDelete() {
    if (!deleteDialog.plan) return;
    try {
      await deleteUserPlan(deleteDialog.plan.id);
      showSnackbar('Plan deleted.');
      setDeleteDialog({ open: false });
      await load();
    } catch {
      showSnackbar('Failed to delete plan.', 'error');
    }
  }

  const totalDuration = (plan: UserPlan) =>
    plan.exercises.reduce((sum, e) => sum + e.durationMinutes, 0);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>My Plans</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardContent sx={{ pb: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{plan.title}</Typography>
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
                      {totalDuration(plan)} min
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small" variant="contained"
                  onClick={() => navigate(`/session/plan/${plan.id}`)}
                >
                  Start
                </Button>
                <Box sx={{ ml: 'auto', display: 'flex' }}>
                  <IconButton size="small" onClick={() => navigate(`/my-plans/${plan.id}`)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => setDeleteDialog({ open: true, plan })}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          ))}
          {plans.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No custom plans yet. Create your first one!
            </Typography>
          )}
        </Box>
      )}

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => navigate('/my-plans/new')}
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

