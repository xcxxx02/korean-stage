# Task 11 report: accessibility, mobile, and reduced motion

## Scope

- Added axe-core default-state coverage for Home, Unit 3, Unit 4, Practice, Dialogue, and Team.
- Locked one `main`, one `h1`, a skip link, unique IDs, named transcript media, live feedback, and keyboard-complete primary flows.
- Kept the compact vocabulary selector bilingual at mobile width and added actionable English empty/media fallback instructions.
- Enforced 44px button/select touch targets, non-color selection cues, and transform-free reduced-motion flashcards without changing the approved Stage palette or surface system.

## TDD evidence

### Red

Initial command:

`npm test -- src/accessibility.test.tsx src/responsive-contract.test.tsx`

Result: exit 1; 4 expected failures. The transcript figure had no accessible name, unavailable audio was not a live/actionable status, buttons/selectors had no shared 44px minimum, and reduced-motion CSS left the flashcard transform in place.

The proportional browser run then exposed an additional initial-focus bug. A new test, run with:

`npm test -- src/accessibility.test.tsx -t "keeps the skip link"`

failed because the initial page `h1` held focus instead of `body`, so the first Tab bypassed the skip link.

The first sandboxed Vitest/Sites attempts stopped at `spawn EPERM`; those infrastructure failures were rerun with the required subprocess approval and are not counted as RED behavior evidence.

### Green

- Focused accessibility/responsive suite: exit 0; 2 files passed, 13 tests passed.
- After the browser-found focus fix, accessibility plus AppShell: exit 0; 2 files passed, 16 tests passed.
- Affected media compatibility suites: exit 0; 4 files passed, 38 tests passed.

## Production fixes

- `AppShell` preserves the skip link as the first initial keyboard stop, while a new router location still focuses its destination `h1`.
- `MemberVideo` gives its transcript figure a distinct accessible name without duplicating the native video label.
- `HumanAudioButton` exposes unavailable media as a status and pairs every fallback with an English next step.
- Vocabulary and flashcard empty states tell beginners to return to the course map and choose another unit.
- Flashcard faces share a reduced-motion hook that removes both transitions and 3D transforms.
- All buttons and selectors have a 2.75rem minimum height.

## Verification

- `npm test` — exit 0; 20 files passed, 134 tests passed.
- `npm run typecheck` — exit 0.
- `npm run lint` — exit 0 with no warnings.
- `npm run build` — exit 0; Vite production build and Sites packaging completed.
- `npm run test:sites` — exit 0; 4 tests passed.
- `git diff --check` — exit 0; only Git line-ending conversion notices.
- No dependency or lockfile change: `axe-core` was already present.

## Browser QA

The in-app browser connected but blocked localhost navigation, so the already-approved local Playwright CLI 1.62.1 fallback was used at 390×844 with reduced motion enabled.

All 16 checks passed: Home landmark/heading count; skip-link first focus and target focus; Enter/Escape menu control; eight bilingual mobile selector options; no Unit 3 horizontal overflow; 44px visible button/select sizing; keyboard word navigation; Space/Enter grammar completion with announced feedback; Space flashcard flip; computed `transform: none` and `transition-duration: 0s`; keyboard dialogue selection; and visible `Selected dialogue` non-color feedback.

## Files

- `app/src/accessibility.test.tsx`
- `app/src/responsive-contract.test.tsx`
- `app/src/components/AppShell.tsx`
- `app/src/components/FlashcardDeck.tsx`
- `app/src/components/HumanAudioButton.tsx`
- `app/src/components/MemberVideo.tsx`
- `app/src/components/VocabularyJourney.tsx`
- `app/src/styles.css`
- `.superpowers/sdd/2026-08-17-korean-stage-implementation/task-11-report.md`

## Commit

Included in the Task 11 commit with message `fix: complete accessibility and responsive behavior`; the exact SHA is recorded in the handoff because a commit cannot contain its own final SHA.

## Self-review

- The six-route axe checks use real pages inside the real shell and separately assert structural contracts axe does not cover.
- Color contrast is disabled only in jsdom axe because jsdom has no layout/canvas implementation; the existing token contrast suite remains green, and browser QA checks real computed layout and motion.
- Keyboard tests use native controls and `user-event` Space/Enter input; the browser run independently verifies the same flows in Chromium.
- The media group and nested video have distinct names, avoiding ambiguous accessible labels while keeping transcripts discoverable.
- The skip-link fix keys focus restoration to router locations, so React development effect replay cannot recreate initial autofocus.
- Mutation check: removing the route guard, English selector meanings, status role/instructions, minimum height, or either reduced-motion declaration fails a focused test.
- Diff review found no palette, radius, elevation, dependency, lockfile, generated asset, or unrelated production change.

## Concerns

- None blocking. Media in the course data remains intentionally unavailable until team members add real human recordings; the UI now announces that state and gives a written fallback.
