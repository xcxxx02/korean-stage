import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { course } from '../content/course'
import type { MediaSource, VocabularyItem } from '../content/types'
import { readProgress, writeProgress } from '../progress/progressStore'
import { HomePage } from '../pages/HomePage'
import { UnitPage } from '../pages/UnitPage'
import { HumanAudioButton } from './HumanAudioButton'
import { MemberVideo } from './MemberVideo'
import { VocabularyJourney } from './VocabularyJourney'

const occupationItems = course.vocabulary.filter((item) => item.unitId === 'unit-3')
const approvedCountries = [
  { korean: '중국', english: 'China' },
  { korean: '일본', english: 'Japan' },
  { korean: '미국', english: 'USA' },
  { korean: '한국', english: 'Korea' },
  { korean: '프랑스', english: 'France' },
  { korean: '독일', english: 'Germany' },
  { korean: '호주', english: 'Australia' },
  { korean: '영국', english: 'United Kingdom' },
] as const
const approvedOccupations = [
  { id: 'student', korean: '학생', english: 'Student' },
  { id: 'teacher', korean: '선생님', english: 'Teacher' },
  { id: 'office-worker', korean: '회사원', english: 'Office worker' },
  { id: 'reporter', korean: '기자', english: 'Reporter' },
  { id: 'doctor', korean: '의사', english: 'Doctor' },
  { id: 'singer', korean: '가수', english: 'Singer' },
  { id: 'soldier', korean: '군인', english: 'Soldier' },
  { id: 'chef', korean: '요리사', english: 'Chef' },
] as const
const humanMediaItems = occupationItems.slice(0, 2).map((item, index): VocabularyItem => ({
  ...item,
  audio: { src: `/media/${index === 0 ? 'student' : 'teacher'}.mp3`, kind: 'human-recording' },
  video: {
    src: `/media/${index === 0 ? 'student' : 'teacher'}.mp4`,
    captionSrc: `/media/${index === 0 ? 'student' : 'teacher'}.vtt`,
    kind: 'human-recording',
  },
}))

afterEach(cleanup)

beforeEach(() => localStorage.clear())

function unlockThroughDoctor() {
  writeProgress({
    completedUnitIds: [],
    completedVocabularyIds: ['student', 'teacher', 'office-worker', 'reporter'],
    exerciseResults: {},
    lastPath: '/learn/unit-3',
  }, localStorage)
}

