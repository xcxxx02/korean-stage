import { useCallback, useState } from 'react'
import { readProgress, writeProgress, type CourseProgress } from '../progress/progressStore'

type CourseProgressActions = {
  progress: CourseProgress
  markUnitComplete: (unitId: string) => void
  markVocabularyComplete: (itemId: string) => void
  recordExerciseResult: (exerciseId: string, correct: boolean) => void
}

export function useCourseProgress(): CourseProgressActions {
  const [progress, setProgress] = useState<CourseProgress>(() => readProgress())

  const updateProgress = useCallback((update: (current: CourseProgress) => CourseProgress) => {
    setProgress((current) => {
      const next = update(current)
      writeProgress(next)
      return next
    })
  }, [])

  const markUnitComplete = useCallback((unitId: string) => {
    updateProgress((current) => ({
      ...current,
      completedUnitIds: current.completedUnitIds.includes(unitId)
        ? current.completedUnitIds
        : [...current.completedUnitIds, unitId],
      lastPath: `/learn/${unitId}`,
    }))
  }, [updateProgress])

  const markVocabularyComplete = useCallback((itemId: string) => {
    updateProgress((current) => ({
      ...current,
      completedVocabularyIds: current.completedVocabularyIds.includes(itemId)
        ? current.completedVocabularyIds
        : [...current.completedVocabularyIds, itemId],
      lastPath: '/vocabulary',
    }))
  }, [updateProgress])

  const recordExerciseResult = useCallback((exerciseId: string, correct: boolean) => {
    updateProgress((current) => ({
      ...current,
      exerciseResults: { ...current.exerciseResults, [exerciseId]: correct },
      lastPath: '/practice',
    }))
  }, [updateProgress])

  return { progress, markUnitComplete, markVocabularyComplete, recordExerciseResult }
}
