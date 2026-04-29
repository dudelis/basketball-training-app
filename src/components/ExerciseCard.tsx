import { Box, Card, CardContent, CardMedia, CardActions, Typography, Chip, Button } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import type { Exercise, ExerciseType } from '../types';

type ExerciseCardProps = {
  exercise: Exercise;
  exerciseType?: ExerciseType;
  onStart?: () => void;
  onAddToPlan?: () => void;
};

function getYoutubeThumbnail(url: string): string | undefined {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
  return undefined;
}

function getThumbnail(exercise: Exercise): string | undefined {
  if (exercise.imageUrls?.[0]) return exercise.imageUrls[0];
  if (exercise.youtubeUrl) return getYoutubeThumbnail(exercise.youtubeUrl);
  return undefined;
}

export default function ExerciseCard({ exercise, exerciseType, onStart, onAddToPlan }: ExerciseCardProps) {
  const thumbnail = getThumbnail(exercise);

  return (
    <Card>
      {thumbnail ? (
        <CardMedia component="img" height="140" image={thumbnail} alt={exercise.title} />
      ) : (
        <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover' }}>
          <FitnessCenterIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
        </Box>
      )}
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{exercise.title}</Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
          {exerciseType && <Chip label={exerciseType.name} size="small" />}
          <Chip label={`${exercise.defaultDurationMinutes} min`} size="small" variant="outlined" />
        </Box>
      </CardContent>
      {(onStart ?? onAddToPlan) && (
        <CardActions>
          {onStart && <Button size="small" variant="contained" onClick={onStart}>Start</Button>}
          {onAddToPlan && <Button size="small" variant="outlined" onClick={onAddToPlan}>Add to Plan</Button>}
        </CardActions>
      )}
    </Card>
  );
}
