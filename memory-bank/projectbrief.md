# Project Brief

## Overview
Mobile-first Progressive Web App (PWA) for basketball training.

## Users & Roles
| Role | Description |
|---|---|
| `admin` (Trainer) | Full access: exercise CRUD, plan CRUD, media upload, user management |
| `trainee` | View/run predefined plans, manage own custom plans and history |

## Core Features
- Exercise library (admin manages, trainees view)
- Structured training plans (admin creates, trainees execute)
- Active training session with timer
- Custom plans (trainees create their own)
- Training history tracking
- Profile management
- Light/dark theme toggle
- PWA (installable, offline-capable)

## Design Principles
- Mobile-first, large touch targets
- Teen-friendly, clean, minimalistic UI
- Minimal friction to start a workout
- MUI light/dark theme via ThemeProvider

## Security Rules
- Firestore security rules enforce RBAC at the backend level
- Never rely solely on frontend routing for access control
- Admin role = full access; trainee role = scoped access only
