# StayNEP — Next.js app

GIS-powered tourism intelligence platform for Nepal (travelers, hotels, tourism authorities).

## Requirements

- Node.js 20+
- PostgreSQL database

## Local setup

```bash
cd staynep
cp .env.example .env
```

Edit `.env` with your values (see [Environment variables](#environment-variables)), then:

```bash
npm install
npm run db:push      # apply Prisma schema
npm run db:seed      # optional demo data
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run start` | Run production server locally |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Prisma Studio |
| `npm run lint` | ESLint |

## Environment variables

Copy from `.env.example`:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | NextAuth secret (`openssl rand -base64 32`) |
| `NEXTAUTH_SECRET` | Yes | Same value as `AUTH_SECRET` |
| `AUTH_URL` | Yes (prod) | Public app URL, e.g. `https://your-app.vercel.app` |
| `NEXTAUTH_URL` | Yes (local) | `http://localhost:3000` for local dev |
| `NEXT_PUBLIC_GEOAPIFY_API_KEY` | For maps | Geoapify key for map/search features |
| `GEOAPIFY_API_KEY` | Optional | Server-side Geoapify override |
| `GEMINI_API_KEY` | Optional | Google AI for travel assistant |
| `GEMINI_MODEL` | Optional | Default: `gemini-2.0-flash` |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Optional | Stable Server Action IDs across deploys (`openssl rand -base64 32`) |

Auth is **credentials only** (email/password). Signup and login use API routes:

- `POST /api/auth/register`
- `POST /api/auth/login`

## Deploy on Vercel

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. **Root Directory:** `staynep` (Project Settings → General).
3. **Environment variables** (Production + Preview):
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_SECRET` (same as `AUTH_SECRET`)
   - `AUTH_URL` — your deployment URL, e.g. `https://nepgeom-stay-nep.vercel.app`
4. Redeploy after changing env vars.

Build uses `npm run build` (runs `scripts/vercel-build.mjs`: Prisma generate + Next.js build).

### Common issues

| Symptom | Fix |
|---------|-----|
| Signup/login “Server Action not found” | Hard-refresh after deploy; auth uses API routes (not Server Actions) in current versions |
| Edge middleware &gt; 1 MB | Middleware uses a slim `auth.config.ts` only — do not import Prisma in `middleware.ts` |
| “DATABASE_URL not configured” | Add `DATABASE_URL` in Vercel env and redeploy |
| Build fails: Prisma schema missing | Set Vercel **Root Directory** to `staynep` |

## Project structure

```text
staynep/
├── prisma/           # schema & seed
├── src/
│   ├── app/          # App Router pages & API routes
│   ├── components/
│   ├── lib/          # auth, prisma, maps, AI helpers
│   ├── actions/      # server actions (dashboard features)
│   └── middleware.ts # route protection (edge-safe)
└── scripts/          # dev & Vercel build helpers
```

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **Auth:** NextAuth v5 (credentials)
- **Database:** PostgreSQL + Prisma
- **Maps:** MapLibre / Geoapify
- **AI:** Google Gemini (optional)

## License

Private — hackfest / academic project.
