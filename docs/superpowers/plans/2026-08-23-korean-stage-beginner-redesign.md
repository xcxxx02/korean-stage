# Korean Stage Beginner-First Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Korean Stage around a four-destination, beginner-first experience with direct lesson access, bilingual selectable vocabulary, compact real-member video, lesson-based practice, a simple dialogue presentation, and a clean 2-6 member Team page.

**Architecture:** Keep the existing React 19, React Router 7, typed local course data, Tailwind 4, and CSS-token foundation. Replace the current account-like progress flow with route and component-local state, keep coursework validation separate from the learner experience, and reuse the existing real-media safety model while removing duplicate audio controls from learner vocabulary and dialogue screens.

**Tech Stack:** React 19.2, TypeScript 6, React Router DOM 7.18, Tailwind CSS 4.3, Vite 6.4, Vitest 4.1, Testing Library, axe-core, Phosphor Icons.

**Spec:** `docs/superpowers/specs/2026-08-23-korean-stage-beginner-redesign.md`

## Global Constraints

- Use Lec 1 as the only content source.
- Primary navigation is exactly `Learn`, `Practice`, `Dialogue`, and `Team`.
- Do not add login, account, backend, learner identity, analytics, persistent learner progress, `Start learning`, `Continue learning`, `Welcome back`, streak, or saved completion percentage behavior.
- Opening `/` redirects directly to `/learn/lesson-1`.
- Learn shows Korean, adjacent English, romanization, visible pronunciation help, a bilingual example, and an English usage note for each first vocabulary presentation.
- Learners choose a word; the course data chooses the assigned member. Do not add a speaker selector.
- Do not show a separate `Listen to Member` control in the first learner-facing implementation. Real member video provides pronunciation audio.
- Do not enable playback controls for missing or invalid media.
- Keep coursework media and validation rules, including the prohibition on AI-generated speech.
- Keep the white background, vivid cobalt/vermilion/jade/yellow accents, palace mark, slim obangsaek band, and low-contrast Korean architectural line art.
- Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact.
- Every behavior change follows red-green-refactor TDD and ends with the focused tests passing.

---

## File Structure Map

### Course data and routing

- Modify `app/src/content/types.ts` — add member contribution and dialogue scenario fields without weakening existing media validation types.
- Modify `app/src/content/course.ts` — expose the seven public lesson slugs and populate Team/Dialogue display copy.
- Create `app/src/content/lessonCatalog.test.ts` — lock the seven public lesson slugs and required member/dialogue presentation fields.
- Modify `app/src/navigation.ts` — define only four primary destinations and explicit navigation targets.
- Modify `app/src/routeObjects.tsx` — root and legacy redirects plus the new lesson route.
- Modify `app/src/App.test.tsx` — route coverage and removal of obsolete primary destinations.
- Create `app/src/test/renderApp.tsx` — shared memory-router render helper for route tests.

### Application shell and learning

- Modify `app/src/components/AppShell.tsx` — four-item navigation and Learn active-state mapping.
- Modify `app/src/components/AppShell.test.tsx` — desktop/mobile navigation and active-state tests.
- Create `app/src/components/LessonSelector.tsx` — accessible seven-lesson popover/drawer trigger and list.
- Create `app/src/components/LessonSelector.test.tsx` — lesson selection, Escape, and bilingual-safe labels.
- Rewrite `app/src/pages/LearnPage.tsx` — resolve lesson slug, render the correct lesson content, and show the approved lesson header.
- Rewrite `app/src/pages/LearnPage.test.tsx` — direct content, lesson switching, invalid lesson handling, and no progress/dashboard copy.
- Create `app/src/components/IntroductionLesson.tsx` — Lesson 1 models without account/readiness completion UI.
- Create `app/src/components/GrammarGuide.tsx` — Learn-only grammar explanation without embedded assessed quiz controls.
- Delete `app/src/pages/UnitPage.tsx`, `app/src/pages/HomePage.tsx`, `app/src/pages/HomePage.test.tsx`, `app/src/pages/VocabularyPage.tsx`, `app/src/pages/VocabularyPage.test.tsx`, and `app/src/pages/GrammarPage.tsx` after routing no longer imports them.

### Vocabulary and media

- Rewrite `app/src/components/VocabularyJourney.tsx` — free bilingual word selection, sequential navigation, no lock/completion persistence, compact video, and visible beginner details.
- Rewrite `app/src/components/VocabularyJourney.test.tsx` — free selection, sequential controls, member assignment, no audio button, and honest missing media.
- Modify `app/src/components/MemberVideo.tsx` — learner mode with compact honest placeholder and no contributor checklist.
- Modify `app/src/styles.css` — approved three-column density, compact video, lesson selector, responsive word selector, and four-item header.

### Practice, Dialogue, and Team

- Create `app/src/content/practiceCatalog.ts` — lesson-grouped vocabulary and grammar practice definitions derived from existing course content.
- Create `app/src/content/practiceCatalog.test.ts` — supported lesson groups and beginner-safe prompts.
- Rewrite `app/src/pages/PracticePage.tsx` — lesson selection, quiz flow, English feedback, retry, and optional mixed challenge.
- Rewrite `app/src/pages/PracticePage.test.tsx` — lesson selection and no storage persistence.
- Modify `app/src/components/DialoguePlayer.tsx` — one primary video area, scenario, roles, and bilingual transcript; remove line audio and recording checklist from learner view.
- Modify `app/src/components/DialoguePlayer.test.tsx` — simple transcript/media states and no line-audio controls.
- Modify `app/src/pages/DialoguePage.tsx` — simple dialogue selection and no unit completion state.
- Modify `app/src/pages/TeamPage.tsx` — clean learner-facing Team heading and optional development readiness query.
- Modify `app/src/components/TeamGrid.tsx` — 2-6 member cards with role, contribution, assigned words, and dialogue participation.
- Modify `app/src/components/TeamGrid.test.tsx` — dynamic team count and clean default copy.

