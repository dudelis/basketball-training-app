import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, TextField, Select, MenuItem, FormControl,
  InputLabel, Button, CircularProgress, Snackbar, Alert,
  FormHelperText, Stack,
} from '@mui/material';
import type { AlertColor, SelectChangeEvent } from '@mui/material';
import { getExerciseById, createExercise, updateExercise } from '../../services/exercises';
import { getExerciseTypes } from '../../services/exerciseTypes';
import { uploadExerciseVideo, uploadExerciseImage } from '../../services/storage';
import { useAuthContext } from '../../contexts/AuthContext';
import MediaUpload from '../../components/MediaUpload';
import type { ExerciseType } from '../../types';

function isValidYoutubeUrl(url: string): boolean {
  if (!url) return true;
  return /^https?:\/\/(www\.)?(youtube\.com\/watch|youtu\.be\/)/.test(url);
}

export default function AdminExerciseFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [typeId, setTypeId] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [existingVideoUrl, setExistingVideoUrl] = useState<string | undefined>();
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false, message: '', severity: 'success',
  });

  useEffect(() => {
    void getExerciseTypes().then(setExerciseTypes);
    if (id) {
      void (async () => {
        setLoading(true);
        const exercise = await getExerciseById(id);
        if (exercise) {
          setTitle(exercise.title);
          setTypeId(exercise.typeId);
          setDescription(exercise.description ?? '');
          setDuration(String(exercise.defaultDurationMinutes));
          setYoutubeUrl(exercise.youtubeUrl ?? '');
          setExistingVideoUrl(exercise.videoUrl);
          setExistingImageUrls(exercise.imageUrls ?? []);
        }
        setLoading(false);
      })();
    }
  }, [id]);

  function showSnackbar(message: string, severity: AlertColor = 'success') {
    setSnackbar({ open: true, message, severity });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required.';
    if (!typeId) errs.typeId = 'Exercise type is required.';
    const dur = parseInt(duration, 10);
    if (!duration || isNaN(dur) || dur < 1) errs.duration = 'Duration must be at least 1 minute.';
    if (youtubeUrl && !isValidYoutubeUrl(youtubeUrl)) errs.youtubeUrl = 'Enter a valid YouTube URL.';
    if (existingImageUrls.length + newImageFiles.length > 5) errs.images = 'Maximum 5 images allowed.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const durationNum = parseInt(duration, 10);

      if (id) {
        let finalVideoUrl = existingVideoUrl;
        if (newVideoFile) {
          finalVideoUrl = await uploadExerciseVideo(id, newVideoFile);
        }
        const uploadedImageUrls = await Promise.all(
          newImageFiles.map((f) => uploadExerciseImage(id, `${Date.now()}_${f.name}`, f))
        );
        await updateExercise(id, {
          title: title.trim(),
          typeId,
          description: description.trim() || undefined,
          defaultDurationMinutes: durationNum,
          youtubeUrl: youtubeUrl.trim() || undefined,
          videoUrl: finalVideoUrl,
          imageUrls: [...existingImageUrls, ...uploadedImageUrls],
        });
      } else {
        const newId = await createExercise({
          title: title.trim(),
          typeId,
          description: description.trim() || undefined,
          defaultDurationMinutes: durationNum,
          youtubeUrl: youtubeUrl.trim() || undefined,
          videoUrl: undefined,
          imageUrls: [],
          createdBy: user?.id ?? '',
        });
        const mediaUpdate: { videoUrl?: string; imageUrls?: string[] } = {};
        if (newVideoFile) {
          mediaUpdate.videoUrl = await uploadExerciseVideo(newId, newVideoFile);
        }
        if (newImageFiles.length > 0) {
          mediaUpdate.imageUrls = await Promise.all(
            newImageFiles.map((f) => uploadExerciseImage(newId, `${Date.now()}_${f.name}`, f))
          );
        }
        if (Object.keys(mediaUpdate).length > 0) {
          await updateExercise(newId, mediaUpdate);
        }
      }
      navigate('/admin/exercises');
    } catch {
      showSnackbar('Failed to save exercise. Please try again.', 'error');
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
      <Typography variant="h5" sx={{ mb: 3 }}>
        {id ? 'Edit Exercise' : 'New Exercise'}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Title" value={title} onChange={(e) => setTitle(e.target.value)}
          required fullWidth error={!!errors.title} helperText={errors.title}
        />

        <FormControl fullWidth error={!!errors.typeId} required>
          <InputLabel>Exercise Type</InputLabel>
          <Select value={typeId} label="Exercise Type" onChange={(e: SelectChangeEvent) => setTypeId(e.target.value)}>
            {exerciseTypes.map((t) => (
              <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
            ))}
          </Select>
          {errors.typeId && <FormHelperText>{errors.typeId}</FormHelperText>}
        </FormControl>

        <TextField
          label="Description" value={description} onChange={(e) => setDescription(e.target.value)}
          fullWidth multiline rows={3}
        />

        <TextField
          label="Default Duration (minutes)" type="number" value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required fullWidth slotProps={{ htmlInput: { min: 1 } }}
          error={!!errors.duration} helperText={errors.duration}
        />

        <TextField
          label="YouTube URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
          fullWidth placeholder="https://youtube.com/watch?v=..."
          error={!!errors.youtubeUrl} helperText={errors.youtubeUrl}
        />

        <MediaUpload
          label="Video"
          accept="video/*"
          existingUrls={existingVideoUrl ? [existingVideoUrl] : []}
          onUpload={(files) => setNewVideoFile(files[0])}
          onRemoveExisting={() => setExistingVideoUrl(undefined)}
        />
        {newVideoFile && (
          <Typography variant="body2" color="text.secondary">New video: {newVideoFile.name}</Typography>
        )}

        <MediaUpload
          label="Images (up to 5)"
          accept="image/*"
          multiple
          existingUrls={existingImageUrls}
          onUpload={(files) =>
            setNewImageFiles((prev) =>
              [...prev, ...files].slice(0, 5 - existingImageUrls.length)
            )
          }
          onRemoveExisting={(url) => setExistingImageUrls((prev) => prev.filter((u) => u !== url))}
        />
        {newImageFiles.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {newImageFiles.length} new image(s) selected
          </Typography>
        )}
        {errors.images && <FormHelperText error>{errors.images}</FormHelperText>}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 1 }}>
          <Button variant="outlined" onClick={() => navigate('/admin/exercises')} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting
              ? <CircularProgress size={20} color="inherit" />
              : id ? 'Save Changes' : 'Create Exercise'}
          </Button>
        </Box>
      </Stack>

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
