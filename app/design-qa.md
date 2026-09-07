# Vocabulary Lesson 3 Design QA

## Scope

- Route: `/vocabulary/lesson-3`, word 1 of 8.
- Approved reference: `C:/Users/Nitro/AppData/Local/Temp/codex-clipboard-d54622ef-c3ff-4a77-b2b6-7eaf12ed655c.png`.
- Browser capture: `design-qa-assets/vocabulary-lesson-3-fullpage.png`.
- Side-by-side comparison: `design-qa-assets/approved-vs-vocabulary-lesson-3.png`.
- Comparison viewport: 1488 × 1058 CSS pixels at DPR 1. The supplied reference is 1487 × 1058 pixels; the one-pixel width difference is preserved rather than stretched.

## Fidelity review

- Structure: passed. The implementation matches the approved framed canvas, single eight-word rail, center learning details, right circular member video, separate audio player, and bottom Previous/Next controls.
- Spacing: passed. The measured desktop tracks are 276 px, 440 px, and 408 px with a 96.72 px gap. The details and media columns now sit within 10 px of the approved reference positions.
- Above-the-fold fit: passed. At 1488 × 1058, document height equals viewport height (1058 px) and horizontal overflow is 0. At the user's shorter 1536 × 720 browser window, all eight words and both navigation buttons remain visible without page scrolling.
- Typography and bilingual clarity: passed. Every rail item shows Korean and English. The selected word exposes Korean, English meaning, romanization, an English pronunciation cue, example, and grammar tip.
- Color and cultural styling: passed. Cobalt, jade, vermilion, and yellow accents are retained, with the Korean palace/Seoul line art visible as a low-contrast background rather than competing with the lesson.
- Interaction: passed. Direct word selection and sequential Next word navigation update the progress count and learning content. Previous word is correctly disabled on the first item.
- Accessibility/runtime: passed. The current-word state is announced without adding a visible layout row; controls retain accessible names and 44 px minimum targets. Browser console reported zero errors.

## Accepted content differences

- The approved mock contains a finished team-member portrait and recorded audio. Those files have not been supplied, so the implementation intentionally shows the existing circular recording placeholder, disabled playback controls, and `Audio coming soon` rather than pretending media exists.
- The last English label remains `Chef`, matching the user's chosen course wording, although the visual reference says `Cook`.

## Verification

- `npm test -- --run`: 24 files, 221 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; 4608 modules transformed.
- Focused final regression: 2 files, 25 tests passed.

final result: passed