### Removed persistence and final verification

- Delete `app/src/hooks/useCourseProgress.ts`, `app/src/hooks/useCourseProgress.test.ts`, `app/src/progress/progressStore.ts`, and `app/src/progress/progressStore.test.ts` after all imports are removed.
- Modify `app/src/accessibility.test.tsx`, `app/src/responsive-contract.test.tsx`, `app/src/visualSystem.test.ts`, and `app/src/App.test.tsx` to cover the redesigned contract.
- Modify `app/AGENTS.md` — record the durable selected design decisions.
- Modify `app/design-qa.md` — record final same-viewport visual comparison and verified breakpoints.

---

### Task 1: Lock the Public Lesson Catalog and Presentation Data

**Files:**
- Modify: `app/src/content/types.ts`
- Modify: `app/src/content/course.ts`
- Create: `app/src/content/lessonCatalog.test.ts`
- Modify: `app/AGENTS.md`

**Interfaces:**
- Produces: `courseLessons: readonly { id: string; slug: LessonSlug; title: string }[]`
- Produces: `LessonSlug = 'lesson-1' | ... | 'lesson-7'`
- Produces: `getLessonBySlug(slug: string): CourseLesson | undefined`
- Extends: `Member` with `role: string` and `contribution: string`
- Extends: `Dialogue` with `scenario: string`
- Consumes: existing internal unit IDs used by vocabulary, grammar, and validators.

- [ ] **Step 1: Write the failing lesson catalog tests**

```ts
import { describe, expect, it } from 'vitest'
import { course, courseLessons, getLessonBySlug } from './course'

describe('public lesson catalog', () => {
  it('exposes seven Lec 1-derived public lesson slugs', () => {
    expect(courseLessons.map((lesson) => lesson.slug)).toEqual([
      'lesson-1', 'lesson-2', 'lesson-3', 'lesson-4',
      'lesson-5', 'lesson-6', 'lesson-7',
    ])
    expect(getLessonBySlug('lesson-3')?.id).toBe('unit-3')
    expect(getLessonBySlug('unit-3')).toBeUndefined()
  })

  it('supplies learner-facing team and dialogue presentation copy', () => {
    expect(course.members.every((member) => member.role && member.contribution)).toBe(true)
    expect(course.dialogues.every((dialogue) => dialogue.scenario)).toBe(true)
  })
})
```

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run: `npm test -- src/content/lessonCatalog.test.ts`

Expected: FAIL because `courseLessons`, `getLessonBySlug`, `Member.role`, `Member.contribution`, and `Dialogue.scenario` do not exist.

- [ ] **Step 3: Add the lesson catalog and display fields**

```ts
export type CourseLesson = {
  id: `unit-${1 | 2 | 3 | 4 | 5 | 6 | 7}`
  slug: `lesson-${1 | 2 | 3 | 4 | 5 | 6 | 7}`
  title: string
}

export type LessonSlug = CourseLesson['slug']

export const courseLessons = [
  { id: 'unit-1', slug: 'lesson-1', title: 'Hello & Self-introduction' },
  { id: 'unit-2', slug: 'lesson-2', title: 'Countries & Nationalities' },
  { id: 'unit-3', slug: 'lesson-3', title: 'Jobs & Occupations' },
  { id: 'unit-4', slug: 'lesson-4', title: '이에요 / 예요 - to be' },
  { id: 'unit-5', slug: 'lesson-5', title: '은 / 는 - topic marker' },
  { id: 'unit-6', slug: 'lesson-6', title: '이 / 가 아니에요 - to not be' },
  { id: 'unit-7', slug: 'lesson-7', title: 'Dialogue & Role Play' },
] as const satisfies readonly CourseLesson[]

// Temporary compatibility alias until the old pages are removed in Task 8.
export const courseUnits = courseLessons

export const getLessonBySlug = (slug: string) =>
  courseLessons.find((lesson) => lesson.slug === slug)
```

Add exact initial development fields to each member and scenario copy to each dialogue. Record in `app/AGENTS.md` that the selected durable design is the refined Direction A with four primary destinations, no persistent learner progress, a bilingual word rail, and compact member video.

```ts
members: [
  {
    id: 'member-1', name: 'Member 1', studentId: 'Add your student ID',
    isDevelopmentIdentity: true,
    role: 'Vocabulary presenter & dialogue performer',
    contribution: 'Presents the first four occupation words and performs in both dialogues.',
  },
  {
    id: 'member-2', name: 'Member 2', studentId: 'Add your student ID',
    isDevelopmentIdentity: true,
    role: 'Vocabulary presenter & dialogue performer',
    contribution: 'Presents the final four occupation words and performs in both dialogues.',
  },
],
```

Use `Meeting someone for the first time` for Dialogue 1's scenario and `Talking about jobs` for Dialogue 2's scenario.

- [ ] **Step 4: Run content and validator tests**

Run: `npm test -- src/content/lessonCatalog.test.ts src/content/validateCourse.test.ts src/content/courseSummary.test.ts`

Expected: PASS; existing coursework validation remains unchanged.

- [ ] **Step 5: Commit**

```bash
git add app/src/content/types.ts app/src/content/course.ts app/src/content/lessonCatalog.test.ts app/AGENTS.md
git commit -m "refactor: define public Korean lesson catalog"
```

### Task 2: Reduce Navigation to Four Destinations and Redirect Directly to Learn

