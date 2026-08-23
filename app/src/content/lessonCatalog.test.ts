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
})
