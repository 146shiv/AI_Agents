# AI Resume Analyzer + Interview Prep System

A production-grade SaaS platform that analyzes resumes, matches them against job descriptions, and provides AI-powered interview preparation.

## Features

- **Resume Upload & Parsing** — PDF/DOCX upload with NLP-based extraction of skills, experience, education, and projects
- **ATS Resume Scoring** — Score resumes 0–100 based on keywords, formatting, experience relevance, and skill density
- **JD Matching** — Compare resumes against job descriptions with match percentage, missing skills, and suggestions
- **AI Suggestions** — Improve bullet points, rewrite sections, and add missing keywords
- **Interview Question Generator** — Generate technical, behavioral, and HR questions based on resume + JD
- **AI Mock Interview** — Real-time conversational mock interviews with confidence, accuracy, and clarity tracking
- **Weakness Detection** — Identify skill gaps, communication issues, and domain weaknesses
- **Dashboard** — Track resume score history, interview performance, and progress over time

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React (JSX), Tailwind CSS, Zustand |
| Backend | NestJS (TypeScript), REST + WebSocket APIs |
| Database | PostgreSQL 16 + Prisma ORM |
| AI | OpenAI GPT-4o-mini, text-embedding-3-small |
| Infra | Docker, Docker Compose |

## Project Structure

```
AI_Agents/
├── .cursor/rules/          # AI agent rules and coding standards
├── docs/
│   ├── prd/                # Product Requirement Document
│   ├── architecture/       # System architecture & diagrams
│   ├── tasks/              # Task breakdowns by epic
│   ├── api/                # API contracts per module
│   ├── database/           # Schema design & ERD
│   ├── team/               # Team roles & workflow
│   ├── security/           # Security guidelines
│   ├── testing/            # Testing strategy
│   └── deployment/         # Deployment plan
├── backend/                # NestJS API server (to be built)
├── frontend/               # React SPA (to be built)
└── docker-compose.yml      # Container orchestration (to be created)
```

## Documentation Index

| Document | Path | Description |
|----------|------|-------------|
| **PRD** | `docs/prd/README.md` | Product overview, phases, success metrics |
| **Features** | `docs/prd/features.md` | Detailed feature specifications |
| **User Stories** | `docs/prd/user-stories.md` | User stories by epic |
| **Architecture** | `docs/architecture/README.md` | System design, module dependencies |
| **Folder Structure** | `docs/architecture/folder-structure.md` | Complete file/folder map |
| **Auth API** | `docs/api/auth.md` | Auth endpoints contract |
| **Resume API** | `docs/api/resume.md` | Resume endpoints contract |
| **JD Match API** | `docs/api/jd-match.md` | JD matching endpoints contract |
| **Interview API** | `docs/api/interview.md` | Interview endpoints + WebSocket contract |
| **Analytics API** | `docs/api/analytics.md` | Dashboard data endpoints contract |
| **DB Schema** | `docs/database/schema.md` | All database models and columns |
| **ERD** | `docs/database/erd.md` | Entity relationship diagram |
| **Team Roles** | `docs/team/roles.md` | Agent roles and responsibilities |
| **Security** | `docs/security/README.md` | Security guidelines and OWASP mapping |
| **Testing** | `docs/testing/README.md` | Testing strategy and coverage targets |
| **Deployment** | `docs/deployment/README.md` | Deployment plan and environments |

## Task Boards (by Epic)

| Epic | File | Tasks |
|------|------|-------|
| Authentication | `docs/tasks/epic-auth.md` | AUTH-1 through AUTH-6 |
| Resume Upload | `docs/tasks/epic-resume.md` | RES-1 through RES-7 |
| Resume Scoring | `docs/tasks/epic-scoring.md` | SCORE-1 through SCORE-8 |
| AI Suggestions | `docs/tasks/epic-ai-suggestions.md` | AI-1 through AI-4 |
| JD Matching | `docs/tasks/epic-jd-match.md` | JD-1 through JD-6 |
| Interview System | `docs/tasks/epic-interview.md` | INT-1 through INT-10 |
| Dashboard | `docs/tasks/epic-dashboard.md` | DASH-1 through DASH-5 |

## Cursor Rules

The `.cursor/rules/` directory contains agent behavior rules:

| Rule File | Purpose |
|-----------|---------|
| `system-identity.md` | Who the AI team is and core principles |
| `coding-standards.md` | Naming, architecture, and code rules |
| `communication-rules.md` | Agent workflow sequence and documentation requirements |
| `tech-stack.md` | Approved technologies and version constraints |
| `restrictions.md` | What NOT to do — guardrails and security constraints |

## Execution Phases

| Phase | Features | Status |
|-------|----------|--------|
| Phase 1 | Auth + Resume Upload + Parsing | Design Complete |
| Phase 2 | Resume Scoring + Analysis + Suggestions | Design Complete |
| Phase 3 | JD Matching System | Design Complete |
| Phase 4 | Interview System (Chat + WebSocket) | Design Complete |
| Phase 5 | Voice Interview + Advanced AI | Design Complete |

## Getting Started

> **Current Status**: Design phase complete. All rules, PRD, architecture, API contracts, database schema, task breakdowns, and operational docs are defined. Ready for implementation.

To begin implementation, follow the agent workflow:
1. Review the task board for the current phase
2. Implement backend modules per API contracts
3. Implement frontend pages per feature specs
4. Run tests per testing strategy
5. Deploy per deployment plan
