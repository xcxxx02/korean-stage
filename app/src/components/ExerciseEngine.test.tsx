import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { course } from '../content/course'
import { ExerciseEngine } from './ExerciseEngine'

afterEach(cleanup)

const ieyoExercises = course.grammar.find((grammarPoint) => grammarPoint.id === 'ieyo-yeyo')!.exercises

describe('ExerciseEngine', () => {
  it('explains a wrong answer in English, preserves it during feedback, and supports a successful retry', async () => {
    const user = userEvent.setup()
    const onResult = vi.fn()
    render(<ExerciseEngine exercises={ieyoExercises} onResult={onResult} />)

    const firstExercise = screen.getByRole('group', { name: /1 of 3.*Complete the sentence for Minsu/i })
    const wrongAnswer = within(firstExercise).getByRole('radio', { name: '민수이에요' })
    await user.click(wrongAnswer)
    await user.click(within(firstExercise).getByRole('button', { name: 'Check answer 1' }))

    const feedback = within(firstExercise).getByRole('status')
    expect(feedback).toHaveTextContent('Not quite')
    expect(feedback).toHaveTextContent('Correct answer: 민수예요')
    expect(feedback).toHaveTextContent('민수 ends in a vowel, so use 예요.')
    expect(wrongAnswer).toBeChecked()
    expect(within(firstExercise).getByRole('button', { name: 'Try again' })).toBeVisible()
    expect(screen.getByText('Score: 0 of 3 correct')).toBeVisible()
    expect(onResult).toHaveBeenLastCalledWith('ieyo-yeyo-1', false)

    await user.click(within(firstExercise).getByRole('button', { name: 'Try again' }))
    await user.click(within(firstExercise).getByRole('radio', { name: '민수예요' }))
    await user.click(within(firstExercise).getByRole('button', { name: 'Check answer 1' }))

    expect(within(firstExercise).getByRole('status')).toHaveTextContent('Correct')
    expect(screen.getByText('Score: 1 of 3 correct')).toBeVisible()
    expect(onResult).toHaveBeenLastCalledWith('ieyo-yeyo-1', true)
  })

  it('allows keyboard answer selection and submission', async () => {
    const user = userEvent.setup()
    const onResult = vi.fn()
    render(<ExerciseEngine exercises={[ieyoExercises[0]]} onResult={onResult} />)

    await user.tab()
    expect(screen.getByRole('radio', { name: '민수예요' })).toHaveFocus()
    await user.keyboard('[Space]')
    expect(screen.getByRole('radio', { name: '민수예요' })).toBeChecked()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Check answer 1' })).toHaveFocus()
    await user.keyboard('[Enter]')

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByRole('status')).toHaveTextContent('Correct')
    expect(onResult).toHaveBeenCalledWith('ieyo-yeyo-1', true)
  })
})
