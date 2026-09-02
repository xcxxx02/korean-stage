import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { course } from '../content/course'
import { ExerciseEngine } from './ExerciseEngine'

afterEach(cleanup)

const ieyoExercises = course.grammar.find((grammarPoint) => grammarPoint.id === 'ieyo-yeyo')!.exercises

const matchingExercise = ieyoExercises[2]

describe('ExerciseEngine', () => {
  it('locks a submitted wrong answer, then clears it and restores focus for retry', async () => {
    const user = userEvent.setup()
    const onResult = vi.fn()
    render(<ExerciseEngine exercises={ieyoExercises} onResult={onResult} />)

    const firstExercise = screen.getByRole('group', { name: /1 of 3.*Complete the sentence for Minsu/i })
    const wrongAnswer = within(firstExercise).getByRole('radio', { name: '민수이에요' })
    expect(within(firstExercise).getByText('민수이에요')).toHaveAttribute('lang', 'ko')
    await user.click(wrongAnswer)
    await user.click(within(firstExercise).getByRole('button', { name: 'Check answer 1' }))

    const feedback = within(firstExercise).getByRole('status')
    expect(feedback).toHaveTextContent('Not quite')
    expect(feedback).toHaveTextContent('Correct answer: 민수예요')
    expect(feedback).toHaveTextContent('민수 ends in a vowel, so use 예요.')
    expect(within(feedback).getByText('민수예요')).toHaveAttribute('lang', 'ko')
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

  it('runs one quiz question at a time and moves focus through feedback and navigation', async () => {
    const user = userEvent.setup()
    render(<ExerciseEngine exercises={ieyoExercises} mode="quiz" title="Lesson 4 quiz" />)

    expect(screen.getByRole('heading', { name: 'Lesson 4 quiz' })).toBeVisible()
    expect(screen.getAllByRole('group', { name: /Question \d of 3/ })).toHaveLength(1)
    expect(screen.getByText('Question 1 of 3')).toBeVisible()
    await waitFor(() => expect(screen.getByText('Question 1 of 3').closest('legend')).toHaveFocus())

    await user.click(screen.getByRole('radio', { name: '민수이에요' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveFocus())
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Next question' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(screen.getByRole('radio', { name: '민수예요' })).toHaveFocus())
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: '민수예요' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    await user.click(screen.getByRole('button', { name: 'Next question' }))

    await waitFor(() => expect(screen.getByText('Question 2 of 3').closest('legend')).toHaveFocus())
    expect(screen.getAllByRole('group', { name: /Question \d of 3/ })).toHaveLength(1)
  })

  it('uses accessible matching controls with complete-answer gating, feedback, retry, and scoring', async () => {
    const user = userEvent.setup()
    const onResult = vi.fn()
    render(<ExerciseEngine exercises={[matchingExercise]} onResult={onResult} />)

    const exercise = screen.getByRole('group', { name: /1 of 1.*Match each Korean sentence to its English meaning/i })
    expect(within(exercise).queryByRole('radio')).not.toBeInTheDocument()
    const studentMatch = within(exercise).getByRole('combobox', { name: 'Match 저는 학생이에요. to its English meaning' })
    const singerMatch = within(exercise).getByRole('combobox', { name: 'Match 제니는 가수예요. to its English meaning' })
    const submit = within(exercise).getByRole('button', { name: 'Check answer 1' })
    expect(submit).toBeDisabled()

    await user.selectOptions(studentMatch, 'Jenny is a singer.')
    expect(submit).toBeDisabled()
    await user.selectOptions(singerMatch, 'I am a student.')
    await user.click(submit)

    const wrongFeedback = within(exercise).getByRole('status')
    expect(wrongFeedback).toHaveTextContent('Not quite')
    expect(wrongFeedback).toHaveTextContent('Correct matches: 저는 학생이에요. — I am a student.; 제니는 가수예요. — Jenny is a singer.')
    expect(wrongFeedback).toHaveTextContent('이에요 follows consonant-ending 학생, while 예요 follows vowel-ending 가수.')
    expect(studentMatch).toBeDisabled()
    expect(singerMatch).toBeDisabled()
    expect(onResult).toHaveBeenLastCalledWith('ieyo-yeyo-3', false)

    await user.click(within(exercise).getByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(studentMatch).toHaveFocus())
    expect(studentMatch).toHaveValue('')
    expect(singerMatch).toHaveValue('')

    await user.selectOptions(studentMatch, 'I am a student.')
    await user.selectOptions(singerMatch, 'Jenny is a singer.')
    await user.click(within(exercise).getByRole('button', { name: 'Check answer 1' }))

    expect(within(exercise).getByRole('status')).toHaveTextContent('Correct')
    expect(screen.getByText('Score: 1 of 1 correct')).toBeVisible()
    expect(onResult).toHaveBeenLastCalledWith('ieyo-yeyo-3', true)
  })

  it('hydrates a saved matching result as complete and locked', () => {
    render(<ExerciseEngine exercises={[matchingExercise]} initialResults={{ 'ieyo-yeyo-3': true }} />)

    expect(screen.getByText('Score: 1 of 1 correct')).toBeVisible()
    expect(screen.getByRole('combobox', { name: 'Match 저는 학생이에요. to its English meaning' })).toHaveValue('I am a student.')
    expect(screen.getByRole('combobox', { name: 'Match 제니는 가수예요. to its English meaning' })).toHaveValue('Jenny is a singer.')
    for (const select of screen.getAllByRole('combobox')) expect(select).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Answer 1 correct' })).toBeDisabled()
  })
})
