# 🏀 Basketball Training App – Product & Technical Specification

## 1. Goal

Build a **mobile-optimized web application (PWA)** for basketball training that allows:
- Trainers (Admins) to create structured training plans
- Trainees (Users) to execute training sessions with timers
- Flexible use with predefined plans and custom user-created plans

---

## 2. Architecture Overview

### Frontend
- **Framework**: React with TypeScript
- **UI Library**: MUI (Material UI)
- **App Type**: Progressive Web App (PWA)
- **Design Principles**:
  - Mobile-first
  - Light/Dark mode toggle
  - Minimalistic, teen-friendly UX

### Backend
- **Primary Choice**: Firebase
  - Firestore for database
  - Firebase Authentication
  - Firebase Storage for uploaded media

### Hosting
- **Frontend Hosting**: Vercel or Netlify
- **Backend Services**: Firebase managed services

---

## 3. Authentication and User Management

### Authentication Methods
- Email and password
- Google sign-in
- Microsoft sign-in (optional but supported in design)

### User Profile
Each user should have a profile with:
- Name
- Email
- Profile picture
  - Uploaded manually, or
  - Retrieved from Google or Microsoft account
- Role: `admin` or `trainee`

### Roles
#### Admin
- Manage exercise types
- Manage exercise library
- Create and edit predefined plans
- Upload media
- Manage global app content

#### Trainee
- View and execute predefined plans
- Create personal custom plans
- Edit only their own custom plans
- View their own training history
- Update their own profile

---

## 4. Core Data Model

### User
```ts
type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "trainee";
  profileImageUrl?: string;
  createdAt: string;
};
```

### ExerciseType
```ts
type ExerciseType = {
  id: string;
  name: string; // e.g. Dribbling, Shooting, Layups, Free Throws, Team Training
};
```

### Exercise
```ts
type Exercise = {
  id: string;
  title: string;
  description?: string;
  typeId: string;
  youtubeUrl?: string;
  videoUrl?: string;
  imageUrls?: string[];
  defaultDurationMinutes: number;
  createdBy: string; // admin user id
};
```

### Predefined Training Plan
```ts
type TrainingPlan = {
  id: string;
  title: string;
  description?: string;
  totalDurationMinutes?: number;
  exercises: {
    exerciseId: string;
    durationMinutes: number;
    order: number;
  }[];
  createdBy: string; // admin user id
};
```

### Custom User Plan
```ts
type UserPlan = {
  id: string;
  userId: string;
  title: string;
  exercises: {
    exerciseId: string;
    durationMinutes: number;
    order: number;
  }[];
  createdAt: string;
  editable: true;
};
```

### Training Session / Execution Log
```ts
type TrainingSession = {
  id: string;
  userId: string;
  planId?: string;
  date: string;
  exercises: {
    exerciseId: string;
    plannedDuration: number;
    actualDuration: number;
    completed: boolean;
  }[];
};
```

---

## 5. Functional Requirements

## 5.1 Exercise Library

The app should provide a central exercise library managed by admins.

Each exercise may contain:
- Title
- Description only
- YouTube link
- Uploaded video
- One or multiple images
- Exercise type/category
- Default duration in minutes

Examples of exercise types:
- Dribbling
- Layups
- Free Throws
- Three-Pointers
- Passing
- Footwork
- Team Training
- Conditioning

Exercise types should be manageable through the admin UI, so new categories can be added later.

---

## 5.2 Training Plans

### Predefined Plans
Admins can create structured training plans from exercises in the library.

A predefined plan:
- Has a title and optional description
- Contains multiple exercises
- Stores duration per exercise
- May target overall durations like 1 hour, 2 hours, or 3 hours
- Cannot be edited by trainees

### Custom Plans
Trainees can create their own personal plans from the exercise library.

A custom plan:
- Belongs only to the creating user
- Can be edited later by that user
- Can reuse exercises from the library
- Can define custom durations per exercise

---

## 5.3 Training Execution

A trainee should be able to:
- Select a predefined plan
- Select one of their own custom plans
- Select an individual exercise from the library and run it directly

During execution, the trainee should see:
- Exercise title
- Description
- Embedded YouTube video when a YouTube link exists
- Uploaded video player when a custom video exists
- Images where provided
- Timer controls

---

## 5.4 Timer System

