# Two-Unit Course Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Korean Stage around two nine-word Vocabulary units, two beginner Grammar units, useful word imagery, and all-at-once Practice quizzes.

**Architecture:** Replace the shared seven-lesson model with category-specific vocabulary and grammar catalogs, each with independent display numbering and semantic routes. Keep course content as the single source of truth, let the Vocabulary journey render an explicit image descriptor per word, and make one submit-all exercise engine serve both topic practice and the comprehensive Quiz.

**Tech Stack:** React 19, TypeScript, React Router, Tailwind CSS plus existing component CSS, Vitest, Testing Library, axe-core, Vite

**Spec:** `docs/superpowers/specs/2026-09-14-two-unit-course-restructure-design.md`

## Global Constraints

- Keep the primary navigation: Vocabulary, Grammar, Practice, Dialogue, Team.
- Do not add accounts, login, or persisted learner progress.
- Preserve the approved Vocabulary layout and its one-viewport desktop target at 100% zoom.
- Keep the member recording visually and semantically separate from word imagery.
- Bundle every new image locally and resolve it through `publicAssetPath()` for GitHub Pages.
- Do not represent generated or illustrative media as a real member recording.
- Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact.

## File Structure

- `src/content/types.ts`: category-specific unit and word-image contracts.
- `src/content/course.ts`: two Vocabulary catalogs, two Grammar catalogs, eighteen words, examples, tips, and exercises.
- `src/content/practiceCatalog.ts`: four topic practice groups derived from course data.
- `src/content/validateCourse.ts`: coursework and catalog validation.
- `src/components/VocabularyJourney.tsx`: word-image rendering and next-unit navigation.
- `src/components/GrammarGuide.tsx`: structured beginner grammar sections.
- `src/components/ExerciseEngine.tsx`: shared submit-all quiz interaction.
- `src/pages/VocabularyPage.tsx`, `src/pages/GrammarPage.tsx`, `src/pages/PracticePage.tsx`: selector and detail-page wiring.
- `src/navigation.ts`, `src/routeObjects.tsx`: semantic routes and old-link redirects.
- `src/styles.css`: additive image, grammar, and quiz presentation styles.
- `public/assets/flags/nz.svg`: New Zealand flag.
- `public/assets/occupations/*.svg`: nine consistent occupation illustrations.
- Existing colocated `*.test.ts` and `*.test.tsx` files: behavior contracts.

---

### Task 1: Category-Specific Course Catalogs

**Files:**
- Modify: `src/content/types.ts`
- Modify: `src/content/course.ts`
- Modify: `src/content/validateCourse.ts`
- Test: `src/content/vocabularyRevision.test.ts`
- Test: `src/content/vocabularyCatalog.test.ts`
- Test: `src/content/lessonCatalog.test.ts`
- Test: `src/content/validateCourse.test.ts`

**Interfaces:**
- Produces: `VocabularyUnitId = 'vocabulary-1' | 'vocabulary-2'`
- Produces: `GrammarUnitId = 'grammar-1' | 'grammar-2'`
- Produces: `WordImage = { src: string; alt: string; kind: 'flag' | 'occupation' }`
- Produces: `vocabularyUnits` and `grammarUnits` catalog arrays with semantic slugs.
- Consumed by: Vocabulary, Grammar, Practice, routing, and validation tasks.

- [ ] **Step 1: Write failing catalog tests**

```ts
expect(vocabularyUnits.map((unit) => unit.title)).toEqual([
  'Countries & Nationalities',
  'Jobs & Occupations',
])
expect(course.vocabulary.filter((item) => item.unitId === 'vocabulary-1')).toHaveLength(9)
expect(course.vocabulary.filter((item) => item.unitId === 'vocabulary-2')).toHaveLength(9)
expect(course.vocabulary.some((item) => item.id === 'yes' || item.id === 'no')).toBe(false)
expect(course.vocabulary.find((item) => item.id === 'new-zealand')?.korean).toBe('뉴질랜드')
expect(course.vocabulary.find((item) => item.id === 'police-officer')?.korean).toBe('경찰관')
expect(new Set(course.vocabulary.map((item) => item.grammarTip))).toHaveSize(18)
```