describe('VocabularyJourney', () => {
  it('uses the approved three-region learning composition with eight progress markers', () => {
    render(<VocabularyJourney items={occupationItems} />)

    expect(screen.getByRole('complementary', { name: 'Ordered vocabulary words' })).toBeVisible()
    expect(screen.getByRole('region', { name: 'Member vocabulary video' })).toBeVisible()
    expect(screen.getByRole('complementary', { name: 'Vocabulary learning details' })).toBeVisible()
    expect(within(screen.getByRole('list', { name: 'Word progress markers' })).getAllByRole('listitem')).toHaveLength(8)
  })

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
    unlockThroughDoctor()
    render(<VocabularyJourney items={occupationItems} initialItemId="doctor" />)

    const rail = screen.getByRole('list', { name: 'Vocabulary progress' })
    expect(within(rail).getAllByRole('listitem')).toHaveLength(8)
    approvedOccupations.forEach((item, index) => {
      const row = within(rail).getByRole('listitem', { name: `${index + 1}. ${item.korean}, ${item.english}` })
      expect(row).toHaveTextContent(item.korean)
      expect(row).toHaveTextContent(item.english)
    })
    expect(within(rail).getByRole('listitem', { name: '5. 의사, Doctor' })).toHaveAttribute('aria-current', 'step')
  })

  it('finishes the eighth word and records all eight occupations complete', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    for (let index = 0; index < 7; index += 1) {
      const next = screen.getByRole('button', { name: 'Next word' })
      expect(next).toBeEnabled()
      await user.click(next)
    }

    expect(screen.getAllByText('요리사').length).toBeGreaterThan(0)
    const finish = screen.getByRole('button', { name: 'Finish vocabulary' })
    expect(finish).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Next word' })).not.toBeInTheDocument()
    await user.click(finish)

    await waitFor(() => expect(readProgress(localStorage).completedVocabularyIds).toEqual([
      'student',
      'teacher',
      'office-worker',
      'reporter',
      'doctor',
      'singer',
      'soldier',
      'chef',
    ]))
    expect(readProgress(localStorage).completedUnitIds).toContain('unit-3')
    expect(screen.getByRole('button', { name: 'Vocabulary complete' })).toBeDisabled()
  })

  it('provides a compact bilingual word selector while keeping the full rail desktop-only', async () => {
    const user = userEvent.setup()
    unlockThroughDoctor()
    render(<VocabularyJourney items={occupationItems} initialItemId="doctor" />)

    expect(screen.getByRole('list', { name: 'Vocabulary progress' })).toHaveClass('hidden', 'lg:grid')
    const compact = screen.getByRole('group', { name: 'Compact vocabulary progress' })
    expect(compact).toHaveClass('lg:hidden')
    const selector = within(compact).getByRole('combobox', { name: 'Choose vocabulary word' })
    expect(within(selector).getAllByRole('option').map((option) => option.textContent)).toEqual([
      '1. 학생 — Student',
      '2. 선생님 — Teacher',
      '3. 회사원 — Office worker',
      '4. 기자 — Reporter',
      '5. 의사 — Doctor',
      '6. 가수 — Singer',
      '7. 군인 — Soldier',
      '8. 요리사 — Chef',
    ])
    expect(within(compact).getByText('5 of 8 · 의사 · Doctor')).toHaveAttribute('aria-current', 'step')

    await user.selectOptions(selector, 'teacher')
    expect(within(compact).getByText('2 of 8 · 선생님 · Teacher')).toHaveAttribute('aria-current', 'step')
    expect(screen.getAllByText('Teacher').length).toBeGreaterThan(0)
  })

  it('prevents the compact selector from skipping ahead to a false completion', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    const selector = screen.getByRole('combobox', { name: 'Choose vocabulary word' })
    expect(within(selector).getByRole('option', { name: '8. 요리사 — Chef' })).toBeDisabled()
    await user.selectOptions(selector, 'chef')

    expect(selector).toHaveValue('student')
    expect(screen.queryByRole('button', { name: 'Finish vocabulary' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Vocabulary complete' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next word' })).toBeEnabled()
    expect(readProgress(localStorage).completedVocabularyIds).toEqual([])
  })

  it('recovers human audio and video when Next word loads a different source', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={humanMediaItems} />)

    fireEvent.error(document.querySelector('audio')!)
    fireEvent.error(screen.getByLabelText('Member 1 vocabulary video'))
    expect(screen.getByText('Audio playback unavailable. Continue with the written example.')).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Video playback unavailable' })).toBeVisible()
    expect(screen.getByText('저는 학생이에요. I am a student.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Next word' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Next word' }))

    expect(screen.queryByText('Audio playback unavailable. Continue with the written example.')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Video playback unavailable' })).not.toBeInTheDocument()
    expect(document.querySelector('audio')).toHaveAttribute('src', '/media/teacher.mp3')
    const nextVideo = screen.getByLabelText('Member 1 vocabulary video')
    expect(nextVideo.querySelector('source')).toHaveAttribute('src', '/media/teacher.mp4')
    expect(screen.getByText('저는 선생님이에요. I am a teacher.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Finish vocabulary' })).toBeEnabled()
  })
})

