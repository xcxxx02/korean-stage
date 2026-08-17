import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { course } from '../content/course'
import { validCourse } from '../test/fixtures'
import { DialoguePage } from '../pages/DialoguePage'
import { UnitPage } from '../pages/UnitPage'
import { DialoguePlayer } from './DialoguePlayer'

afterEach(cleanup)

const recordingChecklist = [
  "Show every speaker's face",
  "Use each member's real voice",
  'Act naturally',
  'Record 1-3 minutes',
  'Maintain clear pronunciation and uninterrupted flow',
  'Avoid background noise',
  'Never use AI voice',
] as const

describe('DialoguePlayer', () => {
  it('puts the full human role-play before an eight-line bilingual transcript with real member labels', () => {
    const dialogue = validCourse.dialogues[0]
    render(<DialoguePlayer dialogue={dialogue} members={validCourse.members} />)

    const fullPlayback = screen.getByRole('button', { name: 'Play full role-play video' })
    expect(fullPlayback).toBeEnabled()
    const transcript = screen.getByRole('list', { name: 'Bilingual dialogue transcript' })
    expect(fullPlayback.compareDocumentPosition(transcript) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    const lines = within(transcript).getAllByRole('listitem')
    expect(lines).toHaveLength(8)
    expect(transcript.querySelectorAll('[lang="ko"]')).toHaveLength(8)
    expect(transcript.querySelectorAll('[lang="en"]')).toHaveLength(8)
    expect(lines[0]).toHaveTextContent('Amina Rahman')
    expect(lines[1]).toHaveTextContent('Daniel Lee')
    expect(within(transcript).getByRole('button', { name: 'Listen to line 1 by Amina Rahman' })).toBeEnabled()
  })

  it('marks a selected line current without hiding any English translation', async () => {
    const user = userEvent.setup()
    render(<DialoguePlayer dialogue={validCourse.dialogues[0]} members={validCourse.members} />)

    const transcript = screen.getByRole('list', { name: 'Bilingual dialogue transcript' })
    const lines = within(transcript).getAllByRole('listitem')
    expect(lines[0]).toHaveAttribute('aria-current', 'true')

    await user.click(within(lines[4]).getByRole('button', { name: 'Select line 5 by Amina Rahman' }))

    expect(lines[0]).not.toHaveAttribute('aria-current')
    expect(lines[4]).toHaveAttribute('aria-current', 'true')
    expect(transcript.querySelectorAll('[lang="en"]')).toHaveLength(8)
    expect(within(lines[4]).getByText('English line 5')).toBeVisible()
  })

  it('keeps missing role-play media honest and displays all seven recording rules', () => {
    render(<DialoguePlayer dialogue={course.dialogues[0]} members={course.members} />)

    expect(screen.getByRole('button', { name: 'Play full role-play video' })).toBeDisabled()
    expect(screen.getByRole('heading', { name: 'Full role-play video coming soon' })).toBeVisible()
    expect(screen.getByText('This role-play still needs a real recording from Member 1 and Member 2.')).toBeVisible()
    expect(screen.queryByRole('list', { name: 'Recording checklist' })).not.toBeInTheDocument()
    expect(document.querySelector('video')).not.toBeInTheDocument()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
    for (const rule of recordingChecklist) expect(screen.getByText(rule)).toBeVisible()
    expect(screen.getAllByText('Audio coming soon')).toHaveLength(8)
  })
})

describe('dialogue entry points', () => {
  it('offers exactly the two approved dialogues and switches between their complete transcripts', async () => {
    const user = userEvent.setup()
    render(<DialoguePage />)

    const chooser = screen.getByRole('group', { name: 'Choose a dialogue' })
    expect(within(chooser).getAllByRole('button')).toHaveLength(2)
    expect(within(chooser).getByRole('button', { name: 'Hello, I am Mina' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('안녕하세요.')).toBeVisible()

    await user.click(within(chooser).getByRole('button', { name: 'Who are you?' }))

    expect(within(chooser).getByRole('button', { name: 'Who are you?' })).toHaveAttribute('aria-pressed', 'true')
    const transcript = screen.getByRole('list', { name: 'Bilingual dialogue transcript' })
    expect(within(transcript).getAllByRole('listitem')).toHaveLength(8)
    expect(within(transcript).getByText('다니엘은 학생이에요?')).toBeVisible()
    expect(within(transcript).getByText('Daniel, are you a student?')).toBeVisible()
  })

  it('connects the dialogue overview and Unit 7 to the same study flow', () => {
    const overview = render(<DialoguePage />)
    expect(screen.getByRole('heading', { name: 'Dialogue & role play' })).toBeVisible()
    expect(screen.getByRole('list', { name: 'Bilingual dialogue transcript' })).toBeVisible()
    overview.unmount()

    render(
      <MemoryRouter initialEntries={['/learn/unit-7']}>
        <Routes><Route path="learn/:unitId" element={<UnitPage />} /></Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Unit 7 · Dialogue & role play' })).toBeVisible()
    expect(screen.getByRole('list', { name: 'Bilingual dialogue transcript' })).toBeVisible()
  })
})
