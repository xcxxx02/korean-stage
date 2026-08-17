# Korean Stage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, responsive React website that teaches only LMPU3282 Lec 1 through seven beginner-friendly units and visibly satisfies every coursework requirement.

**Architecture:** Bootstrap the bundled Product Design web prototype under `app/`, then convert the application surface to React + TypeScript while preserving its Sites-ready Vite/Worker infrastructure. Keep course content in typed local modules, UI behavior in focused components, progress in a guarded local-storage adapter, and submission compliance in a pure validator. The initial site uses development-only identity and media states that are visually complete but intentionally fail submission readiness until the students add their real information and recordings.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7, Phosphor Icons, Vitest, Testing Library, jest-dom, user-event, axe-core, and the bundled Product Design prototype runtime.

## Global Constraints

- Use only content adapted from `C:\Users\Nitro\Downloads\04_LMPU3282_Note_L1.pdf`; do not add Lec 2-6 content.
- Follow `docs/superpowers/specs/2026-08-17-korean-stage-design.md` and visually match `docs/design/korean-stage-approved-ui.png`.
- Label the internal curriculum as Units 1-7, never as seven lecturer-provided Lessons.
- Primary users are English-speaking absolute beginners; no primary task may require understanding an unexplained Korean-only label.
- Every member must own 3-5 recorded vocabulary items; the two-member development dataset uses eight occupation items, four per member.
- Every vocabulary item must support Korean, English, a Korean example, a human selfie video, and human audio.
- Explain 이에요/예요, 은/는, and 이/가 아니에요 in clear English; give each grammar point exactly three exercises.
- Provide two dialogues for the initial group; each has two speakers, 6-8 Korean lines, English translations, and a 1-3 minute drama-video slot.
- All assessed audio and video must use the members' real faces and voices. Never generate, synthesize, or ship AI voice.
- Use pure white surfaces, vivid obangsaek accents, a slim dancheong strip, and restrained pale-gray Korean architectural line art.
- Use real raster assets for custom cultural artwork and `@phosphor-icons/react` for UI icons; do not hand-draw UI imagery with CSS or inline SVG.
- Preserve native audio/video semantics, visible focus, keyboard operation, transcripts, non-color state cues, WCAG AA contrast, and reduced-motion behavior.
- Store progress locally without authentication, a backend, or a database.
- Keep the Product Design project Sites-ready; do not run `init-site.sh` or replace it with another starter.
- Do not publish or deploy unless the user explicitly requests it.

---

## File Structure

```text
app/
  .openai/hosting.json                 # generated Sites metadata source
  public/
    assets/culture/                    # generated palace, dancheong, and media-state artwork
    media/dialogues/                   # user-supplied drama videos and captions
    media/vocabulary/                  # user-supplied selfie videos and human audio
  scripts/prepare-sites-build.mjs      # protected generated hosting builder
  src/
    App.tsx                            # route table only
    main.tsx                           # React entry
    styles.css                         # Tailwind import, tokens, global focus/motion rules
    test/setup.ts                      # jest-dom and browser API test setup
    components/
      AppShell.tsx                     # header, mobile menu, decorative background
      CourseMap.tsx                    # seven-unit overview
      DialoguePlayer.tsx               # bilingual script and full/line playback
      ExerciseEngine.tsx               # question, answer, feedback, retry
      FlashcardDeck.tsx                # keyboard-operable review cards
      HumanAudioButton.tsx             # labeled real-human audio control
      LearningShell.tsx                # unit/item progress and previous/next controls
      MemberVideo.tsx                  # video, captions/transcript, media state
      ProgressSummary.tsx              # completion and last-location display
      SubmissionReadiness.tsx          # development compliance report
      TeamGrid.tsx                     # purpose and member contributions
      VocabularyJourney.tsx            # bilingual ordered word sequence
    content/
      course.ts                        # complete Lec 1 dataset
      types.ts                         # shared domain contracts
      validateCourse.ts                # pure coursework validator
    hooks/
      useCourseProgress.ts             # React progress API
    pages/
      DialoguePage.tsx
      GrammarPage.tsx
      HomePage.tsx
      LearnPage.tsx
      NotFoundPage.tsx
      PracticePage.tsx
      TeamPage.tsx
      UnitPage.tsx
      VocabularyPage.tsx
    progress/
      progressStore.ts                 # guarded localStorage adapter
    test/
      fixtures.ts                      # valid and incomplete course fixtures
  tests/sites-worker.test.mjs          # generated hosting contract
  package.json
  tsconfig.json
  vite.config.mjs
  worker/index.js                      # generated Sites worker
design-qa.md                           # final reference-vs-build report
```

---

### Task 1: Bootstrap the Sites-ready React + TypeScript test environment

**Files:**
- Create from Product Design template: `app/**`
- Create: `app/tsconfig.json`
- Create: `app/eslint.config.js`
- Create: `app/src/App.test.tsx`
- Create: `app/src/test/setup.ts`
- Create: `app/src/App.tsx`
- Create: `app/src/main.tsx`
- Modify: `app/package.json`
- Modify: `app/index.html`
- Modify: `app/vite.config.mjs`
- Modify: `app/src/styles.css`
- Delete after TypeScript entry passes: `app/src/App.jsx`, `app/src/main.jsx`

