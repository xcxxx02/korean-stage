# Korean Stage Beginner-First Redesign Specification

**Status:** Draft for user review

**Date:** 2026-08-23

**Course:** LMPU3282 Korean for Beginners

**Content source:** Lec 1 only

**Initial team size:** 2 members

**Supported team size:** 2-6 members

## 1. Decision Summary

This specification records the redesign approved during the beginner UX review and Superpowers brainstorming process. It supersedes the learner-facing information architecture, navigation, progress, media, and layout decisions in `2026-08-17-korean-stage-design.md`. Coursework content counts and recording obligations from the earlier specification remain in force unless this document explicitly changes their presentation.

The selected visual direction is **Direction A: Guided Stage**, refined into a direct learning interface rather than a personalized dashboard.

The redesign makes these primary changes:

- The main navigation is reduced to **Learn, Practice, Dialogue, and Team**.
- There is no separate Vocabulary, Grammar, Review, Project, or learner-account destination in the primary navigation.
- There is no login, account, learner identity, saved personal progress, `Continue learning`, `Welcome back`, or personalized completion percentage.
- Opening the learning experience shows real course content immediately. It does not require a separate `Start learning` step.
- Learners may choose any bilingual vocabulary item while Previous/Next actions still support sequential learning.
- The member is assigned to each vocabulary item by the course data. Learners never choose a speaker before choosing a word.
- Member selfie video is the main pronunciation medium. A separate audio button is not shown unless a real, separate member-recorded audio source is supplied and required.
- Practice contains the quizzes. Dialogue contains the group drama video. Team contains member and contribution information.

## 2. Product Goal and Audience

Korean Stage is a short, visually polished learning website for an English-speaking absolute beginner who cannot yet read Korean. It reorganizes Lec 1 into seven small lessons while remaining clearly attributable to Lec 1.

The site must let a first-time visitor answer these questions without guessing:

1. What am I learning now?
2. What does this Korean word or sentence mean in English?
3. How can I attempt to pronounce it?
4. Where is the member-recorded pronunciation video?
5. How do I move to another word or lesson?
6. Where can I practise with a quiz?
7. Where can I watch the group dialogue?

The website is a coursework learning artifact, not an account-based learning platform. It must not imitate features that require user profiles, cloud storage, or long-term analytics.

## 3. Confirmed Navigation and Route Responsibilities

### Primary navigation

| Label | Learner expectation | Page responsibility |
|---|---|---|
| Learn | Learn new Lec 1 content | Lessons, vocabulary, pronunciation videos, examples, and beginner explanations |
| Practice | Test what was taught | Lesson-based quizzes, immediate feedback, retry, and optional final mixed quiz |
| Dialogue | Watch the language in use | Group short-drama video, context, roles, and bilingual transcript |
| Team | Understand who made the project | Member names, student IDs, roles, vocabulary assignments, recordings, and contribution summary |

### Removed or absorbed destinations

- **Vocabulary** is absorbed into Learn because vocabulary is core lesson content, not a separate destination.
- **Grammar** is absorbed into the relevant Learn lessons because a beginner should meet the rule in context.
- **Review** is removed because Practice already provides retrieval, feedback, and retry. A separate Review destination would duplicate Practice.
- **Project** is replaced by Team, which is a clearer label for member and coursework information.
- A separate personalized home dashboard is removed.

### Route behavior

- `/` redirects directly to `/learn/lesson-1` without an intermediate Start action.
- `/learn/:lessonId` shows the selected lesson.
- Vocabulary selection is local state within `/learn/:lessonId`; the first item is selected after initial load or refresh.
- `/practice` opens the lesson-based quiz selection.
- `/practice/:lessonId` opens the chosen lesson quiz.
- `/dialogue` opens the group short-drama experience.
- `/team` opens the member and contribution page.
- Unknown routes show a short English error and a clear return to Learn.

## 4. Learn Experience

### Overall lesson hierarchy

All content is adapted from Lec 1 and divided into seven learner-facing lessons. The interface must not imply that the lecturer supplied seven separate lecture files.

