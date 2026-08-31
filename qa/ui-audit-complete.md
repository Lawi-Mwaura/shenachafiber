# Shenacha whole-site UI/UX audit — completed visual evidence pass

Date: 2026-08-27  
Preview audited: `http://127.0.0.1:3100`  
Viewports: desktop 1440×1000; mobile 375×812

## Audit status

This is the completed screenshot-backed UI/UX audit for the ten primary routes. Every accepted screenshot was captured in this run and visually inspected. No application code was changed.

The first full-page fibre captures were rejected because Chrome omitted the off-screen resident board during compositing. They are isolated under `qa/audit-current/rejected/` and are not used as evidence. The route was recaptured as four accepted viewport segments per breakpoint so every important state is visible without blank/loading/wrong-state regions.

Automated capture checks also confirmed:

- All ten routes returned their expected page with one H1.
- No desktop or mobile route had horizontal page overflow.
- Every audited image resource reported loaded with a non-zero natural size.
- The open mobile menu begins at y=76 while the mobile header ends at y=68.
- `/fibre-internet` contains duplicate IDs in both viewports.
- The coverage form error summary receives focus after failed submission.
- Invalid inputs receive a red error treatment, while invalid selects retain the neutral border/background.

## Accepted evidence

### Primary routes

| Step | Route | Desktop | Mobile |
| --- | --- | --- | --- |
| 1 | Home `/` | [01-home-desktop.png](audit-current/01-home-desktop.png) | [01-home-mobile.png](audit-current/01-home-mobile.png) |
| 2 | About `/about` | [02-about-desktop.png](audit-current/02-about-desktop.png) | [02-about-mobile.png](audit-current/02-about-mobile.png) |
| 3 | Fibre `/fibre-internet` | [top](audit-current/03a-fibre-internet-desktop-top.png), [owner form](audit-current/03b-fibre-internet-desktop-owner.png), [resident board](audit-current/03c-fibre-internet-desktop-resident.png), [resident form](audit-current/03d-fibre-internet-desktop-resident-form.png) | [top](audit-current/03a-fibre-internet-mobile-top.png), [owner form](audit-current/03b-fibre-internet-mobile-owner.png), [resident board](audit-current/03c-fibre-internet-mobile-resident.png), [resident form](audit-current/03d-fibre-internet-mobile-resident-form.png) |
| 4 | CCTV `/cctv` | [04-cctv-desktop.png](audit-current/04-cctv-desktop.png) | [04-cctv-mobile.png](audit-current/04-cctv-mobile.png) |
| 5 | Biometric access `/biometric-access` | [05-biometric-access-desktop.png](audit-current/05-biometric-access-desktop.png) | [05-biometric-access-mobile.png](audit-current/05-biometric-access-mobile.png) |
| 6 | Coverage `/coverage` | [06-coverage-desktop.png](audit-current/06-coverage-desktop.png) | [06-coverage-mobile.png](audit-current/06-coverage-mobile.png) |
| 7 | Contact `/contact` | [07-contact-desktop.png](audit-current/07-contact-desktop.png) | [07-contact-mobile.png](audit-current/07-contact-mobile.png) |
| 8 | Enquire `/enquire` | [08-enquire-desktop.png](audit-current/08-enquire-desktop.png) | [08-enquire-mobile.png](audit-current/08-enquire-mobile.png) |
| 9 | Help `/help` | [09-help-desktop.png](audit-current/09-help-desktop.png) | [09-help-mobile.png](audit-current/09-help-mobile.png) |
| 10 | Privacy `/privacy` | [10-privacy-desktop.png](audit-current/10-privacy-desktop.png) | [10-privacy-mobile.png](audit-current/10-privacy-mobile.png) |

### Interaction and error evidence

- [11-home-mobile-menu.png](audit-current/11-home-mobile-menu.png)
- [12-coverage-mobile-error-viewport.png](audit-current/12-coverage-mobile-error-viewport.png)
- [13-cctv-mobile-error-viewport.png](audit-current/13-cctv-mobile-error-viewport.png)
- [capture-metrics.json](audit-current/capture-metrics.json)

