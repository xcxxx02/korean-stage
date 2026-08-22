import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
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
      <MemoryRouter initialEntries={['/learn/unit-1']}>
        <Routes><Route path="learn/:unitId" element={<LearnPage />} /></Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Hello & Self-introduction' })).toBeInTheDocument()
    const models = screen.getByRole('list', { name: 'Bilingual self-introduction models' })
    expect(models).toHaveTextContent('안녕하세요?')
    expect(models).toHaveTextContent('Hello.')
    expect(models).toHaveTextContent('저는 미나예요.')
    expect(models).toHaveTextContent('I am Mina.')
    const modelItems = within(models).getAllByRole('listitem')
    expect(modelItems).toHaveLength(2)
    expect(modelItems[0]).toHaveTextContent('Romanization: annyeonghaseyo?')
    expect(modelItems[0]).toHaveTextContent('Pronunciation: an-nyeong-ha-se-yo')
    expect(modelItems[0]).toHaveTextContent('Presented by Member 1')
    expect(within(modelItems[0]).getByRole('button', { name: 'Listen to Member 1 greeting' })).toBeDisabled()
    expect(modelItems[0]).toHaveTextContent('Audio coming soon Use the written example for now.')
    expect(modelItems[1]).toHaveTextContent('Romanization: jeoneun minayeyo.')
    expect(modelItems[1]).toHaveTextContent('Presented by Member 2')
    expect(within(modelItems[1]).getByRole('button', { name: 'Listen to Member 2 self-introduction' })).toBeDisabled()
    expect(modelItems[1]).toHaveTextContent('Audio coming soon Use the written example for now.')
    expect(screen.getByRole('region', { name: 'Ready to continue?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Mark unit complete' }))

    expect(screen.getByText('Unit complete')).toBeInTheDocument()
    expect(readProgress(localStorage).completedUnitIds).toEqual(['unit-1'])
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
