import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { AppShell } from './components/AppShell'
import { FlashcardDeck } from './components/FlashcardDeck'
import { HumanAudioButton } from './components/HumanAudioButton'
import { course } from './content/course'
import { DialoguePage } from './pages/DialoguePage'
import { HomePage } from './pages/HomePage'
import { PracticePage } from './pages/PracticePage'
import { TeamPage } from './pages/TeamPage'
import { UnitPage } from './pages/UnitPage'

const routes = [
  ['Home', '/'],
  ['Unit 3', '/learn/unit-3'],
  ['Unit 4', '/learn/unit-4'],
  ['Practice', '/practice'],
  ['Dialogue', '/dialogue'],
  ['Team', '/team'],
] as const

function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="learn/:unitId" element={<UnitPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="dialogue" element={<DialoguePage />} />
          <Route path="team" element={<TeamPage />} />
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

  it('labels transcript media and announces unavailable human audio', () => {
    renderRoute('/learn/unit-3')

    expect(screen.getByRole('figure', { name: 'Member 1 vocabulary video transcript' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Audio coming soon')
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
    menu.focus()
    await user.keyboard('[Enter]')
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    expect(within(document.getElementById('primary-navigation-list')!).getByRole('link', { name: 'Practice' })).toBeVisible()

    const nextWord = screen.getByRole('button', { name: 'Next word' })
    nextWord.focus()
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
    correctAnswer.focus()
    await user.keyboard('[Space]')
    await user.tab()
    await user.keyboard('[Enter]')
    expect(screen.getByRole('status')).toHaveTextContent('Correct')

    cleanup()
    render(<FlashcardDeck items={[course.vocabulary[0]]} />)
    const flashcard = screen.getByRole('button', { name: 'Show meaning' })
    flashcard.focus()
    await user.keyboard('[Space]')
    expect(screen.getByRole('button', { name: 'Show Korean' })).toHaveTextContent(course.vocabulary[0].english)

    cleanup()
    render(<DialoguePage />)
    const dialogueChoices = screen.getByRole('group', { name: 'Choose a dialogue' })
    const secondDialogue = within(dialogueChoices).getAllByRole('button')[1]
    secondDialogue.focus()
    await user.keyboard('[Enter]')
    expect(secondDialogue).toHaveAttribute('aria-pressed', 'true')
    expect(secondDialogue).toHaveTextContent('Selected dialogue')
  })
})
