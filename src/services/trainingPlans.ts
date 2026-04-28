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
import type { TrainingPlan } from '../types';

const COLLECTION = 'trainingPlans';

export async function getTrainingPlans(): Promise<TrainingPlan[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TrainingPlan);
}

export async function getTrainingPlanById(id: string): Promise<TrainingPlan | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as TrainingPlan;
}

export async function createTrainingPlan(
  data: Omit<TrainingPlan, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), data);
  return ref.id;
}

export async function updateTrainingPlan(
  id: string,
  data: Partial<TrainingPlan>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data as Record<string, unknown>);
}

export async function deleteTrainingPlan(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
