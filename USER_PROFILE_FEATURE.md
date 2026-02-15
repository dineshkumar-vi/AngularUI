# User Profile Feature

## Overview
This feature adds user profile management capabilities to the Angular application, allowing users to view, edit, and delete their profiles.

## Components Added

### 1. UserProfileService (`src/app/user-profile.service.ts`)
A service that handles all user profile-related API calls:
- `getUserProfile(userId)` - Fetch user profile by ID
- `updateUserProfile(userId, profile)` - Update user profile information
- `deleteUserProfile(userId)` - Delete user profile
- `getAllProfiles()` - Get all user profiles (admin only)

### 2. UserProfileComponent (`src/app/user-profile/`)
A component that provides the user interface for profile management:
- View user profile information
- Edit profile details (email, first name, last name)
- Delete user profile with confirmation
- Loading states and error handling
- Success/error message display

## Files Created

```
src/app/
├── user-profile.service.ts
├── user-profile.service.spec.ts
└── user-profile/
    ├── user-profile.component.ts
    ├── user-profile.component.html
    ├── user-profile.component.css
    └── user-profile.component.spec.ts
```

## Testing
All components include comprehensive unit tests:
- Service tests with mocked axios calls
- Component tests with mocked service
- Edge case handling (errors, missing data, etc.)

## Usage

### Navigation
Access the user profile page at `/profile` route.

### API Endpoints
The service expects these backend endpoints:
- `GET /api/user/:id` - Get user profile
- `PUT /api/user/:id` - Update user profile
- `DELETE /api/user/:id` - Delete user profile
- `GET /api/user/all` - Get all profiles (admin)

### Local Storage
The component expects a `userId` to be stored in localStorage for automatic profile loading.

## Features

### View Mode
- Display user information in a clean, organized layout
- Shows username, email, first name, last name, and account creation date
- Edit and Delete buttons for profile management

### Edit Mode
- Inline editing of email, first name, and last name
- Form validation with visual feedback
- Save or cancel changes

### Delete Functionality
- Confirmation dialog before deletion
- Success message after deletion
- Proper error handling

### Error Handling
- Network error handling
- User-friendly error messages
- Loading states during API calls

## Styling
The component includes responsive CSS with:
- Clean, modern design
- Hover effects on buttons
- Form validation styling
- Mobile-friendly layout
- Color-coded messages (error/success)

## Future Enhancements
- Profile picture upload
- Password change functionality
- Email verification
- Two-factor authentication
- Activity log
- Account settings preferences
