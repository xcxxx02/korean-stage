import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import { FullQuiz } from './FullQuiz'
import { practiceGroups } from '../content/practiceCatalog'

afterEach(cleanup)

it('shows all questions and reveals results only after a complete submission', async () => {
  const user = userEvent.setup()
  const exercises = practiceGroups[0].exercises.slice(0, 2)
  render(<FullQuiz exercises={exercises} />)
  expect(screen.getByText('Question 2 of 2')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Submit Quiz' })).toBeDisabled()
  for (const [index, exercise] of exercises.entries()) {
    if (exercise.type === 'matching') throw new Error('Expected vocabulary choices')
    const group = screen.getByRole('group', { name: `Question ${index + 1} of 2` })
    await user.click(within(group).getByRole('radio', { name: exercise.answer }))
  }
  expect(screen.queryByText('Correct')).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Submit Quiz' }))
  expect(screen.getByText('Score: 2 of 2 correct')).toBeVisible()
  expect(screen.getAllByText('Correct')).toHaveLength(2)
  await user.click(screen.getByRole('button', { name: 'Try Quiz again' }))
  expect(screen.queryByText('Correct')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Submit Quiz' })).toBeDisabled()
})
