# Task 10 Design QA

## Beginner-first redesign verification

- Date: 2026-08-24.
- Approved source: refined Direction A Learn mock.
- Compared route: `/learn/lesson-3`, word 1 of 8.
- Desktop CSS viewport: 1440 x 1024 at device pixel ratio 1.
- Tablet CSS viewport: 768 x 1024 at device pixel ratio 1.
- Mobile CSS viewport: 390 x 844 at device pixel ratio 1.
- Tablet and mobile routes checked: Learn, Practice, Dialogue, and Team.

## Source visual truth

- Primary approved vocabulary mock: `C:/Users/Nitro/AppData/Local/Temp/codex-clipboard-570191f1-a34b-4c90-bcaf-905f49e88c38.png`.
- Refined prior direction: `C:/Users/Nitro/.codex/generated_images/01a00e73-4a35-7c00-8237-c6f4815271b8/exec-0326bc35-7758-4b26-a72e-042aa14fd78c.png`.
- Primary source pixels: 1484 x 1060, RGB, with no device frame.
- Refined prior pixels: 1487 x 1058, RGB, with no device frame.
- The primary source was center-cropped from 1484 x 1060 to 1484 x 1055, then bicubically normalized to 1440 x 1024. This preserves the source aspect ratio while matching the implementation capture exactly.
- Normalized source: `../.superpowers/sdd/2026-08-23-korean-stage-beginner-redesign/task-10-approved-vocabulary-mock-normalized-1440x1024.png`.
- State difference accepted before comparison: the source depicts a finished member recording and obsolete Vocabulary/Grammar navigation. The binding beginner-first specification requires four destinations, a compact video slot, an honest missing-media state when no recording exists, and no separate audio control.

## Browser-rendered implementation evidence

- Initial exact implementation capture: `../.superpowers/sdd/2026-08-23-korean-stage-beginner-redesign/task-10-desktop-learn-lesson-3-viewport-1440x1024.png`.
- Repeated exact implementation capture: `../.superpowers/sdd/2026-08-23-korean-stage-beginner-redesign/task-10-desktop-learn-lesson-3-pass2-1440x1024.png`.
- Both implementation files are 1440 x 1024 RGB screenshots captured from a 1440 x 1024 CSS viewport at device pixel ratio 1; no density resampling was used.
- Initial same-input comparison: `../.superpowers/sdd/2026-08-23-korean-stage-beginner-redesign/task-10-approved-vs-implementation-1440x1024-comparison.png`.
- Final same-input comparison (tracked with the report): `design-qa-assets/approved-vocabulary-vs-lesson-3.png`.
- The comparison sheets place the normalized 1440 x 1024 source and 1440 x 1024 implementation at natural scale with a 24 px neutral divider.
- Focused-region comparison was not needed: the source and implementation were also opened at original resolution together, and the requested rail, media, details, word controls, typography, wrapping, cultural line art, colors, and radii were all legible in that input.

## Required fidelity surfaces