- [ ] **Step 2: Run the focused content tests and confirm failure**

Run: `npm test -- --run src/content/vocabularyRevision.test.ts src/content/vocabularyCatalog.test.ts src/content/lessonCatalog.test.ts src/content/validateCourse.test.ts`

Expected: FAIL because the existing content still exposes three Vocabulary and three Grammar units and lacks the two new words.

- [ ] **Step 3: Introduce category-specific types**

```ts
export type VocabularyUnitId = 'vocabulary-1' | 'vocabulary-2'
export type GrammarUnitId = 'grammar-1' | 'grammar-2'

export type WordImage = {
  src: string
  alt: string
  kind: 'flag' | 'occupation'
}

export type LearningUnit<TId extends string> = {
  id: TId
  slug: string
  title: string
  eyebrow: string
  description: string
}
```

Update `VocabularyItem.unitId`, `GrammarPoint.unitId`, and `VocabularyItem.image` to use these contracts.

- [ ] **Step 4: Replace the course catalogs and content**

Export these exact catalogs:

```ts
export const vocabularyUnits: LearningUnit<VocabularyUnitId>[] = [
  { id: 'vocabulary-1', slug: 'countries', title: 'Countries & Nationalities', eyebrow: 'Unit 1', description: 'Learn country names used to introduce where someone is from.' },
  { id: 'vocabulary-2', slug: 'occupations', title: 'Jobs & Occupations', eyebrow: 'Unit 2', description: 'Learn common occupations for introducing yourself and others.' },
]

export const grammarUnits: LearningUnit<GrammarUnitId>[] = [
  { id: 'grammar-1', slug: 'identity', title: 'Talking about who someone is', eyebrow: 'Unit 1', description: 'Use topic markers and polite “to be” endings.' },
  { id: 'grammar-2', slug: 'negative-identity', title: 'Saying what someone is not', eyebrow: 'Unit 2', description: 'Use 이/가 아니에요 to correct or clarify identity.' },
]
```

Move the eight revised countries into `vocabulary-1`, add `뉴질랜드 — New Zealand`, move the eight revised occupations into `vocabulary-2`, and add `경찰관 — Police officer`. Give both new items romanization, pronunciation guidance, bilingual examples, unique grammar tips, and missing-member media metadata matching the other revised words.

- [ ] **Step 5: Update validation for the new model**

Require exactly two Grammar units, exactly nine vocabulary items per Vocabulary unit, 3–5 assigned words per member once ownership is filled, unique examples and tips, and no AI voice media.

- [ ] **Step 6: Run content tests**

