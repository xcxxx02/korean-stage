import { cleanup, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { renderApp } from '../test/renderApp'

describe('Canonical learning routes', () => {
  afterEach(cleanup)

  it('shows vocabulary content immediately without progress language', () => {
    renderApp(['/vocabulary/lesson-1'])

    expect(screen.getByRole('heading', { name: 'Essential greetings' })).toBeVisible()
    expect(screen.getAllByText('안녕하세요?')[0]).toHaveAttribute('lang', 'ko')
    expect(screen.queryByText(/ready to continue|mark.*complete|continue learning/i)).not.toBeInTheDocument()
  })

  it('dispatches matching vocabulary content from a canonical detail route', () => {
    renderApp(['/vocabulary/lesson-2'])

    expect(screen.getByRole('heading', { name: 'Countries & Nationalities' })).toBeVisible()
    expect(screen.getAllByText('중국')[0]).toBeVisible()
    expect(screen.getAllByText('China')[0]).toBeVisible()
  })

  it('dispatches a focused guide from a canonical grammar route', () => {
    renderApp(['/grammar/lesson-4'])

    expect(screen.getByRole('heading', { name: '이에요 / 예요 · to be', level: 2 })).toBeVisible()
    expect(screen.getByText('이에요 / 예요')).toHaveAttribute('lang', 'ko')
    expect(screen.getByText('to be')).toHaveAttribute('lang', 'en')
    expect(screen.getByText((_, element) => element?.tagName === 'LI' && element.textContent === 'Consonant-ending noun + 이에요')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Practise this lesson' })).toHaveAttribute('href', '/practice/lesson-4')
    expect(screen.queryByText('Complete the sentence for Minsu.')).not.toBeInTheDocument()
  })

  it('renders the standalone dialogue destination', () => {
    renderApp(['/dialogue'])

    expect(screen.getByRole('heading', { name: 'Dialogue & role play' })).toBeVisible()
    expect(screen.getByText('안녕하세요.')).toHaveAttribute('lang', 'ko')
    expect(screen.getByText('Hello. What is your name?')).toHaveAttribute('lang', 'en')
  })

  it.each([
    ['/vocabulary/lesson-99', 'Vocabulary unit not found', 'Choose a vocabulary unit', '/vocabulary'],
    ['/grammar/lesson-99', 'Grammar topic not found', 'Choose a grammar topic', '/grammar'],
  ])('shows a friendly recovery state for %s', (path, heading, linkName, href) => {
    renderApp([path])

    expect(screen.getByRole('heading', { name: heading })).toBeVisible()
    expect(screen.getByRole('link', { name: linkName })).toHaveAttribute('href', href)
  })
})
