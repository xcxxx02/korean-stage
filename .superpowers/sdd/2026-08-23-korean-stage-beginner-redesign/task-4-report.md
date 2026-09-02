# Task 4 Report — Free Vocabulary Selection and Sequential Guidance

## Status

Complete. Task 4 now matches the approved beginner-first Learn experience and the binding media-test preservation ruling.

## Implementation summary

- Rebuilt `VocabularyJourney` around one component-local `activeIndex`.
- Removed progress hydration, unlocking, completion writes, unit completion, finish actions, initial-item routing, and persistence-path behavior.
- Replaced the locked rail and mobile select with one responsive ordered list of eight bilingual buttons. Every button is directly selectable and named `${index}. ${korean}, ${english}`.
- Kept Previous word and Next word controls for sequential guidance. They stay within bounds and never complete or persist a word.
- Resolves the presenter from each vocabulary item's assigned `ownerId`; the learner never chooses a speaker.
- Removed `HumanAudioButton` from the vocabulary learner flow. Member video is the only pronunciation playback surface.
- Shows Korean, English, romanization, a separately labelled `Say it like` hint, bilingual examples, and a plain-English grammar tip. Korean learning text carries `lang="ko"` and English examples carry `lang="en"`.
- Added an explicit `MemberVideo` learner mode. Missing learner video is a compact `Member video coming soon` alert with no player controls, no contributor checklist, and no decorative recording-readiness panel.
- Preserved native human-video controls, captions, adjacent transcript behavior, AI-media rejection, malformed-source rejection, and playback-error fallbacks.
- Keyed `MemberVideo` playback errors to the current source so changing to another valid human video clears the previous error state.
- Changed the nested `LearningShell` heading from `h1` to `h2`, leaving Learn's lesson heading as the only page-level heading.
- Updated the legacy `UnitPage` caller to stop passing the removed persistence prop.
- Updated responsive and accessibility contracts to exercise free bilingual buttons, keyboard-only later-word selection, no separate learner audio control, the All lessons empty-state recovery path, and the existing menu-only elevation rule.

## Binding Ruling 1

Before rewriting the mixed `VocabularyJourney.test.tsx`, the HumanAudioButton and MemberVideo contracts were moved into:

- `app/src/components/HumanAudioButton.test.tsx`
- `app/src/components/MemberVideo.test.tsx`

The focused media suites cover:

- honest missing audio;
- AI-generated audio prohibition;
- malformed missing-audio source rejection;
- native audio playback errors and rejected play promises;
- audio recovery when the source changes;
- contributor checklist availability outside learner mode;
- AI-generated video prohibition;
- malformed missing-video source rejection;
- native video controls;
- caption tracks;
- adjacent transcripts;
- video playback fallback; and
- video recovery when the source changes.

The extraction initially exposed a real MemberVideo regression: a playback error remained active after the source changed. The focused test failed for that reason, then passed after the source-keyed error-state fix.

## TDD evidence

### Red

`npm test -- src/components/VocabularyJourney.test.tsx src/accessibility.test.tsx`

- 12 expected failures.
- All eight new vocabulary learner-contract tests failed against the old locked/persisted/audio/completion implementation.
- The four staged accessibility failures mapped to duplicate vocabulary `h1` headings, the obsolete separate audio control, and non-interactive locked rail items.

### Green — focused Task 4 matrix

`npm test -- src/components/VocabularyJourney.test.tsx src/components/HumanAudioButton.test.tsx src/components/MemberVideo.test.tsx src/accessibility.test.tsx src/content/validateCourse.test.ts`

- 5 test files passed.
- 62 tests passed.
- Course validation still rejects prohibited or incomplete final media.

### Responsive and visual contracts

`npm test -- src/responsive-contract.test.tsx src/visualSystem.test.ts`

- 2 test files passed.
- 17 tests passed.
- The responsive horizontal button rail and menu-only elevation contract are both preserved.

## Final verification

`npm test`

- 25 test files passed.
- 185 tests passed.
- 0 failures.

`npm run typecheck`

- Passed with exit code 0.

`git diff --check`

- Passed; only Git line-ending notices were emitted during other read-only diff commands.

## Files changed

- `app/src/components/VocabularyJourney.tsx`
- `app/src/components/VocabularyJourney.test.tsx`
- `app/src/components/HumanAudioButton.test.tsx`
- `app/src/components/MemberVideo.tsx`
- `app/src/components/MemberVideo.test.tsx`
- `app/src/components/LearningShell.tsx`
- `app/src/pages/UnitPage.tsx`
- `app/src/accessibility.test.tsx`
- `app/src/responsive-contract.test.tsx`
- `app/src/styles.css`
- `.superpowers/sdd/2026-08-23-korean-stage-beginner-redesign/task-4-report.md`

## Concerns and follow-up

- The development course still intentionally uses missing placeholder vocabulary videos. The learner UI reports this honestly; real member recordings and captions remain a group-supplied content dependency.
- Words without a dedicated pronunciation hint use an explicit `Try: ${romanization}` fallback so the Romanization and Say it like layers remain separately labelled. Final pronunciation review remains a human coursework responsibility.
- The unrelated untracked `docs/audit/` directory was present before Task 4 and was not inspected, modified, staged, or committed.

## Commit

Commit message: `feat: make vocabulary selection beginner friendly`

## Review fix — reload native video when the word source changes

The Task 4 review identified that React could reuse the same native `<video>` element while changing only its nested `<source src>`. Browsers do not reliably reload or restart an existing media element when the child source is replaced this way.

### Behavioral regression test

Added `remounts the native video when a different human source is supplied` to `MemberVideo.test.tsx`. The test renders one human-recorded source, retains the actual native video DOM node, rerenders with another member's human source, and verifies that:

- the next native video is a different DOM element;
- the original video has been removed from the document; and
- the replacement video is connected to the document.

This is a lifecycle assertion rather than a nested source-attribute assertion. Removing the source key causes the test to fail even if the new `<source src>` text appears in the DOM.

### Red evidence

`npm test -- src/components/MemberVideo.test.tsx`

- 1 expected failure: the second render returned the exact same `<video>` object.
- 5 existing MemberVideo safety tests still passed.

### Implementation

The native `<video>` now uses the existing `sourceKey` as its React key. A different media kind, URL, presenter, or accessible label mounts a fresh video element, which gives the browser a new media lifecycle. Existing source-keyed playback-error recovery, native controls, captions, transcript behavior, missing-media handling, malformed-source rejection, and AI-video prohibition are unchanged.

### Review-fix verification

`npm test -- src/components/MemberVideo.test.tsx src/components/VocabularyJourney.test.tsx`

- 2 test files passed.
- 14 tests passed.

`npm test`

- 25 test files passed.
- 186 tests passed.
- 0 failures.

`npm run typecheck`

- Passed with exit code 0.

### Review-fix commit

Commit message: `fix: remount member video on source change`

This report is stored in that follow-up commit; its exact hash is recorded in the Task 4 handoff.
