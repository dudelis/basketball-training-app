---
mode: agent
description: Step 03 – Create Firebase service modules in src/services/ for Firestore CRUD and Firebase Storage uploads, separated by domain.
---

# Step 03 – Firebase Service Modules

Create all Firebase service modules inside `src/services/`. Each file encapsulates Firestore and Storage operations for one domain. Import `db` and `storage` from `src/firebase.ts`. Import all types from `src/types/index.ts`.

Use the **modular Firebase v9+ SDK** (`firebase/firestore`, `firebase/storage`). Use `async/await` throughout — no `.then()` chains.

---

## `src/services/users.ts`

Functions:
- `createUserProfile(user: AppUser): Promise<void>` — writes to `users/{userId}`
- `getUserProfile(userId: string): Promise<AppUser | null>`
- `updateUserProfile(userId: string, data: Partial<AppUser>): Promise<void>`

---

## `src/services/exerciseTypes.ts`

Functions:
- `getExerciseTypes(): Promise<ExerciseType[]>`
- `createExerciseType(name: string): Promise<string>` — returns new doc id
- `updateExerciseType(id: string, name: string): Promise<void>`
- `deleteExerciseType(id: string): Promise<void>`

Firestore collection: `exerciseTypes`

---

## `src/services/exercises.ts`

Functions:
- `getExercises(): Promise<Exercise[]>`
- `getExerciseById(id: string): Promise<Exercise | null>`
- `createExercise(data: Omit<Exercise, 'id'>): Promise<string>`
- `updateExercise(id: string, data: Partial<Exercise>): Promise<void>`
- `deleteExercise(id: string): Promise<void>`

Firestore collection: `exercises`

---

## `src/services/trainingPlans.ts`

Functions:
- `getTrainingPlans(): Promise<TrainingPlan[]>`
- `getTrainingPlanById(id: string): Promise<TrainingPlan | null>`
- `createTrainingPlan(data: Omit<TrainingPlan, 'id'>): Promise<string>`
- `updateTrainingPlan(id: string, data: Partial<TrainingPlan>): Promise<void>`
- `deleteTrainingPlan(id: string): Promise<void>`

Firestore collection: `trainingPlans`

---

## `src/services/userPlans.ts`

Functions:
- `getUserPlans(userId: string): Promise<UserPlan[]>`
- `createUserPlan(data: Omit<UserPlan, 'id'>): Promise<string>`
- `updateUserPlan(id: string, data: Partial<UserPlan>): Promise<void>`
- `deleteUserPlan(id: string): Promise<void>`

Firestore collection: `userPlans`  
All queries must filter by `userId` to enforce data isolation.

---

## `src/services/trainingSessions.ts`

Functions:
- `createTrainingSession(data: Omit<TrainingSession, 'id'>): Promise<string>`
- `getTrainingSessions(userId: string): Promise<TrainingSession[]>`
- `getTrainingSessionById(id: string): Promise<TrainingSession | null>`

Firestore collection: `trainingSessions`  
All queries must filter by `userId`.

---

## `src/services/storage.ts`

Functions:
- `uploadProfileImage(userId: string, file: File): Promise<string>` — uploads to `profileImages/{userId}`, returns download URL
- `uploadExerciseVideo(exerciseId: string, file: File): Promise<string>` — uploads to `exerciseVideos/{exerciseId}`, returns download URL
- `uploadExerciseImage(exerciseId: string, fileName: string, file: File): Promise<string>` — uploads to `exerciseImages/{exerciseId}/{fileName}`, returns download URL
- `deleteFile(downloadUrl: string): Promise<void>` — deletes file by its download URL

---

## `firestore.rules`

Create a `firestore.rules` file at the project root with the following rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Users: readable by self, writable by self (admin can read all)
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
    }

    // Exercise types: readable by all signed-in, writable by admins only
    match /exerciseTypes/{typeId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }

    // Exercises: readable by all signed-in, writable by admins only
    match /exercises/{exerciseId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }

    // Predefined plans: readable by all signed-in, writable by admins only
    match /trainingPlans/{planId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }

    // User plans: accessible only by their owner
    match /userPlans/{planId} {
      allow read, write: if isOwner(resource.data.userId);
      allow create: if isOwner(request.resource.data.userId);
    }

    // Training sessions: accessible only by their owner
    match /trainingSessions/{sessionId} {
      allow read, write: if isOwner(resource.data.userId);
      allow create: if isOwner(request.resource.data.userId);
    }
  }
}
```

## Acceptance Criteria

- All service files compile with no TypeScript errors.
- No hardcoded Firestore collection names — use constants at the top of each file.
- Every function uses `async/await`.
- All data types come from `src/types/index.ts`.
