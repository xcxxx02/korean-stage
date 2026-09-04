import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from './test/renderApp'

afterEach(cleanup)

describe('App', () => {
  it('redirects the root to the vocabulary chooser', async () => {
    renderApp(['/'])

    expect(await screen.findByRole('heading', { name: 'Choose a vocabulary unit' })).toBeVisible()
    expect(screen.queryByText(/Start learning|Continue learning/i)).not.toBeInTheDocument()
  })

  it.each([
    ['/vocabulary', 'Choose a vocabulary unit'],
    ['/vocabulary/lesson-2', 'Countries & Nationalities'],
    ['/grammar', 'Choose a grammar topic'],
    ['/grammar/lesson-5', '은 / 는 - topic marker'],
  ])('renders canonical route %s', async (path, heading) => {
    renderApp([path])

    expect(await screen.findByRole('heading', { name: heading })).toBeVisible()
  })

  it.each([
    ['/learn', 'Choose a vocabulary unit'],
    ['/learn/lesson-1', 'Essential greetings'],
    ['/learn/lesson-2', 'Countries & Nationalities'],
    ['/learn/lesson-3', 'Jobs & Occupations'],
    ['/learn/lesson-4', '이에요 / 예요 - to be'],
    ['/learn/lesson-5', '은 / 는 - topic marker'],
    ['/learn/lesson-6', '이 / 가 아니에요 - to not be'],
    ['/learn/lesson-7', 'Dialogue & role play'],
  ])('redirects legacy route %s to its canonical destination', async (path, heading) => {
    renderApp([path])

    expect(await screen.findByRole('heading', { name: heading })).toBeVisible()
  })

  it('does not read or write browser storage during the main learner journey', async () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem')
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const user = userEvent.setup()

    renderApp(['/vocabulary/lesson-3'])
    await user.click(screen.getByRole('button', { name: 'Next word' }))
    await user.click(screen.getByRole('link', { name: 'Practice' }))

    // React Router reads its own transition key while navigating. Any other
    // browser-storage read would be an application persistence regression.
    expect(getItem.mock.calls.filter(([key]) => key !== 'remix-router-transitions')).toEqual([])
    expect(setItem).not.toHaveBeenCalled()
  })
})
