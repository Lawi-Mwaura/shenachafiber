# Shenacha design QA

## Comparison target

- Source visual truth: `ui.md` and accepted screenshots in `qa/audit-current/`.
- Rendered implementation: production Next.js build captured in `qa/audit-implemented/`.
- Browser: headless Google Chrome through the repository's Playwright setup.
- Viewports: 1440×1000, 1024×768, 768×1024, 390×844, and 375×812 CSS pixels.
- Device scale factor: 1. Source and implementation captures were compared at matching CSS widths and 1× density.
- States: default routes, mobile navigation open, Fibre resident/property deep links, general-enquiry progressive disclosure, Coverage errors, and CCTV errors.

## Full-view comparison evidence

- Home desktop: `qa/audit-current/01-home-desktop.png` (1440×4361) compared with `qa/audit-implemented/01-home-desktop.png` (1440×4089). The visual identity, typography, photography, grid, and editorial section rhythm remain intact; the shorter implementation reflects the lighter footer and simplified actions.
- About desktop: `qa/audit-current/02-about-desktop.png` compared with `qa/audit-implemented/02-about-desktop.png`. The empty grey bands were replaced by three deliberate value cards and a new assessment-to-confirmation process section.
- All ten routes: source captures in `qa/audit-current/` compared with final captures of the same routes and viewport in `qa/audit-implemented/`.
- Coverage mobile: `qa/audit-current/06-coverage-mobile.png` compared with `qa/audit-implemented/06-coverage-mobile.png`. The form now precedes the poster without losing or cropping the poster.
- Contact mobile: `qa/audit-current/07-contact-mobile.png` compared with `qa/audit-implemented/07-contact-mobile.png`. One guided enquiry is dominant and direct routes are reduced to three.
- Enquire desktop/mobile: source and implementation `08-enquire-*` captures show the editorial treatment replacing the rounded glass card and no enquiry journey selected before user action.

## Focused-region comparison evidence

- Mobile menu: `qa/audit-current/11-home-mobile-menu.png` and `qa/audit-implemented/11-home-mobile-menu.png`, both 375×812. The final menu starts exactly at the 68px header edge, uses an opaque surface, and has a visible 58% navy scrim over the underlying page.
- Coverage errors: `qa/audit-current/12-coverage-mobile-error-viewport.png` and `qa/audit-implemented/12-coverage-mobile-error-viewport.png`, both 375×812. The final summary is shorter, receives focus, keeps adjacent detailed errors, and uses matching invalid-control styling.
- CCTV errors: `qa/audit-implemented/13-cctv-mobile-error-viewport.png`. Invalid input and select colors both resolve to border `rgb(165, 29, 39)` and background `rgb(255, 248, 248)`.
- Fibre journeys: `qa/audit-implemented/03-resident-fibre-internet-*.png`, `03-property-fibre-internet-*.png`, and `03-deeplink-*.png`. Only one form is rendered at a time and both external deep links place their panel at 92px, below the 68px sticky header.

## Required fidelity surfaces

- Fonts and typography: existing Manrope display and DM Sans body families are preserved with the same weight hierarchy, responsive scale, wrapping, and antialiasing. No actionable drift remains.
- Spacing and layout rhythm: the editorial grid and generous whitespace remain. Grey placeholder-like bands, competing action clusters, oversized footer weight, and obstructed deep links were corrected.
- Colors and visual tokens: the existing navy/red palette is preserved. Semantic surface, focus, error, z-index, header-height, and control-radius tokens now drive the interaction layer.
- Image quality and asset fidelity: all supplied photographs and the official fibre-ready poster remain source assets with responsive, uncropped rendering. No placeholder, CSS-drawn, emoji, or approximate assets were introduced.
- Copy and content: sentence-case actions, positive coverage language, clearer Kenya service-area language, and consistent “enquiry” terminology are used. Help and Privacy no longer duplicate the persistent home action.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial implementation capture was blocked because the configured browser surfaces were unavailable. With user approval, the repository Playwright workflow was used.
2. First visual comparison found two P2 issues: the menu scrim was not visibly covering content below the menu, and deferred paint left the reordered Coverage poster blank in a full-page capture. The scrim was moved to a full-height layer beneath the menu, and deferred paint was disabled for the reordered Coverage poster. Post-fix evidence is in the final menu and Coverage captures above.
3. Interaction verification found a P1 deep-link issue: the correct Fibre journey selected after hydration, but the newly rendered target did not scroll below the sticky header. A post-render scroll was added. Final measurements are 92.48px target top versus 68px header bottom for both resident and property paths.

## Automated verification

- Production build passed.
- TypeScript passed as part of the production build.
- 24 automated tests passed.
- All ten routes passed at 375, 390, 768, 1024, and 1440px with no horizontal overflow or duplicate IDs.
- Menu isolation, scroll locking, visible scrim, Escape close, scrim close, and focus return passed at 375, 768, and 1024px.
- General enquiry progressive disclosure passed.
- Error-summary focus and invalid input/select parity passed.
- Reduced-motion behavior passed.
- Browser console and page-error check passed with no errors.

## Follow-up polish

No blocking polish remains. Manual VoiceOver/NVDA announcement quality and real-device touch testing remain appropriate pre-launch checks because browser automation cannot establish those device-level behaviors.

final result: passed
