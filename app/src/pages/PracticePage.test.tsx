import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { PracticePage } from './PracticePage'

beforeEach(() => localStorage.clear())
afterEach(cleanup)

function renderPractice(entry = '/practice') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <PracticePage />
    </MemoryRouter>,
  )
}

describe('PracticePage', () => {
  it('starts with the five exact lesson quizzes followed by an explicit mixed quiz', () => {
    renderPractice()

    expect(screen.getByRole('heading', { name: 'Practice by lesson' })).toBeVisible()
    expect(screen.getByRole('button', { name: /Lesson 2.*Countries & Nationalities.*8 questions/ })).toBeVisible()
    expect(screen.getByRole('button', { name: /Lesson 3.*Jobs & Occupations.*8 questions/ })).toBeVisible()
    expect(screen.getByRole('button', { name: /Lesson 4.*이에요 \/ 예요 - to be.*3 questions/ })).toBeVisible()
    expect(screen.getByRole('button', { name: /Lesson 5.*은 \/ 는 - topic marker.*3 questions/ })).toBeVisible()
    expect(screen.getByRole('button', { name: /Lesson 6.*이 \/ 가 아니에요 - to not be.*3 questions/ })).toBeVisible()
    expect(screen.getByRole('button', { name: /Mixed Lec 1 quiz.*25 questions/ })).toBeVisible()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })

  it('opens a selected lesson quiz and explains an incorrect answer in English', async () => {
    const user = userEvent.setup()
    renderPractice()

    await user.click(screen.getByRole('button', { name: /Lesson 3.*Jobs & Occupations/ }))
    expect(screen.getByRole('heading', { name: 'Lesson 3 · Jobs & Occupations quiz' })).toBeVisible()
    expect(screen.getByText('Question 1 of 8')).toBeVisible()

    await user.click(screen.getByRole('radio', { name: 'Teacher' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))

    const feedback = screen.getByRole('status')
    expect(feedback).toHaveTextContent('Not quite')
    expect(feedback).toHaveTextContent('학생 means Student.')
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible()
    expect(localStorage.length).toBe(0)
  })

  it('opens the requested grammar lesson from the Learn guide query', () => {
    renderPractice('/practice?lesson=lesson-5')

    expect(screen.getByRole('heading', { name: 'Lesson 5 · 은 / 는 - topic marker quiz' })).toBeVisible()
    expect(screen.getByText('Question 1 of 3')).toBeVisible()
    expect(screen.getByText('Choose the correct topic-marked sentence.')).toBeVisible()
  })

  it('falls back to the lesson index for an unsupported lesson query', () => {
    renderPractice('/practice?lesson=lesson-7')

    expect(screen.getByRole('heading', { name: 'Practice by lesson' })).toBeVisible()
    expect(screen.queryByText('Question 1 of 3')).not.toBeInTheDocument()
  })

  it('keeps the mixed Lec 1 quiz optional and behind its own explicit card', async () => {
    const user = userEvent.setup()
    renderPractice()

    await user.click(screen.getByRole('button', { name: /Mixed Lec 1 quiz.*25 questions/ }))

    expect(screen.getByRole('heading', { name: 'Mixed Lec 1 quiz' })).toBeVisible()
    expect(screen.getByText('Question 1 of 25')).toBeVisible()
    expect(screen.getByRole('button', { name: 'All lesson quizzes' })).toBeVisible()
  })
})
