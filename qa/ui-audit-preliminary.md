# Shenacha whole-site UI/UX audit - preliminary code-backed pass

Date: 2026-08-27

## Status and evidence limit

This is a delegated, code-backed inventory across every primary route and shared UI component. It is not the completed visual audit. Fresh screenshots could not be captured because the in-app browser was unavailable, so balance, image crops, perceived asymmetry, contrast, wrapping, and alignment remain explicitly unconfirmed until a new desktop/mobile capture run is approved.

## Scope

- `/`
- `/about`
- `/fibre-internet`
- `/cctv`
- `/biometric-access`
- `/coverage`
- `/contact`
- `/enquire`
- `/help`
- `/privacy`
- Shared header, footer, enquiry form, fibre-ready board, responsive rules and design tokens

## Route health inventory

| Step | Surface | Preliminary health | Primary concern |
| --- | --- | --- | --- |
| 1 | Home | Needs refinement | Three competing hero actions weaken the primary path. |
| 2 | About | Structurally sound, shallow trust | Repeats positioning without adding process or proof. |
| 3 | Fibre internet | Needs urgent correction | Two full forms create duplicate IDs and excessive page length. |
| 4 | CCTV | Generally coherent | Needs screenshot confirmation for hero balance and CTA hierarchy. |
| 5 | Biometric access | Generally coherent | Needs screenshot confirmation for hero balance and CTA hierarchy. |
| 6 | Coverage | Copy refinement needed | Defensive checker language introduces unnecessary distrust. |
| 7 | Contact | Needs hierarchy review | Four journey choices compete and cards may become visually imbalanced. |
| 8 | Enquire | IA decision required | Public route exists without clear internal navigation ownership. |
| 9 | Help | Structurally useful | Desktop discoverability differs from mobile navigation. |
| 10 | Privacy | Structurally appropriate | Requires zoom, reading-width and contrast confirmation. |

## Confirmed strengths

- Clear service-area distinction: fibre is Juja-specific; CCTV and biometric access are property-led.
- Semantic page foundations include a main landmark, skip link, useful alt text and visible focus states.
- Controls generally meet the 44px touch-target baseline.
- Reduced-motion behavior is defined.
- Form submission includes loading, success, error-summary, field-error and WhatsApp recovery states.
- Responsive Next Image usage is consistent.

## P0 - fix before visual polish

### 1. Duplicate form IDs on `/fibre-internet`

Two simultaneous enquiry forms reuse IDs such as `location`, `building`, `name`, `phone`, `whatsapp`, `message`, `consent` and their error IDs. Error links and ARIA relationships can resolve to the wrong form.

Implementation:

- Add an `idPrefix` to each enquiry form.
- Generate every control ID, error ID, helper ID and error-summary anchor from the prefix.
- Add a DOM assertion ensuring the page contains no duplicate IDs.

Acceptance:

- Property-form errors focus only property-form fields.
- Resident-form errors focus only resident-form fields.
- Automated accessibility checks report no duplicate-ID or broken ARIA-reference issues.

### 2. Required state is not programmatic

Fields display `Required` visually but do not consistently use native `required` or `aria-required`.

Implementation:

- Use `required` where native semantics match the validation model.
- Use `aria-required="true"` for conditional fields where necessary.
- Keep server validation authoritative.

Acceptance:

- Required state is announced by VoiceOver and NVDA.
- Required state updates correctly when the enquiry journey changes.

### 3. Invalid selects do not receive the same visual treatment

Selects receive `aria-invalid` but the error-state CSS targets only inputs and textareas.

Implementation:

- Include invalid selects in the shared error selector.
- Preserve adjacent error text so color is never the only signal.

## P1 - system and hierarchy corrections

### 4. Consolidate the CSS architecture

`globals.css` and `canonical.css` contain competing rules for the header, mobile menu, forms, fibre board and responsive behavior. Large unused legacy families remain in the stylesheet.

Implementation:

- Confirm unused selectors with route coverage.
- Remove legacy `.story-*`, `.offer-*`, `.chapter-*` and `.plan-*` families that have no current component references.
- Merge canonical rules into intentional component sections.
- Establish one source of truth for type, spacing, radius, elevation, glass, header height, breakpoints and z-index.

### 5. Use one header height and navigation breakpoint

The small header is 68px while the canonical mobile menu is positioned at 76px, creating an 8px discontinuity. Competing 1050px and 1100px rules make the transition fragile.

Implementation:

- Add a `--header-height` token.
- Use one mobile-navigation breakpoint.
- Derive the menu inset and maximum height from that token.

### 6. Resolve information architecture

- Help is prominent on mobile but absent from desktop navigation.
- The floating WhatsApp action disappears at mobile widths.
- `/enquire` is indexed but not owned by a clear internal navigation path.

Decision:

- Either make `/enquire` the universal `Start an enquiry` route, or remove it from the public IA and keep service-specific journeys.
- Keep support discoverable across desktop and mobile.

### 7. Reduce competing primary actions

- Home: use `Check fibre availability` as the primary action and `Explore services` as the secondary action.
- Fibre: lead users to an audience choice before showing a form.
- Contact: group quote journeys beneath a single clear heading rather than four equal choices.
- Keep one visually dominant action per viewport.

### 8. Shorten the fibre journey

Property owners and residents are distinct audiences but currently receive two full forms on one long page.

Implementation:

- Add a clear audience choice near the package section.
- Progressively reveal or route to one contextual form.
- Preserve `#property-meeting` and `#resident-inquiry` deep links.

### 9. Consolidate page-entry patterns

Define three intentional templates:

1. Editorial service hero.
2. Centered utility hero.
3. Support/legal reading layout.

Avoid borrowing route-specific classes, such as using coverage hero styling for contact.

### 10. Normalize the surface system

- Radius scale: 8 / 16 / 24 / pill.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
- Keep glass for transient layered navigation surfaces.
- Prefer opaque surfaces for long forms unless new screenshots prove glass improves hierarchy.
- Add a solid fallback for browsers without `backdrop-filter`.

### 11. Restore readable navigation type

The canonical layer forces desktop navigation to 12px while every item is bold. Use 14-15px medium/semibold text and reserve the strongest treatment for the active item.

### 12. Rebalance the footer

Split the dense `Start here` column into `Enquiries` and `Support`, or allocate it more width than the short service column.

## P2 - copy and interaction polish

- Standardize British `enquiry`, service names and sentence-case CTA labels.
- Replace `There is no fake instant checker` with a positive confirmation promise.
- Add a stable pressed state without layout shift.
- Add factual process and service-standard content to About; do not invent testimonials.

## Fresh screenshot checks still required

- Hero and image balance at 1440, 1024, 768, 390 and 375px.
- Heading orphans and asymmetric vertical whitespace.
- Muted label and footer contrast.
- Glass border visibility and blur readability.
- Footer email wrapping from 761-1000px.
- Poster legibility and dominance on mobile.
- Form label and `Required` baseline alignment.
- Contact-card and service-area grid symmetry.
- 200% zoom, landscape phone and sticky-header obstruction.
- Keyboard order, focus visibility, error focus and mobile-menu behavior.

## Recommended implementation sequence

1. Correct form IDs, required semantics and select error styling.
2. Remove legacy CSS and merge the canonical layer.
3. Establish shared design tokens and one responsive breakpoint system.
4. Resolve `/enquire`, support visibility and CTA hierarchy.
5. Refactor hero, footer and form patterns.
6. Normalize terminology and CTA copy.
7. Run fresh screenshot, keyboard, VoiceOver/NVDA and automated accessibility checks.
8. Iterate only on differences proven by those captures.