**Interfaces:**
- Consumes: the bundled Product Design `prototype` template.
- Produces: `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`, and a TypeScript React root that later tasks extend.

- [ ] **Step 1: Bootstrap the Product Design web template**

Run from the repository root:

```powershell
node "C:\Users\Nitro\.codex\plugins\cache\openai-curated-remote\product-design\0.1.52\scripts\bootstrap-prototype.mjs" --dest "C:\Users\Nitro\Documents\ChatGPT\Korean Project\app"
```

Expected: `app/package.json`, `app/src/App.jsx`, `app/vite.config.mjs`, `app/worker/index.js`, and `app/.openai/hosting.json` exist.

- [ ] **Step 2: Install runtime and test dependencies**

Run:

```powershell
npm install --prefer-offline --no-audit --no-fund react-router-dom @phosphor-icons/react tailwindcss @tailwindcss/vite @fontsource-variable/noto-sans @fontsource-variable/noto-sans-kr
npm install --save-dev --prefer-offline --no-audit --no-fund typescript @types/react @types/react-dom @types/node vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom axe-core eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh
```

Working directory: `app`.

- [ ] **Step 3: Add the failing application smoke test**

Create `app/src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('introduces Korean Stage as a Lec 1 beginner course', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Korean Stage/i })).toBeInTheDocument()
    expect(screen.getByText(/adapted entirely from Lec 1/i)).toBeInTheDocument()
  })
})
```

Create `app/src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Add to `app/package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  },
  "vitest": {
    "environment": "jsdom",
    "setupFiles": ["./src/test/setup.ts"]
  }
}
```

- [ ] **Step 4: Run the smoke test and verify the red state**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because `src/App.tsx` does not exist or the starter does not contain the required heading and Lec 1 statement.

- [ ] **Step 5: Add the minimal TypeScript application root**

Create `app/src/App.tsx`:

```tsx
export default function App() {
  return (
    <main>
      <h1>Korean Stage</h1>
      <p>A beginner course adapted entirely from Lec 1.</p>
    </main>
  )
}
```

Create `app/src/main.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/noto-sans'
import '@fontsource-variable/noto-sans-kr'
import './styles.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
)
```

Change the module script in `app/index.html` from `/src/main.jsx` to `/src/main.tsx`, then delete `app/src/App.jsx` and `app/src/main.jsx` so only one entry path remains.

Create `app/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vitest/globals"]
  },
  "include": ["src"]
}
```

Update `app/vite.config.mjs` without changing its Sites output directory or allowed host:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: { outDir: 'dist/client' },
  optimizeDeps: { include: ['react', 'react-dom/client'] },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['terminal.local'],
    warmup: { clientFiles: ['./src/main.tsx'] },
  },
  plugins: [react(), tailwindcss()],
})
```

Start `app/src/styles.css` with `@import "tailwindcss";`. Create `app/eslint.config.js`:

```js
import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
)
```

- [ ] **Step 6: Verify the green state and generated hosting contract**

Run:

```powershell
npm test -- src/App.test.tsx
npm run typecheck
npm run lint
npm run build
npm run test:sites
```

Expected: all commands pass; `dist/client`, `dist/server/index.js`, and `dist/.openai/hosting.json` exist.

- [ ] **Step 7: Commit the foundation**

```powershell
git add app
git commit -m "chore: bootstrap Korean Stage app"
```

---

### Task 2: Define Lec 1 content contracts and coursework validation

**Files:**
- Create: `app/src/content/types.ts`
- Create: `app/src/content/course.ts`
- Create: `app/src/content/validateCourse.ts`
- Create: `app/src/content/validateCourse.test.ts`
- Create: `app/src/test/fixtures.ts`

**Interfaces:**
- Produces: `Course`, `Member`, `VocabularyItem`, `GrammarPoint`, `Exercise`, `Dialogue`, `DialogueLine`, `CourseIssue`, `course`, and `validateCourse(course: Course): CourseIssue[]`.
- Consumers: every later page and component imports these types and the single `course` dataset.

- [ ] **Step 1: Write failing validator tests for the coursework limits**

Create tests that assert:

```ts
expect(validateCourse(validCourse)).toEqual([])
expect(validateCourse(courseWithTwoWordsForMember)).toContainEqual(
  expect.objectContaining({ code: 'member-vocabulary-count', memberId: 'member-1' }),
)
expect(validateCourse(courseWithFiveLineDialogue)).toContainEqual(
  expect.objectContaining({ code: 'dialogue-line-count', dialogueId: 'dialogue-1' }),
)
expect(validateCourse(courseWithAiVoice)).toContainEqual(
  expect.objectContaining({ code: 'ai-voice-prohibited' }),
)
```

The valid fixture contains two members, four recorded words each, three grammar points with three exercises each, two dialogues with eight lines each, real-looking media paths, and participation by both members.

