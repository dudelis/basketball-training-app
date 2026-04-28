import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { AppUser } from '../types';

const COLLECTION = 'users';

export async function createUserProfile(user: AppUser): Promise<void> {
  await setDoc(doc(db, COLLECTION, user.id), user);
}

export async function getUserProfile(userId: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, COLLECTION, userId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as AppUser;
}

export async function updateUserProfile(
  userId: string,
  data: Partial<AppUser>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, userId), data as Record<string, unknown>);
}
