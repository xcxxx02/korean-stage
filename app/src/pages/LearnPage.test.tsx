import { cleanup, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { renderApp } from '../test/renderApp'

describe('Canonical learning routes', () => {
  afterEach(cleanup)

  it('shows vocabulary content immediately without progress language', () => {
    renderApp(['/vocabulary/countries'])

    expect(screen.getByRole('heading', { name: 'Countries & Nationalities' })).toBeVisible()
    expect(screen.getAllByText('태국')[0]).toHaveAttribute('lang', 'ko')
    expect(screen.queryByText(/ready to continue|mark.*complete|continue learning/i)).not.toBeInTheDocument()
  })

  it('dispatches matching vocabulary content from a canonical detail route', () => {
    renderApp(['/vocabulary/occupations'])

    expect(screen.getByRole('heading', { name: 'Jobs & Occupations' })).toBeVisible()
    expect(screen.getAllByText('학생')[0]).toBeVisible()
    expect(screen.getAllByText('Student')[0]).toBeVisible()
  })

  it('dispatches a focused guide from a canonical grammar route', () => {
    renderApp(['/grammar/identity'])

    expect(screen.getByRole('heading', { name: 'Talking about who someone is' })).toBeVisible()
    expect(screen.getByRole('heading', { name: '이에요 / 예요 + 은 / 는 · talking about identity', level: 2 })).toBeVisible()
    expect(screen.getByText((_, element) => element?.tagName === 'LI' && element.textContent === 'Consonant-ending topic + 은; vowel-ending topic + 는')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Practise this lesson' })).toHaveAttribute('href', '/practice/grammar-1')
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
