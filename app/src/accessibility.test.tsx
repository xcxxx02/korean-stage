import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { MemoryRouter, useRoutes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { FlashcardDeck } from './components/FlashcardDeck'
import { HumanAudioButton } from './components/HumanAudioButton'
import { course } from './content/course'
import { appRouteManifest, type AppRouteId, type RouteManifestEntry } from './navigation'
import { DialoguePage } from './pages/DialoguePage'
import { createAppRouteObjects } from './routeObjects'

const expectedPrimaryHeadings: Record<AppRouteId, string> = {
  home: 'Korean Stage',
  learn: 'Hello & Self-introduction',
  unit: 'Unit 2 · Countries & Nationalities',
  vocabulary: 'Vocabulary review',
  grammar: 'Grammar',
  practice: 'Final practice',
  dialogue: 'Dialogue & role play',
  team: 'Team & submission readiness',
  'not-found': 'Page not found',
}

const routeEntries: readonly RouteManifestEntry[] = appRouteManifest

const primaryRoutes = routeEntries.flatMap((route): Array<readonly [string, string, string]> => {
  const routeId = route.id as AppRouteId
  if (route.index === true) return [['Home', '/', expectedPrimaryHeadings[routeId]]]
  if (route.primaryNavigationLabel) return [[route.primaryNavigationLabel, `/${route.path}`, expectedPrimaryHeadings[routeId]]]
  return []
})

const routes = [
  ...primaryRoutes,
  ['Unit 2', '/learn/unit-2', 'Unit 2 · Countries & Nationalities'],
  ['Unit 3', '/learn/unit-3', 'Unit 3 · Jobs & Occupations'],
  ['Unit 4', '/learn/unit-4', '이에요 / 예요 - to be'],
  ['Unit 7', '/learn/unit-7', 'Unit 7 · Dialogue & role play'],
  ['Fallback', '/missing', 'Page not found'],
] as const

function ProductionRoutes({ manifest = appRouteManifest }: { manifest?: readonly RouteManifestEntry[] }) {
  return useRoutes(createAppRouteObjects(manifest))
}

function renderRoute(path: string, manifest: readonly RouteManifestEntry[] = appRouteManifest) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ProductionRoutes {...{ manifest }} />
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
  it.each(routes)('%s has its expected page heading, a single named content landmark, and no automated axe violations', async (_name, path, expectedHeading) => {
    const { container } = renderRoute(path)

    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: expectedHeading })).toBeInTheDocument()
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

  it('renders a manifest route at its mutated path instead of silently accepting the wildcard page', () => {
    const movedTeamManifest: readonly RouteManifestEntry[] = appRouteManifest.map((route) =>
      route.id === 'team' ? { ...route, path: 'people' } : route,
    )

    renderRoute('/people', movedTeamManifest)

    expect(screen.getByRole('heading', { level: 1, name: expectedPrimaryHeadings.team })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: expectedPrimaryHeadings['not-found'] })).not.toBeInTheDocument()
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
