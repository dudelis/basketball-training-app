import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Avatar, Button, TextField, Chip,
  Snackbar, Alert, Divider, Tooltip,
} from '@mui/material';
import type { AlertColor } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuthContext } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/users';
import { signOut } from '../services/auth';
import type { AppUser } from '../types';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, firebaseUser, refreshUser } = useAuthContext();

  const [name, setName] = useState(user?.name ?? '');
  const [pendingGooglePhoto, setPendingGooglePhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false, message: '', severity: 'success',
  });
  const googleSyncedRef = useRef(false);

  // Auto-save Google photo on first load if none set in Firestore yet
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

  const isDirty =
    name.trim() !== (user?.name ?? '') ||
    pendingGooglePhoto;

  function handleUseGooglePhoto() {
    if (!firebaseUser?.photoURL) return;
    setPendingGooglePhoto(true);
  }

  const handleSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updates: Partial<AppUser> = {};
      if (name.trim() !== user.name) updates.name = name.trim();
      if (pendingGooglePhoto && firebaseUser?.photoURL) {
        updates.profileImageUrl = firebaseUser.photoURL;
      }
      if (Object.keys(updates).length > 0) {
        await updateUserProfile(user.id, updates);
        await refreshUser();
      }
      setPendingGooglePhoto(false);
      setSnackbar({ open: true, message: 'Profile updated successfully.', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update profile.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  }, [user, name, pendingGooglePhoto, firebaseUser, refreshUser]);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  // Show Google photo directly from firebaseUser as fallback (before Firestore sync completes)
  const avatarSrc =
    (pendingGooglePhoto ? firebaseUser?.photoURL : null) ??
    user?.profileImageUrl ??
    firebaseUser?.photoURL ??
    undefined;
  const initials = user?.name?.charAt(0).toUpperCase() ?? '?';
  const googlePhotoUrl = firebaseUser?.photoURL;

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>My Profile</Typography>

      {/* Avatar */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar src={avatarSrc} sx={{ width: 120, height: 120, fontSize: 48, mb: 1.5 }}>
          {!avatarSrc && initials}
        </Avatar>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* TODO: enable once Firebase Storage (Blaze plan) is activated */}
          <Tooltip title="Requires Firebase Storage upgrade">
            <span>
              <Button size="small" startIcon={<PhotoCameraIcon />} variant="outlined" disabled>
                Upload Photo
              </Button>
            </span>
          </Tooltip>
          {googlePhotoUrl && (
            <Button
              size="small"
              startIcon={<GoogleIcon />}
              variant="outlined"
              onClick={handleUseGooglePhoto}
              disabled={pendingGooglePhoto}
            >
              Use Google Photo
            </Button>
          )}
        </Box>
      </Box>

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
          disabled={!isDirty || saving || !name.trim()}
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
