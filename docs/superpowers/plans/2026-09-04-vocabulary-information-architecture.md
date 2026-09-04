# Vocabulary Information Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Learn with a beginner-friendly Vocabulary destination containing Units 1-3, while making Grammar, Practice, Dialogue, and Team independent destinations.

**Architecture:** Add one source of truth for vocabulary-unit presentation metadata and extend the existing vocabulary item model to distinguish useful expressions from individual words. A new `VocabularyPage` owns the three-unit chooser and reuses `VocabularyJourney` for the detail routes. A parallel `GrammarPage` owns Units 4-6; legacy `/learn/*` URLs redirect to their new destination so old bookmarks remain useful.

**Tech Stack:** React 18, TypeScript, React Router, Tailwind utility classes plus `styles.css`, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-04-vocabulary-information-architecture-design.md`

## Global Constraints

- Primary navigation must be exactly Vocabulary, Grammar, Practice, Dialogue, Team, in that order.
- Vocabulary home shows exactly Units 1-3; never render Units 4-7 there.
- Unit 1 is labelled Useful expressions; Units 2-3 are labelled Vocabulary words.
- Reuse the Unit 3 learning interaction and retain keyboard, bilingual-language, media, and responsive contracts.
- Never invent recordings or AI voice/video; missing required member media remains an honest placeholder.
- Keep historical `/learn/*` URLs safe via redirects.

---

## File Structure

- `app/src/content/types.ts` — expands vocabulary items to include Unit 1 and a display kind.
- `app/src/content/course.ts` — stores the two approved Unit 1 expressions as course vocabulary and exports the three-unit vocabulary catalogue.
- `app/src/content/vocabularyCatalog.test.ts` — verifies the only selectable Vocabulary units and their beginner labels.
- `app/src/components/VocabularyJourney.tsx` — accepts the unit’s display label and uses it in non-Korean UI copy.
- `app/src/components/VocabularyJourney.test.tsx` — proves expression terminology and preserved next/previous/keyboard interaction.
- `app/src/pages/VocabularyPage.tsx` — renders the chooser at `/vocabulary` and shared learning screen at `/vocabulary/:lessonSlug`.
- `app/src/pages/VocabularyPage.test.tsx` — verifies chooser boundaries, links, Unit 1, and unknown-route recovery.
- `app/src/pages/GrammarPage.tsx` — renders a grammar chooser and individual grammar views at `/grammar` and `/grammar/:lessonSlug`.
- `app/src/pages/GrammarPage.test.tsx` — verifies only Units 4-6 appear in Grammar and an individual grammar view is preserved.
- `app/src/navigation.ts` — defines active primary routes and legacy redirects without a Learn primary item.
- `app/src/routeObjects.tsx` — wires new page routes and maps legacy paths to new canonical paths.
- `app/src/components/AppShell.tsx` — calculates active navigation state for Vocabulary and Grammar.
- `app/src/components/AppShell.test.tsx`, `app/src/App.test.tsx` — lock navigation order, active state, and redirects.
- `app/src/styles.css` — adds only the responsive topic-card and chooser layout rules required by the new pages.

### Task 1: Model vocabulary units and Unit 1 expressions

**Files:**
- Modify: `app/src/content/types.ts`
- Modify: `app/src/content/course.ts`
- Create: `app/src/content/vocabularyCatalog.test.ts`

**Interfaces:**
- Produces `VocabularyItem.unitId: 'unit-1' | 'unit-2' | 'unit-3'` and `VocabularyItem.displayKind: 'expression' | 'word'`.
- Produces `vocabularyUnits`, an ordered three-entry catalogue with `lessonSlug`, `title`, `eyebrow`, `itemLabel`, and `description`.
- Consumed by `VocabularyPage` and `VocabularyJourney` in later tasks.

- [ ] **Step 1: Write the failing catalogue test**

```tsx
it('exposes exactly the three approved Vocabulary units', () => {
  expect(vocabularyUnits.map(({ lessonSlug, itemLabel }) => [lessonSlug, itemLabel])).toEqual([
    ['lesson-1', 'Useful expressions'],
    ['lesson-2', 'Vocabulary words'],
    ['lesson-3', 'Vocabulary words'],
  ])
  expect(vocabularyUnits.map((unit) => unit.title)).not.toContain('이에요 / 예요 - to be')
})
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --run src/content/vocabularyCatalog.test.ts`

Expected: FAIL because `vocabularyUnits` does not exist.

- [ ] **Step 3: Extend the model and content minimally**

```ts
export type VocabularyItem = {
  // existing fields
  unitId: 'unit-1' | 'unit-2' | 'unit-3'
  displayKind: 'expression' | 'word'
}

export const vocabularyUnits = [
  { lessonSlug: 'lesson-1', unitId: 'unit-1', title: 'Essential greetings', eyebrow: 'Unit 1', itemLabel: 'Useful expressions', description: 'Start with friendly greetings and a simple introduction.' },
  { lessonSlug: 'lesson-2', unitId: 'unit-2', title: 'Countries & Nationalities', eyebrow: 'Unit 2', itemLabel: 'Vocabulary words', description: 'Learn country names used to introduce where someone is from.' },
  { lessonSlug: 'lesson-3', unitId: 'unit-3', title: 'Jobs & Occupations', eyebrow: 'Unit 3', itemLabel: 'Vocabulary words', description: 'Learn common occupations for introducing yourself and others.' },
] as const
```

Create Unit 1 entries from the already-approved Lec 1 models: `안녕하세요? / Hello.` and `저는 미나예요. / I am Mina.`. Mark them `displayKind: 'expression'`, supporting, and not-required for member recording; existing Unit 2 and 3 items are `displayKind: 'word'`.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- --run src/content/vocabularyCatalog.test.ts`

Expected: PASS.

- [ ] **Step 5: Run content validation and commit**

Run: `npm test -- --run src/content/lessonCatalog.test.ts src/content/validateCourse.test.ts src/content/vocabularyCatalog.test.ts`

Expected: PASS.

```bash
git add app/src/content/types.ts app/src/content/course.ts app/src/content/vocabularyCatalog.test.ts
git commit -m "feat: add vocabulary unit catalogue"
```

### Task 2: Make the shared learning journey expression-aware

**Files:**
- Modify: `app/src/components/VocabularyJourney.tsx`
- Modify: `app/src/components/VocabularyJourney.test.tsx`

**Interfaces:**
- Consumes `VocabularyItem.displayKind` from Task 1.
- Produces an `itemLabel` prop with values `Useful expression` or `Vocabulary word`; defaults maintain safe rendering for direct component tests.
- Consumed by `VocabularyPage` in Task 3.

- [ ] **Step 1: Write failing interaction tests**

```tsx
it('names Unit 1 content as useful expressions while preserving word navigation', async () => {
  const user = userEvent.setup()
  render(<VocabularyJourney itemLabel="Useful expression" items={greetingItems} />)

  expect(screen.getByText('Choose a useful expression')).toBeVisible()
  await user.click(screen.getByRole('button', { name: 'Next useful expression' }))
  expect(screen.getByText('저는 미나예요.')).toBeVisible()
})
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --run src/components/VocabularyJourney.test.tsx`

Expected: FAIL because `itemLabel` and expression-specific copy are absent.

- [ ] **Step 3: Implement the smallest shared-copy change**

```tsx
type VocabularyJourneyProps = {
  items: VocabularyItem[]
  itemLabel?: 'Vocabulary word' | 'Useful expression'
}

export function VocabularyJourney({ items, itemLabel = 'Vocabulary word' }: VocabularyJourneyProps) {
  const lowerLabel = itemLabel.toLowerCase()
  // use `Choose a ${lowerLabel}`, `Previous ${lowerLabel}`, and `Next ${lowerLabel}`
  // in learner controls; retain Korean, English, romanization, examples, and chooser behaviour.
}
```

- [ ] **Step 4: Run focused component and responsive tests**

Run: `npm test -- --run src/components/VocabularyJourney.test.tsx src/responsive-contract.test.tsx src/accessibility.test.tsx`

Expected: PASS, including existing keyboard listbox tests.

- [ ] **Step 5: Commit**

```bash
git add app/src/components/VocabularyJourney.tsx app/src/components/VocabularyJourney.test.tsx
git commit -m "feat: label greeting expressions clearly"
```

### Task 3: Create the Vocabulary chooser and detail routes

**Files:**
- Create: `app/src/pages/VocabularyPage.tsx`
- Create: `app/src/pages/VocabularyPage.test.tsx`
- Modify: `app/src/styles.css`

**Interfaces:**
- Consumes `vocabularyUnits` and `course.vocabulary` from Task 1.
- Consumes `VocabularyJourney` with the item label from Task 2.
- Produces `/vocabulary` and `/vocabulary/:lessonSlug` page content for route registration in Task 5.

- [ ] **Step 1: Write failing page tests**

```tsx
it('shows exactly three selectable Vocabulary units', () => {
  renderApp(['/vocabulary'])
  expect(screen.getByRole('heading', { name: 'Choose a vocabulary unit' })).toBeVisible()
  expect(screen.getAllByRole('link', { name: /Open Unit/ })).toHaveLength(3)
  expect(screen.queryByText('Dialogue & Role Play')).not.toBeInTheDocument()
  expect(screen.queryByText('은 / 는 - topic marker')).not.toBeInTheDocument()
})

it('opens Unit 1 in the shared expression journey', () => {
  renderApp(['/vocabulary/lesson-1'])
  expect(screen.getByRole('heading', { name: 'Essential greetings' })).toBeVisible()
  expect(screen.getByText('Choose a useful expression')).toBeVisible()
})
```

- [ ] **Step 2: Run the page test to verify it fails**

Run: `npm test -- --run src/pages/VocabularyPage.test.tsx`

Expected: FAIL because `VocabularyPage` and its detail route do not exist.

- [ ] **Step 3: Implement the chooser and shared detail view**

```tsx
export function VocabularyPage() {
  const { lessonSlug } = useParams()
  if (lessonSlug === undefined) return <VocabularyUnitChooser units={vocabularyUnits} />
  const unit = vocabularyUnits.find((candidate) => candidate.lessonSlug === lessonSlug)
  if (!unit) return <VocabularyRecovery />
  const items = course.vocabulary.filter((item) => item.unitId === unit.unitId)
  return <VocabularyJourney items={items} itemLabel={unit.itemLabel === 'Useful expressions' ? 'Useful expression' : 'Vocabulary word'} />
}
```

The chooser cards use semantic links with accessible names `Open Unit 1: Essential greetings`, `Open Unit 2: Countries & Nationalities`, and `Open Unit 3: Jobs & Occupations`. Add responsive grid rules that keep cards readable in one column at narrow widths without copying the old seven-unit visual.

- [ ] **Step 4: Run page, visual-contract, and accessibility tests**

Run: `npm test -- --run src/pages/VocabularyPage.test.tsx src/visualSystem.test.ts src/accessibility.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/src/pages/VocabularyPage.tsx app/src/pages/VocabularyPage.test.tsx app/src/styles.css
git commit -m "feat: add vocabulary unit chooser"
```

### Task 4: Create the Grammar chooser and grammar detail routes

**Files:**
- Create: `app/src/pages/GrammarPage.tsx`
- Create: `app/src/pages/GrammarPage.test.tsx`

**Interfaces:**
- Consumes `courseLessons` for Units 4-6 and `course.grammar`.
- Consumes existing `GrammarGuide`.
- Produces `/grammar` and `/grammar/:lessonSlug` page content for route registration in Task 5.

- [ ] **Step 1: Write failing Grammar boundary tests**

```tsx
it('shows only the three grammar units', () => {
  renderApp(['/grammar'])
  expect(screen.getByRole('heading', { name: 'Choose a grammar topic' })).toBeVisible()
  expect(screen.getByText('이에요 / 예요 - to be')).toBeVisible()
  expect(screen.queryByText('Jobs & Occupations')).not.toBeInTheDocument()
  expect(screen.queryByText('Dialogue & Role Play')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --run src/pages/GrammarPage.test.tsx`

Expected: FAIL because `GrammarPage` does not exist.

- [ ] **Step 3: Implement the grammar chooser and guide route**

```tsx
const grammarLessons = courseLessons.filter((lesson) =>
  lesson.id === 'unit-4' || lesson.id === 'unit-5' || lesson.id === 'unit-6',
)

export function GrammarPage() {
  const { lessonSlug } = useParams()
  if (lessonSlug === undefined) return <GrammarTopicChooser lessons={grammarLessons} />
  const lesson = grammarLessons.find((candidate) => candidate.slug === lessonSlug)
  const grammarPoint = lesson && course.grammar.find((item) => item.unitId === lesson.id)
  return grammarPoint ? <GrammarGuide grammarPoint={grammarPoint} /> : <GrammarRecovery />
}
```

- [ ] **Step 4: Run Grammar tests and existing grammar-component coverage**

Run: `npm test -- --run src/pages/GrammarPage.test.tsx src/components/GrammarLesson.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/src/pages/GrammarPage.tsx app/src/pages/GrammarPage.test.tsx
git commit -m "feat: separate grammar topics"
```

### Task 5: Replace Learn navigation, register canonical routes, and protect old links

**Files:**
- Modify: `app/src/navigation.ts`
- Modify: `app/src/routeObjects.tsx`
- Modify: `app/src/components/AppShell.tsx`
- Modify: `app/src/components/AppShell.test.tsx`
- Modify: `app/src/App.test.tsx`
- Modify: `app/src/pages/LearnPage.test.tsx`

**Interfaces:**
- Consumes `VocabularyPage` from Task 3 and `GrammarPage` from Task 4.
- Produces canonical routes: `/vocabulary`, `/vocabulary/:lessonSlug`, `/grammar`, `/grammar/:lessonSlug`, `/practice`, `/dialogue`, `/team`.
- Produces legacy redirects: `/learn`, `/learn/lesson-1` through `/learn/lesson-3` to Vocabulary; `/learn/lesson-4` through `/learn/lesson-6` to Grammar; `/learn/lesson-7` to Dialogue.

- [ ] **Step 1: Write failing navigation and redirect tests**

```tsx
it('renders the five approved primary destinations in order', () => {
  renderShell('/vocabulary')
  expect(within(screen.getByRole('navigation', { name: 'Primary navigation' })).getAllByRole('link').map((link) => link.textContent)).toEqual([
    'Vocabulary', 'Grammar', 'Practice', 'Dialogue', 'Team',
  ])
})

it.each([
  ['/learn/lesson-2', 'Choose a vocabulary unit'],
  ['/learn/lesson-5', 'Choose a grammar topic'],
  ['/learn/lesson-7', 'Dialogue'],
])('redirects legacy %s safely', async (path, expectedHeading) => {
  renderApp([path])
  expect(await screen.findByRole('heading', { name: expectedHeading })).toBeVisible()
})
```

- [ ] **Step 2: Run navigation tests to verify they fail**

Run: `npm test -- --run src/components/AppShell.test.tsx src/App.test.tsx`

Expected: FAIL because Learn is still the primary route and new destinations are unregistered.

- [ ] **Step 3: Register canonical navigation and redirects**

```ts
const requiredPrimaryDestinations = [
  { id: 'vocabulary', path: 'vocabulary', primaryNavigationLabel: 'Vocabulary' },
  { id: 'grammar', path: 'grammar', primaryNavigationLabel: 'Grammar' },
  { id: 'practice', path: 'practice', primaryNavigationLabel: 'Practice' },
  { id: 'dialogue', path: 'dialogue', primaryNavigationLabel: 'Dialogue' },
  { id: 'team', path: 'team', primaryNavigationLabel: 'Team' },
] as const
```

In `AppShell`, return `Vocabulary` for `/vocabulary` and `/vocabulary/*`, and `Grammar` for `/grammar` and `/grammar/*`. Route the home URL to `/vocabulary`. Keep `LearnPage` out of canonical rendering; replace it with explicit `Navigate` elements for the previous `/learn/*` routes.

- [ ] **Step 4: Run navigation, route, mobile-menu, and no-storage tests**

Run: `npm test -- --run src/components/AppShell.test.tsx src/App.test.tsx src/pages/LearnPage.test.tsx`

Expected: PASS after replacing obsolete Learn assertions with canonical-route assertions.

- [ ] **Step 5: Commit**

```bash
git add app/src/navigation.ts app/src/routeObjects.tsx app/src/components/AppShell.tsx app/src/components/AppShell.test.tsx app/src/App.test.tsx app/src/pages/LearnPage.test.tsx
git commit -m "feat: make vocabulary and grammar primary destinations"
```

### Task 6: Full regression and visual verification

**Files:**
- Modify: `app/design-qa.md`
- Create: `app/design-qa-assets/vocabulary-home-and-unit-1.png`

**Interfaces:**
- Consumes all prior canonical routes and UI components.
- Produces recorded visual evidence for the new Vocabulary chooser and Unit 1 learning view.

- [ ] **Step 1: Run all automated checks**

Run:

```bash
npm test -- --run
npm run typecheck
npm run lint
npm run build
npm run test:sites
```

Expected: every command exits 0.

- [ ] **Step 2: Manually verify desktop and mobile routes**

At desktop and 390 px widths, inspect `/vocabulary`, `/vocabulary/lesson-1`, `/vocabulary/lesson-2`, `/vocabulary/lesson-3`, `/grammar`, `/grammar/lesson-4`, `/practice`, `/dialogue`, and `/team`. Confirm the visible navigation order, vocabulary boundary, bilingual wrapping, keyboard focus, and that the Next control remains available without unnecessary scrolling on the shared learning view.

- [ ] **Step 3: Capture and document the visual result**

Capture a single comparison image showing the Vocabulary chooser and Unit 1 expression view. Update `app/design-qa.md` with viewport, routes checked, evidence path, and any accepted media-placeholder limitation.

- [ ] **Step 4: Commit verification evidence**

```bash
git add app/design-qa.md app/design-qa-assets/vocabulary-home-and-unit-1.png
git commit -m "docs: verify vocabulary navigation redesign"
```

## Self-review

- Spec coverage: Tasks 1-3 implement the three-unit Vocabulary source, chooser, shared Unit 3-style view, Unit 1 expression label, and no Units 4-7. Task 4 separates Grammar. Task 5 changes navigation and preserves legacy URLs. Task 6 checks visual, keyboard, media, and build constraints.
- Placeholder scan: no TODO/TBD markers or underspecified testing steps remain.
- Type consistency: `VocabularyItem.displayKind`, `vocabularyUnits`, and `VocabularyJourney.itemLabel` are defined before consumers use them; routes use the existing `lessonSlug` naming consistently.
