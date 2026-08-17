# Korean Stage Website Design Specification

**Status:** Approved for implementation on 2026-08-17

**Course:** LMPU3282 Korean for Beginners

**Selected source lesson:** Lec 1 only

**Initial group size:** 2 members

**Supported group size:** 2-6 members

## 1. Purpose

Korean Stage is a beginner-friendly educational website that reorganizes the content of Lec 1 into seven short learning units. It must satisfy every website-content requirement in the T2620 LMPU3282 coursework specification while presenting the material as a coherent course rather than one long page.

The student-facing interface uses English for explanations and Korean for learning content. The site must never generate or use AI speech. All assessed vocabulary audio, vocabulary video, and dialogue video must use the enrolled group members' real faces and voices.

## 2. Source Material and Design Target

- Coursework requirements: `C:\Users\Nitro\Downloads\T2620_LMPU3282_Coursework Specification.pdf`
- Lesson content: `C:\Users\Nitro\Downloads\04_LMPU3282_Note_L1.pdf`
- Approved visual target: `docs/design/korean-stage-approved-ui.png`

The website may rephrase explanations and create original examples, exercises, and dialogues from Lec 1. It must not present content from Lec 2-6 or imply that the seven website units are seven lecturer-provided lessons.

## 3. Product Scope

### In scope

- Responsive React website with seven learning units.
- Vocabulary learning with member-recorded selfie videos and human audio playback.
- Three Lec 1 grammar explanations.
- Three exercises per grammar point, for nine grammar exercises total.
- Vocabulary flashcards and an end-of-course review challenge.
- Two dialogues for the initial two-person group.
- Dialogue scripts, English translations, and 1-3 minute member-recorded drama videos.
- Team and website-purpose information.
- Local progress persistence without an account.
- Submission-readiness validation for content counts and missing required media or member data.

### Out of scope

- Authentication, accounts, a backend, database, content-management system, or cloud upload.
- AI-generated speech or automatic Korean pronunciation.
- Content from Lec 2-6.
- Teacher administration and grading tools.
- Public deployment until the user explicitly requests it.

## 4. Information Architecture

### Primary routes

| Route | Purpose |
|---|---|
| `/` | Course introduction, purpose, overall progress, seven-unit course map, and Start Learning action |
| `/learn/:unitId` | Shared sequential learning shell for Units 1-7 |
| `/vocabulary` | Search-free review deck for countries, nationalities, and occupations |
| `/grammar` | Overview and direct access to the three grammar units |
| `/practice` | Flashcards, grammar quiz, review challenge, results, and explanations |
| `/dialogue` | Two dialogue scripts, line-by-line playback, full drama videos, and translations |
| `/team` | Website purpose, member names, student IDs, assigned vocabulary, and dialogue participation |

### Global navigation

The header contains Learn, Vocabulary, Grammar, Practice, Dialogue, and Team. The active route is visually and programmatically identified. Desktop uses the full navigation; mobile uses an accessible menu button and panel.

Units remain directly accessible from the course map. Learning is encouraged in sequence through Previous and Next controls, but later units are not hard-locked.

## 5. Seven-Unit Curriculum

| Unit | Student-facing title | Lec 1 content | Required learning experience |
|---|---|---|---|
| 1 | Hello & Self-introduction | Greetings, names, and basic self-introduction | Short introduction, model sentences, human-audio replay, and a readiness check |
| 2 | Countries & Nationalities | Country and nationality vocabulary | Sequential member videos, Korean words, English meanings, Korean examples, audio replay, and flashcards |
| 3 | Jobs & Occupations | Occupation vocabulary | Sequential member videos, Korean words, English meanings, Korean examples, audio replay, and flashcards |
| 4 | 이에요 / 예요 | Identification ending | Clear English explanation, consonant/vowel rule, original examples, and three exercises |
| 5 | 은 / 는 | Topic marker | Clear English explanation, consonant/vowel rule, original examples, and three exercises |
| 6 | 이 / 가 아니에요 | Negative identification | Clear English explanation, consonant/vowel rule, original examples, and three exercises |
| 7 | Dialogue & Role Play | Integrated self-introduction dialogue | Two original dialogues, bilingual scripts, full videos, line replay, and a final review challenge |

The site labels these as **Units**, not Lessons. The home and Team pages state that all seven units are adapted exclusively from Lec 1.

## 6. Coursework Content Rules

### Vocabulary recording

- Every configured member owns 3-5 vocabulary items across Units 2 and 3.
- With two members, the submission contains 6-10 vocabulary items total. The initial content target is eight items, four per member.
- Every vocabulary item contains:
  - Korean word;
  - English translation;
  - Korean example sentence;
  - English sentence translation for learner support;
  - romanization as optional learner support;
  - member name;
  - member-recorded selfie video;
  - member-recorded audio file or human-voice audio extracted from that member's video.
