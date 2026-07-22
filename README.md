# اجتياز الخليج للمقاولات — Ijtiyaz Al Khaleej Contracting

Bilingual (Arabic/English), RTL/LTR production website for Ijtiyaz Al Khaleej
Contracting — a Saudi facility management, operation, maintenance, and
support-services company based in Riyadh (est. 2015).

Built with Next.js (App Router), TypeScript, and Tailwind CSS v4, with an
embedded Payload CMS (Postgres-backed) for content, a sales CRM (Leads), and
a role-based admin dashboard.

## Getting started

```bash
npm install
npm run dev
```

The site redirects `/` to `/ar` (default locale) or `/en` based on the
browser's `Accept-Language` header. Visit `http://localhost:3000`.

The CMS requires a Postgres database — set `DATABASE_URI` and
`PAYLOAD_SECRET` in `.env.local` (see `.env.example`), then run:

```bash
npm run payload migrate   # create the schema
npm run seed               # optional: baseline sectors/solutions + first admin user
```

Visit `http://localhost:3000/admin` to log in. See `CMS-GUIDE-AR.md` (content
editors), `SALES-DASHBOARD-GUIDE-AR.md` (sales team), and `DEPLOYMENT.md`
(production setup) for details.

## Scripts

| Command               | What it does                                  |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`           | Start the local dev server                      |
| `npm run build`         | Production build                                |
| `npm start`             | Serve the production build                      |
| `npm run lint`          | ESLint (Next.js core-web-vitals + TypeScript)    |
| `npm test`              | Run the Vitest suite once                       |
| `npm run test:watch`    | Run Vitest in watch mode                        |

Before shipping any change, run in order: `npm run lint`, `npx tsc --noEmit`,
`npm test`, `npm run build`.

## Project structure

```
src/
  app/
    [locale]/            # everything under /ar and /en (root layout lives here)
    sitemap.ts robots.ts # locale-aware sitemap + robots
    global-not-found.tsx # 404 for URLs outside /ar and /en (experimental Next 16 API)
    opengraph-image.tsx  # default OG image (ImageResponse)
    actions.ts           # 'use server' — quote & career form submission
  components/
    primitives/           # Button, Container, Section, Heading, Field, Badge
    layout/                # SiteHeader, MobileNav, SiteFooter, Breadcrumbs, WhatsAppButton...
    sections/               # Hero, TrustStrip, SolutionFamilyCard, ProcessTimeline...
    forms/                  # QuoteWizard, CareerInterestForm
  config/company.ts       # single source of truth for company facts (see below)
  data/                    # solutions, sectors, projects, process, outcomes, clients
  i18n/                    # locale config + ar/en UI-string dictionaries
  lib/                     # validation (Zod), rate-limit, notify adapter, analytics, seo
