---
mode: agent
description: Step 14 – Build the Dashboard page with a welcome card, quick-start shortcuts, and recent activity summary for both trainees and admins.
---

# Step 14 – Dashboard

Implement the Dashboard page — the home screen shown to authenticated users after login.

---

## `src/pages/DashboardPage.tsx`

The dashboard should be **role-aware**: show different content for admins vs trainees.

---

### Common Elements (all users)

**Welcome Card**
- Full-width card at the top.
- "Good morning / afternoon / evening, [Name]! 👋" (based on current time).
- User's role badge (Chip: "Admin" or "Trainee").
- Profile avatar (links to `/profile`).

---

### Trainee Dashboard

**Quick Start Section**
- Section heading: "Quick Start"
- Two large touch-friendly action buttons (full width on mobile, side by side on tablet):
  - "Browse Exercises" → navigates to `/exercises`
  - "Start a Plan" → navigates to `/plans`

**Recent Sessions**
- Section heading: "Recent Activity"
- Load the last 3 training sessions for the user.
- Display as a compact list:
  - Session date
  - Plan name or "Solo Exercise"
  - Exercises completed / total
- "View All History" link → `/history`
- If no sessions: "No training sessions yet. Let's get started!" with a CTA button.

**Stats Row**
- 3 MUI `Paper` stat cards in a row:
  - Total sessions this week
  - Total training time this week (sum of actual durations)
  - Exercises completed this week
- Compute these from loaded sessions filtered to the current week.

---

### Admin Dashboard

**Overview Stats**
- 4 MUI `Paper` stat cards:
  - Total exercises in library
  - Total predefined plans
  - Total exercise types
  - (Placeholder) Total users
- Load these numbers from Firestore counts.

**Quick Actions**
- Section heading: "Quick Actions"
- 3 large buttons:
  - "Manage Exercises" → `/admin/exercises`
  - "Manage Plans" → `/admin/plans`
  - "Manage Exercise Types" → `/admin/exercise-types`

---

## Loading State

- Show `CircularProgress` centered while data is loading.
- Use `Promise.all` to load all needed data in parallel.

---

## Acceptance Criteria

- Dashboard shows role-specific content.
- Trainee sees quick start, recent sessions, and weekly stats.
- Admin sees overview stats and quick action buttons.
- Recent sessions are limited to last 3.
- No TypeScript errors.
