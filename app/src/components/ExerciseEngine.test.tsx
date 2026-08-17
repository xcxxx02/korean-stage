import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { course } from '../content/course'
import { ExerciseEngine } from './ExerciseEngine'

afterEach(cleanup)

const ieyoExercises = course.grammar.find((grammarPoint) => grammarPoint.id === 'ieyo-yeyo')!.exercises

describe('ExerciseEngine', () => {
  it('locks a submitted wrong answer, then clears it and restores focus for retry', async () => {
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
    for (const radio of within(firstExercise).getAllByRole('radio')) expect(radio).toBeDisabled()
    expect(within(firstExercise).getByRole('button', { name: 'Try again' })).toBeVisible()
    expect(screen.getByText('Score: 0 of 3 correct')).toBeVisible()
    expect(onResult).toHaveBeenLastCalledWith('ieyo-yeyo-1', false)

    await user.click(within(firstExercise).getByRole('radio', { name: '민수예요' }))
    expect(wrongAnswer).toBeChecked()
    expect(feedback).toHaveTextContent('Correct answer: 민수예요')

    await user.click(within(firstExercise).getByRole('button', { name: 'Try again' }))
    const correctAnswer = within(firstExercise).getByRole('radio', { name: '민수예요' })
    for (const radio of within(firstExercise).getAllByRole('radio')) expect(radio).toBeEnabled()
    expect(wrongAnswer).not.toBeChecked()
    expect(correctAnswer).not.toBeChecked()
    expect(within(firstExercise).queryByRole('status')).not.toBeInTheDocument()
    await waitFor(() => expect(correctAnswer).toHaveFocus())

    await user.click(correctAnswer)
    await user.click(within(firstExercise).getByRole('button', { name: 'Check answer 1' }))

    expect(within(firstExercise).getByRole('status')).toHaveTextContent('Correct')
    expect(screen.getByText('Score: 1 of 3 correct')).toBeVisible()
    expect(onResult).toHaveBeenLastCalledWith('ieyo-yeyo-1', true)
  })

  it('hydrates persistently correct answers into a locked score that cannot regress', async () => {
    const user = userEvent.setup()
    const onResult = vi.fn()
    render(<ExerciseEngine
      exercises={ieyoExercises}
      initialResults={{ 'ieyo-yeyo-1': true }}
      onResult={onResult}
    />)

    const completedExercise = screen.getByRole('group', { name: /1 of 3.*Complete the sentence for Minsu/i })
    expect(screen.getByText('Score: 1 of 3 correct')).toBeVisible()
    expect(within(completedExercise).getByRole('radio', { name: '민수예요' })).toBeChecked()
    for (const radio of within(completedExercise).getAllByRole('radio')) expect(radio).toBeDisabled()
    expect(within(completedExercise).getByRole('button', { name: 'Answer 1 correct' })).toBeDisabled()

    await user.click(within(completedExercise).getByRole('radio', { name: '민수이에요' }))
    expect(within(completedExercise).getByRole('radio', { name: '민수예요' })).toBeChecked()
    expect(onResult).not.toHaveBeenCalled()
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
