# API Contract: Auth Module

**Base path**: `/api/v1/auth`

---

## POST /register

Create a new user account.

### Request
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe"
}
```

### Validation Rules
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| email | string | yes | Valid email format |
| password | string | yes | Min 8, max 64 characters |
| fullName | string | yes | Min 2, max 100 characters |

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

### Errors
| Status | Condition |
|--------|-----------|
| 400 | Validation failure (missing/invalid fields) |
| 409 | Email already registered |

---

## POST /login

Authenticate and receive a JWT token.

### Request
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

### Errors
| Status | Condition |
|--------|-----------|
| 400 | Validation failure |
| 401 | Invalid email or password |

---

## GET /profile

Get the authenticated user's profile.

### Headers
```
Authorization: Bearer <token>
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "avatarUrl": null,
    "createdAt": "2026-03-30T12:00:00.000Z"
  },
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

### Errors
| Status | Condition |
|--------|-----------|
| 401 | Missing/invalid/expired token |