The Learn screen includes a compact lesson identifier such as `Lesson 3 of 7 · Jobs & Occupations`. An `All lessons` button beside the identifier opens an accessible popover on desktop and a drawer on mobile containing the seven English lesson titles. This is the single lesson-switching control and does not dominate the vocabulary task.

### Desktop layout

The approved desktop composition has three functional columns:

1. **Bilingual word rail** on the left.
2. **Compact member video** in the centre.
3. **Word explanation and navigation** on the right.

The primary vocabulary content and the Previous/Next actions must fit within a common desktop viewport without requiring the learner to scroll down solely to continue.

### Word selection model

- The first item opens by default so the page never appears empty.
- The left rail shows every item as `Korean word + English meaning`.
- Selecting a word changes the video and explanation directly.
- Previous word and Next word remain available for learners who prefer order.
- The learner chooses a word, not a speaker.
- The assigned member is resolved automatically from the word data.
- A current item uses text, shape, and color, including an English label such as `Now learning`.
- The first implementation shows only the current item, not persistent or temporary viewed/completed markers.

### Required beginner information layers

Every first presentation of a Korean vocabulary item shows:

1. Korean word with `lang="ko"`.
2. Adjacent English meaning.
3. Standard romanization.
4. A separately labelled spoken pronunciation hint such as `Say it like: hak-ssaeng`.
5. Korean example sentence.
6. English sentence translation.
7. A short plain-English usage or grammar note when relevant.

Pronunciation support remains visible. It is not hidden behind an unexplained icon or advanced-mode toggle.

### Member video

- Each assessed vocabulary item uses the assigned group member's real face and real voice.
- The video is visually important but smaller than the earlier oversized implementation.
- The player or placeholder sits in a measured landscape slot and does not push navigation below the viewport.
- A real video may provide Korean and English captions, or the page may provide an adjacent bilingual transcript.
- The page identifies the contributor below the video, for example `Presented by Member 1` during development and the real member name before submission.
- There is no enabled playback control when no playable media exists.
- A missing video shows an honest `Member video coming soon` state.
- Recording advice intended for contributors is not shown inside the main learner task. If retained, it belongs on Team or in a development-only readiness view.

### Audio decision

The learner interface does not show a separate `Listen to Member` button. Pronunciation audio is supplied through the real member video. Adding a separate member-recorded audio asset is outside the first implementation scope and requires a later explicit design change. AI-generated speech is never allowed.

## 5. Practice Experience

Practice owns all quiz behavior. It is not mixed with Team or Dialogue content.

### Structure

- The Practice page first presents the available lesson quizzes in English.
- Each lesson quiz uses only content already introduced in that lesson.
- The required grammar exercise counts from the coursework specification remain satisfied.
- An optional mixed final quiz may appear after the lesson quizzes, but it does not replace the required exercises.

### Beginner-safe question patterns

- English meaning to Korean word selection.
- Korean word to English meaning selection.
- Supported matching.
- Sentence completion with visible answer choices.
- Grammar selection only after the relevant consonant/vowel or particle rule has been taught with pronunciation support.

No question may assume that an absolute beginner can independently identify Korean orthographic features that have not been explained.

### Feedback

- A learner submits an answer before the result is revealed.
- Correct and incorrect states use text, shape, and color.
- Incorrect answers receive a short English explanation.
- `Try again` is available where appropriate.
- The current quiz can show `Question 2 of 5`, but no long-term score or user profile is saved.
- Refreshing may reset the active quiz.

## 6. Dialogue Experience

Dialogue is intentionally simple in the first implementation.

### First version

- One primary group-recorded short-drama video area.
- A short English scenario description.
- Role and member mapping.
- A complete transcript with Korean and nearby English translation.
- The first-version transcript shows Korean and nearby English translation. Line-by-line romanization and synchronised pronunciation support are deferred with the other enhanced dialogue features.
- The dialogue reuses vocabulary and grammar that Learn already introduced.
- All final recording duration, speaker count, line count, real-face, real-voice, and participation requirements from the coursework specification remain mandatory.

