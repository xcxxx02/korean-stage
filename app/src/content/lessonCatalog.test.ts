import { describe, expect, it } from 'vitest'
import { course, courseLessons, getLessonBySlug } from './course'

describe('public lesson catalog', () => {
  it('exposes two vocabulary and two grammar slugs', () => {
    expect(courseLessons.map((lesson) => lesson.slug)).toEqual([
      'countries', 'occupations', 'identity', 'negative-identity',
    ])
    expect(getLessonBySlug('occupations')?.id).toBe('vocabulary-2')
    expect(getLessonBySlug('lesson-3')).toBeUndefined()
  })

  it('supplies learner-facing team and dialogue presentation copy', () => {
    expect(course.members.every((member) => member.role && member.contribution)).toBe(true)
    expect(course.dialogues.every((dialogue) => dialogue.scenario)).toBe(true)
  })

  it('marks all vocabulary for recording and preserves the confirmed member allocation', () => {
    const countries = course.vocabulary.filter((item) => item.unitId === 'vocabulary-1')
    const occupations = course.vocabulary.filter((item) => item.unitId === 'vocabulary-2')

    expect(countries).toHaveLength(9)
    expect(countries.every((item) => item.assessmentStatus === 'assessed')).toBe(true)
    expect(countries.every((item) => item.recordingRequirement === 'member-recording-required' && item.ownerId !== null)).toBe(true)
    expect(countries.slice(0, 4).every((item) => item.ownerId === 'member-1')).toBe(true)
    expect(countries.slice(4).every((item) => item.ownerId === 'member-2')).toBe(true)
    expect(occupations).toHaveLength(9)
    expect(occupations.every((item) => item.assessmentStatus === 'assessed')).toBe(true)
    expect(occupations.every((item) => item.recordingRequirement === 'member-recording-required' && item.ownerId !== null)).toBe(true)
    expect(occupations.slice(0, 4).every((item) => item.ownerId === 'member-3')).toBe(true)
    expect(occupations.slice(4).every((item) => item.ownerId === 'member-4')).toBe(true)
    expect(occupations.slice(4).every((item) => item.audio.kind === 'human-recording' && item.video.kind === 'human-recording')).toBe(true)
  })
})
