# Task 10 Design QA

**Source visual truth**

- `../docs/design/korean-stage-approved-ui.png`
- Source pixels: 1484 x 1060, RGB.
- State: Unit 3, word 1 of 8, desktop learning view.

**Rendered implementation evidence**

- Desktop screenshot: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-desktop.png`
- Mobile screenshot: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-mobile.png`
- Full comparison: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-comparison.png`
- Focused header comparison: `../.superpowers/sdd/2026-08-17-korean-stage-implementation/task-10-header-comparison.png`
- Route and state: `/learn/unit-3`, word 1 of 8, missing-member-video state.
- Desktop CSS viewport: 1480 x 1058 at devicePixelRatio 1. Browser capture pixels: 1479 x 1058. The implementation was normalized to 1484 x 1060 with Lanczos resampling for the equal-size comparison.
- Mobile CSS viewport: 390 x 844 at devicePixelRatio 1. Browser capture pixels: 375 x 811. Mobile is responsive evidence only because the selected source provides no mobile frame.

**Full-view comparison evidence**

- The final render preserves the source's white canvas, compact top navigation, high-contrast Korean/English hierarchy, three-column learning layout, cobalt primary emphasis, jade instructional accents, vermilion forward action, restrained borders, and lower-corner architectural detail.
- The supplied 16:9 recording-guide artwork replaces the source's real-video content only in the existing missing-recording state. Its subject, crop, and white background remain clear without competing with the word details or controls.
- Final desktop metrics show body 1480 x 1058 inside a 1480 x 1058 CSS viewport with no horizontal overflow. The Next word control ends at y=975.3 and remains fully visible.
- Mobile metrics show no horizontal overflow. The header collapses to a 44 px-plus menu control, the compact vocabulary selector remains readable, and the 333.6 x 187.65 image slot preserves 16:9.

**Focused comparison evidence**

- The header crop verifies the white surface, bold wordmark, evenly spaced navigation, cobalt active underline, and 12 px approved dancheong strip.
- The full comparison remains legible enough to inspect the rail labels, media-state heading/checklist, bilingual details, transcript, and navigation controls, so no additional focused content crop was necessary.

**Required fidelity surfaces**

- Fonts and typography: Noto Sans KR/Noto Sans variable fonts render both scripts consistently. Desktop heading, navigation, word hierarchy, body copy, and checklist weights are readable with no clipping or unintended wrapping after the title fix.
- Spacing and layout rhythm: 1440 px shell alignment, restrained 12 px radius, one-pixel borders, menu-only shadow, and lower-corner artwork follow the approved visual direction. Desktop controls remain above the fold; mobile content stacks without collisions.
- Colors and visual tokens: white, charcoal, cobalt, vermilion, yellow, jade, border gray, and focus blue are defined as Tailwind theme variables and shared CSS tokens. Contrast remains strong on controls and labels.
- Image quality and asset fidelity: all three approved assets load at their natural dimensions. The strip and palace retain transparency; the recording guide remains sharp at both desktop and mobile crops. No CSS illustration, handcrafted SVG, emoji, watermark, or placeholder art is used.
- Copy and content: existing Korean/English learning copy is unchanged. The missing-recording heading, description, checklist, transcript, and attribution remain visible and coherent.

**Comparison history**

1. Initial browser comparison found three P2 presentation issues: the programmatically focused heading showed a large native outline, the desktop title wrapped to two lines, and the 1087 px body clipped the bottom controls by 29 px at the 1058 px target viewport.
2. Fixes: suppressed outlines only for programmatically focused `tabindex="-1"` content, kept desktop learning headings on one line, and tightened the missing-video copy/checklist spacing.
3. Post-fix evidence: `task-10-desktop.png` and `task-10-comparison.png` show a single-line title, no stray focus rectangle, full controls, body height equal to viewport height, and no horizontal overflow.

**Findings**

- No actionable P0, P1, or P2 findings remain.
- Accepted product constraint: the source image depicts a completed human video and marks Vocabulary active, while the application route correctly marks Learn active and renders its approved missing-recording state. Changing either would alter existing navigation or content behavior outside Task 10.

**Open Questions**

- P3 follow-up only: the supplied asset set does not include the source's palace wordmark icon, so the shell uses the existing Phosphor icon family rather than inventing a cultural logo asset.

**Implementation Checklist**

- [x] Fix initial P2 focus, wrapping, and vertical-fit differences.
- [x] Verify desktop and mobile overflow.
- [x] Exercise menu open/Escape close and next/previous word controls.
- [x] Check browser console warnings and errors; none found.
- [x] Confirm all approved asset dimensions and rendered natural sizes.

**Follow-up Polish**

- If a separate approved brand mark is produced later, replace the standard icon without changing the shell geometry.

final result: passed
