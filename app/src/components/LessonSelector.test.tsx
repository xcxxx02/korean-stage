import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { renderApp } from '../test/renderApp'

describe('Canonical lesson selection', () => {
  afterEach(cleanup)

  it('offers the three vocabulary units from the Vocabulary chooser', () => {
    renderApp(['/vocabulary'])

    expect(screen.getByRole('link', { name: /Open Unit 1: Essential greetings/ })).toHaveAttribute('href', '/vocabulary/lesson-1')
    expect(screen.getByRole('link', { name: /Open Unit 2: Countries & Nationalities/ })).toHaveAttribute('href', '/vocabulary/lesson-2')
    expect(screen.getByRole('link', { name: /Open Unit 3: Jobs & Occupations/ })).toHaveAttribute('href', '/vocabulary/lesson-3')
  })

  it('offers the three grammar topics from the Grammar chooser', () => {
    renderApp(['/grammar'])

    expect(screen.getByRole('link', { name: /Open grammar topic 1:.*to be/ })).toHaveAttribute('href', '/grammar/lesson-4')
    expect(screen.getByRole('link', { name: /Open grammar topic 2:.*topic marker/ })).toHaveAttribute('href', '/grammar/lesson-5')
    expect(screen.getByRole('link', { name: /Open grammar topic 3:.*to not be/ })).toHaveAttribute('href', '/grammar/lesson-6')
  })

  it('opens a selected vocabulary unit on its canonical route', async () => {
    const user = userEvent.setup()
    renderApp(['/vocabulary'])

    await user.click(screen.getByRole('link', { name: /Open Unit 3: Jobs & Occupations/ }))

    expect(screen.getByRole('heading', { level: 1, name: 'Jobs & Occupations' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Vocabulary' })).toHaveAttribute('aria-current', 'page')
  })

  it('opens a selected grammar topic on its canonical route', async () => {
    const user = userEvent.setup()
    renderApp(['/grammar'])

    await user.click(screen.getByRole('link', { name: /Open grammar topic 2:.*topic marker/ }))

    expect(screen.getByRole('heading', { level: 1, name: '은 / 는 - topic marker' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Grammar' })).toHaveAttribute('aria-current', 'page')
  })
})
