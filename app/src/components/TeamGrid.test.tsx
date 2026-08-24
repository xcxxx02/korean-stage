import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { validCourse } from '../test/fixtures'
import { TeamGrid } from './TeamGrid'

afterEach(cleanup)

describe('TeamGrid', () => {
  it('renders the exact Lec 1 source statement and two named member contributions from data', () => {
    render(<TeamGrid course={validCourse} />)

    expect(screen.getByText('All seven units are adapted entirely from Lec 1')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
    for (const member of validCourse.members) {
      expect(screen.getByRole('article', { name: `${member.name} contribution` })).toBeInTheDocument()
    }
  })

  it('shows learner-facing roles, contributions, bilingual words, and dialogue titles without readiness copy', () => {
    render(<TeamGrid course={validCourse} />)

    for (const member of validCourse.members) {
      const memberCard = screen.getByRole('article', { name: `${member.name} contribution` })
      expect(within(memberCard).getByText(member.role)).toBeVisible()
      expect(within(memberCard).getByText(member.contribution)).toBeVisible()
    }

    expect(screen.getByText('한국어 1')).toHaveAttribute('lang', 'ko')
    expect(screen.getByText('Word 1')).toBeVisible()
    expect(within(screen.getByRole('article', { name: 'Amina Rahman contribution' })).getByText('Dialogue 1 · Dialogue 2')).toBeVisible()
    expect(screen.queryByText(/Replace before submission|count passed|Needs 3–5/i)).not.toBeInTheDocument()
  })

  it('renders all six member contributions without a two-person assumption', () => {
    const extraMembers = [3, 4, 5, 6].map((number) => ({
      id: `member-${number}`,
      name: `Member ${number}`,
      studentId: `ID-${number}`,
      isDevelopmentIdentity: false,
      role: 'Dialogue performer',
      contribution: 'Performs assigned dialogue lines.',
    }))
    const sixMemberCourse = { ...validCourse, members: [...validCourse.members, ...extraMembers] }

    render(<TeamGrid course={sixMemberCourse} />)

    expect(screen.getAllByRole('article')).toHaveLength(6)
    for (const member of sixMemberCourse.members) {
      expect(screen.getByRole('article', { name: `${member.name} contribution` })).toBeInTheDocument()
    }
  })

  it.each([
    ['blank name', { name: '   ' }],
    ['blank student ID', { studentId: '   ' }],
  ])('keeps an incomplete identity free of readiness labels in the learner-facing grid', (_case, identityOverride) => {
    const partialIdentityCourse = {
      ...validCourse,
      members: validCourse.members.map((member, index) =>
        index === 0 ? { ...member, ...identityOverride, isDevelopmentIdentity: false } : member,
      ),
    }

    render(<TeamGrid course={partialIdentityCourse} />)

    expect(screen.queryByText('Replace before submission')).not.toBeInTheDocument()
  })

  it('uses neutral empty states when a member has no words or dialogue lines', () => {
    const memberWithoutAssignments = validCourse.members[0]
    const incompleteCourse = {
      ...validCourse,
      vocabulary: validCourse.vocabulary.filter((item) => item.ownerId !== memberWithoutAssignments.id),
      dialogues: validCourse.dialogues.map((dialogue) => ({
        ...dialogue,
        lines: dialogue.lines.filter((line) => line.speakerId !== memberWithoutAssignments.id),
        speakerIds: dialogue.speakerIds.filter((speakerId) => speakerId !== memberWithoutAssignments.id),
      })),
    }

    render(<TeamGrid course={incompleteCourse} />)

    const memberCard = screen.getByRole('article', { name: `${memberWithoutAssignments.name} contribution` })
    expect(within(memberCard).getByText('No assigned words yet.')).toBeVisible()
    expect(within(memberCard).getByText('No dialogue titles yet.')).toBeVisible()
  })
})