**Files:**
- Modify: `app/src/navigation.ts`
- Modify: `app/src/routeObjects.tsx`
- Modify: `app/src/components/AppShell.tsx`
- Modify: `app/src/components/AppShell.test.tsx`
- Modify: `app/src/App.test.tsx`
- Create: `app/src/test/renderApp.tsx`

**Interfaces:**
- Consumes: `courseLessons[0].slug` from Task 1.
- Produces: `getPrimaryNavigationItems()` returning exactly Learn, Practice, Dialogue, Team.
- Produces: root `/` and `/learn` redirects to `/learn/lesson-1`.
- Produces: legacy `/vocabulary` redirect to `/learn/lesson-2` and `/grammar` redirect to `/learn/lesson-4` without listing either in navigation.
- Produces: `renderApp(initialEntries: string[])` for route-aware component tests.

- [ ] **Step 1: Write failing route and navigation tests**

```tsx
export function renderApp(initialEntries: string[]) {
  const router = createMemoryRouter(createAppRouteObjects(), { initialEntries })
  return render(<RouterProvider router={router} />)
}

it('renders exactly four primary destinations', () => {
  renderShell('/learn/lesson-3')
  const nav = screen.getByRole('navigation', { name: 'Primary navigation' })
  expect(within(nav).getAllByRole('link').map((link) => link.textContent)).toEqual([
    'Learn', 'Practice', 'Dialogue', 'Team',
  ])
  expect(within(nav).queryByText('Vocabulary')).not.toBeInTheDocument()
  expect(within(nav).queryByText('Grammar')).not.toBeInTheDocument()
  expect(within(nav).queryByText('Review')).not.toBeInTheDocument()
})

it('redirects the root directly to the first lesson', async () => {
  renderApp(['/'])
  expect(await screen.findByRole('heading', { name: 'Hello & Self-introduction' })).toBeVisible()
  expect(screen.queryByText(/Start learning|Continue learning/i)).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm test -- src/components/AppShell.test.tsx src/App.test.tsx`

Expected: FAIL because Vocabulary and Grammar remain primary links and `/` renders Home.

- [ ] **Step 3: Implement the four-item manifest and redirects**

```ts
const requiredPrimaryDestinations = [
  { id: 'learn', path: 'learn', primaryNavigationLabel: 'Learn', primaryNavigationTo: '/learn/lesson-1' },
  { id: 'practice', path: 'practice', primaryNavigationLabel: 'Practice' },
  { id: 'dialogue', path: 'dialogue', primaryNavigationLabel: 'Dialogue' },
  { id: 'team', path: 'team', primaryNavigationLabel: 'Team' },
] as const

type PathRouteManifestEntry = {
  id: string
  path: string
  primaryNavigationLabel?: string
  primaryNavigationTo?: `/${string}`
}

export function getPrimaryNavigationItems(routes = appRouteManifest) {
  return routes.flatMap((route) => {
    if (route.index || !route.primaryNavigationLabel) return []
    return [{
      id: route.id,
      label: route.primaryNavigationLabel,
      to: route.primaryNavigationTo ?? `/${route.path}`,
    }]
  })
}
```

```tsx
const routeElements = {
  home: <Navigate replace to="/learn/lesson-1" />,
  learn: <Navigate replace to="/learn/lesson-1" />,
  lesson: <LearnPage />,
  practice: <PracticePage />,
  dialogue: <DialoguePage />,
  team: <TeamPage />,
  vocabularyLegacy: <Navigate replace to="/learn/lesson-2" />,
  grammarLegacy: <Navigate replace to="/learn/lesson-4" />,
  'not-found': <NotFoundPage />,
}
```

Update `AppShell.currentSection()` so every `/learn` and `/learn/*` route marks Learn active. Keep the existing accessible mobile menu behavior and route-heading focus behavior.

- [ ] **Step 4: Run route and shell tests**

Run: `npm test -- src/components/AppShell.test.tsx src/App.test.tsx`

Expected: PASS with four destinations and direct first-lesson routing.

- [ ] **Step 5: Commit**

```bash
git add app/src/navigation.ts app/src/routeObjects.tsx app/src/components/AppShell.tsx app/src/components/AppShell.test.tsx app/src/App.test.tsx app/src/test/renderApp.tsx
git commit -m "feat: simplify Korean Stage navigation"
```

### Task 3: Build the Seven-Lesson Learn Shell

**Files:**
- Create: `app/src/components/LessonSelector.tsx`
- Create: `app/src/components/LessonSelector.test.tsx`
- Rewrite: `app/src/pages/LearnPage.tsx`
- Rewrite: `app/src/pages/LearnPage.test.tsx`
- Create: `app/src/components/IntroductionLesson.tsx`
- Create: `app/src/components/GrammarGuide.tsx`

**Interfaces:**
- Consumes: `courseLessons`, `getLessonBySlug`, `course.introductionModels`, `course.vocabulary`, and `course.grammar`.
- Produces: `LessonSelector({ activeSlug }: { activeSlug: LessonSlug })`.
- Produces: Learn page dispatch for introduction, vocabulary, grammar, and Lesson 7 dialogue preview.
- Produces: no completion/readiness button and no persisted learner state.

- [ ] **Step 1: Write failing selector and Learn page tests**

```tsx
it('opens all seven lessons from one compact selector', async () => {
  const user = userEvent.setup()
  renderApp(['/learn/lesson-3'])
  await user.click(screen.getByRole('button', { name: 'All lessons' }))
  expect(screen.getAllByRole('link', { name: /Lesson [1-7] of 7/ })).toHaveLength(7)
  expect(screen.getByRole('link', { name: /Lesson 4 of 7.*to be/ })).toHaveAttribute('href', '/learn/lesson-4')
})

it('shows learning content immediately without progress language', () => {
  renderApp(['/learn/lesson-1'])
  expect(screen.getByRole('heading', { name: 'Hello & Self-introduction' })).toBeVisible()
  expect(screen.getByText('안녕하세요?')).toHaveAttribute('lang', 'ko')
  expect(screen.queryByText(/ready to continue|mark.*complete|continue learning/i)).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm test -- src/components/LessonSelector.test.tsx src/pages/LearnPage.test.tsx`

