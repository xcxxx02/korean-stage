import { describe, expect, it } from 'vitest'
import { course } from './course'

const yiSiangVocabulary = ['doctor', 'nurse', 'firefighter', 'pharmacist', 'police-officer']

const vocabularyAssignments = {
  'member-1': ['thailand', 'vietnam', 'philippines', 'singapore'],
  'member-2': ['indonesia', 'spain', 'italy', 'brazil', 'new-zealand'],
  'member-3': ['student', 'teacher', 'engineer', 'designer'],
  'member-4': yiSiangVocabulary,
} as const

describe('Yi Siang vocabulary recordings', () => {
  it('assigns each recorded occupation to Yi Siang with browser-compatible video and audio', () => {
    const items = yiSiangVocabulary.map((id) => course.vocabulary.find((item) => item.id === id))

    expect(items.every(Boolean)).toBe(true)
    for (const item of items) {
      expect(item).toMatchObject({
        ownerId: 'member-4',
        video: {
          kind: 'human-recording',
          src: `/media/vocabulary/yi-siang/${item!.id}.mp4`,
        },
        audio: {
          kind: 'human-recording',
          src: `/media/vocabulary/yi-siang/${item!.id}.m4a`,
        },
      })
    }
  })

  it('shows Yi Siang recording responsibility in the team information', () => {
    const yiSiang = course.members.find((member) => member.id === 'member-4')

    expect(yiSiang).toMatchObject({
      fullName: 'LAM YI SIANG',
      role: 'Vocabulary presenter',
    })
    expect(yiSiang?.contribution).toContain('Doctor, Nurse, Firefighter, Pharmacist, and Police officer')
  })

  it('records the complete four-member vocabulary allocation', () => {
    for (const [memberId, vocabularyIds] of Object.entries(vocabularyAssignments)) {
      expect(course.vocabulary.filter((item) => item.ownerId === memberId).map((item) => item.id)).toEqual(vocabularyIds)
    }
  })
})
