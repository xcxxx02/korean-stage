# Task 5 Report: Bilingual sequential vocabulary journey

## Scope delivered

- Added the eight-item Unit 3 occupation journey with one active word, ordered bilingual rail rows, non-color active cues, and Previous/Next word controls.
- Added beginner-first detail content: Korean, English, standard romanization, optional pronunciation guidance, bilingual examples, and a plain-English 이에요 / 예요 tip.
- Added explicit human-media components. Missing audio is disabled and labelled `Audio coming soon`; missing member video shows its development state, transcript, owner, and the four recording checks.
- Added native video controls, optional caption tracks, adjacent transcripts, and human-audio playback for supplied media only.
- Added Unit 2's eight bilingual country/nationality cards and flashcard entry, plus the approved Unit 3 learning composition.
- Routed `/learn/unit-2` and `/learn/unit-3` to the specialized unit body while preserving the existing Learn behavior for every other unit and unknown-route recovery.

## TDD red / green evidence

### Red

- Wrote `app/src/components/VocabularyJourney.test.tsx` before adding production components.
- First sandboxed attempt, `npm test -- src/components/VocabularyJourney.test.tsx`, was blocked before collection by the environment's `spawn EPERM` restriction on Vite's esbuild subprocess.
- Reran the same focused command with the permitted subprocess execution.
- Expected red: the suite failed while resolving the missing `../pages/UnitPage` module; zero tests collected because the required journey, unit, and media modules did not yet exist.

### Green

- `npm test -- src/components/VocabularyJourney.test.tsx`
  - PASS: 1 file, 7 tests.
- `npm test`
  - PASS: 8 files, 44 tests.
- `npm run typecheck`
  - PASS: `tsc --noEmit`, exit 0.
- `npm run lint`
  - PASS: `eslint .`, exit 0 with no warnings.
- `git diff --check`
  - PASS: no whitespace errors; Git emitted only line-ending conversion notices for two existing files.

## Files changed

- `app/src/components/HumanAudioButton.tsx`
- `app/src/components/MemberVideo.tsx`
- `app/src/components/LearningShell.tsx`
- `app/src/components/VocabularyJourney.tsx`
- `app/src/components/VocabularyJourney.test.tsx`
- `app/src/pages/UnitPage.tsx`
- `app/src/pages/VocabularyPage.tsx`
- `app/src/App.tsx`
- `.superpowers/sdd/2026-08-17-korean-stage-implementation/task-5-report.md`

## Commit

- `feat: add beginner vocabulary journey` (the Task 5 implementation commit)

## Self-review

- Verified all eight rail rows retain Korean, adjacent English, and their sequence number; the current row adds `aria-current="step"`, a filled marker, left active bar, and `Now learning`.
- Verified the journey does not offer speaker selection: the current word determines its assigned member, and only Previous/Next changes the active item.
- Verified exactly one `Next word` control is present and enabled on the first word; advancing marks the departing word complete through the existing progress action.
- Verified 학생 exposes `haksaeng` separately from `hak-ssaeng`, keeps its English meaning and translation nearby, and explains the consonant-ending 이에요 rule in plain English.
- Verified missing media never pretends to play or to be submission-ready, and no AI voice or generated speech path was added.
- Verified supplied video uses native controls and captions when available, while the transcript remains outside the video.
- Verified Unit 2 has eight bilingual cards plus the flashcard entry and Unit 3's visible heading is exactly `Unit 3 · Jobs & Occupations`.
- Mutation check: removing English rail meanings, the active non-color cues, the disabled audio state, any recording check, native controls/captions, sequencing transitions, progress write, either unit heading, or any Unit 2 card breaks a focused assertion.
- Reviewed the Task 5 diff against the scoped brief; no unrelated implementation files are included.

## Concerns

- The bundled course intentionally still contains development-missing member recordings. The UI reports those states honestly; real member audio, video, and caption assets remain required before submission readiness.
- Full screenshot comparison is intentionally left to the later visual-QA task; this task implements the approved responsive desktop hierarchy and accessible states without adding new decorative assets.

## Fix round 1

### Finding dispositions