- [ ] **Step 2: Run the validator test and verify the red state**

Run: `npm test -- src/content/validateCourse.test.ts`

Expected: FAIL because the content contracts and validator do not exist.

- [ ] **Step 3: Implement the domain contracts**

Create `types.ts` with these exact core shapes:

```ts
export type MediaSource = {
  src: string | null
  captionSrc?: string | null
  kind: 'human-recording' | 'development-missing' | 'ai-generated'
  durationSeconds?: number
}

export type CourseIssue = {
  code: string
  severity: 'warning' | 'error' | 'prohibited'
  message: string
  memberId?: string
  vocabularyId?: string
  grammarId?: string
  dialogueId?: string
}

export type Member = {
  id: string
  name: string
  studentId: string
  isDevelopmentIdentity: boolean
}

export type VocabularyItem = {
  id: string
  unitId: 'unit-2' | 'unit-3'
  korean: string
  english: string
  romanization: string
  pronunciationHint?: string
  koreanExample: string
  englishExample: string
  ownerId: string | null
  video: MediaSource
  audio: MediaSource
}

export type Exercise = {
  id: string
  grammarId: string
  type: 'multiple-choice' | 'particle' | 'sentence-completion'
  prompt: string
  koreanContext: string
  choices: string[]
  answer: string
  explanation: string
}

export type GrammarPoint = {
  id: string
  unitId: 'unit-4' | 'unit-5' | 'unit-6'
  korean: string
  englishFunction: string
  explanation: string
  rules: string[]
  examples: Array<{ korean: string; english: string }>
  exercises: Exercise[]
}

export type DialogueLine = {
  id: string
  speakerId: string
  korean: string
  english: string
  audio: MediaSource
}

export type Dialogue = {
  id: string
  title: string
  speakerIds: string[]
  lines: DialogueLine[]
  video: MediaSource
}

export type Course = {
  sourceLesson: 'Lec 1'
  name: 'Korean Stage'
  purpose: string
  members: Member[]
  vocabulary: VocabularyItem[]
  grammar: GrammarPoint[]
  dialogues: Dialogue[]
}
```

- [ ] **Step 4: Implement the pure validator**

`validateCourse` returns coded issues for source lesson, website name/purpose, missing real member details, member vocabulary count outside 3-5, missing bilingual word fields, missing human media, grammar count, exercise count outside 2-5, dialogue count outside 2-3, speaker count outside 2-3, line count outside 6-8, missing translation/label, video duration outside 60-180 seconds, missing member participation, and any media kind other than `human-recording` in submission mode.

Use a validator option to distinguish development from submission:

```ts
export function validateCourse(
  course: Course,
  mode: 'development' | 'submission' = 'submission',
): CourseIssue[]
```

Development mode reports missing identities and media as warnings; submission mode reports them as errors. Items with `ownerId: null` are supporting vocabulary and are excluded from the 3-5 recording count and required-media checks. Both modes return a prohibited `ai-voice-prohibited` issue whenever any media source has `kind: 'ai-generated'`.

- [ ] **Step 5: Add the complete Lec 1 course dataset**

Use these eight recorded occupation items in Unit 3, assigned four per development member:

```ts
[
  ['student', '학생', 'Student', 'haksaeng', 'hak-ssaeng', '저는 학생이에요.', 'I am a student.', 'member-1'],
  ['teacher', '선생님', 'Teacher', 'seonsaengnim', undefined, '저는 선생님이에요.', 'I am a teacher.', 'member-1'],
  ['office-worker', '회사원', 'Office worker', 'hoesawon', undefined, '저는 회사원이에요.', 'I am an office worker.', 'member-1'],
  ['reporter', '기자', 'Reporter', 'gija', undefined, '저는 기자예요.', 'I am a reporter.', 'member-1'],
  ['doctor', '의사', 'Doctor', 'uisa', undefined, '저는 의사예요.', 'I am a doctor.', 'member-2'],
  ['singer', '가수', 'Singer', 'gasu', undefined, '저는 가수예요.', 'I am a singer.', 'member-2'],
  ['soldier', '군인', 'Soldier', 'gunin', undefined, '저는 군인이에요.', 'I am a soldier.', 'member-2'],
  ['chef', '요리사', 'Chef', 'yorisa', undefined, '저는 요리사예요.', 'I am a chef.', 'member-2'],
]
```

Also include Unit 2 bilingual learning cards for 중국/China, 일본/Japan, 미국/USA, 한국/Korea, 프랑스/France, 독일/Germany, 호주/Australia, and 영국/United Kingdom. These cards have no owner and do not count toward member recording totals.

Add the three grammar points and nine exercises with these answers:

```text
이에요/예요: 민수예요, 학생이에요, 제니예요
은/는: 저는 학생이에요, 선생님은 한국 사람이에요, 제니는 가수예요
이/가 아니에요: 미국 사람이 아니에요, 가수가 아니에요, 회사원이 아니에요
```

Add two eight-line bilingual dialogues. Dialogue 1 covers greeting, names, and nationality. Dialogue 2 covers occupations and negative identification. Use `member-1` and `member-2` as speaker IDs so real names flow from member data later.