- The video visibly shows the member's face and uses that member's own voice.
- A recording checklist reminds contributors to speak clearly, check pronunciation, use good lighting, and minimize background noise.

During development, missing media renders an explicit `Video coming soon` or `Audio coming soon` state. These states are acceptable only for development. The submission-readiness check must fail while any required vocabulary media is missing.

### Grammar explanation

The site explains all three grammar points from Lec 1 in clear English. Each explanation includes the rule, when to use it, consonant/vowel behavior where relevant, at least two original Korean examples, and English translations.

### Exercises

- Each grammar point has exactly three assessed exercises, satisfying the required range of 2-5.
- The nine exercises use a mix of multiple choice, particle selection, matching, and sentence completion.
- A learner can submit an answer, see whether it is correct, read a concise explanation, retry where appropriate, and view a final score.
- Flashcards supplement the nine exercises; they do not replace them.

### Dialogue and role play

- The initial two-member submission contains two dialogues.
- Each dialogue has exactly two named speakers for the initial group and supports a third speaker when the group grows.
- Each dialogue contains 6-8 Korean lines.
- Every Korean line has an English translation and an explicit speaker label.
- Every dialogue has a complete 1-3 minute drama-style video in which the members show their faces, use their own voices, and act naturally.
- All configured members appear in at least one dialogue.
- Line-by-line audio uses only audio from the members' recordings. Full-video playback remains available so the verbal flow can be assessed without interruption.

### Contact and member information

- The website name is Korean Stage.
- The home and Team pages briefly explain the website's purpose.
- Every configured member has a name, student ID, assigned vocabulary count, and dialogue participation shown on the Team page.
- Development labels such as Member 1 and Member 2 are not submission-ready. The readiness check fails until real names and student IDs are provided.

## 7. Visual Design

The implementation follows the approved desktop mockup.

### Visual language

- Pure white page background with generous whitespace.
- Charcoal text and vivid obangsaek-inspired accents: cobalt blue, vermilion red, sunny yellow, and jade green.
- A slim dancheong-inspired strip below the header.
- Very low-contrast cool-gray Korean architectural line art in unused lower-corner space.
- A small amount of cloud-line and Korean lattice detail.
- No dark navy background, beige paper texture, large skyline, heavy palace illustration, bojagi sidebar, tassels, dense ornament, or nested-card clutter.

### Learning screen

- Desktop: unit or item progression on the left, large member video in the center, learning details on the right, and Previous/Next controls below.
- Vocabulary progression is sequential. Learners do not choose a speaker before choosing a word.
- Progress markers, primary actions, and active states use vivid color; decoration remains secondary.
- Custom cultural illustrations are raster assets generated or sourced for the measured slots. UI icons come from one consistent open-source icon library.

### Motion

- Route and content changes use short, smooth transitions.
- Buttons, flashcards, answers, progress markers, and menus have clear hover, focus, pressed, selected, success, and error states.
- Motion respects `prefers-reduced-motion` and never blocks learning.

## 8. Responsive and Accessible Behavior

- Desktop targets the approved 1440 x 1024 composition.
- Tablet stacks the video and learning details while retaining the progress overview.
- Mobile replaces the left rail with a compact unit/item selector and keeps Previous/Next actions reachable without horizontal scrolling.
- All interactive controls work by keyboard.
- Every icon-only button has an accessible name.
- Videos have captions or an adjacent transcript; dialogue text remains available outside the video.
- Audio and video controls use native playback semantics where practical.
- Focus indicators are visible, heading order is logical, and current progress is not communicated by color alone.
- Text and essential controls meet WCAG AA color-contrast targets.

## 9. State and Data Design

Course content lives in typed local data modules rather than being hard-coded inside page components. The model supports 2-6 members without changing component code.

Core entities are:

- `Member`: identity, student ID, photo, vocabulary assignments, and dialogue participation.
- `VocabularyItem`: word, meaning, romanization, example, owner, video source, and audio source.
- `GrammarPoint`: title, explanation, rules, examples, and exercise IDs.
- `Exercise`: prompt, type, options or acceptable answer, correct answer, and explanation.
- `Dialogue`: title, speakers, 6-8 bilingual lines, full video source, and optional line-audio sources.
- `CourseProgress`: completed units, completed vocabulary items, exercise results, and last visited location.

Progress is stored in `localStorage`. Corrupt or obsolete progress data is discarded safely and replaced with the default state. Course content remains usable when storage is unavailable.

## 10. Component Boundaries

