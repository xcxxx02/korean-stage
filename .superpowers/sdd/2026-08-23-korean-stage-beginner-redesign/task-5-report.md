# Task 5 Report — Lesson-Grouped Practice

## Status

Complete. Practice is now a lesson-grouped quiz index for Lessons 2–6, every assessed vocabulary and grammar question is available there, and the optional mixed quiz is separated behind an explicit card.

## Implementation summary

- Added a typed `PracticeGroup` catalog derived from the public course catalog and existing Lec 1 content.
- Added Lesson 2 and Lesson 3 vocabulary quizzes with eight derived English-meaning questions each.
- Reused the existing grammar exercise arrays for Lessons 4–6, preserving exactly three required exercises per grammar point.
- Replaced the flashcard-first/final-grammar-challenge Practice page with five lesson cards using the exact public lesson titles.
- Added an explicit optional `Mixed Lec 1 quiz` after the lesson groups. It contains all 25 assessed questions but does not replace any lesson quiz.
- Consumed the existing `?lesson=lesson-N` GrammarGuide query and opened the matching Practice group when it exists. Unsupported lesson queries return to the index.
- Added a sequential `quiz` mode to `ExerciseEngine` while preserving its existing default all-exercises mode for staged legacy callers.
- Kept answer selection, submitted results, question phase, score, and retry state inside React component memory. The new Practice/catalog/engine production files contain no storage or progress-store references.
- Preserved native radio and matching controls, complete-answer gating, English feedback, incorrect-answer retry, and keyboard focus movement to feedback, retry controls, the next question, and quiz completion.
- Updated the shared accessibility route matrix from the retired `Final practice` heading to the approved `Practice by lesson` heading.

## Catalog contract

| Public lesson | Exact title | Question source | Count |
|---|---|---|---:|
| `lesson-2` | Countries & Nationalities | Derived vocabulary meaning choices | 8 |
| `lesson-3` | Jobs & Occupations | Derived vocabulary meaning choices | 8 |
| `lesson-4` | 이에요 / 예요 - to be | Existing grammar exercises | 3 |
| `lesson-5` | 은 / 는 - topic marker | Existing grammar exercises | 3 |
| `lesson-6` | 이 / 가 아니에요 - to not be | Existing grammar exercises | 3 |

The mixed quiz contains the same 25 questions in lesson order.

## TDD evidence

### Red

Command:

```text
npm test -- src/content/practiceCatalog.test.ts src/pages/PracticePage.test.tsx src/components/ExerciseEngine.test.tsx
```

Observed before production changes:

- Exit code 1.
- `practiceCatalog.test.ts` could not resolve the intentionally missing catalog module.
- All five new Practice page tests failed against the legacy flashcard and nine-question grammar challenge.
- The new engine quiz-mode test failed because the engine ignored the requested lesson title and rendered all three exercises at once.
- The five pre-existing ExerciseEngine tests remained green, confirming the failures were specific to the new contract.

### Green — focused Task 5 matrix

Command:

```text
npm test -- src/content/practiceCatalog.test.ts src/pages/PracticePage.test.tsx src/components/ExerciseEngine.test.tsx
```

Result after implementation: 3 test files passed; 14 tests passed; 0 failures.

### Accessibility regression diagnosis

The first full-suite run had one failure: `accessibility.test.tsx` still expected the removed `Final practice` heading. The rendered page contained one `h1`, named `Practice by lesson`, and the failure occurred before axe assertions. The route matrix was updated to the approved heading, then the focused accessibility suite passed all 15 tests with no axe violations.

## Final verification

`npm test`

- 26 test files passed.
- 187 tests passed.
- 0 failures.

`npm run typecheck`

- Passed with exit code 0.

`git diff --check`

- Passed; Git emitted only the repository's existing LF-to-CRLF checkout notices.

## Files changed

- `app/src/content/practiceCatalog.ts` (new)
- `app/src/content/practiceCatalog.test.ts` (new)
- `app/src/pages/PracticePage.tsx` (rewritten)
- `app/src/pages/PracticePage.test.tsx` (rewritten)
- `app/src/components/ExerciseEngine.tsx`
- `app/src/components/ExerciseEngine.test.tsx`
- `app/src/accessibility.test.tsx`
- `.superpowers/sdd/2026-08-23-korean-stage-beginner-redesign/task-5-report.md`

## Self-review

- Exact public slugs and titles come from `courseLessons`; tests also lock their literal learner-facing values.
- Vocabulary distractors are derived from two adjacent words in the same lesson, so each question contains its answer and only already-taught lesson content.
- Grammar groups reuse `grammarPoint.exercises` directly; no exercise was added, removed, or rewritten.
- The initial Practice view contains no answer controls, so assessed content begins only after an explicit lesson or mixed-quiz selection.
- `ExerciseEngine` quiz mode shows one question at a time, blocks empty submission, prevents duplicate submission, exposes feedback through `role="status"`, and maintains visible text/shape/color result cues.
- Leaving a quiz unmounts its keyed engine. Selecting any quiz creates fresh in-memory state; refresh is allowed to reset it.
- The unrelated untracked `docs/audit/` directory was not inspected, modified, staged, or committed.

## Concerns and follow-up

- The engine retains its older optional `initialResults` and `onResult` compatibility props only for legacy `GrammarLesson`/`UnitPage` callers that remain until Task 8. The new Practice flow passes neither prop and performs no persistence. Task 8 is responsible for deleting the old persistence path.
- The mixed quiz intentionally contains 25 questions and is clearly optional. It is comprehensive rather than short; later visual QA should confirm the completion flow remains comfortable on mobile.

## Commit

Commit message: `feat: group Korean quizzes by lesson`

The exact commit hash is reported in the Task 5 handoff.

## Fix round 1 — language metadata and focus restoration

### Review findings resolved

- Added required per-exercise `answerLanguage` metadata. Derived Lesson 2 and Lesson 3 vocabulary answers are `en`; the existing Korean grammar exercises and fixture exercises are `ko`.
- `ExerciseAnswerControl` now applies the exercise metadata to choice labels, and incorrect-answer feedback applies it to the shown correct answer. Matching controls retain their existing bilingual behavior.
- Quiz mode now focuses the first question legend immediately when it mounts, including direct `?lesson=lesson-N` entry.
- Leaving a quiz through `All lesson quizzes` returns focus to the selected lesson or mixed-quiz card after the quiz unmounts.

### Regression coverage and verification

- Lesson 2 and Lesson 3 tests each assert English `lang` values for a vocabulary choice and incorrect-answer feedback; the existing grammar exercise test asserts Korean `lang` values for both a choice and the shown correct answer.
- Keyboard test asserts Enter opens a lesson quiz with focus on Question 1 and Enter on `All lesson quizzes` returns focus to the originating Lesson 3 card.
- Focused command: `npm test -- src/content/practiceCatalog.test.ts src/pages/PracticePage.test.tsx src/components/ExerciseEngine.test.tsx` — 3 files, 16 tests passed.
- Full command: `npm test -- --reporter=verbose` — 26 files, 189 tests passed.
- `npm run typecheck` — passed.
- `git diff --check` — passed (only existing CRLF checkout notices).

### Commit

`fix: repair practice answer language and quiz focus`