- [ ] **Step 6: Run tests and commit**

Run: `npm test -- src/content/validateCourse.test.ts && npm run typecheck`

Expected: PASS.

```powershell
git add app/src/content app/src/test/fixtures.ts
git commit -m "feat: add Lec 1 course data and validation"
```

---

### Task 3: Build routing, global navigation, and the shared shell

**Files:**
- Create: `app/src/components/AppShell.tsx`
- Create: `app/src/components/AppShell.test.tsx`
- Create: `app/src/pages/HomePage.tsx`
- Create: `app/src/pages/LearnPage.tsx`
- Create: `app/src/pages/VocabularyPage.tsx`
- Create: `app/src/pages/GrammarPage.tsx`
- Create: `app/src/pages/PracticePage.tsx`
- Create: `app/src/pages/DialoguePage.tsx`
- Create: `app/src/pages/TeamPage.tsx`
- Create: `app/src/pages/NotFoundPage.tsx`
- Modify: `app/src/App.tsx`

**Interfaces:**
- Produces: routes `/`, `/learn`, `/learn/:unitId`, `/vocabulary`, `/grammar`, `/practice`, `/dialogue`, `/team`, and fallback `*`.
- Consumes: no course behavior beyond the `course.name` and source lesson statement.

- [ ] **Step 1: Write failing navigation tests**

Test with `MemoryRouter` that the header exposes Learn, Vocabulary, Grammar, Practice, Dialogue, and Team; active navigation uses `aria-current="page"`; the mobile menu has an accessible name; and an unknown route shows `Page not found` plus `Return to course`.

- [ ] **Step 2: Verify the red state**

Run: `npm test -- src/components/AppShell.test.tsx`

Expected: FAIL because the router shell does not exist.

- [ ] **Step 3: Implement the route table and focused page headings**

Use `createBrowserRouter` and `RouterProvider` in `App.tsx`. `AppShell` renders one `<header>`, one `<nav aria-label="Primary navigation">`, one `<main id="main-content">`, and an `<Outlet />`. Include a skip link. Each page module initially renders its final English page heading and one accurate purpose sentence; later tasks replace only page bodies.

- [ ] **Step 4: Implement mobile-menu behavior**

