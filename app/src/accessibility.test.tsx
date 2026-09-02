import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { MemoryRouter, useRoutes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { appRouteManifest, type AppRouteId, type RouteManifestEntry } from './navigation'
import { DialoguePage } from './pages/DialoguePage'
import { ExerciseEngine } from './components/ExerciseEngine'
import { course } from './content/course'
import { createAppRouteObjects } from './routeObjects'

const expectedPrimaryHeadings: Record<AppRouteId, string> = {
  home: 'Hello & Self-introduction',
  learn: 'Hello & Self-introduction',
  lesson: 'Hello & Self-introduction',
  practice: 'Practice by lesson',
  practiceLesson: 'Practice by lesson',
  dialogue: 'Dialogue & role play',
  team: 'Meet the team',
  vocabularyLegacy: 'Countries & Nationalities',
  grammarLegacy: '이에요 / 예요 - to be',
  'not-found': 'Page not found',
}

const routeEntries: readonly RouteManifestEntry[] = appRouteManifest

const primaryRoutes = routeEntries.flatMap((route): Array<readonly [string, string, string]> => {
  const routeId = route.id as AppRouteId
  if (route.index === true) return [['Home', '/', expectedPrimaryHeadings[routeId]]]
  if (route.primaryNavigationLabel) return [[route.primaryNavigationLabel, route.primaryNavigationTo ?? `/${route.path}`, expectedPrimaryHeadings[routeId]]]
  return []
})

const routes = [
  ...primaryRoutes,
  ['Lesson 2', '/learn/lesson-2', 'Countries & Nationalities'],
  ['Lesson 3', '/learn/lesson-3', 'Jobs & Occupations'],
  ['Lesson 4', '/learn/lesson-4', '이에요 / 예요 - to be'],
  ['Lesson 7', '/learn/lesson-7', 'Dialogue & Role Play'],
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
  const assertLanguageBoundaries = (container: HTMLElement) => {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
    const untaggedKorean: string[] = []

    while (walker.nextNode()) {
      const textNode = walker.currentNode
      const text = textNode.textContent?.trim() ?? ''
      const parent = textNode.parentElement
      if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text) && !parent?.closest('[lang="ko"]')) untaggedKorean.push(text)
    }

    const wronglyScopedEnglish = [...container.querySelectorAll('[lang="ko"]')]
      .map((node) => node.textContent?.trim() ?? '')
      .filter((text) => /[A-Za-z]/.test(text))
    expect(untaggedKorean).toEqual([])
    expect(wronglyScopedEnglish).toEqual([])
  }

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

  it('does not add a separate audio control to the member-video vocabulary flow', () => {
    renderRoute('/learn/lesson-3')

    expect(screen.queryByRole('button', { name: /Listen to Member/i })).not.toBeInTheDocument()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('marks every rendered Korean text run in Learn with the Korean language', () => {
    const { container } = renderRoute('/learn/lesson-3')
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
    const untaggedKorean: string[] = []

    while (walker.nextNode()) {
      const textNode = walker.currentNode
      const text = textNode.textContent?.trim() ?? ''
      const parent = textNode.parentElement
      if (/[가-힯]/.test(text) && !parent?.closest('[lang="ko"]')) untaggedKorean.push(text)
    }

    expect(untaggedKorean).toEqual([])
    for (const node of container.querySelectorAll('[data-korean-content]')) {
      expect(node).toHaveAttribute('lang', 'ko')
    }
  })

  it.each(Array.from({ length: 7 }, (_, index) => `lesson-${index + 1}`))(
    'keeps every Hangul run and English run correctly scoped throughout Learn %s',
    async (lessonSlug) => {
      const user = userEvent.setup()
      const { container } = renderRoute(`/learn/${lessonSlug}`)
      await user.click(screen.getByRole('button', { name: 'All lessons' }))

      assertLanguageBoundaries(container)
      cleanup()
    },
  )

  it('uses segmented language-labelled matching controls instead of flattened mixed aria-labels', () => {
    const matching = course.grammar[0].exercises.find((exercise) => exercise.type === 'matching')!
    const { container } = render(<ExerciseEngine exercises={[matching]} />)

    assertLanguageBoundaries(container)
    for (const select of screen.getAllByRole('combobox') as HTMLSelectElement[]) {
      expect(select).not.toHaveAttribute('aria-label')
      expect(select).toHaveAttribute('aria-labelledby')
      for (const option of [...select.options]) {
        expect(option).toHaveAttribute('lang', 'en')
      }
    }

    expect(screen.getByRole('combobox', { name: /Match.*학생.*to its English meaning/ })).toBeInTheDocument()
  })

  it('does not scope English copy as Korean or flatten bilingual control names into aria-labels', async () => {
    const user = userEvent.setup()
    const { container } = renderRoute('/learn/lesson-3')
    await user.click(screen.getByRole('button', { name: /Choose vocabulary word.*학생.*Student/ }))

    const wronglyScopedEnglish = [...container.querySelectorAll('[lang="ko"]')]
      .map((node) => node.textContent?.trim() ?? '')
      .filter((text) => /[A-Za-z]/.test(text))
    const mixedLanguageAriaLabels = [...container.querySelectorAll('[aria-label]')]
      .map((node) => node.getAttribute('aria-label') ?? '')
      .filter((label) => /[가-힯]/.test(label) && /[A-Za-z]/.test(label))

    expect(wronglyScopedEnglish).toEqual([])
    expect(mixedLanguageAriaLabels).toEqual([])

    const results = await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    })
    expect(results.violations).toEqual([])
  })
})

describe('keyboard-complete primary flows', () => {
  it('keeps the skip link as the first keyboard stop on initial load', async () => {
    const user = userEvent.setup()
    renderRoute('/learn/lesson-1')

    expect(document.body).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveFocus()
  })

  it('opens the menu and freely selects a later vocabulary word without pointer clicks', async () => {
    const user = userEvent.setup()
    renderRoute('/learn/lesson-3')

    const menu = screen.getByRole('button', { name: 'Menu' })
    await tabTo(user, menu)
    await user.keyboard('[Enter]')
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    expect(within(document.getElementById('primary-navigation-list')!).getByRole('link', { name: 'Practice' })).toBeVisible()
    await user.keyboard('[Escape]')

    const chef = screen.getByRole('button', { name: /요리사.*Chef/ })
    await tabTo(user, chef)
    await user.keyboard('[Enter]')
    expect(screen.getByRole('heading', { name: '요리사' })).toHaveAttribute('lang', 'ko')
    expect(localStorage.length).toBe(0)
  })

  it('selects a dialogue with the keyboard', async () => {
    const user = userEvent.setup()

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
