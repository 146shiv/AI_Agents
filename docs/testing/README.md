# Testing Strategy

## Testing Pyramid

```
        ┌─────────┐
        │  E2E    │  ← Few, critical user flows
        │ Tests   │
        ├─────────┤
        │ Integra-│  ← API endpoint tests
        │  tion   │
        ├─────────┤
        │  Unit   │  ← Service logic tests (most tests here)
        │ Tests   │
        └─────────┘
```

## Framework
- **Unit + Integration**: Jest + ts-jest
- **E2E**: Jest + Supertest + @nestjs/testing
- **Frontend**: (Future) Vitest + Testing Library

---

## Unit Tests

### What to Test
- Service methods (business logic)
- Parser functions (text extraction, section detection)
- Scoring algorithms (each sub-score function)
- AI service response parsing (JSON extraction, fallbacks)
- Utility functions

### Naming Convention
- File: `*.spec.ts` next to the source file
- Describe: `describe('ServiceName', () => ...)`
- It: `it('should <expected behavior> when <condition>', () => ...)`

### Key Test Cases

#### Auth Service
- [ ] `register` — creates user with hashed password
- [ ] `register` — throws ConflictException for duplicate email
- [ ] `login` — returns JWT for valid credentials
- [ ] `login` — throws UnauthorizedException for wrong password
- [ ] `login` — throws UnauthorizedException for non-existent email

#### Resume Parser Service
- [ ] `extractText` — extracts text from PDF
- [ ] `extractText` — extracts text from DOCX
- [ ] `extractText` — throws for unsupported type
- [ ] `parseResume` — extracts skills from text
- [ ] `parseResume` — extracts contact info (email, phone, LinkedIn, GitHub)
- [ ] `parseResume` — identifies section headers
- [ ] `parseResume` — handles empty/minimal resumes

#### Resume Scorer Service
- [ ] `scoreKeywords` — returns correct score for various skill counts
- [ ] `scoreFormatting` — awards points for each formatting criterion
- [ ] `scoreExperience` — awards points for action verbs, metrics, entries
- [ ] `scoreSkillDensity` — correct density calculation
- [ ] `scoreResume` — weighted overall score is correct
- [ ] `detectWeaknesses` — identifies all weakness categories

#### JD Match
- [ ] `matchResumeToJd` — computes match score
- [ ] `findMatchingSkills` — identifies overlapping skills
- [ ] `findMatchingSkills` — identifies missing skills
- [ ] Fallback similarity works when embedding API fails

#### Interview
- [ ] `startSession` — creates session with questions
- [ ] `submitAnswer` — evaluates and stores answer
- [ ] `endSession` — computes aggregate scores

---

## Integration Tests

### What to Test
- Full API endpoint request → response cycles
- Authentication flow (register → login → access protected route)
- File upload → parsing → analysis pipeline
- JD matching flow
- Interview session lifecycle

### Setup
- Use `@nestjs/testing` Test module
- Mock external services (OpenAI API)
- Use test database or in-memory Prisma

### Key Test Cases

#### Auth Endpoints
- [ ] POST `/auth/register` — 201 with valid data
- [ ] POST `/auth/register` — 400 with invalid email
- [ ] POST `/auth/register` — 409 with duplicate email
- [ ] POST `/auth/login` — 200 with correct credentials
- [ ] POST `/auth/login` — 401 with wrong password
- [ ] GET `/auth/profile` — 200 with valid token
- [ ] GET `/auth/profile` — 401 without token

#### Resume Endpoints
- [ ] POST `/resume/upload` — 201 with valid PDF
- [ ] POST `/resume/upload` — 400 with invalid file type
- [ ] POST `/resume/upload` — 401 without auth
- [ ] GET `/resume` — returns user's resumes only
- [ ] GET `/resume/:id` — 403 for other user's resume

---

## E2E Tests

### Critical User Flows
1. **Registration → Upload → Analysis**: Register → Login → Upload resume → View analysis
2. **JD Matching Flow**: Login → Upload resume → Submit JD → View match results
3. **Interview Flow**: Login → Start interview → Answer questions → End session → View summary

---

## Mocking Strategy

### External Services
- **OpenAI API**: Always mocked in tests — use canned responses
- **File system**: Use test fixtures in `test/fixtures/`

### Test Fixtures
```
backend/test/
├── fixtures/
│   ├── sample-resume.pdf
│   └── sample-resume.docx
├── jest-e2e.json
└── app.e2e-spec.ts
```

---

## Coverage Targets

| Layer | Target |
|-------|--------|
| Services | 80%+ |
| Controllers | 70%+ (via integration tests) |
| Overall | 75%+ |
