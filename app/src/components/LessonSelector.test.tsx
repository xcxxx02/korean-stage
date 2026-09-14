import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { renderApp } from '../test/renderApp'

describe('Canonical lesson selection', () => {
  afterEach(cleanup)

  it('offers the two vocabulary units from the Vocabulary chooser', () => {
    renderApp(['/vocabulary'])

    expect(screen.getByRole('link', { name: /Open Unit 1: Countries & Nationalities/ })).toHaveAttribute('href', '/vocabulary/countries')
    expect(screen.getByRole('link', { name: /Open Unit 2: Jobs & Occupations/ })).toHaveAttribute('href', '/vocabulary/occupations')
  })

  it('offers the two grammar topics from the Grammar chooser', () => {
    renderApp(['/grammar'])

    expect(screen.getByRole('link', { name: /Open grammar topic 1: Talking about who someone is/ })).toHaveAttribute('href', '/grammar/identity')
    expect(screen.getByRole('link', { name: /Open grammar topic 2: Saying what someone is not/ })).toHaveAttribute('href', '/grammar/negative-identity')
  })

  it('opens a selected vocabulary unit on its canonical route', async () => {
    const user = userEvent.setup()
    renderApp(['/vocabulary'])

    await user.click(screen.getByRole('link', { name: /Open Unit 2: Jobs & Occupations/ }))

    expect(screen.getByRole('heading', { level: 1, name: 'Jobs & Occupations' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Vocabulary' })).toHaveAttribute('aria-current', 'page')
  })

  it('opens a selected grammar topic on its canonical route', async () => {
    const user = userEvent.setup()
    renderApp(['/grammar'])

    await user.click(screen.getByRole('link', { name: /Open grammar topic 1: Talking about who someone is/ }))

    expect(screen.getByRole('heading', { level: 1, name: 'Talking about who someone is' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Grammar' })).toHaveAttribute('aria-current', 'page')
  })
})
