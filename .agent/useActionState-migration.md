# useActionState Migration Summary

## Overview

Successfully migrated the `BookEvent` component from manual state management to React's `useActionState` hook for better integration with server actions.

## Changes Made

### 1. Server Action (`lib/actions/booking.actions.ts`)

**Before:**

- Accepted object parameters `{ eventId, slug, email }`
- Returned `{ success, booking }` or `{ success, error }`

**After:**

- Accepts `prevState` and `formData` parameters (required by `useActionState`)
- Extracts data from `FormData` object
- Returns structured `BookingState` type with `success`, `message`, and optional `error`
- Added validation for required fields and email format
- Better error handling with descriptive messages

### 2. Client Component (`components/BookEvent.tsx`)

**Before:**

- Used `useState` for email and submitted state
- Manual form submission with `onSubmit` handler
- Called server action directly with parameters

**After:**

- Uses `useActionState` hook with three return values:
  - `state`: Current state from server action
  - `formAction`: Form action handler
  - `isPending`: Loading state
- Form uses native `action` attribute (progressive enhancement)
- Hidden inputs for `eventId` and `slug`
- Email input uses `name` attribute instead of controlled state
- Automatic pending state with disabled inputs and loading text
- Error messages displayed inline

## Benefits

1. **Progressive Enhancement**: Form works without JavaScript
2. **Better UX**: Automatic pending states and loading indicators
3. **Cleaner Code**: Less boilerplate, no manual state management
4. **Type Safety**: Strongly typed state with `BookingState` interface
5. **Validation**: Server-side validation for required fields and email format
6. **Error Handling**: Clear error messages displayed to users

## Usage

The component usage remains the same:

```tsx
<BookEvent eventId="123" slug="event-slug" />
```

## State Flow

1. User fills email and submits form
2. `useActionState` calls `createBooking` with `FormData`
3. Server validates and processes booking
4. Returns new state with success/error message
5. Component re-renders with updated state
6. Success message or error displayed to user
