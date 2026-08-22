# Task 12 Final Design QA

Date: 2026-08-22

Reference: `docs/design/korean-stage-approved-ui.png`

Implemented comparison state: `/learn/unit-3`, word 1 of 8, 1440 x 1024
Combined evidence: `.superpowers/sdd/2026-08-17-korean-stage-implementation/task-12-browser/unit-3-word-1-source-build-comparison.png`

## Scope and result

This pass compared the approved Unit 3 learning screen with a fresh 1440 x 1024 browser capture, then inspected the full primary journey at 1440 x 1024, 834 x 1194, and 390 x 844. It also checked the typed Unit 1 audio fallback, deliberate Unit 2/3/7 completion, real matching interactions in Unit 4 and Practice, honest dialogue-duration readiness, keyboard operation, real browser axe results, horizontal overflow, and application console/page errors.

Visual QA passes with no open P0, P1, or P2 issue. This is a design and implementation result only; the coursework is **not ready for submission** while identities and required human media remain missing.

## Fresh evidence

| Evidence | Purpose | Result |
|---|---|---|
| `task-12-browser/unit-3-word-1-source-build-comparison.png` | Approved source beside the fresh 1440 x 1024 build | Inspected; no P0-P2 mismatch |
| `task-12-browser/desktop-04-unit-2-complete.png`, `desktop-11-unit-7-complete.png` | Deliberate completion states at 1440 x 1024 | Inspected; existing Stage panels and status treatment remain coherent |
| Corresponding `tablet-*` and `mobile-*` captures | Completion reflow at 834 x 1194 and 390 x 844 | Inspected; controls and status remain readable and reachable |
| `task-12-browser/results.json` | Twelve primary-journey states per viewport; exact route, completion, axe, overflow, keyboard, and error evidence | Passed |

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
2. **Resolved - Unit 1 owner attribution had insufficient contrast.** The first review-fix Chromium run reported a serious axe color-contrast violation for `Presented by` on the cobalt-soft card. The browser acceptance run was the RED evidence; changing that label from the faint to the muted Stage token made the complete 30-checkpoint rerun GREEN with zero violations.
3. **Resolved - the seven-unit counter had no honest completion path for Units 2, 3, and 7.** Minimal Stage panels now require deliberate confirmation in Unit 2 and Unit 7, Unit 7 gates confirmation until both dialogues have been selected, and Unit 3 uses its existing item-8 Finish action. Fresh desktop/tablet/mobile captures show readable native-button and status states with no axe or overflow regression.

No P2 issue remains open.

### P3

1. The build uses the established Phosphor graduation-cap brand mark rather than the palace-shaped mark depicted in the mockup. Keep it until a separate approved wordmark asset is supplied; it does not affect comprehension or task completion.
2. The approved source includes final human video photography. The build must not imitate that state with synthetic or stock media; replacement depends on the enrolled members' real recordings.

## Primary journey health

| Step | State | Health |
|---:|---|---|
| 1 | Home and Start learning | Healthy |
| 2 | Unit 1 typed bilingual introduction and two disabled missing-audio fallbacks | Healthy for development; human audio still absent |
| 3 | Unit 2 countries and nationalities, then deliberate completion | Healthy; visit alone does not complete |
| 4 | Unit 3 word 1 | Healthy; source comparison state |
| 5 | Unit 3 sequential progress through word 8 and Finish | Healthy; eight distinct ordered states and completion persists |
| 6 | Unit 4 keyboard matching and feedback | Healthy |
| 7 | Practice flashcard | Healthy |
| 8 | Practice keyboard matching challenge and feedback | Healthy |
| 9 | Dialogue full-video development state | Healthy for development; media blocked for submission |
| 10 | Unit 7 review-both and deliberate completion | Healthy; overview exposes no completion action |
| 11 | Team submission-readiness report | Healthy; correctly reports not ready |

## Accessibility and responsive checks

- Real Chromium axe run on all 36 captured route/state checkpoints: 0 violations.
- Application console errors and uncaught page errors: 0 at all checkpoints.
- Document and body scroll widths equaled client widths at 1440, 834, and 390 px: no horizontal overflow.
- Keyboard checks passed for the initial skip link, compact menu open/Escape close, Start action, course-map navigation, Unit 2 confirmation, all Unit 3 forward/Finish actions, both Unit 4 matching selects/submission, flashcard flip, both Practice matching selects/submission/focus handoff, dialogue selection, Unit 7 confirmation, and primary navigation.
- Team readiness was checked to ensure missing dialogue videos never produce a misleading `Dialogue video durations — Passed` result; Intonation and Uninterrupted verbal flow were also present in the human-review list.
- Automated accessibility coverage also checks a single main landmark and level-one heading, skip link, no duplicate IDs, media labels, bilingual compact selectors, reduced motion, and route-specific headings.

## Evidence limits

- Axe and screenshots do not prove full WCAG conformance; the run establishes the tested states only.
- Real media captions, file durations, pronunciation, intonation, lighting, noise, acting, and uninterrupted flow cannot be audited until the user supplies final recordings. Development duration values are intentionally unknown rather than placeholder claims.
- The P3 brand-mark difference is intentionally deferred; Task 12 does not invent a replacement asset.

final result: passed