Expected: FAIL because the selector and lesson-slug dispatch do not exist and Learn still uses completion persistence.

- [ ] **Step 3: Implement the selector and lesson dispatch**

```tsx
export function LessonSelector({ activeSlug }: { activeSlug: LessonSlug }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])
  return (
    <div className="lesson-selector">
      <button aria-expanded={open} onClick={() => setOpen((value) => !value)} type="button">All lessons</button>
      {open ? (
        <ol aria-label="Choose a lesson">
          {courseLessons.map((lesson, index) => (
            <li key={lesson.slug}>
              <Link aria-current={lesson.slug === activeSlug ? 'page' : undefined} to={`/learn/${lesson.slug}`}>
                <span>Lesson {index + 1} of {courseLessons.length}</span>
                <strong>{lesson.title}</strong>
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  )
}
```

`LearnPage` resolves `lessonId` with `getLessonBySlug`, renders the common `Lesson N of 7` header and `LessonSelector`, then selects content by the internal unit ID. Lesson 7 renders a bilingual summary and a `Watch the dialogue` link to `/dialogue`; it does not duplicate the full Dialogue page.

```tsx
const vocabulary = course.vocabulary.filter((item) => item.unitId === lesson.id)
const grammarPoint = course.grammar.find((item) => item.unitId === lesson.id)

const lessonContent = lesson.id === 'unit-1'
  ? <IntroductionLesson />
  : lesson.id === 'unit-2' || lesson.id === 'unit-3'
    ? <VocabularyJourney items={vocabulary} />
    : grammarPoint
      ? <GrammarGuide grammarPoint={grammarPoint} />
      : <Link to="/dialogue">Watch the dialogue</Link>
```

Use focused content components so assessed questions remain outside Learn:

```tsx
export function IntroductionLesson() {
  return (
    <ul aria-label="Bilingual self-introduction models" className="introduction-models">
      {course.introductionModels.map((model) => (
        <li key={model.id}>
          <p data-korean-content lang="ko">{model.korean}</p>
          <p lang="en">{model.english}</p>
          <p><strong>Romanization:</strong> {model.romanization}</p>
          <p><strong>Say it like:</strong> {model.pronunciationHint}</p>
        </li>
      ))}
    </ul>
  )
}

export function GrammarGuide({ grammarPoint }: { grammarPoint: GrammarPoint }) {
  return (
    <article aria-labelledby={`${grammarPoint.id}-heading`}>
      <h2 id={`${grammarPoint.id}-heading`}>
        <span lang="ko">{grammarPoint.korean}</span> · {grammarPoint.englishFunction}
      </h2>
      <p>{grammarPoint.explanation}</p>
      <ul>{grammarPoint.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
      <div>
        {grammarPoint.examples.map((example) => (
          <div key={example.korean}>
            <p data-korean-content lang="ko">{example.korean}</p>
            <p lang="en">{example.english}</p>
          </div>
        ))}
      </div>
      <Link to={`/practice?lesson=${courseLessons.find((lesson) => lesson.id === grammarPoint.unitId)!.slug}`}>
        Practise this lesson
      </Link>
    </article>
  )
}
```

- [ ] **Step 4: Run Learn tests**

Run: `npm test -- src/components/LessonSelector.test.tsx src/pages/LearnPage.test.tsx`

Expected: PASS for direct content, seven lesson links, Escape-close behavior, invalid lesson state, and absence of progress copy.

- [ ] **Step 5: Commit**

```bash
git add app/src/components/LessonSelector.tsx app/src/components/LessonSelector.test.tsx app/src/pages/LearnPage.tsx app/src/pages/LearnPage.test.tsx app/src/components/IntroductionLesson.tsx app/src/components/GrammarGuide.tsx
git commit -m "feat: add beginner-first lesson shell"
```

### Task 4: Refine Vocabulary into Free Selection Plus Sequential Guidance

**Files:**
- Rewrite: `app/src/components/VocabularyJourney.tsx`
- Rewrite: `app/src/components/VocabularyJourney.test.tsx`
- Modify: `app/src/components/MemberVideo.tsx`
- Modify: `app/src/styles.css`

**Interfaces:**
- Consumes: `VocabularyItem[]` and assigned `ownerId` from course data.
- Produces: `VocabularyJourney({ items }: { items: VocabularyItem[] })` with component-local `activeIndex` only.
- Produces: every rail item as a button named `${korean}, ${english}`.
- Produces: `MemberVideo` learner mode with compact playable video or honest `Member video coming soon` alert.

- [ ] **Step 1: Write failing vocabulary behavior tests**

