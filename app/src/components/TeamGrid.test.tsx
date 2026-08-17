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

  it('renders all six member contributions without a two-person assumption', () => {
    const extraMembers = [3, 4, 5, 6].map((number) => ({
      id: `member-${number}`,
      name: `Member ${number}`,
      studentId: `ID-${number}`,
      isDevelopmentIdentity: false,
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
  ])('marks a member with a %s for replacement', (_case, identityOverride) => {
    const partialIdentityCourse = {
      ...validCourse,
      members: validCourse.members.map((member, index) =>
        index === 0 ? { ...member, ...identityOverride, isDevelopmentIdentity: false } : member,
      ),
    }

    render(<TeamGrid course={partialIdentityCourse} />)

    const firstMemberCard = screen.getAllByRole('article')[0]
    expect(within(firstMemberCard).getByText('Replace before submission')).toBeInTheDocument()
  })
})
