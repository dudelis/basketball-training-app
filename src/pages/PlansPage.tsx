import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, CardActions,
  Button, CircularProgress, Chip,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { getTrainingPlans } from '../services/trainingPlans';
import type { TrainingPlan } from '../types';

export default function PlansPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setPlans(await getTrainingPlans()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

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
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<FitnessCenterIcon />}
                    label={`${plan.exercises.length} exercise${plan.exercises.length !== 1 ? 's' : ''}`}
                    size="small" variant="outlined"
                  />
                  <Chip
                    icon={<AccessTimeIcon />}
                    label={`${plan.totalDurationMinutes ?? 0} min`}
                    size="small" variant="outlined"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained" size="small"
                  onClick={() => navigate(`/session/plan/${plan.id}`)}
                >
                  Start
                </Button>
              </CardActions>
            </Card>
          ))}
          {plans.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No training plans available yet.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

