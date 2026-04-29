// User

export type UserRole = 'admin' | 'trainee';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImageUrl?: string;
  createdAt: string; // ISO date string
};

// Exercise Type (Category)

export type ExerciseType = {
  id: string;
  name: string;
};

// Exercise Subtype (belongs to an ExerciseType)

export type ExerciseSubtype = {
  id: string;
  name: string;
  typeId: string; // references ExerciseType.id
};

// Exercise

export type Exercise = {
  id: string;
  title: string;
  description?: string;
  typeId: string;            // references ExerciseType.id
  subtypeId?: string;        // references ExerciseSubtype.id
  youtubeUrl?: string;
  videoUrl?: string;         // Firebase Storage URL
  imageUrls?: string[];      // Firebase Storage URLs
  defaultDurationMinutes: number;
  createdBy: string;         // admin user id
};

// Predefined Training Plan (admin-created)

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

// Custom User Plan (trainee-created)

export type UserPlan = {
  id: string;
  userId: string;
  title: string;
  exercises: PlanExercise[];
  createdAt: string;
  editable: true;
};

// Training Session / Execution Log

export type SessionExercise = {
  exerciseId: string;
  plannedDuration: number;  // minutes
  actualDuration: number;   // minutes (recorded after execution)
  completed: boolean;
};

export type TrainingSession = {
  id: string;
  userId: string;
  planId?: string;           // undefined if running a single exercise ad-hoc
  date: string;              // ISO date string
  exercises: SessionExercise[];
};

// Timer State (client-side only, not persisted in Firestore)

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export type TimerState = {
  status: TimerStatus;
  durationSeconds: number;  // total duration set
  remainingSeconds: number; // current countdown value
  startedAt?: number;       // Date.now() timestamp when last started/resumed
};
