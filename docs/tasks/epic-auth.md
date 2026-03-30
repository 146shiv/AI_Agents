# Epic: Authentication & User Management

## Overview
JWT-based authentication with registration, login, and profile management.

---

## Tasks

### AUTH-1: User Registration Endpoint
- **Owner**: Backend Engineer
- **Input**: `{ email, password, fullName }` via POST `/api/v1/auth/register`
- **Output**: `{ user: { id, email, fullName }, accessToken }` (201 Created)
- **Acceptance Criteria**:
  - [ ] Validates email format (class-validator `@IsEmail`)
  - [ ] Validates password min 8 chars, max 64 chars
  - [ ] Validates fullName min 2 chars, max 100 chars
  - [ ] Returns 409 Conflict if email already exists
  - [ ] Password hashed with bcrypt (12 rounds) before storage
  - [ ] Returns JWT token on success
  - [ ] User record created in database
- **Status**: backlog

### AUTH-2: User Login Endpoint
- **Owner**: Backend Engineer
- **Input**: `{ email, password }` via POST `/api/v1/auth/login`
- **Output**: `{ user: { id, email, fullName }, accessToken }` (200 OK)
- **Acceptance Criteria**:
  - [ ] Returns 401 Unauthorized for wrong email
  - [ ] Returns 401 Unauthorized for wrong password
  - [ ] Same error message for both (no enumeration)
  - [ ] Returns JWT token on success
  - [ ] Token expiration configurable via `JWT_EXPIRATION` env var
- **Status**: backlog

### AUTH-3: JWT Auth Guard
- **Owner**: Backend Engineer
- **Input**: `Authorization: Bearer <token>` header
- **Output**: Authenticated request with user payload attached
- **Acceptance Criteria**:
  - [ ] Extracts token from Authorization header
  - [ ] Returns 401 if token missing or invalid
  - [ ] Returns 401 if token expired
  - [ ] Returns 401 if user no longer exists
  - [ ] Attaches `{ sub: userId, email, fullName }` to request
- **Status**: backlog

### AUTH-4: Get Profile Endpoint
- **Owner**: Backend Engineer
- **Input**: JWT token via GET `/api/v1/auth/profile`
- **Output**: `{ id, email, fullName, avatarUrl, createdAt }` (200 OK)
- **Acceptance Criteria**:
  - [ ] Requires authentication (JwtAuthGuard)
  - [ ] Never returns password field
  - [ ] Returns 401 if not authenticated
- **Status**: backlog

### AUTH-5: Login Page (Frontend)
- **Owner**: Frontend Engineer
- **Input**: User types email + password
- **Output**: Redirect to Dashboard on success
- **Acceptance Criteria**:
  - [ ] Form with email and password fields
  - [ ] Client-side validation before submit
  - [ ] Shows error message on invalid credentials
  - [ ] Stores JWT in Zustand store (+ localStorage)
  - [ ] Redirects to `/dashboard` on success
  - [ ] Link to Register page
- **Status**: backlog

### AUTH-6: Register Page (Frontend)
- **Owner**: Frontend Engineer
- **Input**: User types email, password, full name
- **Output**: Redirect to Dashboard on success
- **Acceptance Criteria**:
  - [ ] Form with email, password, fullName fields
  - [ ] Client-side validation (email format, password min 8 chars)
  - [ ] Shows error message on conflict (email taken)
  - [ ] Auto-login after registration (stores JWT)
  - [ ] Redirects to `/dashboard` on success
  - [ ] Link to Login page
- **Status**: backlog
