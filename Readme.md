# Shenacha Fiber website

Production-oriented Next.js site for Shenacha Fiber in Nairobi. The existing navy, white and restrained-red visual system, routes, package information and supplied fibre-ready board artwork are retained.

## Local development

```bash
npm install
npm run dev
```

Open the URL printed by Next.js (normally `http://localhost:3000`). The static pages work without database credentials. In that state, a valid enquiry returns `503`; the form keeps the entered values and says clearly that the request was not sent or stored, with the official WhatsApp contact as a fallback. The app never fakes a successful submission or writes enquiries to local files.

Copy `.env.example` to `.env.local` only when a Neon database is available. `DATABASE_URL` is server-only and must never use the `NEXT_PUBLIC_` prefix.

## Neon setup and migration

1. Create or select the intended Neon database and copy its pooled connection string into `DATABASE_URL`.
2. Review `migrations/001_website_leads.sql`.
3. Run the migration before deploying the API:

```bash
npm run db:migrate
```

The migration is idempotent. It supports an empty database and the legacy table previously created in the request path, preserves legacy columns, copies `notes` into `message`, backfills consent/submission data, and adds non-sequential public references. Schema creation never runs during an enquiry request.

To verify both empty and legacy shapes, set `NEON_TEST_DATABASE_URL` to a disposable test database and run:

```bash
npm run db:test-migration
```

That test creates uniquely named temporary tables, executes the migration twice against each shape, checks the results, and drops only those temporary tables. Do not point it at a production database.

## Stored enquiry data

`website_leads` stores an internal ID, non-sequential public reference, service, optional selected plan, Nairobi area/location, optional building or unit, property type, conditional user count, optional message, name, normalized Kenyan phone, optional normalized email, contact preference, explicit consent state and server-generated consent time, source/UTM attribution, and server-generated submission time. The API uses parameterized Neon queries and never returns the internal sequential ID.

## Verification

```bash
npm run test
npm run typecheck
npm run build
npm audit
```

After a build, run `npm start` and smoke-check `/`, `/enquire`, `/contact`, `/help`, `/privacy`, each `/services/...` route, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, legacy redirects, and `POST /api/leads`. A production deployment requires the migration to have completed and `DATABASE_URL` to be configured in the server environment.

The enquiry API accepts at most 16 KiB of JSON, rejects honeypot submissions, allowlists service/property/contact values, normalizes Kenyan mobile numbers, validates optional email and conditional user counts, requires explicit consent, returns `Cache-Control: no-store`, and logs no names, phone numbers, email addresses, locations or messages.

## Launch items still requiring owner confirmation

- Official speeds, prices, installation charges, router ownership, Fair Usage Policy, and contract terms
- Response expectations, meeting arrangements and support-hour commitments
- A real Shenacha logo and genuine project/customer photography
- Verified service areas, reviews, warranty terms, and support commitments
- Final privacy-controller identity, retention period, and deletion-contact wording
- Branded favicon and a dedicated social-sharing image

Do not invent these details. The current stock photography should be replaced with genuine Shenacha work when it becomes available.
