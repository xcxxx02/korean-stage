import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { readProgress } from '../progress/progressStore'
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

    expect(screen.getByRole('heading', { name: /이에요 \/ 예요 - to be/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Mark unit complete' }))

    expect(screen.getByText('Unit complete')).toBeInTheDocument()
    expect(readProgress(localStorage).completedUnitIds).toEqual(['unit-4'])
  })
})
