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
