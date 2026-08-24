# Task 8 Report — Remove Learner Progress Persistence

## Status

Complete. The learner journey no longer has an application path to browser storage, and the superseded progress pages, store, hook, and flashcard implementation have been removed.

## Implementation summary

- Added the main-journey storage regression test in `app/src/App.test.tsx`. It exercises Lesson 3 word navigation and the Practice navigation link.
- The test disregards React Router's framework-owned `remix-router-transitions` read while rejecting every other browser-storage read and all writes.
- Deleted only the Task 8-approved obsolete files: learner-progress hook/store and their tests, legacy learner pages and tests, course/progress components, and the flashcard component/test.
- Removed only stale assertions and imports from retained tests. Current route accessibility, responsive word/media contracts, dialogue keyboard coverage, grammar exercise rendering, `HumanAudioButton`, and media safety coverage remain.
- Removed obsolete visual-system allow-list entries for the deleted components.

## TDD evidence

### Red

The initial exact storage-spy test failed because React Router read its framework transition-cache key (`remix-router-transitions`) during navigation, not because the learner application persisted progress. The test was corrected to observe the application boundary: all non-Router storage reads and every storage write must remain absent.

### Green

`npm test -- src/App.test.tsx`

- 1 test file passed.
- 6 tests passed.
- 0 failures.

Because the focused journey was already free of reachable persistence, the approved fallback scan identified only dead obsolete progress code before deletion.

## Final verification

- `rg -n 'useCourseProgress|readProgress|writeProgress|HomePage|UnitPage|VocabularyPage|GrammarPage|CourseMap|ProgressSummary|FlashcardDeck' app/src` — no matches (exit code 1).
- `rg -n 'localStorage' app/src --glob '!*.test.ts' --glob '!*.test.tsx'` — no production matches (exit code 1).
- `npm test` — 21 test files passed; 160 tests passed; 0 failures.
- `npm run typecheck` — passed with exit code 0.
- `npm run lint` — passed with exit code 0.
- `git diff --check` — passed; Git emitted only LF-to-CRLF checkout notices.

## Extra retained-test updates

- `app/src/accessibility.test.tsx`: removed the deleted flashcard interaction from the mixed keyboard test; retained the dialogue keyboard test and current-route accessibility coverage.
- `app/src/responsive-contract.test.tsx`: removed deleted flashcard/grammar-page contracts; retained current vocabulary, dialogue, touch-target, and `HumanAudioButton` contracts.
- `app/src/components/GrammarLesson.test.tsx`: removed legacy grammar-route and persisted-completion cases; retained the grammar lesson's bilingual rendering and three-exercise coverage.
- `app/src/visualSystem.test.ts`: removed status-pill allow-list entries for deleted components.

## Concerns and follow-up

- React Router currently reads its own transition-cache key during navigation. The app-level storage regression test excludes only that framework key and still catches every other storage access.
- The unrelated untracked `docs/audit/` directory was not inspected, modified, staged, or committed.
