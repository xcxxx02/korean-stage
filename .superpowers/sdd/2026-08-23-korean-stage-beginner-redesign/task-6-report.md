# Task 6 Report — Simplified Dialogue Experience

## Status

Complete. Dialogue now presents exactly two selectable coursework dialogues, renders only the active dialogue, and keeps the learner experience to context, English role/member mapping, one primary member-video area, and a bilingual transcript.

## Implementation summary

- Replaced selectable transcript lines with static bilingual transcript entries.
- Removed `HumanAudioButton`, line-selection state, current-line badges, and all line-level playback UI from Dialogue.
- Removed the learner-facing role-play recording checklist and staged `Watch first` / `Study second` instructions.
- Added the active dialogue title, English scenario, and `Roles:` member-name mapping before the media.
- Reused `MemberVideo` in compact learner mode with one video area and no separate play button.
- Added an honest `Dialogue video coming soon` state for the real recordings that have not been supplied; no video, audio, or enabled playback control is rendered for missing media.
- Kept native video controls for a supplied human recording while rendering no line-level audio elements.
- Rendered all dialogue lines in one ordered list named `Bilingual dialogue transcript`, with Korean marked `lang="ko"` and English marked `lang="en"`.
- Kept both validator-required coursework dialogues selectable, while mounting only the selected dialogue's media and transcript.
- Removed reviewed-dialogue state, Unit 7 completion props, completion controls, callbacks, and storage behavior from `DialoguePage`.
- Updated the staged legacy `UnitPage` call site to use the now prop-free `DialoguePage`; the obsolete page is scheduled for deletion in Task 8.

## TDD evidence

### Red

Command:

```text
npm test -- src/components/DialoguePlayer.test.tsx
```

Observed before production changes:

- Exit code 1.
- 5 of 6 tests failed for the intended missing behavior.
- The legacy player omitted the scenario/title contract, exposed selectable lines and eight line-audio controls, showed contributor recording instructions, rendered a disabled imitation play control for missing media, and did not render the selected dialogue scenario.
- The no-storage/default-page test already passed, confirming that the other failures were specific to the simplified player contract.

### Green — focused dialogue suite

Command:

```text
npm test -- src/components/DialoguePlayer.test.tsx
```

Result: 1 test file passed; 6 tests passed; 0 failures.

### Green — dialogue and validator matrix

Command:

```text
npm test -- src/components/DialoguePlayer.test.tsx src/content/validateCourse.test.ts
```

Result: 2 test files passed; 35 tests passed; 0 failures. Dialogue counts, speaker/line requirements, real-media rules, and the AI-speech prohibition remain enforced.

## Final verification

`npm test`

- 26 test files passed.
- 183 tests passed.
- 0 failures.

`npm run typecheck`

- Passed with exit code 0.

`npm run lint`

- Passed with exit code 0.

`git diff --check`

- Passed; Git emitted only the repository's LF-to-CRLF checkout notices.

## Files changed

- `app/src/components/DialoguePlayer.tsx`
- `app/src/components/DialoguePlayer.test.tsx`
- `app/src/pages/DialoguePage.tsx`
- `app/src/pages/UnitPage.tsx` (compile-only compatibility call after removing Dialogue completion props)
- `.superpowers/sdd/2026-08-23-korean-stage-beginner-redesign/task-6-report.md`

## Self-review

- There is one `MemberVideo` figure for the active dialogue and no media subtree for the inactive dialogue.
- Missing development media remains explicit and non-playable; no source URL or synthetic media was added.
- A supplied `human-recording` continues to use the native `<video controls>` path and the existing media-safety behavior.
- Dialogue line audio remains in typed course data for coursework validation, but the learner component no longer imports or renders it.
- The active dialogue button uses `aria-pressed` plus visible `Selected dialogue` text, so selection does not rely on color alone.
- The unrelated untracked `docs/audit/` directory was not inspected, modified, staged, or committed.

## Concerns and follow-up

- Both real dialogue recordings are still content dependencies: current course sources are intentionally `development-missing`, so the learner sees `Dialogue video coming soon` until the group supplies real face-and-voice recordings.
- `UnitPage` still contains the broader legacy progress hook used by other obsolete unit flows. Task 8 owns deleting that page and all persistent progress code; Task 6 removed Dialogue's completion props and active-route storage behavior without expanding into that deletion task.

## Commit

Commit message: `feat: simplify beginner dialogue experience`

The exact commit hash is reported in the Task 6 handoff.