proxy.ts                  # Next 16 "Proxy" (formerly middleware) — locale redirect
tests/                     # Vitest unit/integration tests
```

## Imagery

`public/images/` contains photography extracted directly from the client's
own company profile brochure (the source PDF supplied for this project) —
not stock photos pulled from the internet. They're generic trade photography
(a technician's toolbelt, an HVAC unit, a cleaning cart, etc.) rather than
photos of this company's actual staff, sites, or equipment, so treat them as
placeholders that give the site a professional look until the client
supplies real branded photography and a logo. Swap them out by replacing
the file at the same path, or update the `heroImage`/`gallery` fields in
`src/data/solutions.ts` to point at new files.

## Motion & interaction

- `src/components/Reveal.tsx` — a small IntersectionObserver-driven wrapper
  used throughout the site to fade/rise content in as it scrolls into view.
  Fully inert under `prefers-reduced-motion` (see the `motion-reduce:`
  classes and the global override in `globals.css`).
- `src/app/[locale]/template.tsx` — remounts on every navigation, giving
  each page a consistent enter transition without any router-transition
  library.
- Buttons, nav links, cards, and the WhatsApp button all have hover/press
  micro-interactions (scale, shadow, underline) defined alongside their
  components rather than globally, so search for `transition-` in a given
  component if you want to adjust one.

## Editable content

**Solutions, Sectors, and Projects/case studies are edited in the CMS
(`/admin`), not in code.** See `CMS-GUIDE-AR.md` for the editor workflow.
These pages are rendered on demand (`export const dynamic = "force-dynamic"`
in each route) specifically so that publishing or editing content in
`/admin` shows up on the live site immediately, without a redeploy:

- **Solutions** — `/admin` → الحلول (Solutions collection). Frontend at
  `/solutions` and `/solutions/[slug]`, sourced via `src/payload/queries/solutions.ts`.
- **Sectors** — `/admin` → القطاعات (Sectors collection). Frontend at
  `/sectors`, sourced via `src/payload/queries/sectors.ts`. The "relevant
  solutions" shown per sector are derived live from each solution's own
  `sectors` relationship, not a separate field to keep in sync.
- **Projects / case studies** — `/admin` → المشاريع ودراسات الحالة. A case
  study is only visible on the public site once it is **both** Published
  *and* `verificationStatus: verified` (see `CONTENT-VERIFICATION.md`).
  Until the first one is verified, `/projects` and the homepage
  automatically fall back to the single static illustrative template in
  `src/data/projects.ts` (clearly labeled, `isPlaceholder: true`) so the
  page is never empty — sourced via `src/payload/queries/projects.ts`.

A handful of things are still edited directly in code, not the CMS (a
deliberate scope decision, not an oversight — see "Known limitations"):

- **Company facts** (phone, WhatsApp, email, address, certifications, social
  links): `src/config/company.ts`. Every fact that isn't independently
  verified is wrapped in a `{ value, status: "pending" | "confirmed" }`
  object. The UI automatically hides an element (a phone button, an email
  link, the WhatsApp floating button, an ISO badge...) whenever its status
  is `"pending"` — **never** flip a field to `"confirmed"` without a
  verified source.
- **Solution families** (the 4 cards on the homepage — a curated subset/
  grouping of Solutions, not a CMS collection of its own): `src/data/solution-families.ts`.
- **Client logos**: `src/data/clients.ts`. Empty by default — the "Our
  Clients" section renders a pending notice until logos with confirmed
  usage rights are added here.
- **UI copy** (nav labels, buttons, form labels, footer, error/empty
  states): `src/i18n/dictionaries/ar.ts` and `src/i18n/dictionaries/en.ts`.
  Both files must keep an identical key structure — `npm test` enforces
  this (see `tests/i18n.test.ts`).

### Adding a new solution

Create it in `/admin` (see `CMS-GUIDE-AR.md`) and publish. To feature it on
the homepage's 4 "solution family" cards, also add an entry referencing its
slug to `src/data/solution-families.ts` (a code change, since that grouping
isn't itself a CMS collection).

### Adding a new project / case study

Create it in `/admin`, fill in real client-approved data, set
`verificationStatus: verified`, and publish — see the checklist in
`CMS-GUIDE-AR.md`. It automatically appears on `/projects`, gets its own
`/projects/[slug]` page, and is added to the sitemap.

## Forms, leads, and connecting a real CRM/email provider

The quote-request wizard (`/contact`) and the careers interest form
(`/careers`) both post to Server Actions in `src/app/actions.ts`:

- Validation is done with **Zod** (`src/lib/validation.ts`), both
  client-side (native HTML `required`/`type` attributes for immediate
  feedback) and server-side (source of truth).
- A hidden **honeypot** field (`companyWebsite`) silently short-circuits bot
  submissions without tipping them off.
- A minimal in-memory **rate limiter** (`src/lib/rate-limit.ts`) throttles
  repeated submissions per IP. It resets on redeploy and doesn't share
  state across serverless instances — swap it for Redis/Upstash if you
  deploy to a multi-instance/serverless platform and need durable limits.
- Every successful submission gets a server-generated reference ID
  (`src/lib/notify.ts`) shown to the user and passed to the notification
  adapter.

**By default, leads are only logged to the server console** — nothing is
lost, but nobody is emailed. To connect a real provider:

1. Set `NOTIFY_WEBHOOK_URL` (see `.env.example`) to an endpoint that accepts
   a JSON POST — a Zapier/Make webhook, your CRM's inbound-lead API, or an
   email-relay service.
2. That's it — `sendLeadNotification()` in `src/lib/notify.ts` POSTs the
   full lead payload there. No other code changes are required. If your
   provider needs custom auth headers or a different payload shape, adapt
   that one function.

## Environment variables

See `.env.example` for the full list with explanations. The public site
(everything outside `/admin`) needs none of them to run — all default to
safe no-ops. The CMS needs `DATABASE_URI` and `PAYLOAD_SECRET` at minimum.

| Variable | Purpose | Required? |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata, sitemap.xml, robots.txt | Recommended before launch (defaults to `https://example.com`) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Enables GA4 — unset means zero tracking scripts load | No |
| `NOTIFY_WEBHOOK_URL` | Where quote/career leads are POSTed for real-time alerting | No (leads are always saved to the DB regardless; this only adds a push notification) |
| `DATABASE_URI` | Postgres connection string for the CMS | Yes, for `/admin` and lead capture to work |
| `PAYLOAD_SECRET` | Signs admin auth tokens | Yes |
| `NEXT_PUBLIC_SERVER_URL` | Payload's internal server URL, usually same as `NEXT_PUBLIC_SITE_URL` | Yes |
| `S3_*` | Media storage | Recommended before launch — see `DEPLOYMENT.md` |
| `SMTP_HOST` / `RESEND_API_KEY` | Transactional email | Recommended before launch |

