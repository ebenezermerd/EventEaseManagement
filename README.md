# EventEase

EventEase is an event platform for Ethiopia. Attendees discover and book events, organizers publish events and manage their attendees, and admins approve organizers and moderate the platform.

* Web app: https://eventeaser.vercel.app
* API: https://eventease-api-chi.vercel.app (health check at `/health`)

## Demo accounts

The seed script creates three accounts that share one public demo password, which is also shown on the login page.

| Role | Email | Password |
| --- | --- | --- |
| Attendee | `demo-attendee@eventease.app` | `EventEase2026` |
| Organizer | `demo-organizer@eventease.app` | `EventEase2026` |
| Admin | `demo-admin@eventease.app` | `EventEase2026` |

The seed also leaves one organizer application pending so the admin approval flow can be tried straight away.

## Architecture

One repository, two Vercel projects:

| Folder | Vercel project | What it is |
| --- | --- | --- |
| `/` | `eventease` | Next.js 15 web app (App Router, Tailwind, shadcn/ui) |
| `/api` | `eventease-api` | Express REST API with Sequelize on Postgres, exported as a Vercel Function |

* Database: Neon Postgres provisioned through the Vercel Marketplace (`DATABASE_URL`).
* Auth: the API signs JWTs with `JWT_SECRET`. The web app keeps the token in a cookie, sends it as a bearer header and its middleware verifies the same token to guard `/dashboard/*` by role.
* The schema is created by the seed script (`sequelize.sync`), never on cold start.

## What works end to end

* Register and sign in as attendee or organizer, with a redirect to the right dashboard for each role.
* Browse, search and filter upcoming events stored in Postgres, and open event pages with tickets, schedule and FAQs.
* Attendees book free tickets, get a booking reference and can cancel from their dashboard.
* Organizers see live stats, create and edit their own events and ticket types, see attendees, check them in and export a CSV.
* Admins see platform totals, approve or reject organizers, list and deactivate users, and publish or unpublish events.

## Still sample data or disabled

* Organizer analytics, finances, tickets and orders pages and the admin report pages show illustrative figures and are labelled "Sample data".
* Paid checkout runs through Chapa in **test mode** (no real money). Without `CHAPA_SECRET_KEY` paid tickets answer "Paid checkout is in test mode and coming soon". Chapa rejects placeholder email domains such as example.com, so pay with an account that has a real email domain.
* AI event generation (`POST /api/organizers/events/generate`) goes through the Vercel AI Gateway with `google/gemini-2.5-flash`; it has no UI yet.
* Email is logged instead of sent unless SMTP settings exist.
* Calendar sync, push and SMS notifications, file storage and order exports were ported but stay off unless `ENABLE_EXTENDED_MODULES=true` and their providers are configured.

### TODO

* [x] Chapa test keys are set on `eventease-api`; the callback is `https://eventease-api-chi.vercel.app/api/payments/chapa/callback`.
* [ ] Switch to live Chapa keys only after the business account is verified.
* [ ] Add an organizer UI for AI event drafts.

## Local development

Requirements: Node 22, pnpm, and a Postgres database (a local one or a Neon branch).

```bash
# API
cd api
cp .env.example .env          # set DATABASE_URL and JWT_SECRET
npm install
npm run seed                  # drops and recreates all tables with demo data
npm run dev                   # http://localhost:4000

# Web app (in another terminal, from the repo root)
cp .env.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:4000 and the same JWT_SECRET
pnpm install
pnpm dev                      # http://localhost:5000
```

Checks:

```bash
pnpm typecheck                      # tsc for the web app
pnpm build                          # next build
cd api && npm run check             # node --check on every API file
api/scripts/smoke.sh http://localhost:4000   # register, login, list events, book a free ticket
```

## Environment variables

API (`api/.env.example`): `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGINS`, `FRONTEND_URL`, `CHAPA_SECRET_KEY`, `AI_GATEWAY_API_KEY`, `AI_MODEL`, `EMAIL_*`, `DEMO_PASSWORD`.

Web (`.env.example`): `NEXT_PUBLIC_API_URL`, `JWT_SECRET`.

## Main API routes

| Method | Path | Who |
| --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/organizer/register`, `/api/auth/login` | anyone |
| GET | `/api/auth/me` | signed in |
| GET | `/api/events`, `/api/events/:id`, `/api/categories` | anyone |
| POST, PUT, DELETE | `/api/events`, `/api/events/:id` | approved organizer (owner) or admin |
| POST, GET | `/api/user/bookings`, PUT `/api/user/bookings/:id/cancel` | signed in |
| GET | `/api/organizers/dashboard`, `/api/organizers/events`, `/api/organizers/attendees` | organizer |
| GET, PUT | `/api/admin/dashboard`, `/api/admin/users`, `/api/admin/organizers/:id/status`, `/api/admin/events/:id/status` | admin |
