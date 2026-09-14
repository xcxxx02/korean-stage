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
  it('shows exactly two selectable vocabulary units', () => {
    renderVocabulary('/vocabulary')

    expect(screen.getByRole('heading', { name: 'Choose a vocabulary unit' })).toBeVisible()
    expect(screen.getAllByRole('link', { name: /Open Unit/ })).toHaveLength(2)
    expect(screen.getByText('Countries & Nationalities')).toBeVisible()
    expect(screen.getByText('Jobs & Occupations')).toBeVisible()
    expect(screen.queryByText('Dialogue & Role Play')).not.toBeInTheDocument()
    expect(screen.queryByText('은 / 는 - topic marker')).not.toBeInTheDocument()
  })

  it('opens countries in the shared word journey with pictures', () => {
    renderVocabulary('/vocabulary/countries')

    expect(screen.getByRole('heading', { name: 'Countries & Nationalities' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Choose a word' })).toBeVisible()
    expect(screen.getByText('Word 1 of 9')).toBeVisible()
    expect(screen.getByRole('img', { name: 'Thailand flag' })).toBeVisible()
  })
})
