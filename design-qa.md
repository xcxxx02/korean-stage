# Restored Vocabulary Visual QA

Date: 2026-08-23

Reference: `docs/design/korean-stage-approved-ui.png`

Implemented state: `/learn/unit-3`, word 1 of 8, 1440 x 1024

Combined evidence: `docs/design/vocabulary-side-by-side.png`

Latest compact evidence: `docs/design/implementation-vocab-compact.png`

## Result

The restored screen matches the approved visual direction: a white canvas, vivid cobalt/vermilion/jade/yellow accents, palace-gate brand mark, segmented Korean pattern band, subtle palace and Namsan line art, ordered bilingual vocabulary rail, central member-video area, detailed learning panel, word progress, and previous/next controls.

The central panel deliberately shows an honest `Member video coming soon` state instead of copying the mockup's synthetic person. It is ready to accept the required real team-member selfie recording later.

## Comparison findings

| Surface | Assessment |
|---|---|
| Header and cultural identity | Pass. Palace logo and vivid segmented obangsaek band now match the approved direction. |
| Background | Pass. Low-contrast palace line art anchors the lower left; Namsan Tower and clouds anchor the lower right. |
| Vocabulary sequence | Pass. All eight words have Korean and English labels, with an obvious `Now learning` state. |
| Central media | Pass with intentional content difference. Layout follows the reference while truthfully marking the real recording as missing. |
| Learning details | Pass. Korean, English, romanization, pronunciation, audio state, example, translation, and grammar tip are present. |
| Progress and controls | Pass. Eight semantic markers are shown and Next/Previous advances the ordered sequence. |
| Navigation state | Pass. `/learn/unit-3` correctly highlights Vocabulary. |

## Responsive and interaction checks

- 1440 x 1024: three-column composition fits without page overflow; lower controls remain visible.
- 834 x 1194: no horizontal overflow; vocabulary rail becomes a compact bilingual selector.
- 390 x 844: no horizontal overflow; mobile header, progress, selector, video state, and detail flow remain readable.
- Primary interaction: Next word changed the active semantic marker from Word 1 to Word 2; Previous word returned to Word 1.
- Compact desktop fit: the video panel is height-limited, the new conversation-use prompt remains visible, and Next word ends at 759 px in a 1536 x 780 viewport, so it is clickable without scrolling.
- Progress treatment: the generic long line is replaced by a contained vocabulary-path panel with eight numbered nodes, Korean cloud motifs, and cobalt/jade/vermilion/yellow progression cues.
- Automated verification: 182 tests passed; TypeScript and ESLint passed; production build passed.

## Open limitation

Real member video and audio are still required by the coursework. The interface does not pretend those submission assets exist.

final result: passed