Use a Phosphor `List` icon and visible `Menu` label. The button sets `aria-expanded`, Escape closes the panel, selecting a route closes it, and route changes restore focus to the page heading.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- src/components/AppShell.test.tsx && npm run typecheck && npm run lint`

Expected: PASS.

```powershell
git add app/src/App.tsx app/src/components/AppShell* app/src/pages
git commit -m "feat: add course routing and navigation"
```

---

### Task 4: Add the seven-unit course map and durable local progress

**Files:**
- Create: `app/src/progress/progressStore.ts`
- Create: `app/src/progress/progressStore.test.ts`
- Create: `app/src/hooks/useCourseProgress.ts`
- Create: `app/src/components/CourseMap.tsx`
- Create: `app/src/components/ProgressSummary.tsx`
- Create: `app/src/pages/HomePage.test.tsx`
- Modify: `app/src/pages/HomePage.tsx`
- Modify: `app/src/pages/LearnPage.tsx`

**Interfaces:**
- Produces: `CourseProgress`, `readProgress(storage?: Storage)`, `writeProgress(progress, storage?: Storage)`, `markUnitComplete(unitId)`, `markVocabularyComplete(itemId)`, and `recordExerciseResult(exerciseId, correct)`.
- Consumes: seven fixed unit IDs from course metadata.

- [ ] **Step 1: Write failing storage tests**

Assert that missing storage returns the default state, valid JSON restores progress, corrupt JSON is removed and returns defaults, unavailable storage does not throw, and a write/read round trip preserves completed units, vocabulary items, scores, and last location.

- [ ] **Step 2: Verify the red state**

Run: `npm test -- src/progress/progressStore.test.ts`

Expected: FAIL because the adapter does not exist.

- [ ] **Step 3: Implement the guarded adapter and hook**

Use storage key `korean-stage-progress-v1`. Define:

```ts
export type CourseProgress = {
  completedUnitIds: string[]
  completedVocabularyIds: string[]
  exerciseResults: Record<string, boolean>
  lastPath: string
}
```

Wrap every storage operation in `try/catch`; validate parsed shapes before use.

- [ ] **Step 4: Write the failing home-page behavior test**

Render `HomePage` with default progress and assert seven unit links, `Start learning`, the source statement `All seven units are adapted entirely from Lec 1`, and `0 of 7 units complete`. Seed progress and assert `Continue learning` points to `lastPath`.

- [ ] **Step 5: Implement CourseMap and ProgressSummary**

Use the approved titles: Hello & Self-introduction; Countries & Nationalities; Jobs & Occupations; 이에요 / 예요 - to be; 은 / 는 - topic marker; 이 / 가 아니에요 - to not be; Dialogue & Role Play. Every Korean grammar title has its English function adjacent.

- [ ] **Step 6: Run tests and commit**

Run: `npm test -- src/progress src/pages/HomePage.test.tsx && npm run typecheck`

Expected: PASS.

```powershell
git add app/src/progress app/src/hooks app/src/components/CourseMap* app/src/components/ProgressSummary* app/src/pages/HomePage* app/src/pages/LearnPage.tsx
git commit -m "feat: add course map and saved progress"
```

---

### Task 5: Implement the bilingual sequential vocabulary journey

**Files:**
- Create: `app/src/components/HumanAudioButton.tsx`
- Create: `app/src/components/MemberVideo.tsx`
- Create: `app/src/components/LearningShell.tsx`
- Create: `app/src/components/VocabularyJourney.tsx`
- Create: `app/src/components/VocabularyJourney.test.tsx`
- Create: `app/src/pages/UnitPage.tsx`
- Modify: `app/src/pages/VocabularyPage.tsx`
- Modify: `app/src/App.tsx`

**Interfaces:**
- Produces: `VocabularyJourney({ items, initialItemId? })`, `HumanAudioButton({ source, memberName })`, `MemberVideo({ source, memberName, transcript })`, and the Unit 2/3 route bodies.
- Consumes: `VocabularyItem[]`, `Member[]`, and `markVocabularyComplete`.

- [ ] **Step 1: Write failing beginner-language and sequencing tests**

Assert that:

```tsx
expect(screen.getByText('학생')).toBeVisible()
expect(screen.getByText('Student')).toBeVisible()
expect(screen.getByText('Romanization:')).toBeVisible()
expect(screen.getByText('haksaeng')).toBeVisible()
expect(screen.getByText('Pronunciation:')).toBeVisible()
expect(screen.getByText('hak-ssaeng')).toBeVisible()
expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toBeDisabled()
expect(screen.getByText('Now learning')).toBeVisible()
```

Click Next word and assert Teacher/선생님 appears; click Previous word and assert Student/학생 returns. Assert there is exactly one enabled primary `Next word` button.

- [ ] **Step 2: Verify the red state**

Run: `npm test -- src/components/VocabularyJourney.test.tsx`

Expected: FAIL because the vocabulary journey does not exist.

- [ ] **Step 3: Implement explicit media states**

`HumanAudioButton` displays the speaker icon plus `Listen to {memberName}`. It is disabled and shows `Audio coming soon` when `source.src` is null. `MemberVideo` renders native controls, captions when supplied, an adjacent transcript, and a designed `Member video coming soon` panel with the four recording checks when media is missing.

- [ ] **Step 4: Implement the vocabulary rail and detailed panel**

Every rail row contains Korean, English, and its number. The active row adds `aria-current="step"`, a filled number, an active bar, and `Now learning`. The detail panel shows Korean, English, labeled romanization, optional labeled pronunciation, human audio, bilingual example, and the relevant plain-English grammar tip.

- [ ] **Step 5: Implement Unit 2 and Unit 3 content behavior**

Unit 2 shows the eight bilingual country/nationality cards and flashcard entry. Unit 3 shows the eight ordered recorded occupation items and the approved desktop arrangement. `Unit 3 · Jobs & Occupations` must be the visible heading for 학생.

- [ ] **Step 6: Run tests and commit**

Run: `npm test -- src/components/VocabularyJourney.test.tsx && npm run typecheck && npm run lint`

Expected: PASS.

```powershell
git add app/src/components/HumanAudioButton* app/src/components/MemberVideo* app/src/components/LearningShell* app/src/components/VocabularyJourney* app/src/pages/UnitPage.tsx app/src/pages/VocabularyPage.tsx app/src/App.tsx
git commit -m "feat: add beginner vocabulary journey"
```

---

### Task 6: Build the three grammar units and the exercise engine

**Files:**
- Create: `app/src/components/ExerciseEngine.tsx`
- Create: `app/src/components/ExerciseEngine.test.tsx`
- Create: `app/src/components/GrammarLesson.tsx`
- Create: `app/src/components/GrammarLesson.test.tsx`
- Modify: `app/src/pages/GrammarPage.tsx`
- Modify: `app/src/pages/UnitPage.tsx`

**Interfaces:**
- Produces: `GrammarLesson({ grammarPoint })` and `ExerciseEngine({ exercises, onResult })`.
- Consumes: three `GrammarPoint` objects and `recordExerciseResult`.

- [ ] **Step 1: Write failing grammar-comprehension tests**

Render the 이에요/예요 unit and assert the visible heading is `이에요 / 예요 - to be`, the English rule explains consonant/vowel choice, every Korean example has an English translation, and exactly three exercise prompts are available.

- [ ] **Step 2: Write failing answer-feedback tests**

Choose the wrong answer and assert `Not quite`, the correct answer, and the English explanation appear. Retry, choose the correct answer, and assert `Correct` plus updated score. Keyboard selection and submission must work.

- [ ] **Step 3: Verify the red state**

Run: `npm test -- src/components/GrammarLesson.test.tsx src/components/ExerciseEngine.test.tsx`

Expected: FAIL because the components do not exist.

- [ ] **Step 4: Implement GrammarLesson and ExerciseEngine**

Use semantic sections and fieldsets. Do not show Korean-only instructions. Announce answer results with `aria-live="polite"`. Preserve selected answers while feedback is visible and provide a visible `Try again` action.

- [ ] **Step 5: Connect Units 4-6 and the Grammar overview**

The overview links to all three units with Korean form, English function, one-sentence purpose, and completion state. Each unit uses the same LearningShell and records completion only after all three exercise results are correct.

- [ ] **Step 6: Run tests and commit**

Run: `npm test -- src/components/GrammarLesson.test.tsx src/components/ExerciseEngine.test.tsx && npm run typecheck`

Expected: PASS.

```powershell
git add app/src/components/ExerciseEngine* app/src/components/GrammarLesson* app/src/pages/GrammarPage.tsx app/src/pages/UnitPage.tsx
git commit -m "feat: add grammar lessons and exercises"
```

---

### Task 7: Add flashcards and the final practice challenge

**Files:**
- Create: `app/src/components/FlashcardDeck.tsx`
- Create: `app/src/components/FlashcardDeck.test.tsx`
- Create: `app/src/pages/PracticePage.test.tsx`
- Modify: `app/src/pages/PracticePage.tsx`

**Interfaces:**
- Produces: `FlashcardDeck({ items })` with flip, previous, next, shuffle, and reset; final challenge score from the nine grammar exercises.
- Consumes: bilingual Unit 2 and Unit 3 vocabulary plus the nine exercises.

- [ ] **Step 1: Write failing flashcard interaction tests**

Assert the front shows Korean plus `Show meaning`; flipping shows English and romanization; ArrowRight/ArrowLeft navigate; Space flips; Shuffle changes order deterministically when passed a seeded random function; Reset restores the original order.

- [ ] **Step 2: Verify the red state**

Run: `npm test -- src/components/FlashcardDeck.test.tsx`

Expected: FAIL because the deck does not exist.

- [ ] **Step 3: Implement the accessible deck**

Use a real button for flip and visible text labels for every control. Announce `Card X of Y`. Keep transform motion below 250 ms and disable the flip animation under reduced motion.

- [ ] **Step 4: Write and implement the final challenge behavior**

The Practice page offers Vocabulary Flashcards and Grammar Challenge. The challenge uses one exercise at a time, prevents an empty submission, shows bilingual feedback where Korean is involved, calculates `correct / 9`, and offers `Review incorrect answers` and `Try again`.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- src/components/FlashcardDeck.test.tsx src/pages/PracticePage.test.tsx && npm run typecheck`

