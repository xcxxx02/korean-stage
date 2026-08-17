# Task 10 Design QA

## Source visual truth

- `../docs/design/korean-stage-approved-ui.png`
- Source pixels: 1484 x 1060, RGB.
- State: Unit 3, word 1 of 8, desktop learning view.

## Current rendered implementation evidence

- Fix-round-2 desktop screenshot: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-fix2-desktop-1480.png`
- Fix-round-2 source/history comparison: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-fix2-desktop-comparison.png`
- Fix-round-2 mobile comparison: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-fix2-mobile-comparison.png`
- Fix-round-2 focused-state comparison: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-fix2-focused-comparison.png`
- Fix-round-2 semantic-status evidence: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-fix2-team-statuses.png`
- Desktop screenshot: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-fix1-desktop-1480.png`
- Source/implementation comparison: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-fix1-comparison.png`
- Responsive comparison: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-fix1-responsive-sheet.png`
- Focus-state comparison: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-fix1-focus-sheet.png`
- Mobile full-page screenshot: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-fix1-mobile-390-full.png`
- Tablet/mobile menu focus: `task-10-fix1-tablet-menu-focus.png` and `task-10-fix1-mobile-menu-focus.png` in the same report directory.
- Practice focus: `task-10-fix1-practice-feedback-focus.png`, `task-10-fix1-practice-legend-focus.png`, and `task-10-fix1-practice-completion-focus.png` in the same report directory.
- Route and state: `/learn/unit-3`, word 1 of 8, missing-member-video state; `/practice`, answer feedback, next question, and completion states.
- Desktop CSS viewport and capture: 1480 x 1060 at devicePixelRatio 1. The 1484 x 1060 source and 1480 x 1060 implementation were placed together at natural scale with a 16 px divider; no density resampling was needed.
- Responsive CSS viewports and captures: 768, 900, 1024, 1100, and 1280 x 900 at devicePixelRatio 1.
- Mobile CSS viewport: 390 x 844 at devicePixelRatio 1. Full-page capture: 390 x 1683.
- Fix-round-2 captures use the same 1480 x 1060 desktop and 390 x 844 mobile CSS viewports at devicePixelRatio 1; the current mobile full-page image is 390 x 1683. A 768 x 900 tablet capture verifies the compact selector state.

## Full-view comparison evidence

- The final desktop render preserves the selected mockup's white canvas, compact shell, bilingual hierarchy, three-column learning layout, cobalt primary emphasis, jade instructional accents, vermilion forward action, restrained borders, and lower-corner architectural detail.
- The approved missing-recording artwork truthfully replaces the mockup's completed human video without introducing a generic placeholder. Its 16:9 subject, white background, and cultural linework remain crisp and do not compete with the learning controls.
- The source/implementation comparison shows consistent 12 px radii, one-pixel rules, no non-menu elevation, and a clean white/obangsaek surface system throughout the visible product.
- All breakpoint metrics report document, body, and header scroll widths equal to their client widths. Compact navigation remains active at 768, 900, 1024, and 1100 px; desktop navigation activates at 1280 px and remains clear at 1480 px.
- The 390 px full-page capture includes the stacked media, transcript, navigation controls, details, audio state, example, tip, and low-opacity palace artwork without clipping or horizontal overflow.

## Focused comparison evidence

- The responsive sheet makes the header, title wrapping, rail-to-compact-selector transition, media crop, detail rail, and controls readable across four representative widths. The standalone 900 px capture covers the fifth requested metric width.
- The focus sheet shows the open tablet menu's first link, Practice feedback, and Practice completion heading with visible cobalt focus indicators. Separate evidence confirms the next-question legend and the mobile menu link.
- Tablet and mobile menu links compute to a 3 px solid `rgb(7, 94, 229)` outline with `-3px` offset. Practice feedback, legend, and completion targets compute to the same 3 px outline with 3 px offset.

## Required fidelity surfaces

