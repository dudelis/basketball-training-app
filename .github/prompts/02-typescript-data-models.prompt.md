---
mode: agent
description: Step 02 – Define all shared TypeScript types and interfaces for the app in src/types/index.ts. No component or service code.
---

# Step 02 – TypeScript Data Models

Populate `src/types/index.ts` with **all** shared TypeScript types and interfaces for the Basketball Training App. This file is the single source of truth for all data shapes used across services, hooks, and components.

## Types to Define

### User

```ts
export type UserRole = 'admin' | 'trainee';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImageUrl?: string;
  createdAt: string; // ISO date string
};
```

### Exercise Type (Category)

```ts
export type ExerciseType = {
  id: string;
  name: string; // e.g. "Dribbling", "Shooting", "Layups", "Free Throws", "Team Training"
};
```

### Exercise

```ts
export type Exercise = {
  id: string;
  title: string;
  description?: string;
  typeId: string;             // references ExerciseType.id
  youtubeUrl?: string;
  videoUrl?: string;          // Firebase Storage URL
  imageUrls?: string[];       // Firebase Storage URLs
  defaultDurationMinutes: number;
  createdBy: string;          // admin user id
};
```

### Predefined Training Plan (admin-created)

```ts
export type PlanExercise = {
  exerciseId: string;
  durationMinutes: number;
  order: number;
};

export type TrainingPlan = {
  id: string;
  title: string;
  description?: string;
  totalDurationMinutes?: number;
  exercises: PlanExercise[];
  createdBy: string; // admin user id
};
```

### Custom User Plan (trainee-created)

```ts
export type UserPlan = {
  id: string;
  userId: string;
  title: string;
  exercises: PlanExercise[];  // reuse PlanExercise
  createdAt: string;
  editable: true;
};
```

### Training Session / Execution Log

```ts
export type SessionExercise = {
  exerciseId: string;
  plannedDuration: number;   // minutes
  actualDuration: number;    // minutes (recorded after execution)
  completed: boolean;
};

export type TrainingSession = {
  id: string;
  userId: string;
  planId?: string;            // undefined if running a single exercise ad-hoc
  date: string;               // ISO date string
  exercises: SessionExercise[];
};
```

### Timer State (client-side only, not persisted in Firestore)

```ts
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export type TimerState = {
  status: TimerStatus;
  durationSeconds: number;   // total duration set
  remainingSeconds: number;  // current countdown value
  startedAt?: number;        // Date.now() timestamp when last started/resumed
};
```

## Rules

- Do not import anything from Firebase inside this file.
- Do not add React imports.
- Export every type with `export`.
- Use `string` (ISO date) for all date fields — not `Date` objects.
- No default export — only named exports.

## Acceptance Criteria

- `src/types/index.ts` compiles with no TypeScript errors.
- All types listed above are present and exported.