Expected: PASS.

```powershell
git add app/src/components/FlashcardDeck* app/src/pages/PracticePage*
git commit -m "feat: add flashcards and final practice"
```

---

### Task 8: Implement bilingual dialogue study and full role-play playback

**Files:**
- Create: `app/src/components/DialoguePlayer.tsx`
- Create: `app/src/components/DialoguePlayer.test.tsx`
- Modify: `app/src/pages/DialoguePage.tsx`
- Modify: `app/src/pages/UnitPage.tsx`

**Interfaces:**
- Produces: `DialoguePlayer({ dialogue, members })` and the Unit 7 integrated flow.
- Consumes: two eight-line dialogues, `MemberVideo`, and `HumanAudioButton`.

- [ ] **Step 1: Write failing dialogue-rule and interaction tests**

Assert both dialogues are available; selecting one renders exactly eight Korean lines, eight English translations, and explicit speaker labels. Assert `Play full role-play video` is the primary media control and line replay buttons have names such as `Listen to line 1 by Member 1`.

- [ ] **Step 2: Verify the red state**

Run: `npm test -- src/components/DialoguePlayer.test.tsx`

Expected: FAIL because the player does not exist.

- [ ] **Step 3: Implement the bilingual script and media hierarchy**

Show the full 1-3 minute drama video before study controls. Keep all lines visible as a transcript. Selecting a line updates `aria-current`, never hides its English translation, and uses only its supplied human recording.

- [ ] **Step 4: Add the role-play recording checklist**

