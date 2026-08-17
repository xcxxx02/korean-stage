import { course, courseUnits } from '../content/course'

export type CourseProgress = {
  completedUnitIds: string[]
  completedVocabularyIds: string[]
  exerciseResults: Record<string, boolean>
  lastPath: string
}

const storageKey = 'korean-stage-progress-v1'
const firstUnitPath = `/learn/${courseUnits[0].id}`
const currentUnitIds = new Set<string>(courseUnits.map((unit) => unit.id))
const currentVocabularyIds = new Set(course.vocabulary.map((item) => item.id))
const currentExerciseIds = new Set(course.grammar.flatMap((grammar) => grammar.exercises.map((exercise) => exercise.id)))
const supportedLastPaths = new Set([
  '/learn',
  ...courseUnits.map((unit) => `/learn/${unit.id}`),
  '/vocabulary',
  '/grammar',
  '/practice',
  '/dialogue',
  '/team',
])

const createDefaultProgress = (): CourseProgress => ({
  completedUnitIds: [],
  completedVocabularyIds: [],
  exerciseResults: {},
  lastPath: firstUnitPath,
})

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isExerciseResults = (value: unknown): value is Record<string, boolean> =>
  typeof value === 'object'
  && value !== null
  && !Array.isArray(value)
  && Object.values(value).every((result) => typeof result === 'boolean')

const isCourseProgress = (value: unknown): value is CourseProgress => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

  const progress = value as Record<string, unknown>
  return isStringArray(progress.completedUnitIds)
    && isStringArray(progress.completedVocabularyIds)
    && isExerciseResults(progress.exerciseResults)
    && typeof progress.lastPath === 'string'
}

const sanitizeProgress = (progress: CourseProgress): CourseProgress => {
  const exerciseResults = Object.fromEntries(
    Object.entries(progress.exerciseResults).filter(([id]) => currentExerciseIds.has(id)),
  )
  const grammarUnitIds = new Set<string>(course.grammar.map((grammarPoint) => grammarPoint.unitId))
  const completedNonGrammarUnits = [...new Set(
    progress.completedUnitIds.filter((id) => currentUnitIds.has(id) && !grammarUnitIds.has(id)),
  )]
  const completedGrammarUnits = course.grammar
    .filter((grammarPoint) => grammarPoint.exercises.every((exercise) => exerciseResults[exercise.id] === true))
    .map((grammarPoint) => grammarPoint.unitId)

  return {
    completedUnitIds: [...completedNonGrammarUnits, ...completedGrammarUnits],
    completedVocabularyIds: [...new Set(progress.completedVocabularyIds.filter((id) => currentVocabularyIds.has(id)))],
    exerciseResults,
    lastPath: supportedLastPaths.has(progress.lastPath) ? progress.lastPath : firstUnitPath,
  }
}

const removeSavedProgress = (storage: Storage) => {
  try {
    storage.removeItem(storageKey)
  } catch {
    // Storage can be disabled independently for every operation.
  }
}

const defaultStorage = (): Storage | undefined => {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

export function readProgress(storage: Storage | undefined = defaultStorage()): CourseProgress {
  if (!storage) return createDefaultProgress()

  let saved: string | null
  try {
    saved = storage.getItem(storageKey)
  } catch {
    return createDefaultProgress()
  }
  if (saved === null) return createDefaultProgress()

  let parsed: unknown
  try {
    parsed = JSON.parse(saved)
  } catch {
    removeSavedProgress(storage)
    return createDefaultProgress()
  }

  if (!isCourseProgress(parsed)) {
    removeSavedProgress(storage)
    return createDefaultProgress()
  }

  const sanitized = sanitizeProgress(parsed)
  if (JSON.stringify(sanitized) !== JSON.stringify(parsed)) writeProgress(sanitized, storage)

  return sanitized
}

export function writeProgress(progress: CourseProgress, storage: Storage | undefined = defaultStorage()): void {
  if (!storage) return

  try {
    storage.setItem(storageKey, JSON.stringify(progress))
  } catch {
    // Progress remains usable in memory when persistence is unavailable.
  }
}