## Analytics events

`src/lib/analytics.ts` exposes `trackEvent()`, wired up at these points —
all silent no-ops until `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set:

- `quote_start` — QuoteWizard mounts on `/contact`
- `quote_submit` — quote request successfully submitted
- `whatsapp_click` — WhatsApp floating button or contact-card link
- `phone_click` — phone number link on the contact page
- `service_view` — a `/solutions/[slug]` page is viewed
- `case_study_view` — a `/projects/[slug]` page is viewed

## i18n / RTL

- Locale-prefixed routing: `/ar/...` and `/en/...`. `proxy.ts` (Next.js
  16's renamed `middleware`) redirects unprefixed paths to the detected
  locale.
- The root layout lives at `src/app/[locale]/layout.tsx` and sets
  `<html lang dir>` per locale (`dir="rtl"` for `ar`, `dir="ltr"` for `en`).
  This is why there's no top-level `app/layout.tsx` — Next 16's
  `experimental.globalNotFound` (see `next.config.ts`) handles the 404 case
  that this pattern would otherwise leave uncovered
  (`src/app/global-not-found.tsx`).
- Fonts: IBM Plex Sans Arabic (Arabic) and Inter (English), both loaded via
  `next/font/google` — see `src/lib/fonts.ts`.
- Logical CSS (`ms-`, `me-`, `start`, `end`, `rtl:` variants) is used
  instead of hardcoded `left`/`right` wherever direction matters.

## SEO

- Per-page `generateMetadata` with unique titles/descriptions in both
  locales, `alternates.canonical`, and `alternates.languages` for hreflang.
- `src/app/sitemap.ts` and `src/app/robots.ts` cover both locales and all
  static + dynamic routes (case studies with `isPlaceholder: true` are
  excluded from the sitemap and marked `noindex` automatically).
- JSON-LD: `Organization` (root layout), `LocalBusiness` (contact page),
  `Service` + `BreadcrumbList` + `FAQPage` (solution detail pages) — see
  `src/lib/seo.ts`.

## Deployment

See `DEPLOYMENT.md` for the full production checklist (Postgres, S3, email,
migrations, the Vercel Deployment Protection fix, and a post-deploy
verification list). In short: deploy to Vercel or any Node host that runs
`npm run build && npm start`, with the environment variables above set and
`npm run payload migrate` run once against the production database.

## Known limitations / follow-ups

- The lead rate-limiter is in-memory only (see above) — fine for a single
  instance, not durable across multiple serverless invocations.
- The CMS runs against a local development Postgres database in this
  environment. Nothing is wired to production infrastructure yet — see
  `DEPLOYMENT.md` for what's needed to go live (real `DATABASE_URI`, S3
  storage, email provider).
- Solutions, Sectors, and Projects are fully migrated to Payload (see
  "Editable content" above) and render on demand so CMS edits are
  immediately live. `src/data/solutions.ts`, `sectors.ts`, and
  `projects.ts` still exist but are no longer the frontend's data
  source — they're now used only as: (a) the seed script's input, and
  (b) the Projects listing/homepage's zero-risk fallback when no case
  study is yet published+verified in the CMS.
- Company contact facts (`src/config/company.ts`), solution families, and
  client logos are still code-edited, not CMS-edited — a deliberate scope
  decision, not an oversight (see "Editable content" above for why).
- The **footer** (rendered on every page, including the still-statically-
  generated `/about`, `/careers`, `/quality-safety`, `/privacy` pages) reads
  Solutions/Sectors from Payload too. On those specific static pages, the
  footer's links reflect whatever was in the CMS **at build time**, not
  live — the CMS-driven pages themselves (home, `/solutions`, `/sectors`,
  `/projects`, `/contact`) always reflect live content. This is an accepted
  trade-off, not a bug: making every single page fully dynamic just for the
  footer's nav links would give up static generation's performance benefit
  for content that changes rarely.
- File upload on the quote form was intentionally left out — wire it into
  `QuoteWizard`/`submitQuoteRequest` (uploading to the `media` collection)
  if attachments become a requirement.
- See `CONTENT-VERIFICATION.md` for what CMS content is currently seeded as
  unverified/draft and must not be published without client confirmation.

## TODO_VERIFY — facts that must be confirmed before launch

These are marked `status: "pending"` in `src/config/company.ts` and hidden
from the UI until confirmed. Nothing below was invented — most values
either come from the client's brochure (unverified) or are placeholders.

1. **Phone number** — the number in the source PDF is stored as
   Arabic-Indic digits that may have been extracted out of digit-order.
   Do not publish it without confirming the correct number directly with
   the client.
2. **WhatsApp Business number** — not supplied.
3. **Email address** — the brochure lists `passinggulf.cc@outlook.sa`.
   Confirm this is the inbox that should receive live leads before
   publishing it publicly.
4. **Precise address** — only "Riyadh, Saudi Arabia" is confirmed; the
   brochure's "Al Saadah District" reference and any street/building
   details need confirmation.
5. **Legal English company name** — the brochure uses "The Passing Gulf
   Contracting Company," which the client's own strategy brief says not to
   carry into the English site. `Ijtiyaz Al Khaleej Contracting` is used
   throughout as a placeholder pending the confirmed legal/trading name.
6. **ISO certificates** (9001:2015, 14001:2015, 45001:2018) — referenced in
   the brochure but no valid, dated certificate copies were supplied.
   Certificate numbers/logos are marked "pending verification" on the
   Quality & Safety page until real copies are provided.
7. **Commercial registration / VAT numbers** — not supplied.
8. **Social media links** (Instagram, LinkedIn, X) — not supplied.
9. **Real project / case study data** — `src/data/projects.ts` ships with
   one clearly labeled illustrative template only; no real client names,
   locations, or figures have been published anywhere on the site.
10. **Client logos** — the brochure shows a client-logo wall, but no usage
    rights were confirmed, so the "Our Clients" section is empty by design
    until logos are supplied with permission to publish.
11. **Official logo** — no vector logo file was supplied, so the header,
    footer, and favicon use a simple text badge ("اج" / "IK") instead.
    Replace `src/app/icon.svg` and the badge markup in `SiteHeader.tsx` /
    `SiteFooter.tsx` once a real logo is provided.
12. **Photography** — see the "Imagery" section above: current photos are
    generic trade photography pulled from the client's own brochure, not
    photos of this company's actual people, sites, or equipment.
