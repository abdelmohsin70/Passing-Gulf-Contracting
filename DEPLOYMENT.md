# Deployment guide

This app is a Next.js 16 site with an embedded Payload CMS (Postgres-backed).
Locally it runs against a throwaway dev database — none of the steps below
have been run against a real production environment, because doing so
requires credentials only the site owner has. This document is the checklist
for turning the dev build into a real, live deployment.

## 0. Fix the Vercel Deployment Protection block (do this first)

The site audit found that the existing Vercel deployment returns a Vercel
login page instead of the site, because **Deployment Protection** is turned
on for the project. This blocks anyone without a Vercel account from viewing
it — including reviewers.

Fix: in the Vercel dashboard, go to **Project → Settings → Deployment
Protection** and either:

- turn protection **off** entirely, or
- set it to **"Only Preview Deployments"** so Production stays public while
  preview branches stay gated.

Nothing in this repo can change this setting — it's a Vercel project
setting, not an environment variable or config file.

## 1. Provision a real Postgres database

Any managed Postgres works (Vercel Postgres, Neon, Supabase, RDS, etc.).
You need:

- A connection string in the form
  `postgres://user:password@host:port/database?sslmode=require`
- The database should be empty on first deploy — migrations create the
  schema (see step 4).

Set it as `DATABASE_URI` in your hosting provider's environment variables.
**Never commit this value or put it in a file tracked by git.**

## 2. Generate a real `PAYLOAD_SECRET`

```bash
openssl rand -hex 32
```

Set the output as `PAYLOAD_SECRET`. This signs admin auth tokens — treat it
like a password. The value used in local development (`.env.local`, which is
gitignored) must **not** be reused in production.

## 3. Set the remaining required environment variables

See `.env.example` for the full list and explanations. At minimum for a
working production deploy:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URI` | Postgres connection string |
| `PAYLOAD_SECRET` | Admin auth signing secret |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (canonical links, sitemap, OG) |
| `NEXT_PUBLIC_SERVER_URL` | Usually the same as `NEXT_PUBLIC_SITE_URL` |

Strongly recommended before go-live:

| Variable | Purpose |
| --- | --- |
| `S3_BUCKET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION` | Media storage. Without these, uploaded media is written to local disk, which most hosting platforms (including Vercel) do **not** persist across deployments — uploaded images will disappear on the next deploy. |
| `SMTP_HOST` or `RESEND_API_KEY` | Transactional email (password resets, etc.). Without these, Payload logs emails to the server console instead of sending them. |
| `NOTIFY_WEBHOOK_URL` | Where quote/career leads are POSTed for real-time notification (Slack, Zapier, CRM). Without this, leads are still saved to the database and visible in the admin dashboard — they just won't trigger an external alert. |

`PAYLOAD_ADMIN_EMAIL` / `PAYLOAD_ADMIN_PASSWORD` are only read by the one-time
seed script (`npm run seed`), not at request time. Set them just for that run
if you use the seed script in production, then remove them.

## 4. Run database migrations

Migrations are checked into `src/migrations/`. On a fresh database, run:

```bash
npm run payload migrate
```

This creates all tables (~40, including Payload's versioning and
localization tables). Run this as a one-off deploy step (a Vercel build
command, a CI step, or manually) — **not** automatically on every server
boot, since concurrent migration attempts against the same database can
hang (this happened once in local development when the dev server and a
migration ran against the DB at the same time).

If your hosting platform supports a pre-deploy/build hook, wire it there:

```bash
npm run payload migrate && npm run build
```

## 5. Create the first admin user

Either:

- Visit `/admin` on the deployed site — Payload shows a "create first user"
  form when the `users` collection is empty, or
- Run the seed script once (see below), which creates an admin user from
  `PAYLOAD_ADMIN_EMAIL`/`PAYLOAD_ADMIN_PASSWORD` if no users exist yet, plus
  baseline content (sectors, solutions, certification/case-study/insight
  placeholders — all clearly marked as drafts/unverified, nothing fabricated).

```bash
npm run seed
```

The seed script is idempotent — running it again after users/content
already exist does not duplicate anything.

## 6. Deploy the app

Standard Next.js deploy — `npm run build && npm start`, or push to Vercel.
The build compiles both the public site and the `/admin` panel from the same
Next.js build; there's nothing extra to configure beyond the environment
variables above.

## 7. Post-deploy checklist

- [ ] Deployment Protection is off (or Production-only-public) — verify the
      live URL loads without a Vercel login prompt in an incognito window.
- [ ] `/admin` loads and requires login (check `curl -I https://your-domain/admin`
      returns 200, and that visiting it in a browser shows the login form,
      not the dashboard, when logged out).
- [ ] `/robots.txt` disallows `/admin` and `/api/` (already configured in
      `src/app/robots.ts` — verify it survived the deploy).
- [ ] Submit a real test lead through `/contact` and confirm it appears in
      **Leads** in the admin dashboard.
- [ ] Confirm uploaded media survives a redeploy (only true once S3 is
      configured — see step 3).
- [ ] Review `CONTENT-VERIFICATION.md` and confirm nothing marked
      `verificationStatus: pending` or `unverified` is publicly visible
      without the client's sign-off.

## Rolling back

Payload's Postgres adapter tracks applied migrations in the
`payload_migrations` table. To roll back the most recent migration:

```bash
npm run payload migrate:down
```

For a full database restore, see `BACKUP-RESTORE.md`.