```tsx
const occupationItems = course.vocabulary.filter((item) => item.unitId === 'unit-3')

beforeEach(() => localStorage.clear())

it('lets a beginner choose any bilingual word without unlocking it first', async () => {
  const user = userEvent.setup()
  render(<VocabularyJourney items={occupationItems} />)
  await user.click(screen.getByRole('button', { name: '8. 요리사, Chef' }))
  expect(screen.getByRole('heading', { name: '요리사' })).toHaveAttribute('lang', 'ko')
  expect(screen.getByText('Chef')).toBeVisible()
  expect(screen.getByText('yorisa')).toBeVisible()
})

it('uses the assigned member video and never renders a speaker or audio selector', () => {
  render(<VocabularyJourney items={occupationItems} />)
  expect(screen.getByText('Presented by Member 1')).toBeVisible()
  expect(screen.queryByRole('button', { name: /Listen to Member/i })).not.toBeInTheDocument()
  expect(screen.queryByRole('group', { name: /speaker/i })).not.toBeInTheDocument()
})

it('keeps next word available without completing or persisting the current word', async () => {
  const user = userEvent.setup()
  render(<VocabularyJourney items={occupationItems} />)
  await user.click(screen.getByRole('button', { name: 'Next word' }))
  expect(screen.getByRole('heading', { name: '선생님' })).toBeVisible()
  expect(localStorage.length).toBe(0)
})
```

- [ ] **Step 2: Run vocabulary tests and verify failure**

Run: `npm test -- src/components/VocabularyJourney.test.tsx`

Expected: FAIL because later words are locked, progress is persisted, and separate audio UI is rendered.

- [ ] **Step 3: Implement the approved three-column vocabulary layout**

```tsx
const [activeIndex, setActiveIndex] = useState(0)
const item = items[activeIndex]
const member = course.members.find((candidate) => candidate.id === item.ownerId)

<button
  aria-current={index === activeIndex ? 'true' : undefined}
  aria-label={`${index + 1}. ${word.korean}, ${word.english}`}
  onClick={() => setActiveIndex(index)}
  type="button"
>
  <span>{word.korean}</span>
  <span>{word.english}</span>
  {index === activeIndex ? <span>Now learning</span> : null}
</button>
```

Render visible `Romanization`, `Pronunciation` or `Say it like`, Korean example with `lang="ko"`, English example, grammar tip, `Presented by ...`, Previous word, and Next word. Remove `HumanAudioButton`, progress completion calls, unlocking, Finish vocabulary, and the contributor recording checklist from the learner view. Keep AI-media rejection and native video/caption behavior inside `MemberVideo`.

- [ ] **Step 4: Run vocabulary, media, and content tests**

Run: `npm test -- src/components/VocabularyJourney.test.tsx src/content/validateCourse.test.ts`

Expected: PASS; learner UI has no duplicate audio control while validation still rejects prohibited or missing final media.

- [ ] **Step 5: Commit**

```bash
git add app/src/components/VocabularyJourney.tsx app/src/components/VocabularyJourney.test.tsx app/src/components/MemberVideo.tsx app/src/styles.css
git commit -m "feat: make vocabulary selection beginner friendly"
```

### Task 5: Move All Assessed Questions into Lesson-Based Practice

**Files:**
- Create: `app/src/content/practiceCatalog.ts`
- Create: `app/src/content/practiceCatalog.test.ts`
- Rewrite: `app/src/pages/PracticePage.tsx`
- Rewrite: `app/src/pages/PracticePage.test.tsx`
- Modify: `app/src/components/ExerciseEngine.tsx`
- Modify: `app/src/components/ExerciseEngine.test.tsx`

**Interfaces:**
- Produces: `PracticeGroup = { lessonSlug: LessonSlug; title: string; exercises: Exercise[] }`.
- Produces: `practiceGroups` for Lesson 2 vocabulary, Lesson 3 vocabulary, and Lessons 4-6 grammar.
- Consumes: existing grammar exercises without changing the required count of three per grammar point.
- Consumes: optional `?lesson=lesson-N` query from a Learn grammar guide and opens that group when it exists.
- Produces: component-local quiz phase, answers, result, and retry state with no storage writes.

- [ ] **Step 1: Write failing practice catalog and page tests**

```ts
it('groups practice by the lesson that taught the content', () => {
  expect(practiceGroups.map((group) => group.lessonSlug)).toEqual([
    'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6',
  ])
  expect(practiceGroups.find((group) => group.lessonSlug === 'lesson-4')?.exercises).toHaveLength(3)
})
```

```tsx
beforeEach(() => localStorage.clear())

it('opens a selected lesson quiz and explains an incorrect answer in English', async () => {
  const user = userEvent.setup()
  render(<PracticePage />)
  await user.click(screen.getByRole('button', { name: /Lesson 3.*Jobs & Occupations/ }))
  await user.click(screen.getByRole('radio', { name: 'Teacher' }))
  await user.click(screen.getByRole('button', { name: 'Check answer' }))
  expect(screen.getByRole('status')).toHaveTextContent('Not quite')
  expect(screen.getByRole('status')).toHaveTextContent('학생 means Student')
  expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible()
  expect(localStorage.length).toBe(0)
})
```

- [ ] **Step 2: Run practice tests and verify failure**

Run: `npm test -- src/content/practiceCatalog.test.ts src/pages/PracticePage.test.tsx src/components/ExerciseEngine.test.tsx`

Expected: FAIL because Practice currently starts with flashcards and one nine-question grammar challenge instead of a lesson index.

- [ ] **Step 3: Implement derived vocabulary questions and grouped practice**

```ts
const vocabularyGroup = (lessonSlug: LessonSlug, unitId: VocabularyItem['unitId']): PracticeGroup => ({
  lessonSlug,
  title: courseLessons.find((lesson) => lesson.slug === lessonSlug)!.title,
  exercises: course.vocabulary.filter((item) => item.unitId === unitId).map((item, index, items) => ({
    id: `${item.id}-meaning`,
    grammarId: lessonSlug,
    type: 'multiple-choice',
    prompt: `Choose the English meaning of ${item.korean}.`,
    koreanContext: item.korean,
    choices: [item.english, items[(index + 1) % items.length].english, items[(index + 2) % items.length].english],
    answer: item.english,
    explanation: `${item.korean} means ${item.english}.`,
  })),
})
```

