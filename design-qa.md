# Task 12 Final Design QA

Date: 2026-08-22

Reference: `docs/design/korean-stage-approved-ui.png`

Implemented comparison state: `/learn/unit-3`, word 1 of 8, 1440 x 1024
Combined evidence: `.superpowers/sdd/2026-08-17-korean-stage-implementation/task-12-browser/unit-3-word-1-source-build-comparison.png`

## Scope and result

This pass compared the approved Unit 3 learning screen with a fresh 1440 x 1024 browser capture, then inspected the full primary journey at 1440 x 1024, 834 x 1194, and 390 x 844. It also checked keyboard operation, real browser axe results, horizontal overflow, and application console/page errors.

Visual QA passes with no open P0, P1, or P2 issue. This is a design and implementation result only; the coursework is **not ready for submission** while identities and required human media remain missing.

## Fresh evidence

| Evidence | Purpose | Result |
|---|---|---|
| `task-12-browser/unit-3-word-1-source-build-comparison.png` | Approved source beside the fresh 1440 x 1024 build | Inspected; no P0-P2 mismatch |
| `task-12-browser/desktop-contact-sheet.png` | Ten primary-journey states at 1440 x 1024 | Inspected; coherent and unclipped |
| `task-12-browser/tablet-contact-sheet.png` | Ten primary-journey states at 834 x 1194 | Inspected; responsive stacking works |
| `task-12-browser/mobile-contact-sheet.png` | Ten primary-journey states at 390 x 844 | Inspected; readable reflow and reachable controls |
| `task-12-browser/results.json` | Exact route, axe, overflow, sequential-state, keyboard, and error evidence | Passed |

## Source-versus-build comparison

| Surface | Approved source | Fresh build | Assessment |
|---|---|---|---|
| Overall composition | White canvas, compact header, three-column lesson, strong lower controls | Same hierarchy and whitespace; media uses the truthful missing-recording state | Pass |
| Vocabulary sequence | Eight bilingual rail steps, current marker, progress | Eight bilingual steps, `Now learning`, and `Word 1 of 8`; all eight advanced sequentially | Pass |
| Learning detail | Korean/English, romanization, pronunciation, audio, example, grammar tip | All visible with the same reading order and semantic color roles | Pass |
| Palette and geometry | Cobalt, vermilion, jade, yellow; restrained 12 px surfaces | Existing Stage tokens and one-radius/one-border system preserved | Pass |
| Cultural detail | Dancheong strip and low-contrast architecture | Raster strip, palace corner art, and measured missing-video illustration remain secondary | Pass |
| Header state | Mockup shows Vocabulary active | Build correctly shows Learn active for `/learn/unit-3` | Intentional state difference |
| Media | Mockup demonstrates the final member selfie video | Build shows `Member video coming soon`, transcript, and recording checklist because real media is absent | Honest development difference; submission blocker |

## Findings by priority

### P0

None.

### P1

None.

### P2

1. **Resolved - Home and Unit 1 were visually inconsistent scaffolding.** The initial fresh contact sheets showed default text and links beside otherwise finished routes. Home now uses the approved Stage hierarchy, a clear start action, course overview, and responsive seven-unit map. Unit 1 now presents bilingual greeting/self-introduction models and a visible readiness panel. Focused tests moved from two expected failures to 23/23 passing, and the full browser audit passed again after recapture.

No P2 issue remains open.

### P3

1. The build uses the established Phosphor graduation-cap brand mark rather than the palace-shaped mark depicted in the mockup. Keep it until a separate approved wordmark asset is supplied; it does not affect comprehension or task completion.
2. The approved source includes final human video photography. The build must not imitate that state with synthetic or stock media; replacement depends on the enrolled members' real recordings.

## Primary journey health

| Step | State | Health |
|---:|---|---|
| 1 | Home and Start learning | Healthy |
| 2 | Unit 1 bilingual introduction | Healthy |
| 3 | Unit 2 countries and nationalities | Healthy |
| 4 | Unit 3 word 1 | Healthy; source comparison state |
| 5 | Unit 3 sequential progress through word 8 | Healthy; eight distinct ordered states |
| 6 | Unit 4 exercise and feedback | Healthy |
| 7 | Practice flashcard | Healthy |
| 8 | Practice grammar challenge | Healthy |
| 9 | Dialogue full-video development state | Healthy for development; media blocked for submission |
| 10 | Team submission-readiness report | Healthy; correctly reports not ready |

## Accessibility and responsive checks

- Real Chromium axe run on all 30 captured route/state checkpoints: 0 violations.
- Application console errors and uncaught page errors: 0 at all checkpoints.
- Document and body scroll widths equaled client widths at 1440, 834, and 390 px: no horizontal overflow.
- Keyboard checks passed for the initial skip link, compact menu open/Escape close, Start action, course-map navigation, all Unit 3 forward actions, Unit 4 answer, flashcard flip, challenge answer/focus handoff, dialogue selection, and primary navigation.
- Automated accessibility coverage also checks a single main landmark and level-one heading, skip link, no duplicate IDs, media labels, bilingual compact selectors, reduced motion, and route-specific headings.

## Evidence limits

- Axe and screenshots do not prove full WCAG conformance; the run establishes the tested states only.
- Real media captions, pronunciation, intonation, lighting, noise, acting, and uninterrupted flow cannot be audited until the user supplies final recordings.
- The P3 brand-mark difference is intentionally deferred; Task 12 does not invent a replacement asset.

final result: passed
