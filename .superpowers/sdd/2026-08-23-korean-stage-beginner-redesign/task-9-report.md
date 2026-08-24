# Task 9 Report — Responsive, Visual, and Accessibility Contracts

## Status

Complete. Task 9 and all ledgered deferred issues assigned to this task are implemented and verified.

## Implemented

- Added the approved Learn anatomy with `.learn-layout`, `.learn-word-rail`, `.learn-media`, and `.learn-details`.
- Kept Learn stacked below `70rem`; at `70rem` and above it uses `12rem minmax(24rem, 1fr) minmax(18rem, 21rem)`.
- Replaced the small-screen horizontal word rail with a native bilingual vocabulary chooser, with all Korean and English labels kept together and no horizontal overflow.
- Moved Previous/Next into the details column so both controls remain visible without scrolling at the target desktop viewport.
- Kept the member-video area compact at desktop with `height: clamp(14rem, 28vh, 19rem)`.
- Preserved the high-contrast Stage tokens, palace gate mark, obangsaek band, palace line art, and honest missing-media state. No fake person, voice, video, or replacement cultural asset was added.
- Added structural Korean language tagging for vocabulary transcripts and mixed grammar tips. `MemberVideo` now receives a typed bilingual transcript and renders Korean and English in separate language boundaries.
- Kept the existing 3px focus treatment and reduced-motion contract.
- Fixed `LessonSelector` so selection closes the list and Escape closes it while restoring focus to the trigger.
- Strengthened `validatePrimaryNavigation()` so Learn must keep its direct `/learn/lesson-1` destination.

## TDD Evidence

The new regression suite was run before production edits and failed in the expected six places:

- Korean audit found the mixed transcript and mixed grammar tip without Korean language boundaries.
- No mobile vocabulary combobox existed.
- The approved `.learn-*` layout anatomy and details-column controls did not exist.
- `LessonSelector` remained open after selection and did not restore trigger focus from inside the list.
- `MemberVideo` exposed only one mixed-language transcript string.
- Navigation readiness passed after Learn lost its direct Lesson 1 destination.

After implementation, the focused suite passed: 8 files, 81 tests, 0 failures.

## Live Responsive QA

Route checked: `/learn/lesson-3`.

- Desktop `1440 × 1024`: columns computed as `192px 775.2px 336px`; compact media height `286.7px`; Word navigation bottom `870.9px`; controls above fold; horizontal overflow `0`.
- Tablet `768 × 1024`: one stacked column; bilingual chooser visible; desktop rail hidden; horizontal overflow `0`.
- Mobile `390 × 844`: one stacked column; bilingual chooser width `335.2px`; all eight bilingual options present; selecting `8. 요리사 — Chef` updated the Korean heading to `요리사`; horizontal overflow `0`.
- Browser console warnings/errors: none.

## Verification

- Focused visual/accessibility/responsive/assets and deferred-regression tests: 8 files, 81 tests passed.
- Full Vitest suite: 21 files, 168 tests passed.
- TypeScript: `npm run typecheck` passed.
- ESLint: `npm run lint` passed.
- `git diff --check`: passed; only existing Windows line-ending notices were emitted.

## Narrow Files Beyond the Original Task 9 List

- `LearningShell.tsx`: applies the required Learn anatomy and places Word navigation in the details column.
- `LearnPage.tsx`: widens the page container so the approved three-column minimums fit at desktop.
- `VocabularyJourney.tsx` and its tests: provides the bilingual small-screen chooser and segmented Korean grammar/transcript content.
- `MemberVideo.tsx` and its tests: replaces the unsafe mixed transcript string with a typed bilingual transcript.
- `LessonSelector.tsx` and its tests: resolves the ledgered close/focus defects.
- `navigation.ts` and `SubmissionReadiness.test.tsx`: resolves the ledgered direct Learn destination validation defect.

## Concerns

- Real member recordings remain missing in the development course data. The UI intentionally shows the honest existing coming-soon state; this is coursework content readiness, not a Task 9 UI defect.
- The pre-existing untracked `docs/audit/` directory was not modified, staged, or committed.

## Review Follow-up — Bilingual Vocabulary Control (2026-08-24)

The review correctly identified that the native mobile `select` scoped each whole bilingual option as Korean, including its English text, and that the desktop rail's mixed-language `aria-label` flattened the segmented visible label. This follow-up supersedes the earlier report's native-chooser implementation note.

### Resolution

- Replaced the native mobile select with a compact disclosure button and listbox. The button exposes `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`; the listbox uses roving focus, Arrow/Home/End navigation, Enter/Space selection, Escape close with trigger-focus restoration, and Tab close.
- Kept every Korean word in its own visible `<span lang="ko">` and every English gloss in its own visible `<span lang="en">` in both the closed chooser and every listbox option.
- Removed the mixed bilingual `aria-label` from desktop vocabulary buttons so their accessible names come from the correctly segmented visible descendants.
- Kept the chooser width constrained to its mobile column and the popup list vertically scrollable with horizontal overflow hidden.

### TDD Evidence

Before production edits, the new tests failed on the native options' Korean-scoped English, the desktop mixed-language labels, and the missing segmented listbox. A first implementation also failed axe's button-name rule when a button was forced to `role="combobox"`; using the disclosure-button/listbox contract restored content-derived bilingual naming.

The final regression coverage rejects any `lang="ko"` subtree containing Latin copy, rejects any `aria-label` containing both Hangul and Latin text, verifies Korean and English language spans in the chooser and options, verifies desktop controls have no overriding label, and exercises listbox keyboard selection and focus restoration.

### Follow-up Verification

- Focused language/accessibility/responsive/visual suite: 4 files, 46 tests passed.
- Full Vitest suite: 21 files, 170 tests passed.
- TypeScript: `npm run typecheck` passed.
- ESLint: `npm run lint` passed.
- `git diff --check`: passed with only existing Windows line-ending notices.
- A fresh live-browser rerun could not be performed because no browser backend was available. The original Task 9 desktop/tablet/mobile live QA above remains valid for the unchanged layout; the changed chooser behavior and overflow contract are covered by the focused tests.

### Follow-up Concerns

- None in the bilingual control implementation.
- The pre-existing untracked `docs/audit/` directory remains untouched.
