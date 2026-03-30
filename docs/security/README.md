# Security Guidelines

## Authentication

### JWT Implementation
- Algorithm: HS256
- Secret: Minimum 32 characters, stored in `JWT_SECRET` env var
- Expiration: Configurable via `JWT_EXPIRATION` (default: 7 days)
- Token location: `Authorization: Bearer <token>` header only
- No token storage in cookies (prevents CSRF)

### Password Security
- Hashing: bcrypt with 12 salt rounds
- Minimum length: 8 characters
- Maximum length: 64 characters (prevent bcrypt DoS)
- Never log or return passwords in any response

### Protected Routes
All routes except the following require JWT authentication:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

---

## Input Validation

### DTO Validation (Backend)
- All request bodies validated via `class-validator` decorators
- `ValidationPipe` configured globally with:
  - `whitelist: true` — Strip unknown properties
  - `forbidNonWhitelisted: true` — Reject unknown properties with 400
  - `transform: true` — Auto-transform types

### File Upload Validation
- Allowed MIME types: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Max file size: 10 MB
- Files stored with UUID names (prevent path traversal)
- Original filename stored in database only

---

## HTTP Security

### Helmet
Enabled globally, sets these headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (in production)

### CORS
- Allowed origin: `FRONTEND_URL` env var (default: `http://localhost:5173`)
- Credentials: enabled
- Methods: GET, POST, PUT, PATCH, DELETE

### Rate Limiting
- Global: 60 requests per minute per IP (ThrottlerGuard)
- AI endpoints: Consider stricter limits (10–20 per minute)

---

## Data Protection

### Sensitive Data
Never expose in API responses:
- `password` field from User model
- Raw JWT secrets
- Internal file paths (use relative paths)
- Stack traces or internal error details

### Database
- Use parameterized queries (Prisma handles this)
- CASCADE deletes ensure no orphaned data
- UUIDs for all primary keys (prevent enumeration)

---

## Security Checklist

### Before Deploying Any Feature
- [ ] All routes have appropriate auth guards
- [ ] All inputs validated with DTOs
- [ ] File uploads validated (type + size)
- [ ] No sensitive data in responses
- [ ] Error responses don't leak internals
- [ ] Rate limiting active
- [ ] CORS properly configured
- [ ] Environment variables used for all secrets
- [ ] Passwords hashed before storage
- [ ] SQL injection prevented (Prisma ORM)
- [ ] XSS prevented (React auto-escapes)
- [ ] CSRF prevented (JWT in header, not cookies)

---

## OWASP Top 10 Mapping

| Risk | Mitigation |
|------|-----------|
| A01: Broken Access Control | JwtAuthGuard + ownership checks (userId) |
| A02: Cryptographic Failures | bcrypt hashing, HTTPS in production |
| A03: Injection | Prisma ORM (parameterized), class-validator |
| A04: Insecure Design | Clean architecture, separation of concerns |
| A05: Security Misconfiguration | Helmet, CORS whitelist, env vars |
| A06: Vulnerable Components | Regular npm audit, pinned versions |
| A07: Auth Failures | JWT with expiration, bcrypt 12 rounds |
| A08: Data Integrity | Input validation, DTO whitelisting |
| A09: Logging Failures | NestJS Logger, no password logging |
| A10: SSRF | No user-controlled URLs fetched server-side |