## Overall verdict

The public pages have a strong editorial foundation: confident typography, a restrained navy/red palette, good image selection, clear service-area language and mostly sound responsive reflow. The site is recognisably one product across routes.

The experience is not yet at an Apple-quality finish because the interaction layer and system discipline trail the page compositions. The mobile menu is visually broken, the fibre journey is excessively long and duplicates forms, the floating desktop WhatsApp action obscures content, About contains conspicuous empty bands, and several CSS systems compete in the cascade. These are more consequential than adding further glass effects.

## Route-by-route findings

### 1. Home — needs hierarchy refinement

Strengths:

- Desktop hero has strong left/right balance and a useful apartment image crop.
- Mobile reflows without overflow; hero and service imagery remain legible.
- Alternating service rows create a clear desktop rhythm.

Findings:

- Three hero actions compete. On mobile they become two full-width pills plus a separate red text action before the service-area note.
- The desktop gap between the hero and `What we do` is generous enough to weaken continuity.
- Service naming punctuation is inconsistent: the first title has no period; the second and third do.
- The floating WhatsApp pill sits over the page rather than in reserved space.

Evidence: [desktop](audit-current/01-home-desktop.png), [mobile](audit-current/01-home-mobile.png).

### 2. About — visible layout defect and shallow trust story

Strengths:

- Hero copy and technician image are well balanced at both widths.
- The three values stack cleanly on mobile.

Findings:

- Large empty grey bands appear above and below the three-value row on desktop and as isolated blocks on mobile. They read like missing content or unfinished placeholders rather than intentional whitespace.
- The page repeats the service positioning but does not add much trust-building detail about assessment, installation or support.

Evidence: [desktop](audit-current/02-about-desktop.png), [mobile](audit-current/02-about-mobile.png).

### 3. Fibre internet — highest-density and highest-friction route

Strengths:

- Hero image crop, package card and two audience labels are clear.
- Pricing is immediately understandable.
- Poster is uncropped and readable when its section is in view.

Findings:

- Mobile page height is 9,031px. It includes two complete forms plus the full poster and explanation, creating an unusually long conversion path.
- The property-owner form is visually much denser than its adjacent copy on desktop; on mobile it becomes a long uninterrupted field stack.
- Deep-linking/scrolling to `.owner-section` places the heading beneath the sticky header. The accepted owner captures show the beginning of the form clipped by the header.
- Two rendered forms reuse `location`, `building`, `name`, `phone`, `whatsapp`, `message` and `consent` IDs.
- The same resident poster content is repeated on both Fibre and Coverage, increasing site-level redundancy.
- `Submit a fibre inquiry` breaks the site-wide British `enquiry` convention.

Evidence: [desktop top](audit-current/03a-fibre-internet-desktop-top.png), [desktop owner](audit-current/03b-fibre-internet-desktop-owner.png), [desktop resident](audit-current/03c-fibre-internet-desktop-resident.png), [mobile top](audit-current/03a-fibre-internet-mobile-top.png), [mobile owner](audit-current/03b-fibre-internet-mobile-owner.png), [mobile resident](audit-current/03c-fibre-internet-mobile-resident.png).

### 4. CCTV — coherent template with overlay and form-state issues

Strengths:

- Hero crop clearly communicates installation work.
- Scope list and property-type list are easy to scan.
- Mobile hierarchy remains clear without horizontal overflow.

Findings:

- Desktop WhatsApp pill overlaps the scope-list region.
- The form card introduces soft shadow/glass styling into an otherwise flat editorial page; it feels like a separate design layer.
- On failed submission, property type is invalid but its select keeps the neutral visual state while text inputs turn red.

Evidence: [desktop](audit-current/04-cctv-desktop.png), [mobile](audit-current/04-cctv-mobile.png), [error state](audit-current/13-cctv-mobile-error-viewport.png).

### 5. Biometric access — coherent, with wrapping and redundancy

Strengths:

- Hero image has the strongest service-to-image match in the set.
- Desktop and mobile service scope remain balanced.

Findings:

- `Request an access-control quote` wraps with the hyphen at a visually awkward point, especially in the form heading.
- `Other suitable properties` is a generic fifth item and wraps more heavily than its peers.
- Desktop WhatsApp pill again overlaps content.

Evidence: [desktop](audit-current/05-biometric-access-desktop.png), [mobile](audit-current/05-biometric-access-mobile.png).

### 6. Coverage — clear journey, overly defensive copy

Strengths:

- The centered hero and poster/form sequence are easy to understand.
- Poster remains uncropped on both viewports.
- Form error summary is prominent, actionable and followed by the first field.

Findings:

- `There is no fake instant checker` introduces distrust and sounds defensive.
- Poster consumes a large portion of the mobile journey before the user reaches the form.
- The desktop WhatsApp pill covers body copy in the poster explanation.
- Error summary is long on mobile; useful, but it would benefit from compact grouping or moving focus directly to the first invalid field after a short summary.

Evidence: [desktop](audit-current/06-coverage-desktop.png), [mobile](audit-current/06-coverage-mobile.png), [error state](audit-current/12-coverage-mobile-error-viewport.png).

### 7. Contact — clean but action-heavy

Strengths:

- Direct-contact cards are symmetric on desktop and stack cleanly on mobile.
- Phone, WhatsApp and email are visibly differentiated.

Findings:

- After presenting three direct-contact methods, the page immediately presents four more equally weighted journey links. The choice architecture is broader than necessary.
- Desktop hero uses substantial vertical whitespace without a primary action.
- `For properties wherever located` is awkward copy.

Evidence: [desktop](audit-current/07-contact-desktop.png), [mobile](audit-current/07-contact-mobile.png).

### 8. Enquire — useful route without clear IA ownership

Strengths:

- Journey selector provides progressive disclosure within one form.
- Mobile form controls are comfortably sized and reflow correctly.

Findings:

- The route is not linked from the header, footer, contact page or service pages, despite being in the sitemap.
- Rounded pale-blue hero and soft form card feel more consumer-app-like than the flatter editorial service routes.
- The hero crop leaves a partial adult face at the edge on desktop and mobile, producing an accidental-looking crop.
- Defaulting to fibre makes the general `Tell us what you need` page appear fibre-specific before the user acts.

Evidence: [desktop](audit-current/08-enquire-desktop.png), [mobile](audit-current/08-enquire-mobile.png).

### 9. Help — strongest utility route

Strengths:

- Troubleshooting sequence is highly scannable.
- Support, payment, warning and escalation surfaces have distinct visual roles.
- Mobile CTAs are full width and easy to operate.

Findings:

- Help appears as a mobile-menu action and footer item but not in desktop primary navigation.
- `Back to home` is somewhat redundant beside the persistent header brand, though it is not harmful.
- The page mixes several surface treatments—navy band, bordered payment card, pink warning, blue support card—but retains reasonable clarity.

Evidence: [desktop](audit-current/09-help-desktop.png), [mobile](audit-current/09-help-mobile.png).

### 10. Privacy — healthy reading layout

Strengths:

- Desktop line length is controlled and mobile text reflows naturally.
- Headings make the long page easy to scan.
- No clipping or overflow was observed.

Findings:

- The footer is visually heavy relative to the narrow legal article.
- `Back to home` repeats an action already available through the header brand.

Evidence: [desktop](audit-current/10-privacy-desktop.png), [mobile](audit-current/10-privacy-mobile.png).

## Cross-site confirmed findings

### P0 — correct immediately

1. **Repair the mobile menu foreground/background model.** The translucent menu shows the live hero text and hero CTAs through and beneath its links. In the accepted screenshot, menu actions and page actions visually collide. Add an opaque-enough surface or scrim, prevent underlying page interaction while open, and keep the menu within a clear layer.

2. **Unify mobile header/menu geometry.** The menu starts 8px below the 68px header. Use one `--header-height` value for header height, menu inset and available height.

