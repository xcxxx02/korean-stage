export type CourseProgress = {
  completedUnitIds: string[]
  completedVocabularyIds: string[]
  exerciseResults: Record<string, boolean>
  lastPath: string
}

const storageKey = 'korean-stage-progress-v1'

const createDefaultProgress = (): CourseProgress => ({
  completedUnitIds: [],
  completedVocabularyIds: [],
  exerciseResults: {},
  lastPath: '/learn/unit-1',
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

const defaultStorage = (): Storage | undefined => {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

export function readProgress(storage: Storage | undefined = defaultStorage()): CourseProgress {
  if (!storage) return createDefaultProgress()

  try {
    const saved = storage.getItem(storageKey)
    if (saved === null) return createDefaultProgress()

    const parsed: unknown = JSON.parse(saved)
    if (isCourseProgress(parsed)) return parsed

    storage.removeItem(storageKey)
  } catch {
    try {
      storage.removeItem(storageKey)
    } catch {
      // Storage can be disabled independently for every operation.
    }
  }

  return createDefaultProgress()
}

export function writeProgress(progress: CourseProgress, storage: Storage | undefined = defaultStorage()): void {
  if (!storage) return

  try {
    storage.setItem(storageKey, JSON.stringify(progress))
  } catch {
    // Progress remains usable in memory when persistence is unavailable.
  }
}
