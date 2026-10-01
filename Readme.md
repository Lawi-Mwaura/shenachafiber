# Shenachafiber

### Enquiry handling: validation, durable storage, and honest recovery

[Lawi Mwaura](https://github.com/Lawi-Mwaura) · [Source repository](https://github.com/Lawi-Mwaura/shenachafiber)

![Shenachafiber homepage](docs/assets/portfolio-homepage.jpg)

*Actual homepage excerpt from the repository’s interface captures. No submitted enquiry records are shown.*

## Engineering scope

A Next.js website with structured enquiry journeys, server-side validation, PostgreSQL persistence, and notification delivery. The engineering focus is accurately telling a user whether their request was saved when part of the system is unavailable.

**Technologies:** TypeScript, Next.js, React, Neon / PostgreSQL, Resend, Vitest.

## System design

```mermaid
flowchart TB
    FORM[Public enquiry form] --> PARSE[Bounded JSON parsing]
    PARSE --> VALIDATE[Conditional field validation]
    VALIDATE --> SAVE[(PostgreSQL persistence)]
    SAVE --> RESPONSE[Saved result and public reference]
    RESPONSE --> FORM
    SAVE --> NOTIFY[Notification delivery]
    NOTIFY --> LOG[Separate delivery error reporting]
```

## Core decisions

| Failure or constraint | Design response |
| :--- | :--- |
| Malformed or oversized input | Validate request parsing and reject invalid input before persistence. |
| Different enquiry journeys | Apply validation according to the submitted journey rather than relying only on visible form fields. |
| Storage unavailable | Return an explicit unavailable result without claiming that details were received. |
| Notification fails after saving | Preserve the saved result and report the notification failure separately. |
| A reference is needed for follow-up | Return a non-sequential public reference rather than exposing the internal record identifier. |
| Personal information in logs or caches | Use minimal error metadata and no-store responses for submission results. |

## Tradeoffs

**A notification is not the durable record.** Saving before notification makes the response depend on persistence. Reliable retries for email delivery are a separate operational concern, rather than a reason to tell a user that an already-saved request failed.

**Availability must be communicated honestly.** A temporary database outage produces an explicit failure response. The interface can preserve entered values and offer a useful fallback instead of showing a success state that the backend cannot support.

**Validation is a shared contract.** Keeping parsing and validation separate from the route makes malformed input and conditional fields testable without a live database.

## Validation

On **1 October 2026**, **27 tests across three selected suites passed**: lead validation, notification formatting, and the enquiry API route. These cover validation, persistence outcomes, missing storage configuration, and route responses through isolated tests.

The selected run did not exercise a live database, real email delivery, or deployment availability. The repository’s configured public preview URL was unavailable during this portfolio review, so the README uses an actual repository capture and links to source rather than advertising a working demo.

[Contact Lawi](mailto:lawimwaura@gmail.com)

## Developer guide

[Local setup, migrations, environment configuration, and verification commands](docs/development.md).