Practice first renders the lesson cards. Selecting a group starts its quiz. Reuse `ExerciseEngine` answer controls and accessible focus movement, but hold results only in component state. Keep the optional mixed challenge behind an explicit `Mixed Lec 1 quiz` card after the lesson groups.

```tsx
const [searchParams] = useSearchParams()
const requestedGroup = practiceGroups.find(
  (group) => group.lessonSlug === searchParams.get('lesson'),
)
const [activeGroup, setActiveGroup] = useState<PracticeGroup | null>(requestedGroup ?? null)
```

- [ ] **Step 4: Run all practice tests**

Run: `npm test -- src/content/practiceCatalog.test.ts src/pages/PracticePage.test.tsx src/components/ExerciseEngine.test.tsx`

Expected: PASS with beginner English feedback, retry, required grammar exercise counts, and no localStorage use.

- [ ] **Step 5: Commit**

```bash
git add app/src/content/practiceCatalog.ts app/src/content/practiceCatalog.test.ts app/src/pages/PracticePage.tsx app/src/pages/PracticePage.test.tsx app/src/components/ExerciseEngine.tsx app/src/components/ExerciseEngine.test.tsx
git commit -m "feat: group Korean quizzes by lesson"
```

### Task 6: Simplify Dialogue to Video, Context, Roles, and Transcript

**Files:**
- Modify: `app/src/pages/DialoguePage.tsx`
- Modify: `app/src/components/DialoguePlayer.tsx`
- Modify: `app/src/components/DialoguePlayer.test.tsx`

**Interfaces:**
- Consumes: `Dialogue.scenario`, `speakerIds`, bilingual lines, and full member video.
- Produces: one active dialogue at a time with one primary video area.
- Removes: line selection, `HumanAudioButton`, learner-facing recording checklist, unit completion, and progress state.

- [ ] **Step 1: Write failing simplified dialogue tests**

```tsx
it('shows the scenario, roles, one primary video area, and bilingual transcript', () => {
  render(<DialoguePlayer dialogue={course.dialogues[0]} members={course.members} />)
  expect(screen.getByText(course.dialogues[0].scenario)).toBeVisible()
  expect(screen.getByText(/Member 1.*Member 2/)).toBeVisible()
  expect(screen.getByRole('list', { name: 'Bilingual dialogue transcript' })).toBeVisible()
  expect(screen.getAllByText('Hello.').length).toBeGreaterThan(0)
})

it('does not show line audio or contributor recording instructions', () => {
  render(<DialoguePlayer dialogue={course.dialogues[0]} members={course.members} />)
  expect(screen.queryByRole('button', { name: /Listen to line/i })).not.toBeInTheDocument()
  expect(screen.queryByText('Role-play recording checklist')).not.toBeInTheDocument()
  expect(screen.queryByText('Study second')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run dialogue tests and verify failure**

Run: `npm test -- src/components/DialoguePlayer.test.tsx`

Expected: FAIL because the current player exposes line audio and contributor instructions.

- [ ] **Step 3: Implement the simple dialogue presentation**

```tsx
<section aria-labelledby={`${dialogue.id}-heading`}>
  <p>{dialogue.scenario}</p>
  <p><strong>Roles:</strong> {speakers}</p>
  <MemberVideo
    mediaLabel={`${dialogue.title} role-play video`}
    memberName={speakers}
    missingHeading="Dialogue video coming soon"
    showRecordingChecklist={false}
    source={dialogue.video}
    transcript={fullTranscript}
  />
  <ol aria-label="Bilingual dialogue transcript">
    {dialogue.lines.map((line, index) => (
      <li key={line.id}>
        <span>Line {index + 1} · {memberName(line.speakerId)}</span>
        <p lang="ko">{line.korean}</p>
        <p lang="en">{line.english}</p>
      </li>
    ))}
  </ol>
</section>
```

Keep the two coursework dialogues selectable because the content validator requires them, but render only the selected dialogue's single primary video and transcript. Remove Unit 7 completion props from `DialoguePage`.

- [ ] **Step 4: Run dialogue and validator tests**

Run: `npm test -- src/components/DialoguePlayer.test.tsx src/content/validateCourse.test.ts`

Expected: PASS; required dialogue counts remain valid and learner UI is simplified.

- [ ] **Step 5: Commit**

```bash
git add app/src/pages/DialoguePage.tsx app/src/components/DialoguePlayer.tsx app/src/components/DialoguePlayer.test.tsx
git commit -m "feat: simplify beginner dialogue experience"
```

### Task 7: Make Team Clean by Default and Keep Readiness Development-Only

**Files:**
- Modify: `app/src/pages/TeamPage.tsx`
- Modify: `app/src/components/TeamGrid.tsx`
- Modify: `app/src/components/TeamGrid.test.tsx`
- Modify: `app/src/components/SubmissionReadiness.test.tsx`

**Interfaces:**
- Consumes: `Member.role`, `Member.contribution`, assigned vocabulary, and dialogue participation.
- Produces: `TeamGrid` responsive to 2-6 members.
- Produces: readiness report only when `import.meta.env.DEV` and the URL query is `?readiness=1`.

- [ ] **Step 1: Write failing Team tests**

```tsx
it('shows learner-friendly member roles and contributions without readiness warnings', () => {
  render(<MemoryRouter initialEntries={['/team']}><TeamPage /></MemoryRouter>)
  expect(screen.getByRole('heading', { name: 'Meet the team' })).toBeVisible()
  for (const member of course.members) {
    expect(screen.getByText(member.role)).toBeVisible()
    expect(screen.getByText(member.contribution)).toBeVisible()
  }
  expect(screen.queryByText('Submission readiness')).not.toBeInTheDocument()
  expect(screen.queryByText('Replace before submission')).not.toBeInTheDocument()
})