- Fonts and typography: the implementation renders English and Korean with the local Noto Sans KR/Noto Sans variable stack. The lesson hierarchy, Korean word, English meaning, romanization, spoken hint, example, and grammar note remain distinct with no truncation. At 390 px, `Jobs & Occupations` wraps cleanly and the bilingual chooser retains both languages.
- Spacing and layout rhythm: desktop keeps the specified 192 px bilingual rail, 790.4 px media track, and 336 px details track. The compact missing-media slot is 509.7 x 286.7 px; the right-column word controls end at y=870.9, above the 1024 px fold. The denser media and rail are intentional changes from the oversized source, not fidelity regressions.
- Colors and visual tokens: white canvas, charcoal text, cobalt selection, vermilion forward action, jade teaching support, and warm yellow warning treatment preserve the approved obangsaek direction. Selected and missing states use text, shape, and color.
- Image quality and asset fidelity: the palace-gate mark, slim patterned strip, and low-contrast palace/Namsan line art are sharp and correctly restricted to unused edge space. No fake member image, generated voice, CSS illustration, handcrafted SVG replacement, emoji, or broken media control appears.
- Copy and content: Korean/English labels, romanization, `Say it like`, example, grammar note, member attribution, and honest missing-media wording are coherent and visible. The current Learn label, four destinations, and absence of duplicate audio match the binding specification even though the earlier mock shows the superseded IA.
- Layout and responsiveness: Learn, Practice, Dialogue, and Team were inspected at 1440 px, 768 px, and 390 px. Every route reported zero horizontal overflow. Tablet and mobile preserve the bilingual chooser, readable stacked media/details, responsive quiz cards, dialogue transcript, and Team cards.
- Accessibility and interaction: the mobile menu exposes exactly Learn, Practice, Dialogue, and Team. The browser-rendered 390 px focus order with the chooser open is `chooser trigger -> active option -> Next word`, so Shift+Tab resolves to the chooser trigger and Tab resolves to Next word after responsive visibility is applied. Escape still closes to the trigger. A direct synthetic Tab injection did not advance focus in this subagent browser surface, so the rendered browser order is paired with the passing focused Tab/Shift+Tab interaction tests rather than claimed as a physical-key recording.

## Route and interaction evidence

- Desktop captures: `task-10-desktop-learn-lesson-1-1440x1024.png`, `task-10-desktop-learn-lesson-3-1440x1024.png`, `task-10-desktop-practice-1440x1024.png`, `task-10-desktop-dialogue-1440x1024.png`, and `task-10-desktop-team-1440x1024.png` in the Task 10 report directory.
- Tablet captures: `task-10-tablet-768x1024-learn.png`, `task-10-tablet-768x1024-practice.png`, `task-10-tablet-768x1024-dialogue.png`, and `task-10-tablet-768x1024-team.png` in the same directory.
- Mobile captures: `task-10-mobile-390x844-learn.png`, `task-10-mobile-390x844-practice.png`, `task-10-mobile-390x844-dialogue.png`, and `task-10-mobile-390x844-team.png` in the same directory.
- Mobile menu: `task-10-mobile-390x844-menu-open.png`; the DOM exposes only the four approved destinations.
- Free selection: `task-10-mobile-390x844-chef-selected.png`; selecting `8. 요리사 - Chef` updates the Korean heading, English meaning, trigger copy, and attribution to `Presented by Member 2` without overflow.
- Historical Practice feedback capture: `task-10-mobile-390x844-practice-feedback.png`; an incorrect Lesson 3 answer shows `Not quite`, the correct answer, the bilingual explanation `학생 means Student.`, `Try again`, and `Next question`. A subsequent P2 review found that this mixed prompt/feedback copy lacked nested language boundaries and allowed `학생` to split at 390 px, so this pre-fix capture is not used as acceptance evidence. The structured renderer and no-break Korean-run style now cover both the prompt and incorrect-feedback state in passing DOM and source-contract regressions.
- Dialogue: selecting Dialogue 2 updates the active scenario to `Who are you?`, retains the honest coming-soon state, and exposes neither line-audio controls nor a contributor checklist.
- Team: two member cards render by default with no `Submission readiness` or `Replace before submission` warning. Automated Team coverage also supplies four additional valid members and verifies all six contribution articles and accessible names, directly exercising the required 2–6-member range endpoints.
- Browser console: zero warnings and zero errors across the checked routes and states.

## Automated verification evidence

