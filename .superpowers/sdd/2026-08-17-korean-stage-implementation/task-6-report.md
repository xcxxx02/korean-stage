# Task 6 report: grammar lessons and exercise engine

## Scope

- Added the shared `GrammarLesson` and `ExerciseEngine` components.
- Connected Units 4–6 to the grammar lessons through `UnitPage` and the existing `LearningShell`.
- Replaced the Grammar overview placeholder with links to all three bilingual grammar units and completion state.
- Enforced learner-visible behavior around exactly three exercises per grammar point, English learning support, accessible feedback, retry, keyboard use, scoring, persistence, and unit completion.

## TDD evidence

### Red

Command:

`npm test -- src/components/GrammarLesson.test.tsx src/components/ExerciseEngine.test.tsx`

After rerunning with approval for the esbuild subprocess, Vitest exited 1. Both suites failed for the expected reason: `./GrammarLesson` and `./ExerciseEngine` did not exist. The first sandboxed attempt stopped earlier with `spawn EPERM` and was not counted as the RED behavior check.

### Green

Command:

`npm test -- src/components/GrammarLesson.test.tsx src/components/ExerciseEngine.test.tsx`

Result: exit 0; 2 test files passed, 5 tests passed.

The tests cover bilingual lesson comprehension, exactly three prompts, wrong-answer English feedback, correct-answer disclosure, selected-answer preservation, visible retry, updated score, native keyboard selection/submission, polite live announcements, all three overview links, and completion only after all three correct results.

## Verification

- `npm test` — exit 0; 11 files passed, 58 tests passed.
- `npm run typecheck` — exit 0.
- `npm run lint` — exit 0.
- `git diff --check` — exit 0; only line-ending conversion notices from Git on the two pre-existing page files.

## Files

- `app/src/components/ExerciseEngine.tsx`
- `app/src/components/ExerciseEngine.test.tsx`
- `app/src/components/GrammarLesson.tsx`
- `app/src/components/GrammarLesson.test.tsx`
- `app/src/pages/GrammarPage.tsx`
- `app/src/pages/UnitPage.tsx`
- `.superpowers/sdd/2026-08-17-korean-stage-implementation/task-6-report.md`

## Commit

Included in the Task 6 commit with message `feat: add grammar lessons and exercises`; the exact SHA is recorded in the handoff because a commit cannot contain its own final SHA.

## Self-review

- The exercise engine uses real radio inputs, forms, fieldsets, legends, and buttons; keyboard behavior comes from native controls rather than custom key handlers.
- Korean prompts are paired in the same legend with English instructions, examples pair Korean and English in each list item, and all feedback/explanations are in English.
- Wrong feedback leaves the selected radio checked until the learner explicitly retries.
- Each result is persisted through `recordExerciseResult`; `UnitPage` restores the unit as the last visited path and calls `markUnitComplete` only when all three IDs resolve to `true`.
- The mutation check is covered: changing the wrong/correct branch, omitting an English example, rendering a different exercise count, skipping a result write, or completing after fewer than three correct answers fails a focused test.
- Diff review found no changes outside the seven Task 6 files listed above.

## Concerns

- None blocking. The in-page score reflects answers submitted during the current render; persisted unit completion remains visible after reload.