it('renders six member cards without changing the component API', () => {
  const sixMemberCourse = { ...course, members: Array.from({ length: 6 }, (_, index) => ({
    ...course.members[index % course.members.length], id: `member-${index + 1}`, name: `Member ${index + 1}`,
  })) }
  render(<TeamGrid course={sixMemberCourse} />)
  expect(screen.getAllByRole('article')).toHaveLength(6)
})
```

- [ ] **Step 2: Run Team tests and verify failure**

Run: `npm test -- src/components/TeamGrid.test.tsx src/components/SubmissionReadiness.test.tsx`

Expected: FAIL because the default Team page exposes submission/readiness language and Member lacks the new display fields.

- [ ] **Step 3: Implement clean member cards and guarded readiness**

```tsx
export function TeamPage() {
  const [searchParams] = useSearchParams()
  const showReadiness = import.meta.env.DEV && searchParams.get('readiness') === '1'
  return (
    <section className="team-page">
      <h1>Meet the team</h1>
      <p>{course.purpose}</p>
      <TeamGrid course={course} />
      {showReadiness ? <SubmissionReadiness course={course} /> : null}
    </section>
  )
}
```

Each card shows name, student ID, role, contribution, bilingual assigned words, and dialogue titles. Remove warning badges and pass/fail wording from the default grid; readiness continues to validate the same course data in its guarded development view.

- [ ] **Step 4: Run Team and validator tests**

Run: `npm test -- src/components/TeamGrid.test.tsx src/components/SubmissionReadiness.test.tsx src/content/validateCourse.test.ts`

Expected: PASS for 2-6 member rendering, clean default copy, and unchanged readiness validation.

- [ ] **Step 5: Commit**

```bash
git add app/src/pages/TeamPage.tsx app/src/components/TeamGrid.tsx app/src/components/TeamGrid.test.tsx app/src/components/SubmissionReadiness.test.tsx
git commit -m "feat: separate team presentation from readiness"
```

### Task 8: Remove Persistent Progress and Obsolete Learner Pages

**Files:**
- Delete: `app/src/hooks/useCourseProgress.ts`
- Delete: `app/src/hooks/useCourseProgress.test.ts`
- Delete: `app/src/progress/progressStore.ts`
- Delete: `app/src/progress/progressStore.test.ts`
- Delete: `app/src/pages/UnitPage.tsx`
- Delete: `app/src/pages/HomePage.tsx`
- Delete: `app/src/pages/HomePage.test.tsx`
- Delete: `app/src/pages/VocabularyPage.tsx`
- Delete: `app/src/pages/VocabularyPage.test.tsx`
- Delete: `app/src/pages/GrammarPage.tsx`
- Delete: `app/src/components/CourseMap.tsx`
- Delete: `app/src/components/ProgressSummary.tsx`
- Delete: `app/src/components/FlashcardDeck.tsx`
- Delete: `app/src/components/FlashcardDeck.test.tsx`
- Modify: `app/src/App.test.tsx`

**Interfaces:**
- Consumes: completed Tasks 2-7, which remove every runtime import of these files.
- Produces: no application read/write path to `localStorage`.
- Preserves: content validation, member media, exercises, and route not-found behavior.

- [ ] **Step 1: Add the failing no-persistence contract test**

```tsx
it('does not read or write browser storage during the main learner journey', async () => {
  const getItem = vi.spyOn(Storage.prototype, 'getItem')
  const setItem = vi.spyOn(Storage.prototype, 'setItem')
  const user = userEvent.setup()
  renderApp(['/learn/lesson-3'])
  await user.click(screen.getByRole('button', { name: 'Next word' }))
  await user.click(screen.getByRole('link', { name: 'Practice' }))
  expect(getItem).not.toHaveBeenCalled()
  expect(setItem).not.toHaveBeenCalled()
})
```

- [ ] **Step 2: Run the contract test and confirm any remaining storage access**

Run: `npm test -- src/App.test.tsx`

Expected before deletion: FAIL if any old progress hook remains reachable; if the focused test already passes, use `rg -n "useCourseProgress|readProgress|writeProgress|localStorage" app/src` to identify and remove only dead progress code.

- [ ] **Step 3: Delete obsolete files and remove imports**

After Tasks 2-7, run:

```bash
rg -n "useCourseProgress|readProgress|writeProgress|HomePage|UnitPage|VocabularyPage|GrammarPage|CourseMap|ProgressSummary|FlashcardDeck" app/src
```

Expected: matches occur only inside the obsolete files themselves. Delete the listed files and remove any stale route-object or test imports. Do not delete `HumanAudioButton`; submission validation or future supplied media may still test its safety behavior even though the first learner UI does not render it.

- [ ] **Step 4: Run the full unit test suite after deletion**

Run: `npm test`

Expected: PASS with zero imports of persistent progress code and no obsolete page tests.

- [ ] **Step 5: Commit**

```bash
git add -A app/src
git commit -m "refactor: remove learner progress persistence"
```

### Task 9: Complete Responsive, Visual, and Accessibility Contracts

**Files:**
- Modify: `app/src/styles.css`
- Modify: `app/src/accessibility.test.tsx`
- Modify: `app/src/responsive-contract.test.tsx`
- Modify: `app/src/visualSystem.test.ts`
- Modify: `app/src/assets.test.ts`

**Interfaces:**
- Consumes: final class names from Tasks 2-7.
- Produces: desktop three-column Learn layout, tablet stacking, mobile bilingual selector, keyboard focus, reduced motion, and retained cultural assets.

- [ ] **Step 1: Write failing visual and accessibility contract assertions**

```tsx
it('marks Korean learning content with the Korean language', () => {
  renderApp(['/learn/lesson-3'])
  for (const node of document.querySelectorAll('[data-korean-content]')) {
    expect(node).toHaveAttribute('lang', 'ko')
  }
})

