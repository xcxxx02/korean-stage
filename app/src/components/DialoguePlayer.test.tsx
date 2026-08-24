import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { course } from '../content/course'
import { validCourse } from '../test/fixtures'
import { DialoguePage } from '../pages/DialoguePage'
import { DialoguePlayer } from './DialoguePlayer'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

beforeEach(() => localStorage.clear())

describe('DialoguePlayer', () => {
  it('shows the scenario, English role labels, one primary video area, and a bilingual transcript', () => {
    const dialogue = course.dialogues[0]
    render(<DialoguePlayer dialogue={dialogue} members={course.members} />)

    expect(screen.getByRole('heading', { name: dialogue.title })).toBeVisible()
    expect(screen.getByText(dialogue.scenario)).toBeVisible()
    expect(screen.getByText('Member 1 and Member 2').parentElement).toHaveTextContent('Roles: Member 1 and Member 2')
    expect(screen.getAllByLabelText(`${dialogue.title} role-play video transcript`)).toHaveLength(1)

    const transcript = screen.getByRole('list', { name: 'Bilingual dialogue transcript' })
    const lines = within(transcript).getAllByRole('listitem')
    expect(lines).toHaveLength(8)
    expect(lines[0]).toHaveTextContent('Line 1 · Member 1')
    expect(within(lines[0]).getByText('안녕하세요.')).toHaveAttribute('lang', 'ko')
    expect(within(lines[0]).getByText('Hello.')).toHaveAttribute('lang', 'en')
  })

  it('does not show line selection, line audio, or contributor recording instructions', () => {
    render(<DialoguePlayer dialogue={course.dialogues[0]} members={course.members} />)

    expect(screen.queryByRole('button', { name: /Select line/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Listen to line/i })).not.toBeInTheDocument()
    expect(screen.queryByText('Current line')).not.toBeInTheDocument()
    expect(screen.queryByText('Role-play recording checklist')).not.toBeInTheDocument()
    expect(screen.queryByText('Study second')).not.toBeInTheDocument()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
  })

  it('keeps missing dialogue media honest and non-playable', () => {
    render(<DialoguePlayer dialogue={course.dialogues[0]} members={course.members} />)

    expect(screen.getByRole('heading', { name: 'Dialogue video coming soon' })).toBeVisible()
    expect(screen.getByText('This dialogue still needs a real recording from Member 1 and Member 2.')).toBeVisible()
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument()
    expect(document.querySelector('video')).not.toBeInTheDocument()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
  })

  it('renders one supplied human role-play video without line-level media', () => {
    const dialogue = validCourse.dialogues[0]
    render(<DialoguePlayer dialogue={dialogue} members={validCourse.members} />)

    const video = screen.getByLabelText('Dialogue 1 role-play video')
    expect(video).toHaveAttribute('controls')
    expect(video.querySelector('source')).toHaveAttribute('src', '/media/dialogues/dialogue-1.mp4')
    expect(document.querySelectorAll('video')).toHaveLength(1)
    expect(document.querySelector('audio')).not.toBeInTheDocument()
  })
})

describe('DialoguePage', () => {
  it('offers exactly two coursework dialogues and renders only the selected dialogue', async () => {
    const user = userEvent.setup()
    render(<DialoguePage />)

    const chooser = screen.getByRole('group', { name: 'Choose a dialogue' })
    const firstDialogue = within(chooser).getByRole('button', { name: 'Hello, I am Mina' })
    const secondDialogue = within(chooser).getByRole('button', { name: 'Who are you?' })
    expect(within(chooser).getAllByRole('button')).toHaveLength(2)
    expect(firstDialogue).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Meeting someone for the first time')).toBeVisible()
    expect(screen.queryByText('Talking about jobs')).not.toBeInTheDocument()
    expect(screen.getAllByLabelText(/role-play video transcript/)).toHaveLength(1)

    await user.click(secondDialogue)

    expect(firstDialogue).toHaveAttribute('aria-pressed', 'false')
    expect(secondDialogue).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByText('Meeting someone for the first time')).not.toBeInTheDocument()
    expect(screen.getByText('Talking about jobs')).toBeVisible()
    expect(screen.getByText('다니엘은 학생이에요?')).toHaveAttribute('lang', 'ko')
    expect(screen.getByText('Daniel, are you a student?')).toHaveAttribute('lang', 'en')
    expect(screen.getAllByLabelText(/role-play video transcript/)).toHaveLength(1)
  })

  it('does not write learner progress or show completion controls', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const user = userEvent.setup()
    render(<DialoguePage />)

    await user.click(screen.getByRole('button', { name: 'Who are you?' }))

    expect(setItem).not.toHaveBeenCalled()
    expect(localStorage.length).toBe(0)
    expect(screen.queryByRole('button', { name: /Mark Unit 7 complete/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/Unit 7 complete/i)).not.toBeInTheDocument()
  })
})
