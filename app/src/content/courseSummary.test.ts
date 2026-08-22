import { describe, expect, it } from 'vitest'
import { course } from './course'
import { getCourseSummary } from './courseSummary'

describe('getCourseSummary', () => {
  it('derives every Home overview count from the supplied typed course data', () => {
    const smallerCourse = {
      ...course,
      vocabulary: course.vocabulary.slice(0, 5),
      grammar: course.grammar.slice(0, 2).map((grammarPoint) => ({
        ...grammarPoint,
        exercises: grammarPoint.exercises.slice(0, 2),
      })),
      dialogues: course.dialogues.slice(0, 1),
    }

    expect(getCourseSummary(smallerCourse)).toEqual({
      vocabularyCount: 5,
      grammarPointCount: 2,
      exercisesPerGrammarPoint: 2,
      dialogueCount: 1,
    })
  })
})
