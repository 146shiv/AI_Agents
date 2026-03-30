# System Architecture

## Architecture Decision: Modular Monolith

We use a **modular monolith** pattern (not microservices) for v1.

### Rationale
- Faster development velocity for a small team
- Single deployment unit reduces operational complexity
- NestJS module system provides clean boundaries
- Can extract to microservices later if needed

### Trade-offs Accepted
- Shared database (all modules use one PostgreSQL instance)
- Shared process (one NestJS application)
- Independent scaling requires future refactoring

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                    Vite + React + Tailwind                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │  Auth    │ │ Resume   │ │ JD Match │ │ Interview Room    │  │
│  │  Pages   │ │ Pages    │ │ Page     │ │ (WebSocket)       │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────────┘  │
│  ┌──────────┐ ┌──────────────────────────────────────────────┐  │
│  │Dashboard │ │ Analytics Page                                │  │
│  └──────────┘ └──────────────────────────────────────────────┘  │
│                         │ Axios + Socket.io-client              │
└─────────────────────────┼───────────────────────────────────────┘
                          │ HTTP REST + WebSocket
┌─────────────────────────┼───────────────────────────────────────┐
│                     BACKEND (NestJS)                             │
│                         │                                       │
│  ┌──────────────────────┼──────────────────────────────────┐    │
│  │              API Gateway Layer                           │    │
│  │  Helmet │ CORS │ Rate Limiting │ JWT Guard │ Validation  │    │
│  └──────────────────────┼──────────────────────────────────┘    │
│                         │                                       │
│  ┌────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐           │
│  │ Auth   │ │ Resume   │ │ JD Match │ │ Interview │           │
│  │ Module │ │ Module   │ │ Module   │ │ Module    │           │
│  └────────┘ └──────────┘ └──────────┘ └───────────┘           │
│  ┌────────┐ ┌──────────────────────────────────────┐           │
│  │Analytics│ │          AI Module                   │           │
│  │ Module │ │  AiService │ Suggestions │ Questions  │           │
│  └────────┘ │  Embeddings                          │           │
│             └──────────────────────────────────────┘           │
│                         │                                       │
│  ┌──────────────────────┼──────────────────────────────────┐    │
│  │              Data Layer (Prisma ORM)                     │    │
│  └──────────────────────┼──────────────────────────────────┘    │
└─────────────────────────┼───────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────────┐
│                    INFRASTRUCTURE                                │
│  ┌─────────────┐  ┌──────────┐  ┌────────────┐                 │
│  │ PostgreSQL  │  │  Redis   │  │ File Store │                 │
│  │ (Docker)    │  │ (Docker) │  │ (./uploads)│                 │
│  └─────────────┘  └──────────┘  └────────────┘                 │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  OpenAI API (External)                     │ │
│  │         gpt-4o-mini │ text-embedding-3-small               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow

### Standard API Request
```
Client → HTTP Request
  → Helmet (security headers)
  → CORS check
  → Rate Limiter (ThrottlerGuard)
  → Route matching
  → JWT Auth Guard (if protected)
  → ValidationPipe (DTO validation)
  → Controller (extract params, delegate)
  → Service (business logic)
  → Prisma (database)
  → TransformInterceptor (wrap response)
  → JSON Response
```

### WebSocket Flow (Mock Interview)
```
Client → Socket.io connect to /interview namespace
  → join_session event (join room)
  → submit_answer event (send answer text)
  → Server evaluates via AI → answer_evaluated event
  → end_session event → session_ended event with summary
```

---

## Module Dependency Graph

```
AppModule
  ├── PrismaModule (GLOBAL — available to all modules)
  ├── ThrottlerModule (GLOBAL — rate limiting)
  ├── AuthModule
  │     └── depends on: PrismaModule, JwtModule, PassportModule
  ├── ResumeModule
  │     └── depends on: PrismaModule, AiModule
  ├── AiModule
  │     └── depends on: (none — standalone, uses OpenAI SDK)
  ├── JdMatchModule
  │     └── depends on: PrismaModule, AiModule
  ├── InterviewModule
  │     └── depends on: PrismaModule, AiModule
  └── AnalyticsModule
        └── depends on: PrismaModule
```
