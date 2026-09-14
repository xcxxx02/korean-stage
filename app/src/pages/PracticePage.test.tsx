import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { PracticePage } from './PracticePage'

beforeEach(() => localStorage.clear())
afterEach(cleanup)

function renderPractice(entry = '/practice') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="practice" element={<PracticePage />} />
        <Route path="practice/:lessonSlug" element={<PracticePage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PracticePage', () => {
  it('offers four topic practices and one 27-question final quiz', () => {
    renderPractice()

    expect(screen.getByRole('heading', { name: 'Practice & Quiz' })).toBeVisible()
    expect(screen.getAllByRole('link', { name: /Unit [12]/ })).toHaveLength(4)
    expect(screen.getByRole('link', { name: 'Quiz · 27 questions' })).toHaveAttribute('href', '/practice/quiz')
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })

  it('shows a whole nine-question vocabulary practice on one page', () => {
    renderPractice('/practice/vocabulary-1')

    expect(screen.getByRole('heading', { name: 'Vocabulary Unit 1 · Countries & Nationalities' })).toBeVisible()
    expect(screen.getByText('Question 1 of 9')).toBeVisible()
    expect(screen.getByText('Question 9 of 9')).toBeVisible()
    expect(screen.getAllByRole('group', { name: /Question \d of 9/ })).toHaveLength(9)
    expect(screen.getByRole('button', { name: 'Submit answers' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: /Next question/ })).not.toBeInTheDocument()
  })

  it('shows all questions before revealing final quiz results', () => {
    renderPractice('/practice/quiz')

    expect(screen.getByRole('heading', { name: 'Quiz' })).toBeVisible()
    expect(screen.getByText('Question 1 of 27')).toBeVisible()
    expect(screen.getByText('Question 27 of 27')).toBeVisible()
    expect(screen.queryByText(/Correct answer:/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit answers' })).toBeDisabled()
  })

  it('redirects old occupation practice links to the new Unit 2 route', () => {
    renderPractice('/practice/lesson-3')

    expect(screen.getByRole('heading', { name: 'Vocabulary Unit 2 · Jobs & Occupations' })).toBeVisible()
    expect(screen.getByText('Question 9 of 9')).toBeVisible()
  })
})
