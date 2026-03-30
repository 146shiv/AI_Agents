# Tech Stack Rules

## Frontend

| Technology | Purpose | Version |
|-----------|---------|---------|
| Vite | Build tool | ^5.4 |
| React | UI library | ^18.3 (JSX, no TypeScript) |
| Tailwind CSS | Styling | ^3.4 |
| Zustand | Global state management | ^4.5 |
| React Router DOM | Client-side routing | ^6.26 |
| Axios | HTTP client | ^1.7 |
| Recharts | Charts & data visualization | ^2.12 |
| Lucide React | Icon library | ^0.400 |
| React Dropzone | File upload UX | ^14.2 |
| Socket.io Client | WebSocket (mock interview) | ^4.7 |

## Backend

| Technology | Purpose | Version |
|-----------|---------|---------|
| NestJS | API framework (Express adapter) | ^10.4 |
| Prisma | ORM + migrations | ^5.20 |
| PostgreSQL | Primary database | 16 (Docker) |
| Passport + JWT | Authentication | ^10.0 |
| class-validator | DTO validation | ^0.14 |
| Multer | File upload handling | ^1.4 |
| pdf-parse | PDF text extraction | ^1.1 |
| mammoth | DOCX text extraction | ^1.8 |
| OpenAI SDK | LLM + Embeddings | ^4.60 |
| Socket.io | WebSocket server | ^4.7 |
| Helmet | HTTP security headers | ^7.1 |
| Throttler | Rate limiting | ^6.0 |
| bcrypt | Password hashing | ^5.1 |

## Infrastructure

| Technology | Purpose |
|-----------|---------|
| Docker | Containerization |
| Docker Compose | Local orchestration |
| Redis | Rate limiting / caching (optional) |

## Non-Negotiable Rules

1. **No TypeScript on frontend** — Use plain JSX
2. **TypeScript required on backend** — Strict mode enabled
3. **Prisma is the only way to talk to the database** — No raw SQL unless absolutely necessary
4. **OpenAI is the LLM provider** — Use `gpt-4o-mini` for cost efficiency, `text-embedding-3-small` for embeddings
5. **All file uploads go through Multer** — Validate type + size before processing
6. **JWT is the only auth mechanism** — No sessions, no cookies