- `AppShell`: header, responsive navigation, global decorative assets, and page container.
- `CourseMap`: seven-unit overview and progress summary.
- `LearningShell`: shared unit heading, progress, Previous/Next behavior, and responsive layout.
- `VocabularyJourney`: ordered vocabulary sequence.
- `MemberVideo`: native playback, captions/transcript link, poster, and missing-media state.
- `HumanAudioButton`: playback for supplied real-member audio only.
- `GrammarLesson`: English explanation, rules, and examples.
- `ExerciseEngine`: question rendering, answer submission, feedback, retry, and scoring.
- `FlashcardDeck`: keyboard-operable vocabulary review.
- `DialoguePlayer`: bilingual script, active line, line replay, and full video.
- `TeamGrid`: purpose and member contribution information.
- `SubmissionReadiness`: development-only report of missing or invalid required content.

Each unit consumes typed course data and reports completion through one progress interface. Media components do not own course navigation, and exercise components do not own persistence.

## 11. Error and Empty States

- Missing vocabulary video: show the item text, transcript, owner, recording checklist, and `Video coming soon`; mark submission readiness as failed.
- Missing audio: disable playback with `Audio coming soon`; mark readiness as failed.
- Unsupported media: show the transcript and a clear playback error without losing navigation.
- Missing member name or student ID: show a development label and mark readiness as failed.
- Invalid dialogue length, speaker count, vocabulary ownership count, or video duration metadata: identify the exact failing item in the readiness report.
- Unknown unit route: show a friendly not-found state with a return-to-course action.
- Storage failure: continue without persistence and show a non-blocking notice only when useful.

## 12. Submission-Readiness Validation

Before submission, the content validator must confirm:

1. The course declares Lec 1 as its only source lesson.
2. Every member has a real name and student ID.
3. Every member owns 3-5 vocabulary items.
4. Every vocabulary item has the required Korean word, English translation, Korean example, owner, selfie video, and human audio.
5. There are three grammar points and each has 2-5 exercises.
6. There are 2-3 dialogues.
7. Every dialogue has 2-3 speakers, 6-8 bilingual labeled lines, and a 1-3 minute full video.
8. Every member participates in at least one dialogue.
9. No media entry is labeled or configured as AI-generated voice.
10. Website name, purpose, member details, audio playback, and all primary navigation destinations are present.

This validator checks completeness, not pronunciation quality, natural acting, lighting, background noise, or verbal flow. Those require human review of the final recordings.

## 13. Rubric Strategy

### Organization of responses and paragraph

The course follows a visible sequence: greeting, vocabulary, positive identification, topic marking, negative identification, and integrated dialogue. Grammar explanations use consistent sections, and dialogue scripts maintain a logical conversational order.

### Pronunciation and intonation

Large member-video presentation, replay controls, transcripts, and the recording checklist support assessment. The website cannot guarantee a high mark; members must rehearse and record clear, correct Korean with natural intonation.

### Flow of verbal communication

The Dialogue page prioritizes uninterrupted full-video playback. Line replay is a study aid and does not replace the continuous 1-3 minute drama recording used for assessment.

### Creativity

The approved Korean visual system, sequential learning journey, interactive exercises, flashcards, progress feedback, and culturally restrained motion make the presentation interesting without reducing clarity.

## 14. Testing and Verification

### Automated behavior tests

- Header navigation and route not-found behavior.
- Sequential Previous/Next vocabulary and unit navigation.
- Exercise answer evaluation, retry, explanations, and score calculation.
- Flashcard keyboard controls.
- Progress serialization, restoration, and recovery from corrupt storage.
- Content validator for every coursework count and required field.
- Media and member fallback states.
- Dialogue full playback state and line selection.

### Accessibility and responsive checks

- Keyboard-only completion of the primary learning flow.
- Accessible names, focus order, headings, transcripts, and non-color progress cues.
- Automated accessibility scan on the primary routes.
- Visual checks at desktop, tablet, and mobile widths.

### Design QA

The selected mockup and the rendered 1440 x 1024 implementation are compared in the same state. P0-P2 visual differences are corrected before handoff. The final `design-qa.md` must say `final result: passed`.

### Final media review

A human must verify every final vocabulary and dialogue recording for visible faces, member voices, pronunciation, intonation, lighting, noise, natural acting, and uninterrupted flow. Automated tests cannot award or guarantee rubric marks.

## 15. Definition of Done

The website is complete only when:

- all required routes and interactions work on desktop and mobile;
- automated tests, type checking, linting, production build, and accessibility checks pass;
- the submission-readiness validator passes with real member data and media;
- two human reviewers confirm the final recordings satisfy the recording checklist;
- the design QA report passes against the approved mockup;
- the implementation contains no AI-generated voice;
- the local verified prototype remains available for user review.