1. **Media was trusted from `src` alone — fixed.** Audio and video now render/play only when the source is both non-null and `human-recording`. AI sources show a prohibited state and never create media elements. Inconsistent `development-missing` sources with a URL show an invalid-source state and never create media elements.
2. **The eighth occupation could not be completed — fixed.** The single forward action is `Next word` for items 1–7, becomes enabled `Finish vocabulary` on item 8, records the final item, then becomes disabled `Vocabulary complete`.
3. **Vocabulary completion overwrote the active Unit 3 route — fixed.** The completion action accepts an optional valid progress path and otherwise preserves the existing path. Unit 3 supplies `/learn/unit-3`, and Home continues there after an occupation is completed.
4. **`/vocabulary` duplicated the Unit 3 journey — fixed.** The route is now a search-free review containing explicit bilingual lists for all eight Unit 2 words and all eight Unit 3 words. The sequential journey remains under `/learn/unit-3`.
5. **The eight-row rail had no compact mobile form — fixed.** The full bilingual rail is `hidden` below the large breakpoint and `lg:grid` on desktop. Mobile gets a non-speaker bilingual selector plus an `aria-current="step"` summary of the current word.
6. **Feasible media and test-quality minors — fixed.** Supplied audio/video failures now show plain-English playback errors; video always retains its external transcript. Missing-recording checklist markers are neutral `Not yet reviewed` circles rather than green completed checks. Tests use literal approved Korean/English sequences instead of deriving expectations from mutable course data.

### TDD red / green evidence

- Human-only media cycle:
  - RED: 4 expected failures — neutral checklist state absent; AI and inconsistent development sources were enabled by `src`; video error had no learner-facing state.
  - GREEN: `npm test -- src/components/VocabularyJourney.test.tsx` passed 9/9.
- Final completion cycle:
  - RED: item 8 exposed only a disabled `Next word`; `Finish vocabulary` was absent.
  - GREEN: focused journey suite passed 10/10, including all eight literal completion IDs.
- Route-aware progress cycle:
  - RED: completion changed `lastPath` from `/learn/unit-3` to `/vocabulary`.
  - GREEN: journey plus hook suites passed 15/15, and Home's Continue link remained `/learn/unit-3`.
- Vocabulary review cycle:
  - RED: `/vocabulary` had no `Vocabulary review` heading or Unit 2 list because it mounted the Unit 3 journey.
  - GREEN: focused review test passed 1/1 with eight literal entries per unit and no search/searchbox/Next action.
- Responsive selector cycle:
  - RED: the full rail lacked `hidden lg:grid`, and the compact progress group did not exist.
  - GREEN: combined focused suites passed 17/17 with eight literal bilingual options and current-step updates.
- Audio playback-error minor cycle:
  - RED: dispatching an audio error produced no English error and left playback enabled.
  - GREEN: final combined focused suites passed 18/18.

### Final verification

- `npm test -- src/components/VocabularyJourney.test.tsx src/pages/VocabularyPage.test.tsx src/hooks/useCourseProgress.test.ts`
  - PASS: 3 files, 18 tests.
- `npm test`
  - PASS: 9 files, 51 tests.
- `npm run typecheck`
  - PASS: `tsc --noEmit`, exit 0.
- `npm run lint`
  - PASS: `eslint .`, exit 0 with no warnings.
- `git diff --check`
  - PASS: no whitespace errors; only line-ending conversion notices.

### Files changed

- `app/src/components/HumanAudioButton.tsx`
- `app/src/components/MemberVideo.tsx`
- `app/src/components/VocabularyJourney.tsx`
- `app/src/components/VocabularyJourney.test.tsx`
- `app/src/hooks/useCourseProgress.ts`
- `app/src/pages/UnitPage.tsx`
- `app/src/pages/VocabularyPage.tsx`
- `app/src/pages/VocabularyPage.test.tsx`
- `.superpowers/sdd/2026-08-17-korean-stage-implementation/task-5-report.md`

### Commit

- `fix: close vocabulary journey gaps` (the Task 5 fix-round commit)

### Self-review

