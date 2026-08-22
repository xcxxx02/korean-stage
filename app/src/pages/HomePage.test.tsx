import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { writeProgress } from '../progress/progressStore'
import { HomePage } from './HomePage'

const unitTitles = [
  'Hello & Self-introduction',
  'Countries & Nationalities',
  'Jobs & Occupations',
  '이에요 / 예요 - to be',
  '은 / 는 - topic marker',
  '이 / 가 아니에요 - to not be',
  'Dialogue & Role Play',
]

function renderHomePage() {
  return render(<MemoryRouter><HomePage /></MemoryRouter>)
}

describe('HomePage', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('offers all seven Lec 1 units to a new learner', () => {
    renderHomePage()

    expect(screen.getByRole('region', { name: 'Start with Lec 1' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Choose your learning path' })).toBeInTheDocument()
    const courseMap = screen.getByRole('navigation', { name: 'Course map' })
    expect(within(courseMap).getAllByRole('link')).toHaveLength(7)
    unitTitles.forEach((title, index) => {
      expect(within(courseMap).getByRole('link', { name: `Unit ${index + 1} ${title}` })).toBeInTheDocument()
    })
    expect(screen.getByRole('link', { name: 'Start learning' })).toHaveAttribute('href', '/learn/unit-1')
    expect(screen.getByText('All seven units are adapted entirely from Lec 1')).toBeInTheDocument()
    expect(screen.getByText('0 of 7 units complete')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start learning' })).toHaveClass('bg-stage-vermilion')
  })

  it('continues from the last saved location', () => {
    writeProgress({
      completedUnitIds: [],
      completedVocabularyIds: [],
      exerciseResults: {},
      lastPath: '/learn/unit-3',
    }, localStorage)

    renderHomePage()

    expect(screen.getByRole('link', { name: 'Continue learning' })).toHaveAttribute('href', '/learn/unit-3')
    expect(screen.getByText('0 of 7 units complete')).toBeInTheDocument()
  })
})
