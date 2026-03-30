# Coding Standards

## Architecture Rules

- Use **clean architecture** — separate concerns into layers (controller → service → repository)
- Use **modular structure** — each feature is a self-contained module
- Follow **single responsibility principle** — one function does one thing
- Use **dependency injection** — never instantiate services manually

## Naming Conventions

### Files

- `kebab-case` for all file names: `resume-parser.service.ts`, `jd-match.controller.ts`
- Suffix by role: `.controller.ts`, `.service.ts`, `.module.ts`, `.dto.ts`, `.guard.ts`, `.gateway.ts`
- Test files: `.spec.ts` (unit), `.e2e-spec.ts` (integration)

### Code

- `PascalCase` for classes, interfaces, types, enums: `ResumeService`, `ParsedResume`
- `camelCase` for variables, functions, methods: `processResume`, `matchScore`
- `SCREAMING_SNAKE_CASE` for constants: `MAX_FILE_SIZE`, `COMMON_SKILLS`
- `snake_case` for database columns (via Prisma `@map`)

## Backend Rules (NestJS)

- Every module must have: `*.module.ts`, `*.controller.ts`, `*.service.ts`
- DTOs must use `class-validator` decorators for all inputs
- Controllers handle HTTP concerns only — business logic lives in services
- Never expose raw database errors to clients
- Use `@UseGuards(JwtAuthGuard)` on all protected routes
- Always return consistent response shapes via interceptors

## Frontend Rules (React)

- Functional components only — no class components
- Use Zustand for global state, `useState` for local state
- Every page is a standalone file in `src/pages/`
- Shared UI goes in `src/components/common/`
- Feature-specific UI goes in `src/components/<feature>/`
- API calls live in `src/api/` — never call `fetch`/`axios` directly in components
- Use `react-router-dom` v6 for routing

## Environment & Configuration

- **All secrets in `.env`** — never hardcode API keys, passwords, or URLs
- Use `.env.example` as the template — document every variable
- Access via `process.env` (backend) or `import.meta.env` (frontend)

## Error Handling

- Backend: Use NestJS built-in exceptions (`NotFoundException`, `ForbiddenException`, etc.)
- Frontend: Catch all API errors, show user-friendly messages, log details to console
- Never swallow errors silently

## Comments

- Do NOT add comments that narrate what the code does
- DO add comments that explain **why** a non-obvious decision was made
- Prefer self-documenting code over comments
