# Backup & restore

The CMS's only source of truth is the Postgres database (`DATABASE_URI`).
Media files uploaded without S3 configured live on local disk
(`public/media`) and are **not** covered by a database backup — see the
warning in `DEPLOYMENT.md` about configuring S3 before relying on uploads.

## Backing up

### Full database dump (recommended)

```bash
pg_dump "$DATABASE_URI" --format=custom --file=backup-$(date +%Y%m%d-%H%M%S).dump
```

`--format=custom` produces a compressed, restorable-with-options dump (as
opposed to plain SQL). Store it somewhere outside the app server — S3, the
hosting provider's managed-backup feature, or a dedicated backup bucket.

### If your Postgres provider has managed backups

Most managed Postgres providers (Vercel Postgres, Neon, Supabase, RDS) offer
automatic daily snapshots and point-in-time recovery out of the box — prefer
enabling that over relying solely on manual `pg_dump` runs, and use the
manual dump as a portable export/pre-migration safety net, not the primary
backup mechanism.

### Media (only relevant once S3 is configured)

Your S3-compatible provider's own backup/versioning features (S3 bucket
versioning, replication) apply — this repo doesn't need custom tooling for
that.

## Restoring

### From a custom-format dump, into an empty database

```bash
pg_restore --clean --if-exists --no-owner --dbname="$DATABASE_URI" backup-XXXXXXXX.dump
```

- `--clean --if-exists` drops existing objects first so the restore is
  idempotent against a partially-populated database.
- `--no-owner` avoids failures if the restore target's Postgres role names
  don't match the source's.

### After restoring: verify migrations are in sync

The restored dump already includes the `payload_migrations` table state
from when it was taken. If code has shipped new migrations since that
backup was made, run:

```bash
npm run payload migrate
```

This applies only the migrations not already recorded as run — safe to run
even if nothing is pending.

### Sanity checks after any restore

```sql
-- Row counts sanity check
SELECT 'leads' AS table, count(*) FROM leads
UNION ALL SELECT 'solutions', count(*) FROM solutions
UNION ALL SELECT 'sectors', count(*) FROM sectors
UNION ALL SELECT 'projects', count(*) FROM projects
UNION ALL SELECT 'users', count(*) FROM users;
```

Then log into `/admin` and confirm the dashboard KPI numbers look sane
(not zero if the backup should have had data) and that a real admin user
can still log in.

## Disaster recovery: full environment loss

1. Provision a new Postgres database, set `DATABASE_URI`.
2. `npm run payload migrate` to create schema from scratch, **or**
   `pg_restore` from the most recent backup (skip migrate if restoring —
   the dump already has the schema).
3. If you had S3 configured, media is unaffected (it lives outside
   Postgres) — just point the new deployment at the same bucket.
4. Redeploy the app with the same environment variables (`PAYLOAD_SECRET`
   must be the **same** value as before the incident, or every existing
   user's session/auth token becomes invalid and they'll need to log in
   again — not a data-loss issue, just an inconvenience).
5. Run the post-deploy checklist in `DEPLOYMENT.md`.

## What is NOT backed up by any of the above

- The in-memory rate limiter (`src/lib/rate-limit.ts`) — resets on every
  restart/redeploy by design; not meant to be durable.
- Anything in the gitignored `.env.local` — environment variables are
  configuration, not data; keep your own secure record of production
  secrets (a password manager or your hosting provider's secret store),
  independent of database backups.
