import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { GrammarPage } from './GrammarPage'

afterEach(cleanup)

function renderGrammar(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="grammar" element={<GrammarPage />} />
        <Route path="grammar/:lessonSlug" element={<GrammarPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('GrammarPage', () => {
  it('shows exactly the two grammar units', () => {
    renderGrammar('/grammar')

    expect(screen.getByRole('heading', { name: 'Choose a grammar topic' })).toBeVisible()
    expect(screen.getAllByRole('link', { name: /Open grammar topic/ })).toHaveLength(2)
    expect(screen.getByText('Talking about who someone is')).toBeVisible()
    expect(screen.getByText('Saying what someone is not')).toBeVisible()
    expect(screen.queryByText('Jobs & Occupations')).not.toBeInTheDocument()
    expect(screen.queryByText('Dialogue & Role Play')).not.toBeInTheDocument()
  })

  it('shows the matching grammar guide for a grammar lesson route', () => {
    renderGrammar('/grammar/identity')

    expect(screen.getByRole('heading', { level: 1, name: 'Talking about who someone is' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Meaning' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Rule' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Examples' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Put it together' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Quick wrap-up' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Practise this lesson' })).toHaveAttribute('href', '/practice/grammar-1')
  })

  it('recovers when a grammar lesson route is not a grammar unit', () => {
    renderGrammar('/grammar/lesson-3')

    expect(screen.getByRole('heading', { name: 'Grammar topic not found' })).toBeVisible()
  })
})
