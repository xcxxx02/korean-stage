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

## Fix round 1

### Reviewer dispositions

- **Important 1 — static audio status spam: resolved.** Static missing, prohibited, and invalid audio guidance remains visible but no longer uses `role="status"`; only a runtime playback failure creates a live status.
- **Important 2 — real selected-dialogue contrast: resolved.** The selected dialogue index no longer uses reduced opacity. Chromium measured effective contrast at 17.57:1 for the index and 5.21:1 for the selected badge, and axe's color-contrast rule passed the selected state.
- **Important 3 — route and landmark coverage: resolved.** Axe now covers every primary route derived from the route manifest, plus representative Unit 2, Unit 3, Unit 4, Unit 7, and fallback routes. `GrammarPage` uses a section inside `AppShell` instead of nesting a second `main`.
- **Important 4 — persistent navigation targets: resolved.** The site brand and desktop/mobile navigation links share a 2.75rem minimum height. Chromium at 390×844 confirmed the visible site brand, mobile navigation links, buttons, and selects were at least 44×44 CSS pixels.
- **Important 5 — reduced-motion grammar lift: resolved.** Grammar links carry the `grammar-card` hook, and the reduced-motion rule removes their transition and transform as it already does for both flashcard faces. Chromium computed `transform: none` and `transition-duration: 0s` for grammar and flipped-flashcard states.
- **Minor — Team empty-state next actions: resolved.** Missing vocabulary now tells editors to assign 3–5 words; missing participation tells them to add the member to a dialogue.
- **Minor — genuine keyboard paths: resolved.** Tests and Chromium use sequential Tab presses rather than programmatic focus for menu navigation, vocabulary advance, grammar answer/submit, flashcard flip, and dialogue selection.

### TDD and regression evidence

- The prior fix-round agent recorded a focused RED run with exit 1 and 11 expected failures covering the reviewer findings, followed by 51/51 focused GREEN tests. This takeover preserved that evidence and did not manufacture another RED cycle for already-implemented behavior.
- Fresh takeover verification exposed one separate test-code compile defect: `npm run typecheck` failed because literal route-manifest entries were accessed without narrowing. The minimal `in`-operator guard fix made typecheck pass while preserving manifest-derived route coverage; the focused suite then remained 51/51 GREEN.

### Browser QA

- The temporary local Playwright 1.62.1 runner completed 26 check groups at 390×844 with reduced motion enabled, then was deleted with its local server; no QA artifacts remain.
- Axe-core 4.13.0 ran with `color-contrast` enabled on all seven primary routes and on Unit 3 word 2, Unit 4 after a correct answer, Practice after a keyboard flip, and Dialogue after keyboard-selecting dialogue 2. All 11 scans reported zero violations.
- Browser checks also passed one-main/one-h1 structure, no Unit 3 horizontal overflow, first-Tab skip-link focus, client-route h1 focus, real Tab sequences, 44px targets, effective selected-state contrast, and computed reduced-motion styles.

### Fresh full verification

- `npm test -- src/accessibility.test.tsx src/responsive-contract.test.tsx src/components/DialoguePlayer.test.tsx src/components/TeamGrid.test.tsx src/components/VocabularyJourney.test.tsx` — exit 0; 5 files, 51 tests passed.
- `npm test` — exit 0; 20 files, 142 tests passed.
- `npm run typecheck` — exit 0.
- `npm run lint` — exit 0 with no warnings.
- `npm run build` — exit 0; Vite production build and Sites packaging completed.
- `npm run test:sites` — exit 0; 4/4 tests passed.
- `git diff --check` — exit 0; only Git line-ending conversion notices.

### Exact implementation commit

`aecc251c4907d70681305d97db8410a1665e16a8` (`fix: resolve task 11 accessibility review`)

No blocking concerns remain. The intentionally unavailable course recordings still require real team-member media; this fix changes only how those static and runtime states are communicated.
