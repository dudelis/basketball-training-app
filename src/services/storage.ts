import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../firebase';

export async function uploadProfileImage(
  userId: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, `profileImages/${userId}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadExerciseVideo(
  exerciseId: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, `exerciseVideos/${exerciseId}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadExerciseImage(
  exerciseId: string,
  fileName: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, `exerciseImages/${exerciseId}/${fileName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteFile(downloadUrl: string): Promise<void> {
  const storageRef = ref(storage, downloadUrl);
  await deleteObject(storageRef);
}