it('keeps all mobile vocabulary choices bilingual', () => {
  renderApp(['/learn/lesson-3'])
  const chooser = screen.getByRole('combobox', { name: 'Choose vocabulary word' })
  expect(within(chooser).getByRole('option', { name: '1. 학생 — Student' })).toBeVisible()
  expect(within(chooser).getByRole('option', { name: '8. 요리사 — Chef' })).toBeVisible()
})
```

Add source-contract checks for `.learn-layout`, `.learn-word-rail`, `.learn-media`, `.learn-details`, the `70rem` three-column breakpoint, the compact video height range, and `prefers-reduced-motion`.

- [ ] **Step 2: Run responsive/accessibility tests and verify failure**

Run: `npm test -- src/accessibility.test.tsx src/responsive-contract.test.tsx src/visualSystem.test.ts src/assets.test.ts`

Expected: FAIL until the redesigned selectors, class contracts, and page language annotations are complete.

- [ ] **Step 3: Finish the approved visual CSS**

```css
.learn-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;
}

@media (min-width: 70rem) {
  .learn-layout {
    grid-template-columns: 12rem minmax(24rem, 1fr) minmax(18rem, 21rem);
    align-items: start;
    gap: clamp(1.25rem, 2vw, 2rem);
  }

  .learn-media video,
  .learn-media .coming-soon-artwork-frame {
    height: clamp(14rem, 28vh, 19rem);
    object-fit: cover;
  }
}
```

Preserve the existing high-contrast tokens, palace gate asset, obangsaek band, and background line art. Ensure Previous/Next appears within the right column at the target desktop viewport and that mobile uses the bilingual select control without horizontal scrolling.

- [ ] **Step 4: Run accessibility and responsive tests**

Run: `npm test -- src/accessibility.test.tsx src/responsive-contract.test.tsx src/visualSystem.test.ts src/assets.test.ts`

Expected: PASS with no serious axe violations, bilingual mobile choices, Korean language tags, reduced-motion support, and required cultural assets.

- [ ] **Step 5: Commit**

```bash
git add app/src/styles.css app/src/accessibility.test.tsx app/src/responsive-contract.test.tsx app/src/visualSystem.test.ts app/src/assets.test.ts
git commit -m "style: finish responsive beginner learning UI"
```

### Task 10: Run Full Verification and Record Design QA

**Files:**
- Modify: `app/design-qa.md`
- Modify only if verification exposes a defect: files already listed in Tasks 1-9.

**Interfaces:**
- Consumes: the completed application and approved refined Direction A mock.
- Produces: fresh test, typecheck, lint, build, Sites worker, accessibility, responsive, and visual comparison evidence.

- [ ] **Step 1: Run the full automated verification suite**

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm run test:sites
```

Expected: every command exits 0; Vitest reports zero failed tests; the build leaves `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

- [ ] **Step 2: Start the verified preview and inspect the required routes**

Run: `npm run preview -- --host 127.0.0.1`

Inspect at the same desktop viewport:

- `/learn/lesson-1`
- `/learn/lesson-3`
- `/practice`
- `/dialogue`
- `/team`

Verify the four-item header, no personalized copy, free word selection, compact video, visible pronunciation, above-the-fold word navigation, quiz feedback, simple dialogue, clean Team cards, and honest missing-media states.

- [ ] **Step 3: Compare the implementation and approved mock in one visual review**

Capture the refined mock and `/learn/lesson-3` at the same viewport. Place both images in the same comparison input and check hierarchy, video size, rail density, spacing, colors, border radii, background artwork, text wrapping, and button visibility. Fix all visible P0-P2 differences, then repeat the comparison once.

- [ ] **Step 4: Record evidence in `app/design-qa.md`**

```md
## Beginner-first redesign verification

- Approved source: refined Direction A Learn mock
- Compared route: `/learn/lesson-3`
- Desktop viewport: 1440 × 1024
- Tablet and mobile routes checked: Learn, Practice, Dialogue, Team
- Four-item navigation: passed
- Bilingual beginner labels: passed
- Compact member video and visible word navigation: passed
- Honest missing media: passed
- Keyboard and reduced motion: passed
- Final result: passed
```

- [ ] **Step 5: Commit the verified result**

```bash
git add app/design-qa.md app/src
git commit -m "test: verify beginner-first Korean Stage redesign"
```

---

## Final Acceptance Checklist

- [ ] `/` reaches Lesson 1 without Start or Continue UI.
- [ ] Primary navigation contains only Learn, Practice, Dialogue, Team.
- [ ] Learn allows any bilingual word selection and keeps sequential navigation.
- [ ] The selected member comes from word ownership; no speaker selector exists.
- [ ] Korean, English, romanization, pronunciation, example, and usage support are visible.
- [ ] The compact member video and Previous/Next controls fit the target desktop viewport.
- [ ] No learner-facing duplicate audio control is shown.
- [ ] Practice is grouped by lesson and explains errors in English.
- [ ] Dialogue shows one active main video, context, roles, and bilingual transcript without line audio or contributor checklist.
- [ ] Team supports 2-6 members and hides readiness warnings by default.
- [ ] No runtime learner progress storage remains.
- [ ] Required coursework validators still pass and still prohibit AI speech.
- [ ] Desktop, tablet, mobile, keyboard, focus, language tags, contrast, and reduced motion pass.
- [ ] Test, typecheck, lint, production build, and Sites worker checks all exit 0.
