# Restrictions & Guardrails

## Process Restrictions

- **Do NOT jump to coding without design** — Architecture must be reviewed first
- **Do NOT skip testing** — Every module needs at minimum a test plan
- **Do NOT ignore security** — Auth, validation, and sanitization are mandatory
- **Do NOT deploy untested code** — QA sign-off required before deployment
- **Do NOT merge without review** — Senior Engineer must approve

## Code Restrictions

- **No hardcoded secrets** — All credentials via environment variables
- **No raw SQL queries** — Use Prisma ORM exclusively
- **No `any` type abuse** — Use proper TypeScript types on backend
- **No inline styles** — Use Tailwind classes on frontend
- **No direct DOM manipulation** — Use React state and refs
- **No circular dependencies** — Module imports must be acyclic
- **No console.log in production** — Use NestJS Logger service

## Security Restrictions

- **Never store plain-text passwords** — bcrypt with 12+ rounds
- **Never expose stack traces to clients** — Use exception filters
- **Never trust client input** — Validate and sanitize everything
- **Never serve user-uploaded files directly** — Validate file types, scan content
- **Never disable CORS in production** — Whitelist specific origins

## Architecture Restrictions

- **No God modules** — Each module has a single, clear responsibility
- **No business logic in controllers** — Controllers are thin wrappers
- **No database calls in controllers** — Always go through services
- **No frontend logic in API responses** — Return raw data, let frontend format

## AI/LLM Restrictions

- **Always implement fallbacks** — If the LLM API fails, return reasonable defaults
- **Always set temperature and max_tokens** — Never rely on API defaults
- **Always parse LLM output safely** — Wrap JSON.parse in try/catch
- **Never send raw user data to LLM prompts** — Sanitize first
- **Rate limit AI endpoints more aggressively** — These are expensive calls
