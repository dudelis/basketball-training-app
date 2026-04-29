import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { TrainingSession } from '../types';

const COLLECTION = 'trainingSessions';

export async function createTrainingSession(
  data: Omit<TrainingSession, 'id'>
): Promise<string> {
  const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
  const ref = await addDoc(collection(db, COLLECTION), clean);
  return ref.id;
}

export async function getTrainingSessions(userId: string): Promise<TrainingSession[]> {
  const q = query(collection(db, COLLECTION), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TrainingSession);
}

export async function getTrainingSessionById(
  id: string
): Promise<TrainingSession | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as TrainingSession;
}
