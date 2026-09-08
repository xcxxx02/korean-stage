import { describe, expect, it } from 'vitest'
import { course, courseLessons, getLessonBySlug } from './course'

describe('public lesson catalog', () => {
  it('exposes seven Lec 1-derived public lesson slugs', () => {
    expect(courseLessons.map((lesson) => lesson.slug)).toEqual([
      'lesson-1', 'lesson-2', 'lesson-3', 'lesson-4',
      'lesson-5', 'lesson-6', 'lesson-7',
    ])
    expect(getLessonBySlug('lesson-3')?.id).toBe('unit-3')
    expect(getLessonBySlug('unit-3')).toBeUndefined()
  })

  it('supplies learner-facing team and dialogue presentation copy', () => {
    expect(course.members.every((member) => member.role && member.contribution)).toBe(true)
    expect(course.dialogues.every((dialogue) => dialogue.scenario)).toBe(true)
  })

  it('marks country vocabulary as supporting and leaves assessed occupation recordings unassigned', () => {
    const countries = course.vocabulary.filter((item) => item.unitId === 'unit-2')
    const occupations = course.vocabulary.filter((item) => item.unitId === 'unit-3')

    expect(countries).toHaveLength(8)
    expect(countries.every((item) => item.assessmentStatus === 'supporting')).toBe(true)
    expect(countries.every((item) => item.recordingRequirement === 'not-required' && item.ownerId === null)).toBe(true)
    expect(occupations).toHaveLength(8)
    expect(occupations.every((item) => item.assessmentStatus === 'assessed')).toBe(true)
    expect(occupations.every((item) => item.recordingRequirement === 'member-recording-required' && item.ownerId === null)).toBe(true)
  })
})