- Verified no `<audio>` or `<video>` exists for AI or structurally inconsistent media and both controls remain unavailable.
- Verified development-missing null sources retain honest coming-soon guidance, a transcript, and four neutral human-review reminders.
- Verified playback failure states do not remove the written example, transcript, or external word navigation.
- Verified seven Next transitions plus the final Finish transition persist the exact ordered occupation IDs once each.
- Verified Unit 3 progress survives the independent parent/journey hook instances because every vocabulary write receives the route explicitly.
- Verified the review route contains 16 bilingual items with no search dependency and no speaker-first or sequential controls.
- Verified the mobile selector exposes Korean, English, order, and current-step semantics while the approved full rail remains desktop-only.
- Mutation check: allowing media by URL alone, disabling the final action, restoring the hardcoded `/vocabulary` path, removing either review list, exposing the full rail on mobile, removing bilingual options/current-step semantics, or restoring green checklist checks breaks a focused regression.
- Reviewed the complete fix diff against all five Important findings and feasible Minor findings; no unrelated files are included.

### Concerns

- Real human media and caption assets remain intentionally absent from the bundled course. The corrected states prevent prohibited or invalid sources from being mistaken for submission-ready recordings.

## Fix round 2

### Finding dispositions

1. **The compact selector could bypass the sequence and falsely complete Chef — fixed.** The journey now derives its first unfinished item from persisted progress. The compact selector keeps completed words available for backward review, exposes the first unfinished word, and disables every later option. An `initialItemId` is also clamped to that unlocked boundary, so direct initialization cannot bypass the sequence. The existing seven-Next-plus-Finish path still records all eight exact IDs before announcing completion, and exactly one primary forward action remains.
2. **Playback error state leaked into the next item — fixed.** `HumanAudioButton` and `MemberVideo` now receive keys composed from item ID, media kind, and source URL. Loading a different item/source remounts each media control, so a Student playback failure does not suppress Teacher audio or video. The external transcript, written example, and word navigation remain available throughout.

### TDD red / green evidence

- Sequential selector cycle:
  - RED: the Chef option was enabled for a new learner, so the compact selector could activate the final item without completing the first seven.
  - GREEN: `npm test -- src/components/VocabularyJourney.test.tsx` passed 14/14; Chef is disabled, selection stays on Student, Finish/complete are absent, Next remains the single enabled forward action, and stored completion remains empty.
- Media source-identity cycle:
  - RED: after Student audio and video emitted errors, Next loaded Teacher content but the Student audio error remained; the same persistent-state path also retained the video error.
  - GREEN: the focused journey suite passed 15/15; Teacher gets fresh human audio/video elements with the expected source URLs, its transcript is visible, error states are gone, and `Finish vocabulary` is the single forward action.

### Final verification

- `npm test -- src/components/VocabularyJourney.test.tsx`
  - PASS: 1 file, 15 tests.
- `npm test`
  - PASS: 9 files, 53 tests.
- `npm run typecheck`
  - PASS: `tsc --noEmit`, exit 0.
- `npm run lint`
  - PASS: `eslint .`, exit 0 with no warnings.
- `git diff --check`
  - PASS: no whitespace errors; only line-ending conversion notices.

### Files changed

- `app/src/components/VocabularyJourney.tsx`
- `app/src/components/VocabularyJourney.test.tsx`
- `.superpowers/sdd/2026-08-17-korean-stage-implementation/task-5-report.md`

### Commit

- `fix: enforce vocabulary journey state` (the Task 5 fix-round 2 commit)

### Self-review

- Verified a fresh learner can select only Student; after each Next transition the newly first-unfinished item becomes available while earlier items remain selectable for review.
- Verified seeded progress through Reporter unlocks Doctor and preserves the existing `initialItemId="doctor"` behavior without unlocking Singer through Chef.
- Verified selecting a disabled Chef option through user-level interaction cannot change the current item, expose Finish, mutate progress, or announce completion.
- Verified all-eight completion still requires the exact ordered IDs and only the final valid Finish transition produces the disabled `Vocabulary complete` state.
- Verified source-qualified keys include both item identity and media identity, so item changes and replacement source URLs both reset playback error state.
- Verified the journey-level recovery test exercises real audio/video elements and state transitions rather than component mocks.
- Mutation check: removing the unlocked-index cap enables Chef and breaks the false-completion regression; removing either media key leaves the corresponding Student error visible after Next.
- Reviewed the complete fix-round diff against both Important regressions; no unrelated implementation files are included.

### Concerns

- None blocking. Progress remains browser-local by design, and real member recordings/captions are still required before submission readiness.
