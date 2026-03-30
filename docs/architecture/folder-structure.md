# Project Folder Structure

```
AI_Agents/
│
├── .cursor/
│   └── rules/
│       ├── system-identity.md        # Who the AI team is
│       ├── coding-standards.md       # How to write code
│       ├── communication-rules.md    # How agents collaborate
│       ├── tech-stack.md             # What technologies to use
│       └── restrictions.md           # What NOT to do
│
├── docs/
│   ├── prd/
│   │   ├── README.md                 # Product overview & phases
│   │   ├── features.md               # Detailed feature specs
│   │   └── user-stories.md           # User stories by epic
│   │
│   ├── architecture/
│   │   ├── README.md                 # System architecture & diagrams
│   │   └── folder-structure.md       # This file
│   │
│   ├── tasks/
│   │   ├── epic-auth.md              # Auth tasks
│   │   ├── epic-resume.md            # Resume tasks
│   │   ├── epic-scoring.md           # Scoring tasks
│   │   ├── epic-ai-suggestions.md    # AI suggestion tasks
│   │   ├── epic-jd-match.md          # JD matching tasks
│   │   ├── epic-interview.md         # Interview tasks
│   │   └── epic-dashboard.md         # Dashboard tasks
│   │
│   ├── api/
│   │   ├── auth.md                   # Auth API contracts
│   │   ├── resume.md                 # Resume API contracts
│   │   ├── jd-match.md               # JD Match API contracts
│   │   ├── interview.md              # Interview API contracts
│   │   └── analytics.md              # Analytics API contracts
│   │
│   ├── database/
│   │   ├── schema.md                 # Database schema design
│   │   └── erd.md                    # Entity relationship diagram
│   │
│   ├── team/
│   │   └── roles.md                  # Team roles & responsibilities
│   │
│   ├── security/
│   │   └── README.md                 # Security guidelines
│   │
│   ├── testing/
│   │   └── README.md                 # Testing strategy
│   │
│   └── deployment/
│       └── README.md                 # Deployment plan
│
├── backend/                          # NestJS Application
│   ├── prisma/
│   │   └── schema.prisma             # Database schema
│   ├── src/
│   │   ├── main.ts                   # Application entry point
│   │   ├── app.module.ts             # Root module
│   │   ├── common/                   # Shared utilities
│   │   │   ├── decorators/
│   │   │   │   └── current-user.decorator.ts
│   │   │   ├── filters/
│   │   │   │   └── http-exception.filter.ts
│   │   │   └── interceptors/
│   │   │       └── transform.interceptor.ts
│   │   ├── prisma/                   # Database module
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── auth/                     # Authentication
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   └── dto/
│   │   │       ├── register.dto.ts
│   │   │       └── login.dto.ts
│   │   ├── resume/                   # Resume management
│   │   │   ├── resume.module.ts
│   │   │   ├── resume.controller.ts
│   │   │   ├── resume.service.ts
│   │   │   ├── resume-parser.service.ts
│   │   │   └── resume-scorer.service.ts
│   │   ├── ai/                       # AI integration layer
│   │   │   ├── ai.module.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── suggestions.service.ts
│   │   │   ├── question-generator.service.ts
│   │   │   └── embeddings.service.ts
│   │   ├── jd-match/                 # Job description matching
│   │   │   ├── jd-match.module.ts
│   │   │   ├── jd-match.controller.ts
│   │   │   ├── jd-match.service.ts
│   │   │   └── dto/
│   │   │       └── match-jd.dto.ts
│   │   ├── interview/                # Mock interview system
│   │   │   ├── interview.module.ts
│   │   │   ├── interview.controller.ts
│   │   │   ├── interview.service.ts
│   │   │   ├── interview.gateway.ts
│   │   │   └── dto/
│   │   │       ├── start-interview.dto.ts
│   │   │       └── submit-answer.dto.ts
│   │   └── analytics/                # Dashboard analytics
│   │       ├── analytics.module.ts
│   │       ├── analytics.controller.ts
│   │       └── analytics.service.ts
│   ├── test/                         # E2E tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── Dockerfile
│
├── frontend/                         # React Application
│   ├── public/
│   ├── src/
│   │   ├── main.jsx                  # Entry point
│   │   ├── App.jsx                   # Router setup
│   │   ├── index.css                 # Tailwind imports + global styles
│   │   ├── api/
│   │   │   └── client.js             # Axios instance + API methods
│   │   ├── store/
│   │   │   └── useStore.js           # Zustand global store
│   │   ├── hooks/
│   │   │   └── useAuth.js            # Auth hook
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Header.jsx
│   │   │   ├── common/
│   │   │   │   ├── ScoreRing.jsx
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   └── LoadingSpinner.jsx
│   │   │   ├── resume/
│   │   │   │   ├── ScoreBreakdown.jsx
│   │   │   │   └── SuggestionList.jsx
│   │   │   └── interview/
│   │   │       ├── QuestionCard.jsx
│   │   │       └── FeedbackPanel.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── Dashboard.jsx
│   │       ├── ResumeUpload.jsx
│   │       ├── ResumeAnalysis.jsx
│   │       ├── JDMatching.jsx
│   │       ├── InterviewRoom.jsx
│   │       └── Analytics.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── docker-compose.yml                # PostgreSQL + Redis containers
├── .env.example                      # Environment variable template
├── .gitignore
└── README.md                         # Project overview + setup guide
```
