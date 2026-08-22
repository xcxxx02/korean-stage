import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { course } from '../content/course'
import { validCourse } from '../test/fixtures'
import { DialoguePage } from '../pages/DialoguePage'
import { UnitPage } from '../pages/UnitPage'
import { DialoguePlayer } from './DialoguePlayer'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

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
    const firstSelector = within(lines[0]).getByRole('button', { name: 'Select line 1 by Amina Rahman' })
    expect(firstSelector).toHaveAttribute('aria-current', 'true')
    expect(within(firstSelector).getByText('Current line')).toBeVisible()

    await user.click(within(lines[4]).getByRole('button', { name: 'Select line 5 by Amina Rahman' }))

    const fifthSelector = within(lines[4]).getByRole('button', { name: 'Select line 5 by Amina Rahman' })
    expect(firstSelector).not.toHaveAttribute('aria-current')
    expect(within(firstSelector).queryByText('Current line')).not.toBeInTheDocument()
    expect(fifthSelector).toHaveAttribute('aria-current', 'true')
    expect(within(fifthSelector).getByText('Current line')).toBeVisible()
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
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('renders supplied human role-play video and line audio as the only playable media', () => {
    const dialogue = validCourse.dialogues[0]
    render(<DialoguePlayer dialogue={dialogue} members={validCourse.members} />)

    const video = screen.getByLabelText('Dialogue 1 full role-play video')
    expect(video).toHaveAttribute('controls')
    expect(video.querySelector('source')).toHaveAttribute('src', '/media/dialogues/dialogue-1.mp4')
    expect(document.querySelectorAll('audio')).toHaveLength(8)
    expect(document.querySelector('audio')).toHaveAttribute('src', '/media/dialogues/dialogue-1-line-1.mp3')
  })

  it('prohibits AI role-play video and line audio instead of rendering media elements', () => {
    const dialogue = {
      ...validCourse.dialogues[0],
      video: { src: '/media/dialogues/ai.mp4', kind: 'ai-generated' as const, durationSeconds: 90 },
      lines: validCourse.dialogues[0].lines.map((line) => ({
        ...line,
        audio: { src: `/media/dialogues/${line.id}-ai.mp3`, kind: 'ai-generated' as const },
      })),
    }

    render(<DialoguePlayer dialogue={dialogue} members={validCourse.members} />)

    expect(screen.getByRole('button', { name: 'Play full role-play video' })).toBeDisabled()
    expect(screen.getByRole('heading', { name: 'AI-generated video is prohibited' })).toBeVisible()
    expect(screen.getAllByText('AI-generated audio is prohibited')).toHaveLength(8)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(document.querySelector('video')).not.toBeInTheDocument()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
  })

  it('rejects inconsistent development role-play sources instead of rendering them', () => {
    const dialogue = {
      ...validCourse.dialogues[0],
      video: { src: '/media/dialogues/not-approved.mp4', kind: 'development-missing' as const, durationSeconds: 90 },
      lines: validCourse.dialogues[0].lines.map((line) => ({
        ...line,
        audio: { src: `/media/dialogues/${line.id}-not-approved.mp3`, kind: 'development-missing' as const },
      })),
    }

    render(<DialoguePlayer dialogue={dialogue} members={validCourse.members} />)

    expect(screen.getByRole('button', { name: 'Play full role-play video' })).toBeDisabled()
    expect(screen.getByRole('heading', { name: 'Member video unavailable' })).toBeVisible()
    expect(screen.getAllByText('Audio unavailable: invalid media source')).toHaveLength(8)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(document.querySelector('video')).not.toBeInTheDocument()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
  })

  it('uses beginner role-play copy when the full video element reports an error', () => {
    render(<DialoguePlayer dialogue={validCourse.dialogues[0]} members={validCourse.members} />)

    fireEvent.error(screen.getByLabelText('Dialogue 1 full role-play video'))

    expect(screen.getByRole('heading', { name: 'Role-play video unavailable' })).toBeVisible()
    expect(screen.getByText('Keep practising with the bilingual transcript below.')).toBeVisible()
    expect(screen.queryByText('Use the transcript below and continue to the next word.')).not.toBeInTheDocument()
  })

  it('turns rejected primary playback into the same honest role-play error state', async () => {
    const user = userEvent.setup()
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValueOnce(new Error('Playback blocked'))
    render(<DialoguePlayer dialogue={validCourse.dialogues[0]} members={validCourse.members} />)

    await user.click(screen.getByRole('button', { name: 'Play full role-play video' }))

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Role-play video unavailable' })).toBeVisible())
    expect(screen.getByText('Keep practising with the bilingual transcript below.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Play full role-play video' })).toBeDisabled()
  })
})

describe('dialogue entry points', () => {
  it('keeps the selected dialogue index at full opacity for readable contrast', () => {
    render(<DialoguePage />)

    const selected = within(screen.getByRole('group', { name: 'Choose a dialogue' })).getAllByRole('button')[0]
    const indexLabel = within(selected).getByText('Dialogue 1')
    expect(indexLabel).not.toHaveClass('opacity-80')
  })

  it('offers exactly the two approved dialogues and switches between their complete transcripts', async () => {
    const user = userEvent.setup()
    render(<DialoguePage />)

    const chooser = screen.getByRole('group', { name: 'Choose a dialogue' })
    expect(within(chooser).getAllByRole('button')).toHaveLength(2)
    const firstDialogue = within(chooser).getByRole('button', { name: 'Hello, I am Mina' })
    const secondDialogue = within(chooser).getByRole('button', { name: 'Who are you?' })
    expect(firstDialogue).toHaveAttribute('aria-pressed', 'true')
    expect(within(firstDialogue).getByText('Selected dialogue')).toBeVisible()
    expect(within(secondDialogue).queryByText('Selected dialogue')).not.toBeInTheDocument()
    expect(screen.getByText('안녕하세요.')).toBeVisible()

    await user.click(secondDialogue)

    expect(firstDialogue).toHaveAttribute('aria-pressed', 'false')
    expect(within(firstDialogue).queryByText('Selected dialogue')).not.toBeInTheDocument()
    expect(secondDialogue).toHaveAttribute('aria-pressed', 'true')
    expect(within(secondDialogue).getByText('Selected dialogue')).toBeVisible()
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
