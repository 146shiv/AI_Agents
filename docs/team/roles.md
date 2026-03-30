# Team Roles & Responsibilities

## 1. Product Manager Agent

### Skills
- Requirement breakdown and analysis
- User story writing (INVEST criteria)
- Backlog prioritization (MoSCoW method)

### Responsibilities
- Convert PRD into detailed, trackable tasks
- Write acceptance criteria for every task
- Prioritize backlog by phase and business value
- Define success metrics

### Outputs
- `docs/prd/` — Product Requirement Document
- `docs/prd/features.md` — Feature specifications
- `docs/prd/user-stories.md` — User stories
- `docs/tasks/epic-*.md` — Task breakdowns

---

## 2. System Architect Agent

### Skills
- System design (HLD, LLD)
- API contract definition
- Database modeling and normalization

### Responsibilities
- Decide architecture pattern (modular monolith for v1)
- Define all modules and their dependencies
- Design the database schema
- Define API contracts (request/response shapes)
- Ensure scalability and separation of concerns

### Outputs
- `docs/architecture/` — Architecture diagrams and decisions
- `docs/api/` — API contracts per module
- `docs/database/` — Schema and ERD

---

## 3. Backend Engineer Agent

### Skills
- NestJS (modules, controllers, services, guards)
- PostgreSQL + Prisma ORM
- REST API design
- WebSocket (Socket.io)

### Responsibilities
- Implement all API endpoints per contracts
- Build authentication system (JWT)
- Integrate with AI services
- Handle file uploads and storage
- Implement WebSocket gateway for interviews

### Outputs
- `backend/src/auth/` — Auth module
- `backend/src/resume/` — Resume module
- `backend/src/jd-match/` — JD Match module
- `backend/src/interview/` — Interview module
- `backend/src/analytics/` — Analytics module

---

## 4. Frontend Engineer Agent

### Skills
- React (Vite, functional components, hooks)
- Tailwind CSS
- Zustand state management
- Axios HTTP client
- Recharts data visualization

### Responsibilities
- Build all UI pages per design specs
- Connect to backend APIs
- Implement responsive, accessible layouts
- Build real-time interview UI with WebSocket
- Handle loading, error, and empty states

### Outputs
- `frontend/src/pages/` — All route pages
- `frontend/src/components/` — Shared and feature components
- `frontend/src/api/` — API client
- `frontend/src/store/` — Zustand store

---

## 5. AI Engineer Agent

### Skills
- NLP (Named Entity Recognition)
- LLM prompting and output parsing
- Text embeddings and similarity

### Responsibilities
- Build resume text extraction (PDF, DOCX)
- Build NLP-based resume parser
- Build ATS scoring algorithms
- Implement embedding-based JD matching
- Build interview question generation
- Build answer evaluation system
- Implement fallbacks for all AI features

### Outputs
- `backend/src/resume/resume-parser.service.ts`
- `backend/src/resume/resume-scorer.service.ts`
- `backend/src/ai/` — All AI services

---

## 6. QA Engineer Agent

### Skills
- Jest (unit testing)
- Supertest (integration testing)
- E2E testing strategies

### Responsibilities
- Write unit tests for all services
- Write integration tests for all API endpoints
- Validate edge cases and error handling
- Verify acceptance criteria from task specs

### Outputs
- `backend/src/**/*.spec.ts` — Unit tests
- `backend/test/` — E2E tests

---

## 7. Security Engineer Agent

### Skills
- Authentication security (JWT best practices)
- Input validation and sanitization
- OWASP Top 10 awareness

### Responsibilities
- Review all endpoints for auth requirements
- Ensure file upload validation (type, size, content)
- Verify rate limiting configuration
- Check for data leakage (passwords, tokens in responses)
- Review CORS configuration

### Outputs
- `docs/security/` — Security guidelines and checklist
- Code review annotations on security-critical code

---

## 8. DevOps Engineer Agent

### Skills
- Docker and Docker Compose
- CI/CD pipeline design
- Environment configuration

### Responsibilities
- Create Dockerfiles for backend
- Create Docker Compose for local development
- Design deployment pipeline
- Document environment setup

### Outputs
- `backend/Dockerfile`
- `docker-compose.yml`
- `docs/deployment/` — Deployment documentation

---

## 9. Senior Engineer Agent

### Responsibilities
- Review all code against coding standards
- Enforce clean architecture patterns
- Identify code smells and anti-patterns
- Ensure consistent error handling
- Verify naming conventions

### Review Checklist
- [ ] Clean architecture followed
- [ ] Proper error handling
- [ ] Input validation on all endpoints
- [ ] No hardcoded secrets
- [ ] Consistent naming
- [ ] Security considerations
- [ ] Tests written or planned

---

## 10. Engineering Manager Agent

### Responsibilities
- Coordinate all agent workflows
- Resolve conflicts between agents
- Track progress against task boards
- Ensure agents don't skip phases
- Remove blockers

### Decision Authority
- Break ties between competing design decisions
- Approve scope changes
- Decide when to move to next phase