- Fonts and typography: Noto Sans KR/Noto Sans variable fonts render both scripts consistently. Heading, navigation, word hierarchy, body copy, and checklist weights remain clear. Intermediate content titles wrap naturally while the header remains unwrapped and collision-free.
- Spacing and layout rhythm: shell alignment, compact-to-desktop transitions, 12 px radii, one-pixel borders, menu-only shadow, and lower-corner artwork match the approved direction. No breakpoint clips or overlaps.
- Colors and visual tokens: every product surface now uses the Stage white/charcoal/cobalt/vermilion/yellow/jade semantic palette. Selected, success, warning, prohibited, disabled, and instructional states remain distinct and legible.
- Contrast: `stage-faint` now measures 4.93:1 on white and 4.67:1 on Stage soft; white on the vermilion primary control measures 4.62:1; `stage-border-strong` measures 3.25:1 on white and 3.08:1 on Stage soft. The yellow semantic boundary measures 3.36:1 and 3.18:1 on those surfaces. Audited cobalt, jade, prohibited, status, and disabled token pairings meet their applicable WCAG normal-text or non-text thresholds.
- Image quality and asset fidelity: all three approved assets remain sharp at their natural aspect ratios. The transparent strip and palace art integrate cleanly; no CSS illustration, handcrafted SVG, emoji, watermark, or placeholder art is used.
- Copy and content: existing Korean/English learning copy and behavior are unchanged. The missing-recording description, checklist, transcript, and attribution remain coherent.
- Accessibility and motion: keyboard focus is visible on compact-menu links and every Practice programmatic target. With `prefers-reduced-motion: reduce`, the flashcard computes transition and animation durations to `1e-05s` with one animation iteration. Browser console and page errors: none.

## Comparison history

1. Initial Task 10 comparison found P2 programmatic-focus, desktop-title wrapping, and vertical-fit issues. Those were fixed and the original baseline passed.
2. Fix round 1 source review found unsafe intermediate navigation activation, broad focus suppression, and generic product-surface styling. The implementation moved desktop navigation to 1120 px, restored explicit focus, and migrated all product surfaces to Stage tokens and approved geometry.
3. First fix-round render found one P2 layout issue: the compact trigger remained centered between the brand and an empty navigation element while its menu panel was right-aligned. The trigger was visually detached from the opened panel.
4. Fix: added a contract for automatic left margin on the compact trigger and applied `margin-left: auto`. Post-fix captures show the trigger aligned at the header's right edge across 390-1100 px, with the menu panel immediately below it.
5. Post-fix Playwright run passed every responsive, keyboard-focus, reduced-motion, overflow, and console assertion. The final side-by-side review found no remaining P0/P1/P2 issue.
6. Fix round 2 measured the semantic token pairs and found four contract failures: faint text, white text on vermilion, strong borders, and yellow boundaries. The four targeted token adjustments bring each pairing over its applicable threshold.
7. The current desktop, mobile, primary-control, compact-selector, Practice-focus, and team-status captures were compared together with the approved source and fix-round-1 renders. The stronger colors remain vivid and restrained; they do not make the white interface muddy or visually heavy. No new P0/P1/P2 issue was introduced.
8. Fix round 3 is test-only contract hardening. It broadens detection of Tailwind custom-property colors, multi-segment shadows, and JSX inline surface shorthands while explicitly locking menu elevation to `.mobile-navigation`. No production visual value or component changed, so the fix-round-2 rendered comparisons remain current and no screenshot recapture was required.
9. Fix round 4 corrects that test-only elevation check: CSS rule bodies are now extracted before evaluating shadows, so a declaration in a later unrelated rule cannot satisfy the `.mobile-navigation` contract. Production visuals remain unchanged and the fix-round-2 captures remain current.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Accepted product constraint: the source depicts a completed human video and marks Vocabulary active, while the application correctly marks Learn active and renders its approved missing-recording state. Changing either would alter existing navigation or content behavior outside Task 10.

## Open questions

- None.

## Implementation checklist

- [x] Keep compact navigation through 1100 px and verify desktop navigation at 1280/1480 px.
- [x] Align the compact trigger with its right-anchored panel.
- [x] Preserve visible keyboard focus on the open menu and Practice programmatic transitions.
- [x] Apply Stage semantic tokens and approved surface geometry throughout the product.
- [x] Verify desktop, intermediate, mobile full-page, reduced-motion, and console states.
- [x] Compare the rendered desktop and focused regions with the source visual.
- [x] Measure meaningful text and component-boundary token pairings against WCAG thresholds.
- [x] Re-capture and compare the higher-contrast vermilion control, compact boundary, Practice legend, and semantic status surfaces.
- [x] Protect the approved palette, geometry, and menu-only elevation from additional Tailwind v4 and inline-style escape forms.

## Follow-up polish

- P3 only: replace the standard icon if a separate approved palace wordmark asset is supplied later.

final result: passed
