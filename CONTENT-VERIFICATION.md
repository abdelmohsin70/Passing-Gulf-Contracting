# Content verification policy

This project treats unverified facts as a first-class state, not something
to silently guess around. Nothing in this codebase invents contact details,
certifications, client names, or performance numbers — anything not
confirmed by the client is either omitted or explicitly marked pending.

This document explains the mechanism and lists what is currently
unverified, in both the static site and the CMS.

## The pattern

Two parallel mechanisms enforce this, depending on whether the data lives in
a static config file or in the CMS:

### Static site (`src/config/company.ts`)

Fields like phone, email, and address carry a paired `status` value
(`"pending"` / `"confirmed"`). UI components check this status and hide the
field entirely — rather than rendering a guessed or placeholder value — until
it flips to `"confirmed"`.

### CMS (Payload collections)

- **`verificationField`** (`src/payload/fields/seo.ts`) — a
  `verificationStatus` select field (`unverified` / `pending` / `verified` /
  `rejected`) attached to collections where factual accuracy matters:
  Projects, Certifications.
- **Draft/Published status** — every editorial collection (Solutions,
  Sectors, Projects, Insights, Pages) supports Payload's native
  draft/published workflow. A record can exist and be edited without ever
  being publicly visible.
- **Combined gate on Projects** — a case study is only visible on the public
  site when **both** `_status = published` **and** `verificationStatus =
  verified` are true (enforced in `src/payload/collections/Projects.ts`'s
  admin description and must be enforced again in the frontend query once
  case studies are read from Payload — see "Known gap" below).
- **`usageApproved`** (Clients, Media) — a boolean gate separate from
  verification: even a confirmed-real client logo or photo isn't published
  until explicit usage/publication permission is on file.

## What is currently unverified (as of this build)

### Contact & identity (static site, `src/config/company.ts`)

1. **Phone number** — extracted from Arabic-Indic digits in the source PDF;
   digit order not independently confirmed.
2. **WhatsApp Business number** — not supplied by the client.
3. **Email address** — brochure lists `passinggulf.cc@outlook.sa`; not
   confirmed as the inbox that should receive live leads.
4. **Precise street address** — only "Riyadh, Saudi Arabia" is confirmed.
5. **Legal English company name** — "Ijtiyaz Al Khaleej Contracting" is a
   placeholder; the brochure's literal translation was explicitly rejected
   by the client's own strategy brief.
6. **Commercial registration / VAT numbers** — not supplied.
7. **Social media links** — not supplied.
8. **Official logo** — no vector file supplied; a text badge is used instead.

### CMS content (seeded, all in draft/unverified state by design)

9. **ISO certifications** (9001:2015, 14001:2015, 45001:2018) — three
   `certifications` records exist with `verificationStatus: unverified` and
   `publicVisibility: false`. Referenced in the brochure, but no dated
   certificate copy was supplied. **Do not flip `publicVisibility` to true
   or `verificationStatus` to `verified` without a real certificate on file.**
10. **Case studies** — four `projects` records seeded as drafts with
    bracketed placeholder text (e.g. `[اسم العميل]`, `[الرقم قبل/بعد]`).
    These exist so the content team has a structure to fill in, not as
    publishable content. Each must go through the workflow in
    `CMS-GUIDE-AR.md` (real KPI source notes, client approval evidence
    upload, `verificationStatus: verified`) before publishing.
11. **Insights articles** — three seeded as drafts, same rule: review and
    complete before publishing.
12. **Clients / testimonials** — intentionally left empty. No client names,
    logos, or quotes have been fabricated or seeded.
13. **Team members** — intentionally left empty.

## Known gap

The frontend currently reads case studies from the static
`src/data/projects.ts` file, not from the Payload `projects` collection (see
`README.md` → "Known limitations" and task #27 in this project's history).
The `published + verified` double-gate described above is enforced at the
CMS/access-control level today, but a frontend query that reads live from
Payload must re-implement that same filter — do not assume the CMS access
rules alone are sufficient once that migration happens.

## Process for verifying new content

1. Get the fact in writing from the client (email, signed document, or a
   certificate/registration copy).
2. Update the record in the CMS (or `src/config/company.ts` for static
   contact fields) with the real value.
3. Flip the status field (`verificationStatus: verified`,
   `usageApproved: true`, or the static-site `status: "confirmed"`) —
   never leave a real value behind a `pending` flag, and never flip a status
   flag without the underlying value being real.
4. For Projects specifically, upload the approval evidence to
   `approvalEvidence` (restricted to super-admin/content-manager, never
   public) before setting `verificationStatus: verified`.
5. Publish.
