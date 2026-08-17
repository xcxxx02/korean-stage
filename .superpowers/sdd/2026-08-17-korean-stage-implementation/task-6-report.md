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

## Fix round 1

### Dispositions

- **Persisted score and completion:** resolved. `ExerciseEngine` now hydrates persisted correct results into its checked answers, correct feedback, locked controls, and visible score. `GrammarLesson` and `UnitPage` pass the persisted results through rather than starting a second session-local truth.
- **No correct-result regression:** resolved. A result that has become `true` remains `true` in `useCourseProgress`, and a hydrated/completed exercise is locked in the engine. Later wrong submissions cannot contradict completed state.
- **Completion/result consistency:** resolved. Progress sanitization now derives grammar completion exclusively from all three persisted exercise results, removing incomplete legacy flags and adding a missing flag when all three results are true. Non-grammar unit completion is preserved.
- **Stable feedback and retry:** resolved. Radios are disabled while feedback is visible, so the submitted checked answer cannot drift away from the explanation. `Try again` clears feedback and the selected answer, re-enables choices, and restores focus to the first choice.
- **All grammar points:** resolved. Parameterized rendered tests cover the exact title, both exact rules, both Korean/English example pairs, and exactly three prompts for 이에요/예요, 은/는, and 이/가 아니에요.
- **Obsolete generic completion fixture:** reconciled. The existing `LearnPage` manual-completion test now uses Unit 1 instead of grammar Unit 4, preserving its generic contract without bypassing the three-exercise grammar policy.

### TDD evidence

Initial focused RED command:

`npm test -- src/components/GrammarLesson.test.tsx src/components/ExerciseEngine.test.tsx src/hooks/useCourseProgress.test.ts`

Result: exit 1; 5 expected failures. Failures showed submitted radios remained enabled, `initialResults` did not hydrate the score, partial/completed reloads showed 0 of 3, and a later wrong result changed persisted `true` to `false`.

Storage-consistency RED command:

`npm test -- src/progress/progressStore.test.ts`

Result: exit 1; the inconsistent saved state retained incomplete Unit 4 and omitted fully correct Unit 5.

Focused GREEN command:

`npm test -- src/components/GrammarLesson.test.tsx src/components/ExerciseEngine.test.tsx src/hooks/useCourseProgress.test.ts src/progress/progressStore.test.ts`

Result: exit 0; 4 files passed, 23 tests passed.

### Verification

- First `npm test` regression run: 63 passed, 1 failed. The failing legacy test manually completed grammar Unit 4 through `LearnPage`, contrary to the new result-derived policy; its generic fixture was moved to Unit 1.
- Final `npm test`: exit 0; 11 files passed, 64 tests passed.
- Final `npm run typecheck`: exit 0.
- Final `npm run lint`: exit 0.
- `git diff --check`: exit 0; only Git line-ending conversion notices.

### Self-review

- The persisted `exerciseResults` map is the source of truth for grammar scoring and completion after reload; completion flags are normalized from all three exact exercise IDs.
- Correct answers are protected twice: completed controls do not submit, and the persistence action itself treats `true` as monotonic.
- Wrong-answer feedback keeps its submitted radio checked and locked until retry; retry atomically removes both UI states before returning keyboard focus.
- Partial saved progress (2/3 then third), completed reload (3/3 and complete), malformed completion flags, and later wrong submissions all have behavioral regression coverage.
- Existing native keyboard selection/submission and polite live-region tests remain green.
- No production behavior outside grammar progress consistency and exercise feedback was changed.

### Commit

Included in the fix-round Task 6 commit; the exact SHA is recorded in the handoff because a commit cannot contain its own final SHA.

### Concerns

- None blocking.

## Fix round 2

### Disposition

- Corrected the Grammar overview test fixture to persist all three exact Unit 5 exercise results as `true`, matching the result-derived completion policy.
- Replaced the false-positive `/Complete/i` link-name match with an exact visible `Complete` assertion inside the Unit 5 card and an explicit rejection of `Not complete`.
- No production code changed; the issue was confined to test setup and assertion precision.

### TDD-quality evidence

- RED: after tightening the assertion but before repairing the fixture, `npm test -- src/components/GrammarLesson.test.tsx` exited 1 with 1 failed and 6 passed. The Unit 5 card visibly contained `Not complete`, and exact `Complete` was absent.
- GREEN: after seeding `eun-neun-1`, `eun-neun-2`, and `eun-neun-3` as true, the same focused command exited 0 with 7 of 7 tests passed.

### Verification

- `npm test` — exit 0; 11 files passed, 64 tests passed.
- `npm run typecheck` — exit 0.
- `npm run lint` — exit 0.

### Self-review

- The test now fails if Unit 5 renders `Not complete`, even though that phrase contains the substring `complete`.
- The completion fixture is coherent with storage sanitization and the three-exercise completion contract.
- Scope is limited to `GrammarLesson.test.tsx` and this report.

### Commit

Included in the fix-round 2 commit; the exact SHA is recorded in the handoff because a commit cannot contain its own final SHA.

### Concerns

- None.
