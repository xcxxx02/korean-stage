import type { Course } from './types'

export type CourseSummary = {
  vocabularyCount: number
  grammarPointCount: number
  exercisesPerGrammarPoint: number | null
  dialogueCount: number
}

export function getCourseSummary(course: Course): CourseSummary {
  const exerciseCounts = new Set(course.grammar.map((grammarPoint) => grammarPoint.exercises.length))

  return {
    vocabularyCount: course.vocabulary.length,
    grammarPointCount: course.grammar.length,
    exercisesPerGrammarPoint: exerciseCounts.size === 1 ? course.grammar[0]?.exercises.length ?? null : null,
    dialogueCount: course.dialogues.length,
  }
}
