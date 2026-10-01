# Shenacha website

Next.js website for Shenacha's three services: fibre internet in Juja, plus CCTV and biometric access solutions for properties wherever they are located. The visual system uses the existing editorial navy, white and restrained-red direction.

## Local development

```bash
npm install
npm run dev
```

The static pages work without database credentials. In that state, a valid enquiry returns `503`; the form keeps the entered values and clearly says that nothing was sent or stored, with the official WhatsApp contact as a fallback.

Copy `.env.example` to `.env.local` only when the Shenacha Neon project is available. Keep both variables server-only:

- `DATABASE_URL`: pooled connection for the Next.js API.
- `DATABASE_URL_UNPOOLED`: direct connection for migrations.

Never use a `NEXT_PUBLIC_` prefix for either value.

## Neon setup and migration

The workspace is linked to the Shenacha Neon project with the named `shenacha` CLI profile. The existing `DEFAULT` profile is unrelated and must not be repurposed. A project-local MCP server is configured as `neon_shenacha`.

Migrations run in order from `migrations/001_website_leads.sql` and `migrations/002_structured_enquiries.sql`:

```bash
npm run db:migrate
```

Verify the pooled application connection, direct migration connection and enquiry table without writing data:

```bash
npm run db:check
```

The migration command requires `DATABASE_URL_UNPOOLED`. To verify empty and legacy schemas, point `NEON_TEST_DATABASE_URL` only at a disposable Neon child branch and run:

```bash
npm run db:test-migration
```

The compatibility test creates uniquely named tables, executes both migrations twice, checks structured fields and legacy backfills, and drops only its temporary tables.

## Stored enquiry data

`website_leads` stores a non-sequential public reference and structured enquiry data for fibre availability, property meetings, CCTV quotes, biometric quotes and support. Kenyan phone and WhatsApp numbers are normalized. Consent and submission timestamps are created by the server. The internal sequential ID is never returned by the API.

The API accepts at most 16 KiB of JSON, rejects honeypot submissions, conditionally validates each journey, returns `Cache-Control: no-store`, and avoids logging names, phone numbers, email addresses, locations or messages.

## Verification

```bash
npm run test
npm run typecheck
npm run build
npm audit
```

Smoke-check `/`, `/about`, `/fibre-internet`, `/cctv`, `/biometric-access`, `/coverage`, `/contact`, `/enquire`, `/help`, `/privacy`, metadata endpoints, and all legacy redirects at desktop and mobile widths.
