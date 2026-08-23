import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { renderApp } from '../test/renderApp'

describe('LessonSelector', () => {
  afterEach(cleanup)

  it('opens all seven lessons from one compact selector', async () => {
    const user = userEvent.setup()
    renderApp(['/learn/lesson-3'])

    await user.click(screen.getByRole('button', { name: 'All lessons' }))

    expect(screen.getAllByRole('link', { name: /Lesson [1-7] of 7/ })).toHaveLength(7)
    expect(screen.getByRole('link', { name: /Lesson 4 of 7.*to be/ })).toHaveAttribute('href', '/learn/lesson-4')
    expect(screen.getByRole('link', { name: /Lesson 3 of 7.*Jobs & Occupations/ })).toHaveAttribute('aria-current', 'page')
  })

  it('closes the lesson list with Escape', async () => {
    const user = userEvent.setup()
    renderApp(['/learn/lesson-1'])

    await user.click(screen.getByRole('button', { name: 'All lessons' }))
    expect(screen.getByRole('list', { name: 'Choose a lesson' })).toBeVisible()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('list', { name: 'Choose a lesson' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All lessons' })).toHaveAttribute('aria-expanded', 'false')
  })
})
