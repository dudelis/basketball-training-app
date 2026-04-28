---
mode: agent
description: Step 13 – Build the user Profile page with name editing, profile picture upload (manual or provider), and account info display.
---

# Step 13 – Profile Management

Implement the user profile page where authenticated users can view and update their name and profile picture.

---

## `src/pages/ProfilePage.tsx`

### UI Layout

- Page title: "My Profile"
- Profile picture section:
  - Display current profile image in a large MUI `Avatar` (120px).
  - If no profile image: show initials (first letter of name).
  - "Change Photo" button below the avatar.
- Profile form:
  - `TextField` for Name (editable, required).
  - `TextField` for Email (read-only — Firebase Auth email, not editable here).
  - Role badge (MUI `Chip`: "Admin" or "Trainee"), read-only.
- "Save Changes" button (only enabled when name has been modified).
- "Sign Out" button at the bottom (outlined, full width).

---

## Profile Picture Upload

When "Change Photo" is clicked:
- Open a native file picker (`<input type="file" accept="image/*">`).
- Preview the selected image in the avatar before uploading.
- On save:
  1. Upload the image to Firebase Storage via `uploadProfileImage(userId, file)`.
  2. Get the download URL.
  3. Call `updateUserProfile(userId, { profileImageUrl: url })` to save it.
- Show upload progress with MUI `LinearProgress`.
- Show error `Snackbar` if upload fails.

---

## Provider Profile Picture

If the user signed in via Google and no manually uploaded picture exists yet:
- Use the `photoURL` from `firebaseUser` as the initial `profileImageUrl`.
- Save it to Firestore on first profile load if not already set.

---

## Sign Out

"Sign Out" button calls `signOut()` from `src/services/auth.ts` and navigates to `/login`.

---

## Update Name

"Save Changes" calls `updateUserProfile(userId, { name })` then shows a `Snackbar`: "Profile updated successfully."

---

## AppBar Avatar Sync

In `src/components/AppLayout.tsx`, the profile avatar icon in the AppBar should:
- Display the user's `profileImageUrl` if available.
- Fall back to initials if not.
- Update reactively when the profile is updated.

---

## Acceptance Criteria

- Users can update their name and it persists in Firestore.
- Users can upload a profile picture and it appears in the AppBar avatar immediately.
- Google sign-in picture is auto-populated to profile on first login.
- Sign out works and redirects to login.
- No TypeScript errors.
