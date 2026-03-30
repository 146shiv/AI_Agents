# Deployment Plan

## Environments

| Environment | Purpose | Infrastructure |
|-------------|---------|---------------|
| Local Dev | Development | Docker Compose (DB + Redis), Node.js native |
| Staging | Pre-production testing | Same as production, separate instance |
| Production | Live users | Cloud-hosted containers |

---

## Local Development Setup

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- OpenAI API key

### Steps
```bash
# 1. Clone and configure
cp .env.example .env
# Edit .env with your OPENAI_API_KEY and JWT_SECRET

# 2. Start infrastructure
docker compose up -d postgres redis

# 3. Backend
cd backend
npm install
npx prisma migrate dev
npm run start:dev

# 4. Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

### Verification
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001/api/v1`
- Database: `postgresql://postgres:postgres@localhost:5432/resume_analyzer`

---

## Docker Configuration

### Backend Dockerfile
Multi-stage build:
1. **Builder stage**: Install dependencies, generate Prisma client, compile TypeScript
2. **Runner stage**: Copy compiled output, run as non-root user

### Docker Compose Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| postgres | postgres:16-alpine | 5432 | Primary database |
| redis | redis:7-alpine | 6379 | Rate limiting / caching |
| backend | Custom (Dockerfile) | 3001 | API server |

### Health Checks
- PostgreSQL: `pg_isready -U postgres`
- Redis: `redis-cli ping`
- Backend depends on both being healthy

---

## Production Deployment

### Backend Options

| Platform | Pros | Cons |
|----------|------|------|
| **Railway** | Simple deploy, managed DB | Limited free tier |
| **AWS ECS** | Scalable, production-grade | More complex setup |
| **Fly.io** | Good free tier, global | Smaller ecosystem |
| **Render** | Easy Docker deploy | Cold starts on free tier |

### Frontend Options

| Platform | Pros | Cons |
|----------|------|------|
| **Vercel** | Excellent for React, free tier | Vendor lock-in |
| **Netlify** | Simple deploy, good CDN | Build minute limits |
| **Cloudflare Pages** | Fast CDN, generous free tier | Fewer integrations |

### Recommended Stack (v1)
- **Frontend**: Vercel (free tier)
- **Backend**: Railway (Starter plan)
- **Database**: Railway PostgreSQL (or Neon free tier)
- **Redis**: Railway Redis (or Upstash free tier)

---

## Environment Variables (Production)

```env
# Database (provided by hosting platform)
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Security (generate strong values)
JWT_SECRET=<random-64-char-string>
JWT_EXPIRATION=7d

# AI (your API key)
OPENAI_API_KEY=sk-...

# App
BACKEND_PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app

# Redis (provided by hosting platform)
REDIS_URL=redis://...
```

---

## CI/CD Pipeline (Future)

### Triggers
- Push to `main` → Deploy to production
- Push to `develop` → Deploy to staging
- Pull request → Run tests only

### Pipeline Steps
```
1. Checkout code
2. Install dependencies
3. Run linter
4. Run unit tests
5. Run integration tests
6. Build application
7. Build Docker image
8. Push to container registry
9. Deploy to target environment
10. Run smoke tests
```

---

## Database Migrations

### Development
```bash
npx prisma migrate dev --name <migration-name>
```

### Production
```bash
npx prisma migrate deploy
```

**Rule**: Never run `migrate dev` in production. Always use `migrate deploy`.

---

## Monitoring (Future)

| Concern | Tool |
|---------|------|
| Application logs | Railway built-in / CloudWatch |
| Error tracking | Sentry |
| Uptime monitoring | UptimeRobot (free) |
| Performance | Built-in NestJS Logger |
