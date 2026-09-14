import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from './test/renderApp'

afterEach(cleanup)

describe('App', () => {
  it('welcomes first-time learners at the root and guides them to vocabulary', async () => {
    const user = userEvent.setup()
    renderApp(['/'])

    expect(await screen.findByRole('heading', { name: 'Welcome to Korean Stage' })).toBeVisible()
    expect(screen.getByText('안녕하세요!', { exact: true })).toBeVisible()
    expect(screen.queryByText(/Start learning|Continue learning/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Explore vocabulary' }))
    expect(await screen.findByRole('heading', { name: 'Choose a vocabulary unit' })).toBeVisible()
  })

  it.each([
    ['/vocabulary', 'Choose a vocabulary unit'],
    ['/vocabulary/countries', 'Countries & Nationalities'],
    ['/vocabulary/occupations', 'Jobs & Occupations'],
    ['/grammar', 'Choose a grammar topic'],
    ['/grammar/identity', 'Talking about who someone is'],
    ['/grammar/negative-identity', 'Saying what someone is not'],
  ])('renders canonical route %s', async (path, heading) => {
    renderApp([path])

    expect(await screen.findByRole('heading', { name: heading })).toBeVisible()
  })

  it.each([
    ['/learn', 'Choose a vocabulary unit'],
    ['/learn/lesson-1', 'Choose a vocabulary unit'],
    ['/learn/lesson-2', 'Countries & Nationalities'],
    ['/learn/lesson-3', 'Jobs & Occupations'],
    ['/learn/lesson-4', 'Talking about who someone is'],
    ['/learn/lesson-5', 'Talking about who someone is'],
    ['/learn/lesson-6', 'Saying what someone is not'],
    ['/learn/lesson-7', 'Dialogue & role play'],
  ])('redirects legacy route %s to its canonical destination', async (path, heading) => {
    renderApp([path])

    expect(await screen.findByRole('heading', { name: heading })).toBeVisible()
  })

  it('does not read or write browser storage during the main learner journey', async () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem')
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const user = userEvent.setup()

    renderApp(['/vocabulary/occupations'])
    await user.click(screen.getByRole('button', { name: 'Next word' }))
    await user.click(screen.getByRole('link', { name: 'Practice' }))

    // React Router reads its own transition key while navigating. Any other
    // browser-storage read would be an application persistence regression.
    expect(getItem.mock.calls.filter(([key]) => key !== 'remix-router-transitions')).toEqual([])
    expect(setItem).not.toHaveBeenCalled()
  })
})
