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
  it('shows only the three grammar units', () => {
    renderGrammar('/grammar')

    expect(screen.getByRole('heading', { name: 'Choose a grammar topic' })).toBeVisible()
    expect(screen.getByText('이에요 / 예요 - to be')).toBeVisible()
    expect(screen.queryByText('Jobs & Occupations')).not.toBeInTheDocument()
    expect(screen.queryByText('Dialogue & Role Play')).not.toBeInTheDocument()
  })

  it('shows the matching grammar guide for a grammar lesson route', () => {
    renderGrammar('/grammar/lesson-5')

    expect(screen.getByRole('heading', { level: 1, name: '은 / 는 - topic marker' })).toBeVisible()
    expect(screen.getByRole('heading', { name: '은 / 는 · topic marker' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Practise this lesson' })).toHaveAttribute('href', '/practice/lesson-5')
  })

  it('recovers when a grammar lesson route is not a grammar unit', () => {
    renderGrammar('/grammar/lesson-3')

    expect(screen.getByRole('heading', { name: 'Grammar topic not found' })).toBeVisible()
  })
})
