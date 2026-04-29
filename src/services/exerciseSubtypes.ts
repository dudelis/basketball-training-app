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
import type { ExerciseSubtype } from '../types';

const COLLECTION = 'exerciseSubtypes';

export async function getExerciseSubtypes(): Promise<ExerciseSubtype[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ExerciseSubtype);
}

export async function getSubtypesByType(typeId: string): Promise<ExerciseSubtype[]> {
  const q = query(collection(db, COLLECTION), where('typeId', '==', typeId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ExerciseSubtype);
}

export async function createExerciseSubtype(name: string, typeId: string): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), { name, typeId });
  return ref.id;
}

export async function updateExerciseSubtype(id: string, name: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { name });
}

export async function deleteExerciseSubtype(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
