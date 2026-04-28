import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Exercise } from '../types';

const COLLECTION = 'exercises';

export async function getExercises(): Promise<Exercise[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Exercise);
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Exercise;
}

export async function createExercise(data: Omit<Exercise, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), data);
  return ref.id;
}

export async function updateExercise(
  id: string,
  data: Partial<Exercise>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data as Record<string, unknown>);
}

export async function deleteExercise(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
