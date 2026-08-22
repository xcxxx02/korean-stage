import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { AppShell } from './components/AppShell'
import { FlashcardDeck } from './components/FlashcardDeck'
import { HumanAudioButton } from './components/HumanAudioButton'
import { course } from './content/course'
import { appRouteManifest } from './navigation'
import { DialoguePage } from './pages/DialoguePage'
import { GrammarPage } from './pages/GrammarPage'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PracticePage } from './pages/PracticePage'
import { TeamPage } from './pages/TeamPage'
import { UnitPage } from './pages/UnitPage'
import { VocabularyPage } from './pages/VocabularyPage'

const primaryRoutes = appRouteManifest.flatMap((route): Array<readonly [string, string]> => {
  if ('index' in route) return [['Home', '/']]
  if ('primaryNavigationLabel' in route) return [[route.primaryNavigationLabel, `/${route.path}`]]
  return []
})

const routes = [
  ...primaryRoutes,
  ['Unit 2', '/learn/unit-2'],
  ['Unit 3', '/learn/unit-3'],
  ['Unit 4', '/learn/unit-4'],
  ['Unit 7', '/learn/unit-7'],
  ['Fallback', '/missing'],
] as const

function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="learn/:unitId" element={<UnitPage />} />
          <Route path="vocabulary" element={<VocabularyPage />} />
          <Route path="grammar" element={<GrammarPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="dialogue" element={<DialoguePage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

function duplicateIds(container: HTMLElement) {
  const counts = [...container.querySelectorAll<HTMLElement>('[id]')].reduce<Record<string, number>>((result, element) => {
    result[element.id] = (result[element.id] ?? 0) + 1
    return result
  }, {})
  return Object.entries(counts).filter(([, count]) => count > 1).map(([id]) => id)
}

async function tabTo(user: ReturnType<typeof userEvent.setup>, target: HTMLElement) {
  for (let index = 0; index < 30 && document.activeElement !== target; index += 1) await user.tab()
  expect(target).toHaveFocus()
}

beforeEach(() => localStorage.clear())
afterEach(cleanup)

describe('default-route accessibility', () => {
  it.each(routes)('%s has a single named content landmark and no automated axe violations', async (_name, path) => {
    const { container } = renderRoute(path)

    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main-content')
    expect(duplicateIds(container)).toEqual([])

    const results = await axe.run(container, {
      rules: {
        // jsdom has no layout/canvas implementation; token contrast is covered separately.
        'color-contrast': { enabled: false },
      },
    })
    expect(results.violations).toEqual([])
  })

  it('labels transcript media without announcing static unavailable audio guidance', () => {
    renderRoute('/learn/unit-3')

    expect(screen.getByRole('figure', { name: 'Member 1 vocabulary video transcript' })).toBeInTheDocument()
    expect(screen.getByText('Audio coming soon')).toBeVisible()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('keyboard-complete primary flows', () => {
  it('keeps the skip link as the first keyboard stop on initial load', async () => {
    const user = userEvent.setup()
    renderRoute('/')

    expect(document.body).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveFocus()
  })

  it('opens the menu, advances a word, and focuses an available audio control without pointer clicks', async () => {
    const user = userEvent.setup()
    renderRoute('/learn/unit-3')

    const menu = screen.getByRole('button', { name: 'Menu' })
    await tabTo(user, menu)
    await user.keyboard('[Enter]')
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    expect(within(document.getElementById('primary-navigation-list')!).getByRole('link', { name: 'Practice' })).toBeVisible()
    await user.keyboard('[Escape]')

    const nextWord = screen.getByRole('button', { name: 'Next word' })
    await tabTo(user, nextWord)
    await user.keyboard('[Enter]')
    expect(screen.getByText('Word 2 of 8')).toBeVisible()

    cleanup()
    render(<HumanAudioButton memberName="Member 1" source={{ kind: 'human-recording', src: '/member-1.mp3' }} />)
    await user.tab()
    expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toHaveFocus()
  })

  it('submits one grammar answer, flips a flashcard, and selects a dialogue with the keyboard', async () => {
    const user = userEvent.setup()
    renderRoute('/learn/unit-4')

    const correctAnswer = screen.getByRole('radio', { name: '민수예요' })
    await tabTo(user, correctAnswer)
    await user.keyboard('[Space]')
    await user.tab()
    await user.keyboard('[Enter]')
    expect(screen.getByRole('status')).toHaveTextContent('Correct')

    cleanup()
    render(<FlashcardDeck items={[course.vocabulary[0]]} />)
    const flashcard = screen.getByRole('button', { name: 'Show meaning' })
    await user.tab()
    expect(flashcard).toHaveFocus()
    await user.keyboard('[Space]')
    expect(screen.getByRole('button', { name: 'Show Korean' })).toHaveTextContent(course.vocabulary[0].english)

    cleanup()
    render(<DialoguePage />)
    const dialogueChoices = screen.getByRole('group', { name: 'Choose a dialogue' })
    const secondDialogue = within(dialogueChoices).getAllByRole('button')[1]
    await user.tab()
    await user.tab()
    expect(secondDialogue).toHaveFocus()
    await user.keyboard('[Enter]')
    expect(secondDialogue).toHaveAttribute('aria-pressed', 'true')
    expect(secondDialogue).toHaveTextContent('Selected dialogue')
  })
})