### Deferred enhancements

The first version does not require synchronised transcript highlighting, automatic line tracking, scene tabs, or interactive speaker selection. These may be added only after the core video and transcript are complete.

### Missing-media state

When the drama video is not ready, the page shows the scenario, roles, and transcript plus a clean `Dialogue video coming soon` state. It does not imitate a playable video or show broken controls.

## 7. Team Experience

Team contains the coursework and contributor information that would otherwise distract from learning.

### Content

- Website purpose and clear statement that the seven lessons are adapted from Lec 1.
- Member name and student ID.
- Member role and contribution summary.
- Assigned vocabulary items and recording count.
- Dialogue role or participation.
- Optional member photograph when supplied.

### Layout and data

- A responsive card grid supports 2-6 members without changing component markup.
- Development may use explicit `Member 1` and `Member 2` placeholders.
- Placeholder identities are never treated as submission-ready.
- Contribution counts and required-media validation may appear in Team or a development-only readiness panel, not in the main Learn task.

## 8. Visual Direction

### Selected style

- White primary background with generous breathing room.
- Charcoal content text.
- Vivid obangsaek-inspired cobalt blue, vermilion red, jade green, and warm yellow.
- A slim colourful traditional-pattern band below the header.
- Small Korean palace-gate brand mark.
- Very low-contrast gray palace or Korean architectural line art only in unused edge space.
- Limited cloud-line or lattice details.

The UI must feel clean before it feels decorative. Korean cultural elements support identity but never reduce text contrast or compete with the lesson.

### Avoid

- Dark navy page backgrounds.
- Dense decorative panels.
- Beige paper texture across the full interface.
- Multiple unrelated Korean motifs on the same screen.
- Large video dominating the viewport.
- Nested cards for every line of content.
- Korean-only menus or word selectors.
- Disabled controls that look actionable.
- Contributor checklists inside learner-facing cards.

### Interaction and motion

- Short content transitions and clear hover, pressed, selected, focus, success, and error states.
- Motion is subtle and respects `prefers-reduced-motion`.
- Changing a vocabulary item does not cause layout jumping.
- Primary navigation and word controls remain predictable across lessons.

## 9. Responsive Behavior

### Desktop

- Three-column Learn layout.
- Compact video and visible Previous/Next controls.
- Full four-item primary navigation.

### Tablet

- Bilingual word selector remains visible, with video and details arranged to preserve reading order.
- Video and text may stack when the viewport can no longer sustain three columns.

### Mobile

- The left word rail becomes a horizontal bilingual selector or accessible item chooser.
- Korean and English labels remain together.
- Video, word information, example, and navigation form a single vertical flow.
- Previous/Next actions remain reachable without horizontal overflow.
- The four-item navigation becomes an accessible compact menu when necessary.

## 10. Accessibility and Beginner Comprehension

- The document language is English; Korean words and sentences use `lang="ko"`.
- Navigation, instructions, buttons, media states, feedback, and errors use plain English.
- Korean text never serves as the only label for a primary control.
- Videos have captions or adjacent transcripts.
- All controls work with keyboard and have visible focus indicators.
- Active and result states do not rely on color alone.
- Essential text and controls meet WCAG AA contrast targets.
- Heading order is logical.
- Native media semantics are preferred for playable videos.
- A missing media state remains readable and navigable.

## 11. State and Privacy Boundaries

- No authentication, account, backend, database, learner profile, or cloud progress storage.
- No name collection, email collection, or analytics requirement.
- No `Continue learning`, `Welcome back`, personal streak, or saved completion percentage.
- Item selection, current quiz answer, and viewed markers may exist in React memory during the current browsing session.
- Reloading the page may reset learner interaction state.
- Course content and member assignment data remain typed local project data.
- Real member names and student IDs are coursework content displayed on Team, not learner account data.

## 12. Data and Component Boundaries

Core data entities remain locally defined and support 2-6 members:

- `Member`: identity, student ID, role, contributions, vocabulary assignments, and dialogue participation.
- `Lesson`: title, English objective, content blocks, vocabulary IDs, grammar references, and practice ID.
- `VocabularyItem`: Korean, English, romanization, pronunciation hint, bilingual example, grammar note, owner, and member video.
- `Exercise`: lesson, prompt, answer type, options, correct answer, and English explanation.
- `Dialogue`: scenario, roles, bilingual lines, full video, and member participation.

Primary UI components:

- `AppShell`: brand, four-item navigation, cultural strip, and decorative background.
- `LessonSelector`: compact access to the seven Lec 1-derived lessons.
- `LearnWordRail`: bilingual selectable words and current-item state.
- `MemberVideo`: real playback, captions/transcript link, and honest missing state.
- `WordDetails`: Korean, English, romanization, pronunciation, bilingual example, and usage note.
- `WordNavigation`: Previous/Next behavior that remains visible on desktop.
- `PracticeIndex` and `QuizEngine`: lesson selection, answer submission, feedback, and retry.
- `DialogueExperience`: scenario, video, roles, and transcript.
- `TeamGrid`: responsive 2-6 member information.
- `SubmissionReadiness`: development-only validation separated from the learner flow.

## 13. Coursework and Submission Safeguards

The redesign changes presentation, not assessment obligations. Before submission, the project must still verify the requirements documented from the coursework specification, including:

- Lec 1 is the only selected source lesson.
- Every member has real identity information where required for submission.
- Every member owns the required number of vocabulary recordings.
- Every assessed word has Korean, English, a Korean example, assigned owner, and required real-member recording evidence.
- Every member recording shows that member's face and uses that member's voice.
- The three Lec 1 grammar points and required exercise counts are present.
- Required dialogues satisfy speaker, line, duration, translation, participation, real-face, and real-voice rules.
- No AI-generated speech is used.
- Development placeholders and missing media make submission readiness fail.

The final human review must check pronunciation, intonation, acting, lighting, background noise, and natural verbal flow. Automated validation cannot guarantee rubric marks.

## 14. Verification Strategy

### Behavior

- The four navigation destinations load and identify the active page.
- Learn opens real content without Start or Continue gates.
- Every word selector contains Korean and English.
- Clicking a word updates the assigned video and word details.
- Previous/Next stays within bounds and follows the displayed word order.
- No speaker selector exists.
- Missing video states have no false playback action.
- Lesson quiz answers produce correct English feedback and retry behavior.
- Dialogue and Team fallback content remains readable.
- Reloading does not claim to restore personal progress.

### Accessibility

- Keyboard-only completion of word selection and quiz flow.
- Korean language tags.
- Accessible media labels and transcripts.
- Focus order and visible focus.
- Automated accessibility checks on Learn, Practice, Dialogue, and Team.

### Responsive and visual QA

- Compare the refined Direction A mock with the implementation at the same desktop viewport.
- Confirm the compact video and word navigation remain above the fold at the target desktop size.
- Check tablet and mobile layouts for bilingual selection, overflow, and touch-target size.
- Inspect cultural decoration for contrast and crowding.
- Verify that Korean type renders correctly on Windows and common browsers.

### Build quality

- Unit and interaction tests pass.
- Type checking passes.
- Linting passes.
- Production build passes.
- Coursework content validation reports exact missing items rather than a generic failure.

## 15. Implementation Boundary

The first implementation pass will focus on the approved learner-facing structure and visual system:

1. Simplify the primary navigation.
2. Remove personalized/home-progress concepts.
3. Refine Learn into bilingual word selection + compact video + beginner details.
4. Align Practice to lesson-based quizzes.
5. Simplify Dialogue to one main video and transcript experience.
6. Move contributor and readiness information to Team or development-only views.
7. Apply beginner language, accessibility, responsive, and honest missing-media rules across the four destinations.

New media, real member identities, and final dialogue recordings remain content dependencies supplied by the group. The implementation must make these dependencies explicit without pretending they are complete.
