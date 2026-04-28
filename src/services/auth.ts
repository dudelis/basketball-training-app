import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';
import { createUserProfile, getUserProfile } from './users';
import type { AppUser } from '../types';

const googleProvider = new GoogleAuthProvider();

function mapAuthError(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'No account found with these credentials.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? '';
    throw new Error(mapAuthError(code));
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<void> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });

    const profile: AppUser = {
      id: credential.user.uid,
      name,
      email,
      role: 'trainee',
      createdAt: new Date().toISOString(),
    };
    await createUserProfile(profile);
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? '';
    throw new Error(mapAuthError(code));
  }
}

export async function signInWithGoogle(): Promise<void> {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    const { user } = credential;

    const existing = await getUserProfile(user.uid);
    if (!existing) {
      const profile: AppUser = {
        id: user.uid,
        name: user.displayName ?? 'Unknown',
        email: user.email ?? '',
        role: 'trainee',
        profileImageUrl: user.photoURL ?? undefined,
        createdAt: new Date().toISOString(),
      };
      await createUserProfile(profile);
    }
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? '';
    throw new Error(mapAuthError(code));
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}
