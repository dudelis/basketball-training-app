import { useState, useEffect, useRef, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';
import { getUserProfile } from '../services/users';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
} from '../services/auth';
import type { AppUser } from '../types';

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async (uid?: string) => {
    const id = uid ?? firebaseUser?.uid;
    if (!id) return;
    const profile = await getUserProfile(id);
    setUser(profile);
  }, [firebaseUser?.uid]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const profile = await getUserProfile(fbUser.uid);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    firebaseUser,
    loading,
    refreshUser,
    signIn: signInWithEmail,
    signUp: signUpWithEmail,
    signInWithGoogle,
    signOut,
  };
}
