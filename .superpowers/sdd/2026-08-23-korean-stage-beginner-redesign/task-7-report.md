# Task 7 Report — Clean Team Page and Development-Only Readiness

## Status

Complete. Team now defaults to a learner-facing directory of contributors. Submission readiness remains available only during development at `/team?readiness=1` and retains the existing course-data validation.

## Implementation summary

- Changed the Team heading and introduction to learner-facing copy.
- Kept the responsive two-to-six-member grid and added each member's role and contribution to every card.
- Retained name, student ID, bilingual assigned words, and dialogue titles from the existing typed course data.
- Removed replacement badges, word-count pass/fail states, and prescriptive assignment copy from learner-facing cards.
- Replaced missing-assignment warnings with neutral empty states.
- Guarded `SubmissionReadiness` behind both `import.meta.env.DEV` and the `readiness=1` URL query.
- Preserved direct `SubmissionReadiness` coverage so validation remains unchanged.
- Updated the accessibility route-heading matrix to the approved `Meet the team` heading.

## TDD evidence

### Red

`npm test -- src/components/TeamGrid.test.tsx src/components/SubmissionReadiness.test.tsx`

- Exit code 1.
- Five tests failed for the intended behavior: the old Team page exposed readiness by default, cards omitted role/contribution details, and default cards retained replacement/count warnings and corrective empty states.

### Green — focused Team and validator tests

`npm test -- src/components/TeamGrid.test.tsx src/components/SubmissionReadiness.test.tsx src/content/validateCourse.test.ts`

- 3 test files passed.
- 54 tests passed.
- 0 failures.

## Final verification

- `npm test` — 26 test files passed; 186 tests passed; 0 failures.
- `npm run typecheck` — passed with exit code 0.
- `npm run lint` — passed with exit code 0.
- `git diff --check` — passed; Git reported only existing LF-to-CRLF checkout notices.

## Files changed

- `app/src/pages/TeamPage.tsx`
- `app/src/components/TeamGrid.tsx`
- `app/src/components/TeamGrid.test.tsx`
- `app/src/components/SubmissionReadiness.test.tsx`
- `app/src/accessibility.test.tsx`
- `.superpowers/sdd/2026-08-23-korean-stage-beginner-redesign/task-7-report.md`

## Concerns and follow-up

- The current course continues to use development member identities and missing recording media. Those conditions are intentionally visible only in the guarded development readiness report, not the default learner-facing Team route.
- The unrelated untracked `docs/audit/` directory was not inspected, modified, staged, or committed.
