import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { course } from '../content/course'
import type { MediaSource } from '../content/types'
import { readProgress } from '../progress/progressStore'
import { UnitPage } from '../pages/UnitPage'
import { HumanAudioButton } from './HumanAudioButton'
import { MemberVideo } from './MemberVideo'
import { VocabularyJourney } from './VocabularyJourney'

const occupationItems = course.vocabulary.filter((item) => item.unitId === 'unit-3')

afterEach(cleanup)

beforeEach(() => localStorage.clear())

describe('VocabularyJourney', () => {
  it('introduces one beginner word at a time with English learning support', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    expect(screen.getAllByText('학생').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Student').length).toBeGreaterThan(0)
    expect(screen.getByText('Romanization:')).toBeVisible()
    expect(screen.getByText('haksaeng')).toBeVisible()
    expect(screen.getByText('Pronunciation:')).toBeVisible()
    expect(screen.getByText('hak-ssaeng')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toBeDisabled()
    expect(screen.getByText('Now learning')).toBeVisible()
    expect(screen.getByText('학생 ends in a consonant, so use 이에요.')).toBeVisible()

    const nextButtons = screen.getAllByRole('button', { name: 'Next word' })
    expect(nextButtons).toHaveLength(1)
    expect(nextButtons[0]).toBeEnabled()

    await user.click(nextButtons[0])
    expect(screen.getAllByText('선생님').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Teacher').length).toBeGreaterThan(0)
    expect(screen.queryByText('hak-ssaeng')).not.toBeInTheDocument()
    await waitFor(() => expect(readProgress(localStorage).completedVocabularyIds).toContain('student'))

    await user.click(screen.getByRole('button', { name: 'Previous word' }))
    expect(screen.getAllByText('학생').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Student').length).toBeGreaterThan(0)
  })

  it('keeps all eight ordered bilingual occupations visible in its progress rail', () => {
    render(<VocabularyJourney items={occupationItems} initialItemId="doctor" />)

    const rail = screen.getByRole('list', { name: 'Vocabulary progress' })
    expect(within(rail).getAllByRole('listitem')).toHaveLength(8)
    occupationItems.forEach((item, index) => {
      const row = within(rail).getByRole('listitem', { name: `${index + 1}. ${item.korean}, ${item.english}` })
      expect(row).toHaveTextContent(item.korean)
      expect(row).toHaveTextContent(item.english)
    })
    expect(within(rail).getByRole('listitem', { name: '5. 의사, Doctor' })).toHaveAttribute('aria-current', 'step')
  })
})

describe('human media states', () => {
  const missingMedia: MediaSource = { src: null, kind: 'development-missing' }

  it('keeps missing human audio honest and unavailable', () => {
    render(<HumanAudioButton memberName="Member 1" source={missingMedia} />)

    expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toBeDisabled()
    expect(screen.getByText('Audio coming soon')).toBeVisible()
  })

  it('turns missing member video into an actionable recording checklist', () => {
    render(<MemberVideo memberName="Member 1" source={missingMedia} transcript="저는 학생이에요. I am a student." />)

    expect(screen.getByRole('heading', { name: 'Member video coming soon' })).toBeVisible()
    for (const check of ['Speak clearly', 'Check pronunciation', 'Use good lighting', 'Minimize background noise']) {
      expect(screen.getByText(check)).toBeVisible()
    }
    expect(screen.getByText('저는 학생이에요. I am a student.')).toBeVisible()
  })

  it('uses native video controls, captions, and an adjacent transcript when supplied', () => {
    render(<MemberVideo
      memberName="Member 1"
      source={{ src: '/media/student.mp4', captionSrc: '/media/student.vtt', kind: 'human-recording' }}
      transcript="저는 학생이에요. I am a student."
    />)

    const video = screen.getByLabelText('Member 1 vocabulary video')
    expect(video).toHaveAttribute('controls')
    expect(video.querySelector('track')).toHaveAttribute('src', '/media/student.vtt')
    expect(screen.getByText('저는 학생이에요. I am a student.')).toBeVisible()
  })
})

describe('UnitPage vocabulary units', () => {
  function renderUnit(path: string) {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes><Route path="learn/:unitId" element={<UnitPage />} /></Routes>
      </MemoryRouter>,
    )
  }

  it('shows all eight bilingual country cards and a flashcard entry in Unit 2', () => {
    renderUnit('/learn/unit-2')

    expect(screen.getByRole('heading', { name: 'Unit 2 · Countries & Nationalities' })).toBeVisible()
    const cards = screen.getByRole('list', { name: 'Country and nationality vocabulary' })
    expect(within(cards).getAllByRole('listitem')).toHaveLength(8)
    for (const item of course.vocabulary.filter((word) => word.unitId === 'unit-2')) {
      expect(within(cards).getByText(item.korean)).toBeVisible()
      expect(within(cards).getByText(item.english)).toBeVisible()
    }
    expect(screen.getByRole('link', { name: 'Practise Unit 2 with flashcards' })).toHaveAttribute('href', '/practice')
  })

  it('uses the approved Unit 3 heading above the ordered occupation journey', () => {
    renderUnit('/learn/unit-3')

    expect(screen.getByRole('heading', { name: 'Unit 3 · Jobs & Occupations' })).toBeVisible()
    expect(screen.getByRole('list', { name: 'Vocabulary progress' })).toBeVisible()
    expect(screen.getAllByText('학생').length).toBeGreaterThan(0)
  })
})