Display: show every speaker's face; use each member's real voice; act naturally; record 1-3 minutes; maintain clear pronunciation and uninterrupted flow; avoid background noise; never use AI voice.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- src/components/DialoguePlayer.test.tsx && npm run typecheck`

Expected: PASS.

```powershell
git add app/src/components/DialoguePlayer* app/src/pages/DialoguePage.tsx app/src/pages/UnitPage.tsx
git commit -m "feat: add bilingual role-play dialogues"
```

---

### Task 9: Add Team details and a submission-readiness report

**Files:**
- Create: `app/src/components/TeamGrid.tsx`
- Create: `app/src/components/SubmissionReadiness.tsx`
- Create: `app/src/components/SubmissionReadiness.test.tsx`
- Modify: `app/src/pages/TeamPage.tsx`

**Interfaces:**
- Produces: Team contribution cards and `SubmissionReadiness({ course })` grouped into Passed, Needs content, and Prohibited.
- Consumes: `course` and `validateCourse`.

- [ ] **Step 1: Write the failing development-readiness test**

Using the real development dataset, assert the report says `Not ready for submission`, names both missing real identities, lists all missing vocabulary media, lists both missing dialogue videos, and still marks vocabulary counts, grammar counts, exercise counts, dialogue counts, line counts, navigation, website name, and purpose as structurally complete.

- [ ] **Step 2: Verify the red state**

Run: `npm test -- src/components/SubmissionReadiness.test.tsx`

Expected: FAIL because the report does not exist.

- [ ] **Step 3: Implement TeamGrid**

Show the Korean Stage purpose, the Lec 1 source statement, member name, student ID, assigned word count, assigned Korean/English word pairs, and dialogue participation. Development identities carry a visible `Replace before submission` badge.

- [ ] **Step 4: Implement SubmissionReadiness**

Map validator issue codes to plain-English actions. Put AI voice prohibition at the top in a persistent warning: `AI-generated voices receive 0 marks and must never be added.` Do not claim pronunciation, acting, lighting, or noise have passed; label them `Human review required`.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- src/components/SubmissionReadiness.test.tsx && npm run typecheck`

Expected: PASS.

```powershell
git add app/src/components/TeamGrid* app/src/components/SubmissionReadiness* app/src/pages/TeamPage.tsx
git commit -m "feat: add team and submission readiness"
```

---

### Task 10: Produce and integrate the Korean cultural visual assets

**Files:**
- Create: `app/public/assets/culture/dancheong-strip.png`
- Create: `app/public/assets/culture/palace-line-art.png`
- Create: `app/public/assets/culture/video-coming-soon.png`
- Create: `app/src/assets.test.ts`
- Modify: `app/src/styles.css`
- Modify: `app/src/components/AppShell.tsx`
- Modify: `app/src/components/MemberVideo.tsx`

**Interfaces:**
- Produces: measured raster assets and the final white/obangsaek visual system.
- Consumes: the selected mockup dimensions and existing component slots.

- [ ] **Step 1: Measure the final asset slots from the approved mockup**

Record in `app/src/styles.css` comments only the resulting slot contracts: header strip `1440 x 12`, lower-left palace line art maximum `520 x 210`, and missing-video artwork `960 x 540` at 16:9. Do not copy the complete mockup into the page.

- [ ] **Step 2: Write the failing asset-contract test**

Use Node `fs.existsSync` in Vitest to require the three exact PNG paths. Assert `AppShell.tsx` references the strip and palace assets and `MemberVideo.tsx` references the media-state artwork.

- [ ] **Step 3: Generate the three assets with built-in Image Gen**

Generate each asset independently and save it to the exact path above.

Prompt for `dancheong-strip.png`:

```text
Transparent-background horizontal decorative asset, 1440 x 12. A crisp simplified Korean dancheong band using vivid cobalt blue, jade green, vermilion red, sunny yellow, and small white line motifs. Seamless-looking, flat front view, no text, no shadows, no beige, no dark navy.
```

Prompt for `palace-line-art.png`:

```text
Transparent-background Korean cultural line-art asset, 1040 x 420. Accurate Gyeongbokgung-inspired gate and hanok tiled eaves with gently upturned corners, drawn only in cool light gray thin lines, fading softly at the right and upper edges. No fill, no people, no skyline, no Chinese pagoda styling, no Japanese torii, no text.
```

Prompt for `video-coming-soon.png`:

```text
Clean 16:9 educational media-state illustration, 1920 x 1080, pure white background. Restrained Korean window-lattice corner detail and pale-gray cloud line motif, with a simple camera-and-person recording-guide composition in vivid cobalt, jade, and vermilion. Clearly a recording guide, not a real student and not a photoreal person. No text, no AI imagery cues, no dark background.
```

- [ ] **Step 4: Inspect every generated asset before integration**

Use `view_image` on each saved file. Reject and regenerate any asset with text, watermark, opaque beige background, incorrect architecture, cropped edges, or density that competes with learning content.

- [ ] **Step 5: Implement final tokens and layout styling**

Define Tailwind theme variables for white, charcoal, cobalt, vermilion, yellow, jade, border gray, and focus blue. Recreate the selected mockup using grid/flex layout, not a screenshot background. Apply palace artwork only to unused lower corners and keep it beneath controls. Use one consistent radius scale, one subtle border scale, and shadows only for menus or focused media.

- [ ] **Step 6: Run tests and commit**

Run: `npm test -- src/assets.test.ts && npm run typecheck && npm run build`

Expected: PASS.

```powershell
git add app/public/assets/culture app/src/assets.test.ts app/src/styles.css app/src/components/AppShell.tsx app/src/components/MemberVideo.tsx
git commit -m "feat: apply Korean Stage visual system"
```

---

### Task 11: Close accessibility, mobile, and reduced-motion gaps

**Files:**
- Create: `app/src/accessibility.test.tsx`
- Create: `app/src/responsive-contract.test.tsx`
- Modify: focused components identified by the failing tests
- Modify: `app/src/styles.css`

