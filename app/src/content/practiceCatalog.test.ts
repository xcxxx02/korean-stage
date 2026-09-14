import { describe, expect, it } from 'vitest'
import { course } from './course'
import { practiceGroups } from './practiceCatalog'

describe('practice catalog', () => {
  it('groups every assessed question by the lesson that taught it', () => {
    expect(practiceGroups.map((group) => group.lessonSlug)).toEqual([
      'vocabulary-1', 'vocabulary-2', 'grammar-1', 'grammar-2',
    ])
    expect(practiceGroups.map((group) => group.title)).toEqual([
      'Countries & Nationalities',
      'Jobs & Occupations',
      'Talking about who someone is',
      'Saying what someone is not',
    ])
    expect(practiceGroups.map((group) => group.exercises.length)).toEqual([9, 9, 6, 3])
    expect(practiceGroups.flatMap((group) => group.exercises)).toHaveLength(27)
  })

  it('derives beginner-safe vocabulary questions from the lesson words', () => {
    const jobs = practiceGroups.find((group) => group.id === 'vocabulary-2')!
    expect(jobs.exercises[0]).toMatchObject({
      id: 'student-meaning',
      grammarId: 'vocabulary-2',
      type: 'multiple-choice',
      prompt: 'Choose the English meaning of 학생.',
      koreanContext: '학생',
      choices: ['Student', 'Teacher', 'Engineer'],
      answer: 'Student',
      answerLanguage: 'en',
      explanation: '학생 means Student.',
    })
    expect(jobs.exercises.every((exercise) => exercise.type !== 'matching' && exercise.choices.includes(exercise.answer))).toBe(true)
  })

  it('reuses all three required exercises for each grammar lesson without changing them', () => {
    for (const grammarPoint of course.grammar) {
      const group = practiceGroups.find((candidate) => candidate.id === grammarPoint.unitId)!
      expect(group.exercises).toEqual(grammarPoint.exercises)
      expect(group.exercises).toHaveLength(grammarPoint.unitId === 'grammar-1' ? 6 : 3)
      expect(group.exercises.every((exercise) => exercise.answerLanguage === 'ko')).toBe(true)
    }
  })
})
