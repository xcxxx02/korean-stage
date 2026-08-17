import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { VocabularyPage } from './VocabularyPage'

const approvedCountries = [
  ['중국', 'China'],
  ['일본', 'Japan'],
  ['미국', 'USA'],
  ['한국', 'Korea'],
  ['프랑스', 'France'],
  ['독일', 'Germany'],
  ['호주', 'Australia'],
  ['영국', 'United Kingdom'],
] as const

const approvedOccupations = [
  ['학생', 'Student'],
  ['선생님', 'Teacher'],
  ['회사원', 'Office worker'],
  ['기자', 'Reporter'],
  ['의사', 'Doctor'],
  ['가수', 'Singer'],
  ['군인', 'Soldier'],
  ['요리사', 'Chef'],
] as const

afterEach(cleanup)

describe('VocabularyPage', () => {
  it('shows a search-free bilingual review of all Unit 2 and Unit 3 words', () => {
    render(<MemoryRouter><VocabularyPage /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Vocabulary review' })).toBeVisible()
    const countryList = screen.getByRole('list', { name: 'Unit 2 vocabulary review' })
    const occupationList = screen.getByRole('list', { name: 'Unit 3 vocabulary review' })
    expect(within(countryList).getAllByRole('listitem')).toHaveLength(8)
    expect(within(occupationList).getAllByRole('listitem')).toHaveLength(8)

    for (const [korean, english] of approvedCountries) {
      const item = within(countryList).getByRole('listitem', { name: `${korean}, ${english}` })
      expect(item).toHaveTextContent(korean)
      expect(item).toHaveTextContent(english)
    }
    for (const [korean, english] of approvedOccupations) {
      const item = within(occupationList).getByRole('listitem', { name: `${korean}, ${english}` })
      expect(item).toHaveTextContent(korean)
      expect(item).toHaveTextContent(english)
    }

    expect(screen.queryByRole('search')).not.toBeInTheDocument()
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next word' })).not.toBeInTheDocument()
  })
})
