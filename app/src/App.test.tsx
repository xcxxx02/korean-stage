import { cleanup, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
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
})
