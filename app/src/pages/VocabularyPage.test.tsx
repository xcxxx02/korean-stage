import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { VocabularyPage } from './VocabularyPage'

afterEach(cleanup)

function renderVocabulary(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="vocabulary" element={<VocabularyPage />} />
        <Route path="vocabulary/:lessonSlug" element={<VocabularyPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('VocabularyPage', () => {
  it('shows exactly three selectable Vocabulary units', () => {
    renderVocabulary('/vocabulary')

    expect(screen.getByRole('heading', { name: 'Choose a vocabulary unit' })).toBeVisible()
    expect(screen.getAllByRole('link', { name: /Open Unit/ })).toHaveLength(3)
    expect(screen.queryByText('Dialogue & Role Play')).not.toBeInTheDocument()
    expect(screen.queryByText('은 / 는 - topic marker')).not.toBeInTheDocument()
  })

  it('opens Unit 1 in the shared expression journey', () => {
    renderVocabulary('/vocabulary/lesson-1')

    expect(screen.getByRole('heading', { name: 'Essential greetings' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Choose a useful expression' })).toBeVisible()
  })
})
