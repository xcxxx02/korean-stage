# Korean Stage Two-Unit Course Restructure

## Goal

Restructure the Lec 1 website so its public learning model is clear to a beginner:

- Vocabulary has two independently numbered units.
- Grammar has two independently numbered units.
- Practice mirrors those four topics and uses an all-at-once submission flow.
- Vocabulary remains visually familiar while adding useful word imagery.
- Old shared lesson numbering must not remain visible or produce broken links.

The site remains account-free and does not store learner progress.

## Information Architecture

The five primary destinations remain Vocabulary, Grammar, Practice, Dialogue, and Team.

### Vocabulary

1. Unit 1: Countries & Nationalities
2. Unit 2: Jobs & Occupations

The old Everyday Essentials unit is removed. Each vocabulary unit contains nine individual words.

Countries:

1. 태국 — Thailand
2. 베트남 — Vietnam
3. 필리핀 — Philippines
4. 싱가포르 — Singapore
5. 인도네시아 — Indonesia
6. 스페인 — Spain
7. 이탈리아 — Italy
8. 브라질 — Brazil
9. 뉴질랜드 — New Zealand

Occupations:

1. 학생 — Student
2. 선생님 — Teacher
3. 엔지니어 — Engineer
4. 디자이너 — Designer
5. 의사 — Doctor
6. 간호사 — Nurse
7. 소방관 — Firefighter
8. 약사 — Pharmacist
9. 경찰관 — Police officer

Every item keeps Korean, English meaning, romanization, pronunciation guidance, a Korean example, an English translation, a specific grammar tip, member video metadata, and member audio metadata.

### Grammar

1. Unit 1: Talking about who someone is
   - 이에요/예요 for “am/is/are”
   - 은/는 as the topic marker
   - Combined pattern: `Topic + 은/는 + Noun + 이에요/예요`
2. Unit 2: Saying what someone is not
   - 이/가 아니에요 for negative identity
   - Combined pattern: `Topic + 은/는 + Noun + 이/가 아니에요`

Each grammar page presents Meaning, Rule, Examples, Put it together, and Quick wrap-up. Examples must reuse the revised country and occupation vocabulary and provide English support for beginners.

### Practice

Practice contains four topic cards:

1. Vocabulary Unit 1 quiz
2. Vocabulary Unit 2 quiz
3. Grammar Unit 1 quiz
4. Grammar Unit 2 quiz

It also contains one clearly named comprehensive `Quiz` covering all four topics.

All practice modes show every question on one page. Learners answer all questions and press `Submit answers` once. Before submission, no answer is marked right or wrong. After submission, the page shows:

- total score;
- correct/incorrect state for every question;
- the correct answer for missed questions;
- a short English explanation;
- one `Try again` action.

The 2.5-second delay, automatic progression, question-by-question Next button, and automatic checking on selection are removed.

## Vocabulary Visual Design

The approved desktop and responsive vocabulary layout remains the source of truth. Do not rearrange its word rail, learning details, compact Listen & watch control, Vocabulary path, circular member video, separate waveform audio panel, grammar tip, or navigation buttons.

Add imagery as learning support:

- Country items show a matching local flag asset in the word rail and the main word-detail region.
- Occupation items show a consistent, friendly occupation illustration or icon in the word rail and the main word-detail region.
- Word imagery must be visually distinct from the circular member-recording video so learners do not mistake the illustration for the presenter.
- Images use meaningful alternative text; decorative duplicates use empty alternative text.
- Assets are bundled locally and referenced with the Vite base path so GitHub Pages deployment works under `/korean-stage/`.

Visual additions must preserve the one-viewport desktop target at 100% browser zoom. Mobile may scroll naturally.

## Routes and Compatibility

Canonical public routes:

- `/vocabulary/countries` — Vocabulary Unit 1: Countries & Nationalities
- `/vocabulary/occupations` — Vocabulary Unit 2: Jobs & Occupations
- `/grammar/identity` — Grammar Unit 1: Talking about who someone is
- `/grammar/negative-identity` — Grammar Unit 2: Saying what someone is not
- `/practice/vocabulary-1`
- `/practice/vocabulary-2`
- `/practice/grammar-1`
- `/practice/grammar-2`
- `/practice/quiz`

Semantic canonical routes avoid a collision between the old shared lesson numbers and the new category-local unit numbers. Legacy links redirect by their old meaning: old Vocabulary lesson 2 goes to Countries, old Vocabulary lesson 3 goes to Occupations, old Grammar lessons 4 and 5 go to Identity, and old Grammar lesson 6 goes to Negative identity. The removed old Vocabulary lesson 1 goes to the Vocabulary selector. Invalid routes recover to the relevant selector page.

## Data and Component Boundaries

- Course data remains the single source of truth for unit labels, words, examples, tips, grammar lessons, and exercises.
- Vocabulary presentation consumes word imagery through an explicit optional asset field rather than hard-coded item checks.
- Practice catalog derives its four groups from the revised course data.
- The exercise engine gains one all-at-once submission flow shared by topic quizzes and the comprehensive Quiz.
- Media placeholders remain honest: no generated image is presented as a real member recording.

## Validation and Testing

Tests will verify:

- exactly two vocabulary units with nine words each;
- exactly two grammar units with the approved topics;
- unique vocabulary examples and grammar tips;
- correct flags and occupation imagery with accessible text;
- four practice groups plus the comprehensive Quiz;
- no feedback before final submission;
- complete results and retry behavior after submission;
- canonical routes and legacy redirects;
- responsive vocabulary layout at desktop and mobile sizes;
- asset paths work with the GitHub Pages base path;
- course validation, accessibility checks, type checking, linting, build, and Sites packaging remain green.

## Out of Scope

- User accounts, saved progress, or login
- Real member video/audio files before the team supplies them
- Dialogue content redesign beyond keeping links and existing content valid
- Changes to the already approved overall Korean visual identity
