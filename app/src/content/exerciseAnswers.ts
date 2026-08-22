import type { Exercise, ExerciseAnswer } from './types'

const isMatchingAnswer = (answer: ExerciseAnswer | undefined): answer is Record<string, string> =>
  typeof answer === 'object' && answer !== null && !Array.isArray(answer)

export function createCorrectExerciseAnswer(exercise: Exercise): ExerciseAnswer {
  if (exercise.type !== 'matching') return exercise.answer
  return Object.fromEntries(exercise.pairs.map((pair) => [pair.id, pair.english]))
}

export function isExerciseAnswerComplete(exercise: Exercise, answer: ExerciseAnswer | undefined): boolean {
  if (exercise.type !== 'matching') return typeof answer === 'string' && answer.length > 0
  return isMatchingAnswer(answer) && exercise.pairs.every((pair) => Boolean(answer[pair.id]))
}

export function isExerciseAnswerCorrect(exercise: Exercise, answer: ExerciseAnswer | undefined): boolean {
  if (!isExerciseAnswerComplete(exercise, answer)) return false
  if (exercise.type !== 'matching') return answer === exercise.answer
  if (!isMatchingAnswer(answer)) return false
  return exercise.pairs.every((pair) => answer[pair.id] === pair.english)
}

export function formatCorrectExerciseAnswer(exercise: Exercise): string {
  if (exercise.type !== 'matching') return exercise.answer
  return exercise.pairs.map((pair) => `${pair.korean} — ${pair.english}`).join('; ')
}

export function formatExerciseAnswer(exercise: Exercise, answer: ExerciseAnswer): string {
  if (exercise.type !== 'matching') return typeof answer === 'string' ? answer : ''
  if (!isMatchingAnswer(answer)) return ''
  return exercise.pairs.map((pair) => `${pair.korean} — ${answer[pair.id] || 'No match'}`).join('; ')
}
