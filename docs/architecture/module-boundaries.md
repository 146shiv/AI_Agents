# Module Boundaries & Service Contracts

## Design Principle

Each NestJS module owns its data and exposes a clean service interface.
Modules never access another module's database tables directly — they call
the exported service methods.

---

## Module: Auth

### Owns
- `users` table
- JWT token generation/validation
- Password hashing

### Exports
- `AuthService` — register, login, getProfile
- `JwtAuthGuard` — reusable route guard
- `JwtModule` — for token signing in other modules if needed

### Internal Services
| Service | Methods |
|---------|---------|
| AuthService | `register(dto)`, `login(dto)`, `getProfile(userId)` |
| JwtStrategy | `validate(payload)` — called automatically by Passport |

### Dependencies
- PrismaModule (global)
- @nestjs/jwt
- @nestjs/passport

---

## Module: Resume

### Owns
- `resumes` table
- `resume_analyses` table
- File upload storage (./uploads/resumes/)

### Exports
- `ResumeService` — used by other modules to fetch resume data

### Internal Services
| Service | Methods |
|---------|---------|
| ResumeService | `processResume(userId, file)`, `listResumes(userId)`, `getResume(id, userId)`, `getAnalysis(resumeId, userId)`, `reanalyze(resumeId, userId)` |
| ResumeParserService | `extractText(filePath, mimeType)`, `parseResume(rawText)` |
| ResumeScorerService | `scoreResume(parsed, rawText)`, `detectWeaknesses(parsed, scores)` |

### Dependencies
- PrismaModule (global)
- AiModule (for suggestions)

---

## Module: AI

### Owns
- Nothing in the database — pure service layer
- OpenAI API connection

### Exports (all services available to other modules)
- `AiService` — generic LLM chat, embeddings
- `SuggestionsService` — resume improvement AI
- `QuestionGeneratorService` — interview question generation + answer evaluation
- `EmbeddingsService` — text similarity computation

### Internal Services
| Service | Methods |
|---------|---------|
| AiService | `chat(system, user, opts)`, `chatWithHistory(system, messages, opts)`, `getEmbedding(text)`, `generateResumeSuggestions(parsed, raw)` |
| SuggestionsService | `improveBulletPoints(bullets)`, `rewriteSection(name, content, role?)`, `suggestKeywords(skills, role?)` |
| QuestionGeneratorService | `generateFromResume(data, count)`, `generateFromJD(jd, resume, count)`, `evaluateAnswer(question, answer, type)` |
| EmbeddingsService | `computeSimilarity(textA, textB)`, `findMatchingSkills(resumeSkills, jdText)` |

### Dependencies
- None (standalone — uses OpenAI SDK directly)

---

## Module: JD Match

### Owns
- `job_descriptions` table
- `jd_matches` table

### Exports
- `JdMatchService`

### Internal Services
| Service | Methods |
|---------|---------|
| JdMatchService | `matchResumeToJd(userId, dto)`, `getMatchHistory(userId)`, `getMatch(id, userId)` |

### Dependencies
- PrismaModule (global)
- AiModule (for embeddings + suggestions)

---

## Module: Interview

### Owns
- `interview_sessions` table
- `questions` table
- `answers` table

### Exports
- `InterviewService`

### Internal Services
| Service | Methods |
|---------|---------|
| InterviewService | `startSession(userId, dto)`, `listSessions(userId)`, `getSession(id, userId)`, `submitAnswer(sessionId, userId, dto)`, `endSession(id, userId)` |
| InterviewGateway | WebSocket event handlers (join_session, submit_answer, end_session) |

### Dependencies
- PrismaModule (global)
- AiModule (for question generation + answer evaluation)

---

## Module: Analytics

### Owns
- Nothing — reads from other modules' tables via Prisma (read-only cross-module queries)

### Note on Design
Analytics is the one exception to "modules don't read other tables."
It performs read-only aggregate queries across resumes, analyses, sessions, and answers.
This is acceptable because:
1. It's strictly read-only
2. It's an aggregate/reporting concern
3. Creating service-to-service calls for every stat would be wasteful

### Internal Services
| Service | Methods |
|---------|---------|
| AnalyticsService | `getDashboard(userId)`, `getResumeScoreHistory(userId)`, `getInterviewPerformance(userId)` |

### Dependencies
- PrismaModule (global)

---

## Cross-Module Communication Rules

```
 AuthModule ←── (JwtAuthGuard used by all controllers)
     │
     │ exports guard only; no service-to-service calls
     │
 ResumeModule ──→ AiModule.AiService.generateResumeSuggestions()
     │
 JdMatchModule ──→ AiModule.EmbeddingsService.computeSimilarity()
               ──→ AiModule.EmbeddingsService.findMatchingSkills()
               ──→ AiModule.AiService.chat() (for suggestions)
     │
 InterviewModule ──→ AiModule.QuestionGeneratorService.generateFromResume()
                 ──→ AiModule.QuestionGeneratorService.generateFromJD()
                 ──→ AiModule.QuestionGeneratorService.evaluateAnswer()
     │
 AnalyticsModule ──→ PrismaService (direct read-only queries)
```

### Forbidden Patterns
- Controller calling another module's service directly (go through your own service)
- Module A writing to Module B's tables
- Circular module imports (A imports B, B imports A)
- Service instantiation without dependency injection