3. **Make every rendered form ID unique.** Prefix IDs and error/helper IDs by journey/form instance on Fibre.

4. **Make required and invalid states complete.** Add native `required` or `aria-required` as appropriate, and style invalid selects exactly as invalid inputs while retaining adjacent text errors.

### P1 — structural and conversion improvements

1. Replace the About value-grid padding bands with intentional section spacing/backgrounds.
2. Reduce Fibre to one active audience/form at a time; preserve deep links with proper `scroll-margin-top`.
3. Decide whether `/enquire` is the universal entry point. If yes, link it and simplify downstream CTAs; if no, remove it from public IA.
4. Establish one primary CTA per viewport. Home should not present three similar next steps at once.
5. Move the desktop WhatsApp control into a reserved safe area or collapse it to an icon so it never covers copy or list rows.
6. Consolidate `globals.css` and `canonical.css`; remove unused `.story-*`, `.offer-*`, `.chapter-*` and `.plan-*` systems.
7. Define three deliberate page templates: editorial service, centered utility, and support/legal.
8. Rebalance the footer by separating `Enquiries` from `Support`; reduce mobile footer length.
9. Use glass only for genuinely layered/transient surfaces. Long forms should use a stable opaque surface unless visual testing proves translucency improves hierarchy.

### P2 — polish

1. Normalize radius, spacing, elevation and motion tokens.
2. Raise desktop navigation from 12px to approximately 14–15px and reserve the strongest weight for active state.
3. Normalize sentence-case CTAs and British `enquiry` terminology.
4. Replace defensive coverage copy with a positive manual-confirmation promise.
5. Re-crop the Enquire hero image to remove the partial face at the edge.
6. Add a subtle pressed state to buttons without translating surrounding layout.
7. Add only factual trust content to About: assessment process, installation standards and support approach.

## Suggested implementation plan

### Phase 1 — interaction and accessibility blockers

- Mobile-menu surface, scrim, geometry, scroll locking and keyboard-close behavior.
- Form ID prefixing, required semantics, select error styling and error-focus verification.
- `scroll-margin-top` for every deep-link target.

Acceptance:

- Open menu is visually isolated from page content at 375, 768 and 1024px.
- Underlying controls cannot be clicked or focused while menu is open.
- No duplicate IDs or broken ARIA references on Fibre.
- Every invalid control has visible and programmatic error state.
- Deep-linked headings remain fully visible below the sticky header.

### Phase 2 — system cleanup

- Remove unused CSS and merge the canonical override layer.
- Create semantic tokens for type, spacing, radius, elevation, glass, z-index and header height.
- Refactor hero, form card, section heading and footer patterns.

Acceptance:

- One rule source per shared component.
- No competing 1050/1100 navigation breakpoints.
- Radius and spacing values come from the approved token scale.
- No route changes unexpectedly when another shared route is adjusted.

### Phase 3 — journey and copy simplification

- Choose the `/enquire` IA model.
- Show one Fibre audience journey/form at a time.
- Reduce home/contact action competition.
- Normalize terminology, title punctuation and CTA case.

Acceptance:

- One visually dominant next action per viewport.
- A user can identify the correct enquiry path without comparing more than three equal options.
- Fibre mobile journey is materially shorter than 9,031px in its default state.

### Phase 4 — visual verification

- Re-capture the ten routes at 1440, 1024, 768, 390 and 375px.
- Verify image crops, wrapping, footer balance, glass contrast, poster prominence and error states.
- Run 200% zoom and landscape-phone checks.

## Accessibility verification still required

Screenshots and DOM metrics cannot establish full accessibility compliance. The following remain separate follow-up work:

- VoiceOver and NVDA announcement quality, reading order and required-state wording.
- Full keyboard order, menu focus containment/return and route-change focus.
- 200%/400% zoom and text-only enlargement.
- Measured WCAG contrast for every text/surface and focus-state combination.
- Automated axe pass after duplicate IDs and ARIA relationships are corrected.
- Real-device touch testing and screen-reader error recovery.