The timer is a key feature of the app.

### Default Duration
- For predefined exercises inside predefined plans, the timer should start with the number of minutes defined by the trainer/admin.
- For custom usage by the trainee, the timer should start with the exercise default duration.

### Timer Adjustments
The trainee should be able to modify the timer before or during use:
- `+1 minute`
- `-1 minute`
- `+5 minutes`
- `-5 minutes`

### Timer Controls
- Start
- Pause
- Reset
- Adjust time
- Restart from beginning

### Timer Persistence
The timer should continue to work even if:
- The app is minimized
- The screen is locked
- The mobile device temporarily switches away from the app

Expected behavior:
- The timer should continue counting down based on timestamps
- When the timer ends, the app should play a sound or trigger a notification
- The timer state should be recoverable if the app is reopened

Implementation ideas:
- PWA support
- Service worker
- Web Notifications API
- Save timer start/end timestamps locally and/or in backend storage

### Completion Confirmation
After the timer finishes:
- The app should not automatically mark the exercise as completed
- The trainee must manually choose whether the exercise was completed or not

---

## 5.5 Training History and Progress Tracking

The app should save execution data in the database.

Track at minimum:
- User
- Date
- Selected plan or exercise
- Planned duration
- Actual duration
- Completion status

The trainee should be able to open a history view and see:
- Which plans were completed
- Which exercises were completed
- On what dates

---

## 5.6 Profile Management

Each user should have a profile page where they can:
- View and edit their name
- View and edit profile information
- Upload or replace a profile picture
- Use a provider-based profile picture from Google or Microsoft if available

This profile should be visible in the app UI, for example on the dashboard or account page.

---

## 5.7 Admin Panel

Admins need a dedicated admin area.

The admin panel should allow:
- Create, edit, delete exercise types
- Create, edit, delete exercises
- Upload videos and images
- Create, edit, delete predefined training plans
- Configure durations for exercises inside predefined plans

The admin UI should be separated from trainee-facing pages by role-based access.

---

## 6. UI and UX Requirements

### General Design
- Clean
- Light
- Modern
- Teen-friendly
- Not overloaded with too many controls
- Easy to use on mobile devices

### Themes
- Light theme
- Dark theme

### Main Screens
- Login / Register
- Dashboard
- Exercise Library
- Predefined Plans
- My Custom Plans
- Active Training Session
- Training History
- Profile Page
- Admin Panel

### UX Notes
- Large touch-friendly controls
- Clear timer display
- Embedded media inside the page
- Fast navigation
- Minimal friction to start a workout

---

## 7. Non-Functional Requirements

### Performance
- Fast initial loading
- Responsive mobile layout
- Lazy loading for media where appropriate

### Security
- Role-based access
- Users can only access their own custom plans and own history
- Admin-only permissions for global content management
- Firestore security rules must enforce backend-level access restrictions

### Scalability
- Suitable for one user initially
- Should be easy to extend later for more users, more trainers, and more trainees

### Cost Sensitivity
- Prefer free-tier-friendly architecture
- Firebase free tier should be sufficient for MVP and personal use
- Hosting should use free-tier options where possible

---

## 8. Recommended Technical Stack

- React
- TypeScript
- MUI
- Firebase Authentication
- Firestore
- Firebase Storage
- Vite
- PWA support
- Hosting on Vercel or Netlify

---

## 9. Suggested MVP Scope

For the first version, build:
1. Authentication
2. User profile
3. Exercise type management
4. Exercise library
5. Predefined training plans
6. Custom user plans
7. Timer with adjustments and completion confirmation
8. Training history
9. Admin panel
10. Mobile-first responsive UI
11. Light and dark mode

---

## 10. Future Enhancements

Possible later versions may include:
- Native wrapper using Capacitor
- Push notifications and reminders
- Offline mode
- Better analytics
- Coach feedback
- Sharing plans with other users
- Gamification features such as streaks, levels, or achievements

---

## 11. Build Intent for AI Coding Tools

The app should be generated as a **clean, modular, mobile-first React TypeScript PWA** with Firebase backend integration.

Important expectations for generated code:
- Clear component structure
- Reusable form and card components
- Role-based routing
- Firebase integration separated into service modules
- Strong typing with TypeScript
- Simple and maintainable architecture
- No unnecessary complexity