**Interfaces:**
- Produces: keyboard-complete primary flow, semantic transcripts, non-color progress, readable mobile bilingual selection, and reduced-motion styling.
- Consumes: all primary routes and components.

- [ ] **Step 1: Write failing automated accessibility checks**

Run axe-core against Home, Unit 3, Unit 4, Practice, Dialogue, and Team in their default states. Also assert one `<main>`, one level-one heading, a skip link, accessible media labels, `aria-live` feedback, and no duplicate IDs.

- [ ] **Step 2: Write failing keyboard and beginner-language checks**

Using user-event keyboard APIs, complete menu opening, word navigation, audio-button focus, one grammar answer, one flashcard flip, and dialogue selection without pointer clicks. Assert all vocabulary selectors retain English meanings at mobile state and all error/empty messages contain English instructions.

- [ ] **Step 3: Verify the red state**

Run: `npm test -- src/accessibility.test.tsx src/responsive-contract.test.tsx`

Expected: FAIL with specific semantic, focus, or language gaps.

- [ ] **Step 4: Apply the smallest fixes for every failure**

Correct landmarks, labels, focus order, announcement regions, button sizes, contrast, and mobile layout. Add `@media (prefers-reduced-motion: reduce)` to remove nonessential transforms and transitions. Use a bilingual mobile selector rather than Korean-only abbreviations.

- [ ] **Step 5: Run the full suite and commit**

Run: `npm test && npm run typecheck && npm run lint`

Expected: PASS with no warnings.

```powershell
git add app/src
git commit -m "fix: complete accessibility and responsive behavior"
```

---

### Task 12: Verify coursework coverage and pass visual design QA

**Files:**
- Create: `design-qa.md`
- Create: `docs/verification/coursework-coverage.md`
- Modify: implementation files only when verification exposes a failure

**Interfaces:**
- Produces: a locally running verified prototype, a coursework traceability report, and `design-qa.md` with `final result: passed`.
- Consumes: the approved mockup, source PDFs, automated tests, and all implemented routes.

- [ ] **Step 1: Run the complete automated verification set**

Run from `app`:

```powershell
npm test
npm run typecheck
npm run lint
npm run build
npm run test:sites
```

Expected: every command exits 0; no test, type, lint, build, or hosting warning remains unexplained.

- [ ] **Step 2: Start the local prototype**

Run: `npm run dev -- --host 0.0.0.0 --port 4173 --strictPort`

Keep the process running. In Codex Desktop, use the in-app Browser and open the local preview according to the Product Design browser rule.

- [ ] **Step 3: Test the primary journey in the browser**

Verify Home → Start Learning → Unit 2 → Unit 3 word 1 through word 8 → Unit 4 exercise → Practice flashcard → Dialogue full-video state → Team readiness. Test desktop `1440 x 1024`, tablet `834 x 1194`, and mobile `390 x 844`. Inspect the console after each primary route and require zero application errors.

- [ ] **Step 4: Create the coursework coverage report**

For every requirement, record its route, visible evidence, automated test, and final status. Include vocabulary counts, member face/voice media status, grammar explanations, 2-5 exercises per grammar point, interactive tools, dialogue counts/speakers/lines/translations/duration, member details, audio playback, navigation, organization, and AI-voice prohibition.

The development report must state that real names, student IDs, and real recordings remain user-supplied submission dependencies until they are added; do not mark those items complete based on development media states.

- [ ] **Step 5: Run reference-versus-build design QA**

Capture the implemented Unit 3 word 1 screen at `1440 x 1024`. Compare that screenshot and `docs/design/korean-stage-approved-ui.png` together. Write `design-qa.md` with P0-P3 findings. Fix every P0-P2 issue, recapture, and repeat until the report ends with:

```text
final result: passed
```

Do not loop on P3 polish; record remaining P3 notes for later iteration.

- [ ] **Step 6: Run final verification after visual fixes**

Run again:

```powershell
npm test
npm run typecheck
npm run lint
npm run build
npm run test:sites
git diff --check
```

Expected: all pass and `design-qa.md` says `final result: passed`.

- [ ] **Step 7: Commit the verified result**

```powershell
git add app design-qa.md docs/verification/coursework-coverage.md
git commit -m "test: verify Korean Stage coursework site"
```

---

## Post-build User Media Handoff

The development build deliberately remains not ready for coursework submission until the user provides:

1. Real names and student IDs for every member.
2. Eight member selfie vocabulary videos and matching human audio files for the initial two-member assignment.
3. Captions or transcripts synchronized to each vocabulary video.
4. Two complete 1-3 minute drama videos using every member's face and voice.
5. Human confirmation of pronunciation, intonation, lighting, background noise, acting, and uninterrupted verbal flow.
6. Review of all Korean words, example sentences, grammar explanations, exercise answers, and dialogue lines by the lecturer or a fluent Korean reviewer.

After those files are supplied, update only `app/src/content/course.ts` and `app/public/media/`, rerun Task 12, and require the submission-readiness report to pass before submission.
