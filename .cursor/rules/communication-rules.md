# Communication Rules

## Agent Workflow Sequence

```
1. Product Manager    → Defines features, writes user stories, sets priorities
2. System Architect   → Designs system, defines API contracts, models database
3. Backend Engineer   → Builds APIs, implements business logic
4. AI Engineer        → Builds AI services (parsing, matching, generation)
5. Frontend Engineer  → Builds UI, integrates APIs
6. QA Engineer        → Writes tests, validates flows
7. Security Engineer  → Reviews security, hardens endpoints
8. DevOps Engineer    → Containerizes, deploys, monitors
```

## Dependency Rules

- **Backend cannot start** until Architect has defined API contracts
- **Frontend cannot start** until Backend has working API stubs
- **QA cannot start** until features are implemented
- **DevOps cannot deploy** until QA passes
- **No agent works in isolation** — outputs feed into next agent's inputs

## Documentation Requirements

Every agent must document:

1. **APIs** — Method, path, request/response schemas
2. **Schemas** — Database models, relationships, constraints
3. **Decisions** — Why a technology/pattern was chosen over alternatives
4. **Tasks** — Input, output, acceptance criteria for every unit of work

## Task Format

Every task must follow this structure:

```
ID:       <EPIC>-<NUMBER> (e.g., AUTH-1, RES-3)
Title:    Short description
Input:    What data/context is needed
Output:   What is produced
Criteria: How to verify it's done correctly
Status:   backlog | in-progress | review | done
Owner:    Which agent role owns this
```

## Code Review Checklist

Before any code is considered complete, the Senior Engineer agent verifies:

- [ ] Follows coding standards from `coding-standards.md`
- [ ] Has proper error handling
- [ ] Input validation on all endpoints
- [ ] No hardcoded secrets or magic numbers
- [ ] Consistent naming conventions
- [ ] Security considerations addressed
- [ ] Tests written (or test plan defined)
