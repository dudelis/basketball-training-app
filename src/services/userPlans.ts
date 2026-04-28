import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { UserPlan } from '../types';

const COLLECTION = 'userPlans';

export async function getUserPlans(userId: string): Promise<UserPlan[]> {
  const q = query(collection(db, COLLECTION), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as UserPlan);
}

export async function createUserPlan(data: Omit<UserPlan, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), data);
  return ref.id;
}

export async function updateUserPlan(
  id: string,
  data: Partial<UserPlan>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data as Record<string, unknown>);
}

export async function deleteUserPlan(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
