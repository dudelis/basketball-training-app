import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Avatar, Button, TextField, Chip,
  LinearProgress, Snackbar, Alert, Divider,
} from '@mui/material';
import type { AlertColor } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuthContext } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/users';
import { uploadProfileImage } from '../services/storage';
import { signOut } from '../services/auth';
import type { AppUser } from '../types';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, firebaseUser, refreshUser } = useAuthContext();

  const [name, setName] = useState(user?.name ?? '');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingGooglePhoto, setPendingGooglePhoto] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false, message: '', severity: 'success',
  });
  const googleSyncedRef = useRef(false);

  // Auto-save Google photo on first load if none set yet
  useEffect(() => {
    if (
      !googleSyncedRef.current &&
      user && !user.profileImageUrl &&
      firebaseUser?.photoURL
    ) {
      googleSyncedRef.current = true;
      void (async () => {
        await updateUserProfile(user.id, { profileImageUrl: firebaseUser.photoURL! });
        await refreshUser();
      })();
    }
  }, [user, firebaseUser, refreshUser]);

  // Revoke blob URL on cleanup
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const isDirty =
    name.trim() !== (user?.name ?? '') ||
    pendingFile !== null ||
    pendingGooglePhoto;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPendingFile(file);
    setPendingGooglePhoto(false);
    setPreviewUrl(URL.createObjectURL(file));
    // Reset input so re-selecting same file still fires onChange
    e.target.value = '';
  }

  function handleUseGooglePhoto() {
    if (!firebaseUser?.photoURL) return;
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPendingGooglePhoto(true);
    setPreviewUrl(firebaseUser.photoURL);
  }

  const handleSave = useCallback(async () => {
    if (!user) return;
    setUploading(true);
    try {
      const updates: Partial<AppUser> = {};
      if (name.trim() !== user.name) updates.name = name.trim();
      if (pendingFile) {
        updates.profileImageUrl = await uploadProfileImage(user.id, pendingFile);
      } else if (pendingGooglePhoto && firebaseUser?.photoURL) {
        updates.profileImageUrl = firebaseUser.photoURL;
      }
      if (Object.keys(updates).length > 0) {
        await updateUserProfile(user.id, updates);
        await refreshUser();
      }
      setPendingFile(null);
      setPendingGooglePhoto(false);
      setPreviewUrl(null);
      setSnackbar({ open: true, message: 'Profile updated successfully.', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update profile.', severity: 'error' });
    } finally {
      setUploading(false);
    }
  }, [user, name, pendingFile, pendingGooglePhoto, firebaseUser, refreshUser]);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  const avatarSrc = previewUrl ?? user?.profileImageUrl;
  const initials = user?.name?.charAt(0).toUpperCase() ?? '?';
  const googlePhotoUrl = firebaseUser?.photoURL;

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>My Profile</Typography>

      {/* Avatar */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar src={avatarSrc ?? undefined} sx={{ width: 120, height: 120, fontSize: 48, mb: 1.5 }}>
          {!avatarSrc && initials}
        </Avatar>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            component="label"
            size="small"
            startIcon={<PhotoCameraIcon />}
            variant="outlined"
          >
            Upload Photo
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Button>
          {googlePhotoUrl && (
            <Button
              size="small"
              startIcon={<GoogleIcon />}
              variant="outlined"
              onClick={handleUseGooglePhoto}
            >
              Use Google Photo
            </Button>
          )}
        </Box>
      </Box>

      {uploading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Form */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Email"
          value={user?.email ?? ''}
          fullWidth
          slotProps={{ input: { readOnly: true } }}
        />
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Role</Typography>
          <Chip
            label={user?.role === 'admin' ? 'Admin' : 'Trainee'}
            color={user?.role === 'admin' ? 'primary' : 'default'}
            size="small"
          />
        </Box>
        <Button
          variant="contained"
          disabled={!isDirty || uploading || !name.trim()}
          onClick={() => void handleSave()}
          fullWidth
        >
          Save Changes
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Button
        variant="outlined"
        color="error"
        fullWidth
        onClick={() => void handleSignOut()}
      >
        Sign Out
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
