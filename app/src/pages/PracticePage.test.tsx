import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { PracticePage } from './PracticePage'

afterEach(cleanup)

const correctAnswers = [
  '민수예요',
  '학생이에요',
  '제니예요',
  '저는 학생이에요',
  '선생님은 한국 사람이에요',
  '제니는 가수예요',
  '미국 사람이 아니에요',
  '가수가 아니에요',
  '회사원이 아니에요',
] as const

describe('PracticePage', () => {
  it('offers the Unit 2 and Unit 3 flashcards and the grammar challenge', async () => {
    const user = userEvent.setup()
    render(<PracticePage />)

    expect(screen.getByRole('heading', { name: 'Final practice' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Vocabulary Flashcards' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Grammar Challenge' })).toBeVisible()
    expect(screen.getByText('Card 1 of 16')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Grammar Challenge' }))

    expect(screen.getByRole('heading', { name: 'Grammar Challenge' })).toBeVisible()
    expect(screen.getByText('Question 1 of 9')).toBeVisible()
    expect(screen.queryByText('Question 2 of 9')).not.toBeInTheDocument()
  })

  it('prevents an empty answer and gives beginner-first bilingual feedback', async () => {
    const user = userEvent.setup()
    render(<PracticePage />)
    await user.click(screen.getByRole('button', { name: 'Grammar Challenge' }))

    expect(screen.getByRole('button', { name: 'Check answer' })).toBeDisabled()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: '민수이에요' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))

    const feedback = screen.getByRole('status')
    expect(feedback).toHaveTextContent('아직 아니에요. Not quite.')
    expect(feedback).toHaveTextContent('Correct answer: 민수예요')
    expect(feedback).toHaveTextContent('민수 ends in a vowel, so use 예요.')
  })

  it('scores all nine exercises, reviews incorrect answers, and starts a fresh retry', async () => {
    const user = userEvent.setup()
    render(<PracticePage />)
    await user.click(screen.getByRole('button', { name: 'Grammar Challenge' }))

    await user.click(screen.getByRole('radio', { name: '민수이에요' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    await user.click(screen.getByRole('button', { name: 'Next question' }))

    for (const [index, answer] of correctAnswers.slice(1).entries()) {
      await user.click(screen.getByRole('radio', { name: answer }))
      await user.click(screen.getByRole('button', { name: 'Check answer' }))
      if (index < 7) await user.click(screen.getByRole('button', { name: 'Next question' }))
    }

    expect(screen.getByRole('status')).toHaveTextContent('맞았어요! Correct!')
    await user.click(screen.getByRole('button', { name: 'See results' }))
    expect(screen.getByRole('heading', { name: 'Challenge complete' })).toBeVisible()
    expect(screen.getByText('Score: 8 / 9')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Review incorrect answers' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Review incorrect answers' }))
    expect(screen.getByRole('heading', { name: 'Review incorrect answers' })).toBeVisible()
    const incorrectReview = screen.getByText('민수___').closest('article')
    expect(incorrectReview).toHaveTextContent('Your answer: 민수이에요')
    expect(incorrectReview).toHaveTextContent('Correct answer: 민수예요')

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(screen.getByText('Question 1 of 9')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Check answer' })).toBeDisabled()
  })
})
