import { describe, expect, it } from 'vitest'
import { course, courseLessons } from './course'
import { practiceGroups } from './practiceCatalog'

describe('practice catalog', () => {
  it('groups every assessed question by the lesson that taught it', () => {
    expect(practiceGroups.map((group) => group.lessonSlug)).toEqual([
      'lesson-2',
      'lesson-3',
      'lesson-4',
      'lesson-5',
      'lesson-6',
    ])
    expect(practiceGroups.map((group) => group.title)).toEqual([
      'Countries & Nationalities',
      'Jobs & Occupations',
      '이에요 / 예요 - to be',
      '은 / 는 - topic marker',
      '이 / 가 아니에요 - to not be',
    ])
    expect(practiceGroups.map((group) => group.exercises.length)).toEqual([8, 8, 3, 3, 3])
    expect(practiceGroups.flatMap((group) => group.exercises)).toHaveLength(25)
  })

  it('derives beginner-safe vocabulary questions from the lesson words', () => {
    const jobs = practiceGroups.find((group) => group.lessonSlug === 'lesson-3')!
    expect(jobs.exercises[0]).toMatchObject({
      id: 'student-meaning',
      grammarId: 'lesson-3',
      type: 'multiple-choice',
      prompt: 'Choose the English meaning of 학생.',
      koreanContext: '학생',
      choices: ['Student', 'Teacher', 'Office worker'],
      answer: 'Student',
      answerLanguage: 'en',
      explanation: '학생 means Student.',
    })
    expect(jobs.exercises.every((exercise) => exercise.type !== 'matching' && exercise.choices.includes(exercise.answer))).toBe(true)
  })

  it('reuses all three required exercises for each grammar lesson without changing them', () => {
    for (const grammarPoint of course.grammar) {
      const lesson = courseLessons.find((candidate) => candidate.id === grammarPoint.unitId)!
      const group = practiceGroups.find((candidate) => candidate.lessonSlug === lesson.slug)!
      expect(group.exercises).toEqual(grammarPoint.exercises)
      expect(group.exercises).toHaveLength(3)
      expect(group.exercises.every((exercise) => exercise.answerLanguage === 'ko')).toBe(true)
    }
  })
})
