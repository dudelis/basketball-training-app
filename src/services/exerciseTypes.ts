import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { ExerciseType } from '../types';

const COLLECTION = 'exerciseTypes';

export async function getExerciseTypes(): Promise<ExerciseType[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ExerciseType);
}

export async function createExerciseType(name: string): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), { name });
  return ref.id;
}

export async function updateExerciseType(id: string, name: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { name });
}

export async function deleteExerciseType(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