- `npm test`: passed, 21 files and 174 tests, 0 failures. The Practice regression selects Lesson 3, asserts that the vocabulary prompt and incorrect explanation expose Hangul only inside `lang="ko"` descendants and English inside `lang="en"` descendants, and walks both DOM subtrees to reject any untagged Hangul text node. The responsive source contract requires each Korean run to be an inline-block with `word-break: keep-all`, `overflow-wrap: normal`, and `white-space: nowrap`.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; Vite transformed 4608 modules and emitted the production client and Sites package.
- `npm run test:sites`: passed, 4 tests, 0 failures.
- Required artifacts verified: `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
- Runtime learner-progress storage: `App.test.tsx` spies on `Storage.prototype.getItem` and `setItem` while advancing a Lesson 3 word and navigating to Practice. It permits only React Router's own transition key, observes no application read, and observes no write. The full learner journey therefore has explicit no-runtime-progress-storage acceptance coverage.
- Human-speech requirement: `validateCourse.test.ts` asserts the global prohibited `ai-voice-prohibited` issue, keeps that prohibition alongside media-specific errors, and exercises AI-generated introduction and dialogue media. The validator gathers introduction audio, vocabulary video/audio, dialogue video, and dialogue-line audio before rejecting any `ai-generated` source. `HumanAudioButton.test.tsx` and `MemberVideo.test.tsx` additionally verify that AI-generated audio/video never renders or enables playback.
- Team size: `TeamGrid.test.tsx` verifies the real two-member course and a constructed six-member course, checking every contribution article and accessible name at both required range endpoints.

## Comparison history

1. Initial pass compared the normalized approved vocabulary mock and fresh `/learn/lesson-3` browser capture together at 1440 x 1024. The hierarchy, three-column anatomy, compact video slot, bilingual rail, word controls, palette, radii, cultural assets, and wrapping were intact.
2. No Learn production fix was justified. The source's larger finished video, duplicate audio action, six-item navigation, and Vocabulary active state conflict with the later approved specification and current missing course media, so copying those differences would regress the product contract.
3. A fresh second Learn capture at the same route, state, viewport, density, and crop remained visually stable. The final portable combined comparison is stored beside this report.
4. Follow-up interaction review found one Practice P2 outside that Learn comparison: flat mixed-language prompt and feedback strings inherited English and could split a Korean word between syllables at 390 px. Practice now uses structured language-aware runs across exercise titles, prompts, contexts, answers, explanations, and lesson headings; the focused DOM/accessibility and responsive no-break regressions pass.

## Findings

- The Practice mixed-language P2 is fixed and covered by DOM/accessibility and responsive no-break regressions. No actionable P0, P1, or P2 findings remain after the fix.
- Accepted product constraint: real member and dialogue recordings have not been supplied. The application correctly keeps honest coming-soon states and no false playback controls; media content readiness remains separate from UI readiness.
- Live verification limitation: after the fix and production rebuild, the Browser skill's inferred-URL connection reported no available browser backend. Per the Browser recovery contract, no standalone Playwright or unrelated browser surface was substituted. A fresh post-fix `/practice` 390 x 844 spot check remains pending browser reconnection; the earlier defect-state capture is explicitly excluded above.
- Residual evidence limit: the in-app browser's synthetic Tab command did not advance focus in this subagent thread. Browser-rendered responsive focus order and the passing native-navigation regression tests verify the intended destinations, but a final physical-key spot check may still be useful before coursework submission.

## Final acceptance checklist

- [x] `/` reaches Lesson 1 without Start or Continue UI.
- [x] Primary navigation contains only Learn, Practice, Dialogue, and Team.
- [x] Learn allows free bilingual word selection and sequential Previous/Next navigation.
- [x] Course ownership selects the member; no speaker selector or duplicate learner audio exists.
- [x] Korean, English, romanization, spoken hint, bilingual example, and usage support are visible.
- [x] Compact member media and word controls fit above the target desktop fold.
- [x] Practice is lesson-grouped, explains errors in English, and preserves explicit Korean/English language boundaries without mid-word Hangul wrapping.
- [x] Dialogue shows one active main video state, context, roles, and bilingual transcript.
- [x] Team is clean by default and supports the tested member cards without readiness warnings.
- [x] Desktop, tablet, and mobile routes have no horizontal overflow.
- [x] Keyboard focus order, Korean language boundaries, contrast contracts, and reduced motion have passing automated coverage.
- [x] Test, typecheck, lint, production build, and Sites worker checks exit 0.

final result: automated fix passed; live Practice 390 px recheck pending browser reconnection