describe('human media states', () => {
  const missingMedia: MediaSource = { src: null, kind: 'development-missing' }

  it('keeps missing human audio honest and unavailable', () => {
    render(<HumanAudioButton memberName="Member 1" source={missingMedia} />)

    expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toBeDisabled()
    expect(screen.getByText('Audio coming soon')).toBeVisible()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('turns missing member video into an actionable recording checklist', () => {
    render(<MemberVideo memberName="Member 1" source={missingMedia} transcript="저는 학생이에요. I am a student." />)

    expect(screen.getByRole('heading', { name: 'Member video coming soon' })).toBeVisible()
    for (const check of ['Speak clearly', 'Check pronunciation', 'Use good lighting', 'Minimize background noise']) {
      expect(screen.getByText(check)).toBeVisible()
    }
    expect(screen.getAllByLabelText('Not yet reviewed')).toHaveLength(4)
    expect(screen.getByText('저는 학생이에요. I am a student.')).toBeVisible()
  })

  it('never renders or enables AI-generated audio and video', () => {
    const aiMedia: MediaSource = { src: '/media/generated.mp4', kind: 'ai-generated' }
    render(<>
      <HumanAudioButton memberName="Member 1" source={aiMedia} />
      <MemberVideo memberName="Member 1" source={aiMedia} transcript="저는 학생이에요. I am a student." />
    </>)

    expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toBeDisabled()
    expect(screen.getByText('AI-generated audio is prohibited')).toBeVisible()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI-generated video is prohibited' })).toBeVisible()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
    expect(document.querySelector('video')).not.toBeInTheDocument()
  })

  it('rejects development-missing media that inconsistently includes a source', () => {
    const invalidMedia: MediaSource = { src: '/media/not-approved.mp4', kind: 'development-missing' }
    render(<>
      <HumanAudioButton memberName="Member 1" source={invalidMedia} />
      <MemberVideo memberName="Member 1" source={invalidMedia} transcript="저는 학생이에요. I am a student." />
    </>)

    expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toBeDisabled()
    expect(screen.getByText('Audio unavailable: invalid media source')).toBeVisible()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Member video unavailable' })).toBeVisible()
    expect(screen.getByText('This media source is invalid. Ask a course editor to replace it with a human recording.')).toBeVisible()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
    expect(document.querySelector('video')).not.toBeInTheDocument()
  })

  it('reports a supplied human audio playback error in plain English', () => {
    render(<HumanAudioButton
      memberName="Member 1"
      source={{ src: '/media/student.mp3', kind: 'human-recording' }}
    />)

    const audio = document.querySelector('audio')!
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    fireEvent.error(audio)
    expect(screen.getByRole('status')).toHaveTextContent('Audio playback unavailable. Continue with the written example.')
    expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toBeDisabled()
  })

  it('handles rejected playback and resets the fallback when the source changes', async () => {
    const user = userEvent.setup()
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValueOnce(new Error('Playback blocked'))
    const view = render(<HumanAudioButton
      memberName="Member 1"
      source={{ src: '/media/student.mp3', kind: 'human-recording' }}
    />)

    await user.click(screen.getByRole('button', { name: 'Listen to Member 1' }))

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(
      'Audio playback unavailable. Continue with the written example.',
    ))
    expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toBeDisabled()

    view.rerender(<HumanAudioButton
      memberName="Member 2"
      source={{ src: '/media/teacher.mp3', kind: 'human-recording' }}
    />)

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Listen to Member 2' })).toBeEnabled()
    expect(document.querySelector('audio')).toHaveAttribute('src', '/media/teacher.mp3')
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

    fireEvent.error(video)
    expect(screen.getByRole('heading', { name: 'Video playback unavailable' })).toBeVisible()
    expect(screen.getByText('Use the transcript below and continue to the next word.')).toBeVisible()
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
    for (const item of approvedCountries) {
      expect(within(cards).getByText(item.korean)).toBeVisible()
      expect(within(cards).getByText(item.english)).toBeVisible()
    }
    expect(screen.getByRole('link', { name: 'Practise Unit 2 with flashcards' })).toHaveAttribute('href', '/practice')
    expect(readProgress(localStorage).completedUnitIds).not.toContain('unit-2')
  })

  it('completes Unit 2 only after the learner deliberately confirms review', async () => {
    const user = userEvent.setup()
    const view = renderUnit('/learn/unit-2')
    const complete = screen.getByRole('button', { name: 'Mark Unit 2 complete' })

    expect(complete).toBeEnabled()
    expect(readProgress(localStorage).completedUnitIds).not.toContain('unit-2')
    complete.focus()
    await user.keyboard('{Enter}')

    await waitFor(() => expect(readProgress(localStorage).completedUnitIds).toContain('unit-2'))
    expect(screen.getByRole('status')).toHaveTextContent('Unit 2 complete')
    expect(complete).toBeDisabled()

    view.unmount()
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    expect(screen.getByText('1 of 7 units complete')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Continue learning' })).toHaveAttribute('href', '/learn/unit-2')
  })

  it('uses the approved Unit 3 heading above the ordered occupation journey', () => {
    renderUnit('/learn/unit-3')

    expect(screen.getByRole('heading', { name: 'Unit 3 · Jobs & Occupations' })).toBeVisible()
    expect(screen.getByRole('list', { name: 'Vocabulary progress' })).toBeVisible()
    expect(screen.getAllByText('학생').length).toBeGreaterThan(0)
  })

  it('keeps Home continuation on Unit 3 while its vocabulary is completed', async () => {
    const user = userEvent.setup()
    const view = renderUnit('/learn/unit-3')
    await waitFor(() => expect(readProgress(localStorage).lastPath).toBe('/learn/unit-3'))

    await user.click(screen.getByRole('button', { name: 'Next word' }))
    await waitFor(() => expect(readProgress(localStorage)).toMatchObject({
      completedVocabularyIds: ['student'],
      lastPath: '/learn/unit-3',
    }))

    view.unmount()
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Continue learning' })).toHaveAttribute('href', '/learn/unit-3')
  })
})
