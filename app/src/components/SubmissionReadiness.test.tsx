import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { course } from '../content/course'
import { validCourse } from '../test/fixtures'
import { appRouteManifest } from '../navigation'
import { TeamPage } from '../pages/TeamPage'
import { SubmissionReadiness } from './SubmissionReadiness'

const developmentMissingMedia = { src: null, kind: 'development-missing' as const }

afterEach(cleanup)

function courseWithAiOnlyProhibition() {
  return {
    ...validCourse,
    vocabulary: [
      ...validCourse.vocabulary,
      {
        ...validCourse.vocabulary[0],
        id: 'unowned-ai-reference',
        ownerId: null,
        assessmentStatus: 'supporting' as const,
        recordingRequirement: 'not-required' as const,
        audio: { src: '/media/reference/ai.mp3', kind: 'ai-generated' as const },
      },
    ],
  }
}

describe('SubmissionReadiness', () => {
  it('keeps the Team page learner-facing unless the development readiness query is enabled', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/team']}>
        <TeamPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Meet the team' })).toBeVisible()
    for (const member of course.members) {
      const memberCard = screen.getByRole('article', { name: `${member.name} contribution` })
      expect(within(memberCard).getByText(member.role)).toBeVisible()
      expect(within(memberCard).getByText(member.contribution)).toBeVisible()
    }
    expect(screen.queryByText('Submission readiness')).not.toBeInTheDocument()
    expect(screen.queryByText('Replace before submission')).not.toBeInTheDocument()

    unmount()
    render(
      <MemoryRouter initialEntries={['/team?readiness=1']}>
        <TeamPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Submission readiness')).toBeVisible()
  })

  it('keeps the real development course not ready while distinguishing complete structure from missing submission content', () => {
    render(<SubmissionReadiness course={course} />)

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
    expect(within(passed).queryByText('Dialogue video durations')).not.toBeInTheDocument()
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
    expect(humanReview).toHaveLength(6)
    expect(within(needsContent).getByText('Intonation')).toBeInTheDocument()
    expect(within(needsContent).getByText('Uninterrupted verbal flow')).toBeInTheDocument()
    expect(within(passed).queryByText(/pronunciation|acting|lighting|background noise/i)).not.toBeInTheDocument()
  })

  it('sends a complete human-recorded course to human review without calling it ready for submission', () => {
    render(<SubmissionReadiness course={validCourse} />)

    expect(screen.getByRole('heading', { name: 'Ready for human review' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Not ready for submission' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Needs content' })).toHaveTextContent('No automated content gaps detected.')
    expect(screen.getAllByText('Human review required')).toHaveLength(6)
  })

  it('keeps an otherwise complete course not ready and names each missing Unit 1 model audio owner', () => {
    const missingIntroductionAudio = {
      ...validCourse,
      introductionModels: validCourse.introductionModels.map((model) => ({
        ...model,
        audio: developmentMissingMedia,
      })),
    }

    render(<SubmissionReadiness course={missingIntroductionAudio} />)

    expect(screen.getByRole('heading', { name: 'Not ready for submission' })).toBeInTheDocument()
    const needsContent = screen.getByRole('region', { name: 'Needs content' })
    expect(within(needsContent).getByText('안녕하세요? / Hello. — Amina Rahman: add human-recorded audio.')).toBeInTheDocument()
    expect(within(needsContent).getByText('저는 다니엘이에요. / I am Daniel. — Daniel Lee: add human-recorded audio.')).toBeInTheDocument()
  })

  it('blocks readiness when the required self-introduction model is absent', () => {
    render(<SubmissionReadiness course={{
      ...validCourse,
      introductionModels: [validCourse.introductionModels[0]],
    }} />)

    expect(screen.getByRole('heading', { name: 'Not ready for submission' })).toBeVisible()
    expect(screen.getByRole('region', { name: 'Needs content' })).toHaveTextContent(
      'Keep exactly two distinct Unit 1 models: greeting and self-introduction.',
    )
    expect(screen.getByRole('region', { name: 'Passed' })).not.toHaveTextContent('Unit 1 introduction models')
  })

  it('names every malformed self-introduction field and its invalid owner', () => {
    const malformedCourse = {
      ...validCourse,
      introductionModels: validCourse.introductionModels.map((model) => model.id === 'self-introduction'
        ? {
            ...model,
            korean: '',
            english: '',
            romanization: '',
            pronunciationHint: '',
            audioLabel: '',
            ownerId: 'former-member',
          }
        : model),
    }

    render(<SubmissionReadiness course={malformedCourse} />)

    expect(screen.getByRole('heading', { name: 'Not ready for submission' })).toBeVisible()
    expect(screen.getByRole('region', { name: 'Needs content' })).toHaveTextContent(
      'Self-introduction model — add Korean, English, romanization, pronunciation guidance, and audio label and assign an existing member.',
    )
  })

  it.each([
    ['missing', { src: null, kind: 'development-missing' as const }],
    ['AI-generated', { src: '/media/dialogues/ai.mp4', kind: 'ai-generated' as const, durationSeconds: 90 }],
    ['inconsistent development', { src: '/media/dialogues/placeholder.mp4', kind: 'development-missing' as const, durationSeconds: 90 }],
  ])('does not pass dialogue duration when the full video is %s', (_label, video) => {
    const invalidCourse = {
      ...validCourse,
      dialogues: [{ ...validCourse.dialogues[0], video }, validCourse.dialogues[1]],
    }

    render(<SubmissionReadiness course={invalidCourse} />)

    expect(screen.getByRole('region', { name: 'Passed' })).not.toHaveTextContent('Dialogue video durations')
    expect(screen.getByRole('region', { name: 'Needs content' })).toHaveTextContent('Dialogue 1 — add a human-recorded dialogue video.')
  })

  it('reports an AI-only violation in Prohibited without inventing a content gap', () => {
    render(<SubmissionReadiness course={courseWithAiOnlyProhibition()} />)

    expect(screen.getByRole('heading', { name: 'Not ready for submission' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Prohibited' })).toHaveTextContent('Remove every AI-generated voice before submission.')
    expect(screen.getByRole('region', { name: 'Needs content' })).toHaveTextContent('No automated content gaps detected.')
  })

  it('names only the missing vocabulary media source', () => {
    const singleMissingAudio = {
      ...validCourse,
      vocabulary: validCourse.vocabulary.map((item, index) =>
        index === 0 ? { ...item, audio: developmentMissingMedia } : item,
      ),
    }

    render(<SubmissionReadiness course={singleMissingAudio} />)

    const needsContent = screen.getByRole('region', { name: 'Needs content' })
    expect(within(needsContent).getByText('한국어 1 / Word 1 — add human-recorded audio.')).toBeInTheDocument()
    expect(within(needsContent).queryByText(/한국어 1 \/ Word 1 — add human-recorded video and audio\./)).not.toBeInTheDocument()
  })

  it('names only dialogue lines whose audio is missing', () => {
    const oneMissingLineAudio = {
      ...validCourse,
      dialogues: validCourse.dialogues.map((dialogue, dialogueIndex) =>
        dialogueIndex === 0
          ? {
              ...dialogue,
              lines: dialogue.lines.map((line, lineIndex) =>
                lineIndex === 0 ? { ...line, audio: developmentMissingMedia } : line,
              ),
            }
          : dialogue,
      ),
    }

    render(<SubmissionReadiness course={oneMissingLineAudio} />)

    const needsContent = screen.getByRole('region', { name: 'Needs content' })
    expect(within(needsContent).getByText('Dialogue 1 — add human-recorded audio to line 1.')).toBeInTheDocument()
    expect(within(needsContent).queryByText('Dialogue 1 — add human-recorded audio to every dialogue line.')).not.toBeInTheDocument()
  })

  it.each([
    ['name', { name: '   ' }, 'A12345 — add a real name.'],
    ['student ID', { studentId: '   ' }, 'Amina Rahman — add a real student ID.'],
  ])('identifies the exact missing %s for a partial member identity', (_field, identityOverride, expectedAction) => {
    const partialIdentity = {
      ...validCourse,
      members: validCourse.members.map((member, index) =>
        index === 0 ? { ...member, ...identityOverride, isDevelopmentIdentity: false } : member,
      ),
    }

    render(<SubmissionReadiness course={partialIdentity} />)

    expect(screen.getByRole('region', { name: 'Needs content' })).toHaveTextContent(expectedAction)
  })

  it('shows prohibited and precise missing-media actions together', () => {
    const aiAndMissingVideo = {
      ...courseWithAiOnlyProhibition(),
      vocabulary: courseWithAiOnlyProhibition().vocabulary.map((item, index) =>
        index === 1 ? { ...item, video: developmentMissingMedia } : item,
      ),
    }

    render(<SubmissionReadiness course={aiAndMissingVideo} />)

    expect(screen.getByRole('region', { name: 'Needs content' })).toHaveTextContent(
      '한국어 2 / Word 2 — add human-recorded video.',
    )
    expect(screen.getByRole('region', { name: 'Prohibited' })).toHaveTextContent(
      'Remove every AI-generated voice before submission.',
    )
  })

  it('does not pass navigation when a required registered route is missing', () => {
    const routes = appRouteManifest.filter((route) => route.id !== 'team')

    render(<SubmissionReadiness course={validCourse} {...{ routes }} />)

    expect(screen.getByRole('heading', { name: 'Not ready for submission' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Passed' })).not.toHaveTextContent('Primary navigation')
    expect(screen.getByRole('region', { name: 'Needs content' })).toHaveTextContent(
      'Restore the Team primary navigation route at /team.',
    )
  })

  it('does not pass exercises when the required interaction-mode mix is missing', () => {
    const courseWithoutMatching = {
      ...validCourse,
      grammar: validCourse.grammar.map((grammarPoint) => ({
        ...grammarPoint,
        exercises: grammarPoint.exercises.map((exercise) => exercise.type === 'matching'
          ? {
              id: exercise.id,
              grammarId: exercise.grammarId,
              answerLanguage: 'ko' as const,
              type: 'multiple-choice' as const,
              prompt: exercise.prompt,
              koreanContext: exercise.koreanContext,
              choices: ['정답'],
              answer: '정답',
              explanation: exercise.explanation,
            }
          : exercise),
      })),
    }

    render(<SubmissionReadiness course={courseWithoutMatching} />)

    expect(screen.getByRole('region', { name: 'Passed' })).not.toHaveTextContent('Exercises per grammar point')
    expect(screen.getByRole('region', { name: 'Needs content' })).toHaveTextContent(
      'Include multiple choice, particle selection, matching, and sentence completion across the nine exercises.',
    )
  })

  it.each([
    ['label', { id: 'team', path: 'team', primaryNavigationLabel: 'People' }],
    ['path', { id: 'team', path: 'people', primaryNavigationLabel: 'Team' }],
  ])('does not pass navigation when a required route has a mismatched %s', (_kind, mismatchedTeamRoute) => {
    const routes = appRouteManifest.map((route) => route.id === 'team' ? mismatchedTeamRoute : route)

    render(<SubmissionReadiness course={validCourse} {...{ routes }} />)

    expect(screen.getByRole('heading', { name: 'Not ready for submission' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Passed' })).not.toHaveTextContent('Primary navigation')
    expect(screen.getByRole('region', { name: 'Needs content' })).toHaveTextContent(
      'Restore the Team primary navigation route at /team.',
    )
  })

  it('does not pass navigation when Learn loses its direct Lesson 1 destination', () => {
    const routes = appRouteManifest.map((route) => route.id === 'learn'
      ? { id: 'learn', path: 'learn', primaryNavigationLabel: 'Learn' }
      : route)

    render(<SubmissionReadiness course={validCourse} {...{ routes }} />)

    expect(screen.getByRole('region', { name: 'Passed' })).not.toHaveTextContent('Primary navigation')
    expect(screen.getByRole('region', { name: 'Needs content' })).toHaveTextContent(
      'Restore the Learn primary navigation route at /learn/lesson-1.',
    )
  })
})
