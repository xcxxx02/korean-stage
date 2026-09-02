# Final review fix 1 report

Date: 2026-09-02
Worktree: `C:/Users/Nitro/Documents/ChatGPT/Korean Project/.worktrees/codex-restore-approved-visuals`

## Already present when this pass resumed

The interrupted branch already contained the completed beginner-first redesign and its Task 1–10 evidence: four-destination routing, direct Learn content, bilingual selectors, structured Practice language boundaries, compact honest media states, the 2–6 member Team layout, responsive drawer CSS, no runtime learner-progress storage, and the initial `app/design-qa.md` comparison/audit artifacts. It also already contained the stable `/practice/:lessonSlug` route/query compatibility work, supporting-country metadata, whitespace checks in the media components/validator, and focused tests for those areas.

## Completed in this pass

- Finished exhaustive language boundaries for Learn grammar headings and matching controls. Matching `<select>` options are explicitly English, and accessible names are assembled with `aria-labelledby` rather than flattened mixed-language labels.
- Confirmed mobile AppShell Escape behavior restores focus to the Menu trigger, and added Dialogue/Team active-route coverage.
- Ensured lesson-drawer selection restores trigger focus while retaining the fixed mobile drawer/backdrop and wider-screen popover behavior.
- Kept Lesson 2 countries explicitly supporting/unrecorded with no owner or generic member/video attribution; retained assessed/member-owned occupations. Added catalog regression coverage.
- Changed Team’s count to neutral “assigned vocabulary words” wording so missing recordings are not presented as completed media.
- Added trim-gate regression coverage for empty/whitespace human media and retained the validator’s trimmed-media check.
- Confirmed the stale `courseUnits` compatibility alias/comment has no consumers and remains removed.
- Refreshed `app/design-qa.md` with the current 200-test evidence.

## Evidence

- `npm test -- --run`: 21 files, 200 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; Sites artifacts emitted.
- `npm run test:sites`: 4 tests passed.
- `git diff --check`: passed.

The supplied real member recordings and final identities remain content dependencies; the app continues to show honest missing-media states and submission validation remains responsible for readiness.
