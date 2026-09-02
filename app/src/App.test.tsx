import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from './test/renderApp'

afterEach(cleanup)

describe('App', () => {
  it('redirects the root directly to the first lesson', async () => {
    renderApp(['/'])

    expect(await screen.findByRole('heading', { name: 'Hello & Self-introduction' })).toBeVisible()
    expect(screen.queryByText(/Start learning|Continue learning/i)).not.toBeInTheDocument()
  })

  it.each([
    ['/learn', 'Hello & Self-introduction'],
    ['/learn/lesson-2', 'Countries & Nationalities'],
    ['/vocabulary', 'Countries & Nationalities'],
    ['/grammar', '이에요 / 예요 - to be'],
  ])('redirects %s to its Learn lesson', async (path, heading) => {
    renderApp([path])

    expect(await screen.findByRole('heading', { name: heading })).toBeVisible()
  })

  it('does not read or write browser storage during the main learner journey', async () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem')
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const user = userEvent.setup()

    renderApp(['/learn/lesson-3'])
    await user.click(screen.getByRole('button', { name: 'Next word' }))
    await user.click(screen.getByRole('link', { name: 'Practice' }))

    // React Router reads its own transition key while navigating. Any other
    // browser-storage read would be an application persistence regression.
    expect(getItem.mock.calls.filter(([key]) => key !== 'remix-router-transitions')).toEqual([])
    expect(setItem).not.toHaveBeenCalled()
  })
})
