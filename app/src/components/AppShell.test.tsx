import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { AppShell } from './AppShell'

const routePage = (heading: string) => <h1>{heading}</h1>

afterEach(cleanup)

function renderShell(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={routePage('Home')} />
          <Route path="learn" element={routePage('Learn')} />
          <Route path="learn/:unitId" element={routePage('Learn')} />
          <Route path="vocabulary" element={routePage('Vocabulary')} />
          <Route path="grammar" element={routePage('Grammar')} />
          <Route path="practice" element={routePage('Practice')} />
          <Route path="dialogue" element={routePage('Dialogue')} />
          <Route path="team" element={routePage('Team')} />
          <Route path="*" element={<><h1>Page not found</h1><a href="/">Return to course</a></>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('AppShell', () => {
  it('renders the approved Korean palace brand and cultural background assets', () => {
    const { container } = renderShell()

    expect(container.querySelector('.site-brand__image')).toHaveAttribute('src', '/assets/culture/palace-gate-mark-v2.png')
    expect(container.querySelector('.obangsaek-band')).toHaveAttribute('src', '/assets/culture/obangsaek-band-v2.png')
    expect(container.querySelector('.korean-stage-background')).toHaveAttribute('src', '/assets/culture/korean-stage-background-v2.png')
  })

  it('renders exactly four primary destinations', () => {
    renderShell('/learn/lesson-3')

    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' })
    expect(within(navigation).getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Learn', 'Practice', 'Dialogue', 'Team',
    ])
    expect(within(navigation).queryByText('Vocabulary')).not.toBeInTheDocument()
    expect(within(navigation).queryByText('Grammar')).not.toBeInTheDocument()
    expect(within(navigation).queryByText('Review')).not.toBeInTheDocument()
  })

  it('marks every Learn lesson route as active', () => {
    renderShell('/learn/lesson-3')

    expect(screen.getByRole('link', { name: 'Learn' })).toHaveAttribute('aria-current', 'page')
  })

  it('opens and closes the accessible mobile menu', async () => {
    const user = userEvent.setup()
    renderShell()

    const menuButton = screen.getByRole('button', { name: 'Menu' })
    const mobilePanel = document.getElementById('primary-navigation-list')!
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(mobilePanel).toHaveAttribute('hidden')
    expect(within(mobilePanel).queryByRole('link', { name: 'Learn' })).not.toBeInTheDocument()

    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(mobilePanel).not.toHaveAttribute('hidden')
    expect(within(mobilePanel).getByRole('link', { name: 'Learn' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(mobilePanel).toHaveAttribute('hidden')
  })

  it('closes the mobile menu and focuses the destination heading after navigation', async () => {
    const user = userEvent.setup()
    renderShell()

    await user.click(screen.getByRole('button', { name: 'Menu' }))
    await user.click(within(document.getElementById('primary-navigation-list')!).getByRole('link', { name: 'Practice' }))

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById('primary-navigation-list')).toHaveAttribute('hidden')
    expect(screen.getByRole('heading', { name: 'Practice' })).toHaveFocus()
  })

  it('shows a recovery route for an unknown address', () => {
    renderShell('/missing')

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return to course' })).toBeInTheDocument()
  })

  it('provides a focusable target for the skip link', () => {
    renderShell()

    expect(document.getElementById('main-content')).toHaveAttribute('tabindex', '-1')
  })
})
