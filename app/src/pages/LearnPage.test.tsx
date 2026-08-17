import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { readProgress } from '../progress/progressStore'
import { HomePage } from './HomePage'
import { LearnPage } from './LearnPage'

describe('LearnPage', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('lets a learner complete the selected course unit', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/learn/unit-4']}>
        <Routes><Route path="learn/:unitId" element={<LearnPage />} /></Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: '이에요 / 예요 - to be' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Mark unit complete' }))

    expect(screen.getByText('Unit complete')).toBeInTheDocument()
    expect(readProgress(localStorage).completedUnitIds).toEqual(['unit-4'])
  })

  it('defaults the parameterless learn route to Unit 1', () => {
    render(
      <MemoryRouter initialEntries={['/learn']}>
        <Routes><Route path="learn" element={<LearnPage />} /></Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Hello & Self-introduction' })).toBeInTheDocument()
  })

  it('continues from a visited unit without marking it complete', async () => {
    const view = render(
      <MemoryRouter initialEntries={['/learn/unit-5']}>
        <Routes><Route path="learn/:unitId" element={<LearnPage />} /></Routes>
      </MemoryRouter>,
    )

    await waitFor(() => expect(readProgress(localStorage)).toMatchObject({
      completedUnitIds: [],
      lastPath: '/learn/unit-5',
    }))

    view.unmount()
    render(<MemoryRouter><HomePage /></MemoryRouter>)

    expect(screen.getByRole('link', { name: 'Continue learning' })).toHaveAttribute('href', '/learn/unit-5')
  })

  it('shows a friendly recovery state for an unknown unit route', () => {
    render(
      <MemoryRouter initialEntries={['/learn/unit-99']}>
        <Routes><Route path="learn/:unitId" element={<LearnPage />} /></Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Unit not found' })).toBeInTheDocument()
    expect(screen.getByText("We couldn't find that course unit.")).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return to course' })).toHaveAttribute('href', '/')
    expect(screen.queryByRole('heading', { name: 'Hello & Self-introduction' })).not.toBeInTheDocument()
  })
})
