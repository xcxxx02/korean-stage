import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TeamPage } from '../pages/TeamPage'

describe('SubmissionReadiness', () => {
  it('keeps the real development course not ready while distinguishing complete structure from missing submission content', () => {
    render(<TeamPage />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'AI-generated voices receive 0 marks and must never be added.',
    )
    expect(screen.getByRole('heading', { name: 'Not ready for submission' })).toBeInTheDocument()

    const needsContent = screen.getByRole('region', { name: 'Needs content' })
    expect(within(needsContent).getByText('Member 1 — add a real name and student ID.')).toBeInTheDocument()
    expect(within(needsContent).getByText('Member 2 — add a real name and student ID.')).toBeInTheDocument()

    const missingVocabulary = [
      ['학생', 'Student'],
      ['선생님', 'Teacher'],
      ['회사원', 'Office worker'],
      ['기자', 'Reporter'],
      ['의사', 'Doctor'],
      ['가수', 'Singer'],
      ['군인', 'Soldier'],
      ['요리사', 'Chef'],
    ]
    for (const [korean, english] of missingVocabulary) {
      expect(within(needsContent).getByText(`${korean} / ${english} — add human-recorded video and audio.`)).toBeInTheDocument()
    }

    expect(within(needsContent).getByText('Hello, I am Mina — add a human-recorded dialogue video.')).toBeInTheDocument()
    expect(within(needsContent).getByText('Who are you? — add a human-recorded dialogue video.')).toBeInTheDocument()

    const passed = screen.getByRole('region', { name: 'Passed' })
    for (const check of [
      'Member vocabulary counts',
      'Grammar point count',
      'Exercises per grammar point',
      'Dialogue count',
      'Dialogue line counts',
      'Primary navigation',
      'Website name',
      'Course purpose',
    ]) {
      expect(within(passed).getByText(check)).toBeInTheDocument()
    }

    const humanReview = within(needsContent).getAllByText('Human review required')
    expect(humanReview).toHaveLength(4)
    expect(within(passed).queryByText(/pronunciation|acting|lighting|background noise/i)).not.toBeInTheDocument()
  })
})