Run: `npm test -- --run src/content/vocabularyRevision.test.ts src/content/vocabularyCatalog.test.ts src/content/lessonCatalog.test.ts src/content/validateCourse.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit the content model**

```bash
git add src/content/types.ts src/content/course.ts src/content/validateCourse.ts src/content/*.test.ts
git commit -m "feat: restructure course into two vocabulary and grammar units"
```

---

### Task 2: Vocabulary Images Without Layout Regression

**Files:**
- Create: `public/assets/flags/nz.svg`
- Create: `public/assets/occupations/student.svg`
- Create: `public/assets/occupations/teacher.svg`
- Create: `public/assets/occupations/engineer.svg`
- Create: `public/assets/occupations/designer.svg`
- Create: `public/assets/occupations/doctor.svg`
- Create: `public/assets/occupations/nurse.svg`
- Create: `public/assets/occupations/firefighter.svg`
- Create: `public/assets/occupations/pharmacist.svg`
- Create: `public/assets/occupations/police-officer.svg`
- Modify: `src/components/VocabularyJourney.tsx`
- Modify: `src/styles.css`
- Test: `src/components/VocabularyJourney.test.tsx`
- Test: `src/assets.test.ts`
- Test: `src/responsive-contract.test.tsx`

**Interfaces:**
- Consumes: `VocabularyItem.image: WordImage` and `publicAssetPath(path)`.
- Produces: `VocabularyWordImage({ item, placement })` with `placement: 'rail' | 'detail'`.
- Preserves: Existing `VocabularyMemberMedia`, circular member video, waveform audio panel, and compact Listen & watch button.

- [ ] **Step 1: Write failing image and layout tests**

```tsx
expect(screen.getByRole('img', { name: 'Thailand flag' })).toHaveAttribute(
  'src',
  expect.stringContaining('/assets/flags/th.svg'),
)
expect(screen.getByRole('img', { name: 'Student occupation illustration' })).toHaveAttribute(
  'src',
  expect.stringContaining('/assets/occupations/student.svg'),
)
expect(screen.getByTestId('member-video-region')).toBeInTheDocument()
expect(screen.getByTestId('word-image-region')).toBeInTheDocument()
```

Add a static contract assertion that the desktop Vocabulary shell still uses its approved three-region grid and keeps the media column under Vocabulary path.

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `npm test -- --run src/components/VocabularyJourney.test.tsx src/assets.test.ts src/responsive-contract.test.tsx`

Expected: FAIL because occupation images and New Zealand’s flag do not exist and image rendering is country-specific.

- [ ] **Step 3: Add local SVG learning assets**

Create one bright, clean flat-vector occupation illustration per word using a consistent cobalt, jade, vermilion, and yellow palette. Keep each SVG viewBox square, use no embedded text, and avoid realistic faces so it cannot be mistaken for member video.

- [ ] **Step 4: Replace the hard-coded flag map with the explicit image field**

```tsx
function VocabularyWordImage({ item, placement }: {
  item: VocabularyItem
  placement: 'rail' | 'detail'
}) {
  return (
    <img
      alt={placement === 'detail' ? item.image.alt : ''}
      className={`vocabulary-word-image vocabulary-word-image--${placement}`}
      data-testid={placement === 'detail' ? 'word-image-region' : undefined}
      src={publicAssetPath(item.image.src)}
    />
  )
}
```

Render the small duplicate at the end of each rail card and the larger learning image beside the active word details without moving the member-media column.

- [ ] **Step 5: Add responsive styles**

Desktop detail imagery must fit within the center content, rail imagery must not reduce bilingual label readability, and mobile detail imagery must scale below the word heading without horizontal overflow.

- [ ] **Step 6: Run image and responsive tests**

Run: `npm test -- --run src/components/VocabularyJourney.test.tsx src/assets.test.ts src/responsive-contract.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit the visual vocabulary support**

```bash
git add public/assets src/components/VocabularyJourney.tsx src/components/VocabularyJourney.test.tsx src/styles.css src/assets.test.ts src/responsive-contract.test.tsx
git commit -m "feat: add visual vocabulary cues"
```

---

### Task 3: Semantic Routes and Two-Unit Selectors

**Files:**
- Modify: `src/navigation.ts`
- Modify: `src/routeObjects.tsx`
- Modify: `src/pages/VocabularyPage.tsx`
- Modify: `src/pages/GrammarPage.tsx`
- Modify: `src/components/GrammarGuide.tsx`
- Modify: `src/components/VocabularyJourney.tsx`
- Test: `src/App.test.tsx`
- Test: `src/pages/VocabularyPage.test.tsx`
- Test: `src/pages/GrammarPage.test.tsx`
- Test: `src/pages/LearnPage.test.tsx`

**Interfaces:**
- Consumes: `vocabularyUnits` and `grammarUnits`.
- Produces: semantic pages at `/vocabulary/countries`, `/vocabulary/occupations`, `/grammar/identity`, and `/grammar/negative-identity`.
- Produces: legacy redirects that preserve old route meaning.

- [ ] **Step 1: Write failing selector and redirect tests**

```tsx
expect(screen.getAllByRole('link', { name: /Open Unit/ })).toHaveLength(2)
expect(screen.getByRole('link', { name: /Countries/ })).toHaveAttribute('href', '/vocabulary/countries')
expect(screen.getByRole('link', { name: /Occupations/ })).toHaveAttribute('href', '/vocabulary/occupations')
```

Route tests must assert:

```ts
['/vocabulary/lesson-2', '/vocabulary/countries'],
['/vocabulary/lesson-3', '/vocabulary/occupations'],
['/grammar/lesson-4', '/grammar/identity'],
['/grammar/lesson-5', '/grammar/identity'],
['/grammar/lesson-6', '/grammar/negative-identity'],
```

- [ ] **Step 2: Run route/page tests and confirm failure**

Run: `npm test -- --run src/App.test.tsx src/pages/VocabularyPage.test.tsx src/pages/GrammarPage.test.tsx src/pages/LearnPage.test.tsx`

Expected: FAIL because pages still use shared `lesson-N` slugs.

- [ ] **Step 3: Wire selectors to category catalogs**

Vocabulary maps only `vocabularyUnits`; Grammar maps only `grammarUnits`. Display category-local `Unit 1` and `Unit 2` labels, beginner-friendly descriptions, and no shared lesson number.

- [ ] **Step 4: Add semantic routes and explicit legacy redirects**

Keep the category detail route parameterized, but resolve against semantic `slug` fields. Register redirect entries before the generic detail routes. Send removed `/vocabulary/lesson-1` to `/vocabulary`.

- [ ] **Step 5: Update Next unit and Practice links**

The ninth country links to `/vocabulary/occupations`; the ninth occupation links to `/vocabulary`. Grammar Unit 1 links to `/practice/grammar-1`; Grammar Unit 2 links to `/practice/grammar-2`.

- [ ] **Step 6: Run route/page tests**

Run: `npm test -- --run src/App.test.tsx src/pages/VocabularyPage.test.tsx src/pages/GrammarPage.test.tsx src/pages/LearnPage.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit routing and selectors**

```bash
git add src/navigation.ts src/routeObjects.tsx src/pages src/components/GrammarGuide.tsx src/components/VocabularyJourney.tsx src/App.test.tsx
git commit -m "feat: add independent vocabulary and grammar routes"
```

---

### Task 4: Two Structured Beginner Grammar Guides

**Files:**
- Modify: `src/content/types.ts`
- Modify: `src/content/course.ts`
- Modify: `src/components/GrammarGuide.tsx`
- Modify: `src/styles.css`
- Test: `src/components/GrammarLesson.test.tsx`
- Test: `src/pages/GrammarPage.test.tsx`

**Interfaces:**
- Produces: `GrammarPoint` fields `meaning`, `rules`, `examples`, `combinedPattern`, `combinedExamples`, and `wrapUp`.
- Consumes: revised country and occupation vocabulary in every example.

- [ ] **Step 1: Write failing grammar structure tests**

```tsx
expect(screen.getByRole('heading', { name: 'Meaning' })).toBeVisible()
expect(screen.getByRole('heading', { name: 'Rule' })).toBeVisible()
expect(screen.getByRole('heading', { name: 'Examples' })).toBeVisible()
expect(screen.getByRole('heading', { name: 'Put it together' })).toBeVisible()
expect(screen.getByRole('heading', { name: 'Quick wrap-up' })).toBeVisible()
expect(screen.getByText('Topic + 은/는 + Noun + 이에요/예요')).toBeVisible()
```

- [ ] **Step 2: Run Grammar tests and confirm failure**

Run: `npm test -- --run src/components/GrammarLesson.test.tsx src/pages/GrammarPage.test.tsx`

Expected: FAIL because `GrammarGuide` currently renders one explanation, rule list, and example grid only.

- [ ] **Step 3: Expand the Grammar data contract and content**

Grammar Unit 1 covers consonant/vowel selection for 이에요/예요, consonant/vowel selection for 은/는, and the combined identity pattern. Grammar Unit 2 covers consonant/vowel selection for 이/가 아니에요 and contrasts a positive identity with a corrected negative identity. Use examples such as `민수는 소방관이에요.`, `마리아는 스페인 사람이에요.`, `준호는 의사가 아니에요.`, and `아나는 태국 사람이 아니에요.` with English translations.

- [ ] **Step 4: Render five scannable sections**

Use a clear reading order, bilingual example cards, one visually distinct formula card, and a compact wrap-up. Keep English explanations beside every Korean rule so a complete beginner never has to infer meaning.

- [ ] **Step 5: Run Grammar tests**

Run: `npm test -- --run src/components/GrammarLesson.test.tsx src/pages/GrammarPage.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit Grammar guides**

```bash
git add src/content/types.ts src/content/course.ts src/components/GrammarGuide.tsx src/components/GrammarLesson.test.tsx src/pages/GrammarPage.test.tsx src/styles.css
git commit -m "feat: create two beginner grammar guides"
```

---

### Task 5: Submit-All Practice and Comprehensive Quiz

**Files:**
- Modify: `src/content/practiceCatalog.ts`
- Modify: `src/components/ExerciseEngine.tsx`
- Modify: `src/pages/PracticePage.tsx`
- Modify: `src/styles.css`
- Test: `src/content/practiceCatalog.test.ts`
- Test: `src/components/ExerciseEngine.test.tsx`
- Test: `src/pages/PracticePage.test.tsx`
- Test: `src/accessibility.test.tsx`

**Interfaces:**
- Produces: four `PracticeGroup` objects with ids `vocabulary-1`, `vocabulary-2`, `grammar-1`, and `grammar-2`.
- Produces: `ExerciseEngine` submit-all behavior with `phase: 'questions' | 'results'`.
- Consumes: `isExerciseAnswerComplete()`, `isExerciseAnswerCorrect()`, and `formatCorrectExerciseAnswer()`.

- [ ] **Step 1: Write failing submit-all interaction tests**

```tsx
expect(screen.getAllByText(/Question \d+ of/)).toHaveLength(exercises.length)
expect(screen.getByRole('button', { name: 'Submit answers' })).toBeDisabled()
expect(screen.queryByText('Correct')).not.toBeInTheDocument()
expect(screen.queryByText('Not quite')).not.toBeInTheDocument()
```

Fill every answer, assert the button becomes enabled, submit once, then assert score plus per-question feedback and a single `Try again` button. Assert that `Auto-next after 2.5 seconds` and `Next question` do not exist.

- [ ] **Step 2: Write failing Practice catalog/page tests**

```ts
expect(practiceGroups.map((group) => group.id)).toEqual([
  'vocabulary-1',
  'vocabulary-2',
  'grammar-1',
  'grammar-2',
])
```

Assert the comprehensive card is named `Quiz`, links to `/practice/quiz`, and combines all four groups.

- [ ] **Step 3: Run focused Practice tests and confirm failure**

Run: `npm test -- --run src/content/practiceCatalog.test.ts src/components/ExerciseEngine.test.tsx src/pages/PracticePage.test.tsx src/accessibility.test.tsx`

Expected: FAIL because the current engine displays one question, checks selections immediately, and waits 2.5 seconds.

- [ ] **Step 4: Rebuild the Practice catalog**

Create two nine-question Vocabulary groups from the two word arrays and two Grammar groups from the revised grammar exercises. Give `PracticeGroup` explicit `id`, `kind`, `unitNumber`, `title`, and `exercises` fields so the page never derives labels from obsolete shared lesson numbers.

- [ ] **Step 5: Replace sequential state with submit-all state**

```ts
type QuizPhase = 'questions' | 'results'

const allComplete = exercises.every((exercise) =>
  isExerciseAnswerComplete(exercise, answers[exercise.id]),
)

const submitAll = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  if (!allComplete) return
  setFeedback(Object.fromEntries(exercises.map((exercise) => [
    exercise.id,
    { isCorrect: isExerciseAnswerCorrect(exercise, answers[exercise.id]) },
  ])))
  setPhase('results')
}
```

Render one outer form containing all question fieldsets and one sticky-on-mobile-safe submit row. During `questions`, changing an answer never creates feedback. During `results`, lock answers, show complete feedback, score, and `Try again`.

- [ ] **Step 6: Simplify the Practice page**

Show four topic cards and one prominent comprehensive `Quiz` card. Topic and comprehensive routes both render the same submit-all engine. Copy explains: “Answer every question, then submit once to see your score and explanations.”

- [ ] **Step 7: Run Practice and accessibility tests**

Run: `npm test -- --run src/content/practiceCatalog.test.ts src/components/ExerciseEngine.test.tsx src/pages/PracticePage.test.tsx src/accessibility.test.tsx`

Expected: PASS with no timer-dependent assertions.

- [ ] **Step 8: Commit Practice behavior**

```bash
git add src/content/practiceCatalog.ts src/content/practiceCatalog.test.ts src/components/ExerciseEngine.tsx src/components/ExerciseEngine.test.tsx src/pages/PracticePage.tsx src/pages/PracticePage.test.tsx src/styles.css src/accessibility.test.tsx
git commit -m "feat: make practice quizzes submit all at once"
```

---

### Task 6: Cross-Page Cleanup, Verification, and Browser Review

**Files:**
- Modify: `src/content/courseSummary.ts`
- Modify: `src/content/courseSummary.test.ts`
- Modify: `src/components/SubmissionReadiness.tsx`
- Modify: `src/components/SubmissionReadiness.test.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `AGENTS.md`
- Test: all existing test files

**Interfaces:**
- Consumes: final course catalogs and routes.
- Produces: consistent counts and labels across homepage, team readiness, navigation, and coursework summaries.

- [ ] **Step 1: Add failing cross-page assertions**

Assert that no visible page uses `Everyday Essentials`, `five lessons`, `Lesson 4`, `Lesson 5`, or `Lesson 6`; summary counts report 18 vocabulary words and 2 Grammar units; home-page links target the semantic selectors.

- [ ] **Step 2: Run the full test suite and collect failures**

Run: `npm test -- --run`

Expected: any remaining stale shared-unit assumptions fail by filename and assertion.

- [ ] **Step 3: Update only stale consumers**

Replace shared-lesson wording and counts in summary, readiness, homepage, and tests. Record the durable two-Unit structure, submit-all Practice behavior, and word imagery rule in `AGENTS.md`.

- [ ] **Step 4: Run complete automated verification**

Run: `npm test -- --run`

Expected: all tests PASS.

Run: `npm run typecheck`

Expected: exit code 0.

Run: `npm run lint`

Expected: exit code 0.

Run: `npm run build`

Expected: exit code 0 and `dist/client/index.html` exists.

Run: `npm run test:sites`

Expected: exit code 0 and Sites package tests PASS.

- [ ] **Step 5: Review the built site in the browser**

Open and inspect:

- `/vocabulary`
- `/vocabulary/countries`
- `/vocabulary/occupations`
- `/grammar`
- `/grammar/identity`
- `/grammar/negative-identity`
- `/practice`
- `/practice/quiz`

At desktop 100% zoom, confirm the Vocabulary page fits comfortably without hiding its navigation. At mobile width, confirm natural vertical flow, no horizontal overflow, readable bilingual labels, image separation from member media, keyboard focus visibility, and complete Quiz submission/results.

- [ ] **Step 6: Commit final synchronization**

```bash
git add src AGENTS.md
git commit -m "chore: synchronize two-unit course experience"
```
