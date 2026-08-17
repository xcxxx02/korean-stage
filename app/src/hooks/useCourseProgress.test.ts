import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { readProgress } from '../progress/progressStore'
import { useCourseProgress } from './useCourseProgress'

describe('useCourseProgress', () => {
  beforeEach(() => localStorage.clear())

  it('marks a unit complete once and persists the unit location', () => {
    const { result } = renderHook(() => useCourseProgress())

    act(() => {
      result.current.markUnitComplete('unit-3')
      result.current.markUnitComplete('unit-3')
    })

    expect(result.current.progress.completedUnitIds).toEqual(['unit-3'])
    expect(readProgress(localStorage)).toMatchObject({
      completedUnitIds: ['unit-3'],
      lastPath: '/learn/unit-3',
    })
  })

  it('persists completed vocabulary without duplicates', () => {
    const { result } = renderHook(() => useCourseProgress())

    act(() => {
      result.current.markVocabularyComplete('china')
      result.current.markVocabularyComplete('china')
    })

    expect(readProgress(localStorage).completedVocabularyIds).toEqual(['china'])
  })

  it('persists the latest result for each exercise', () => {
    const { result } = renderHook(() => useCourseProgress())

    act(() => result.current.recordExerciseResult('ieyo-yeyo-1', false))
    act(() => result.current.recordExerciseResult('ieyo-yeyo-1', true))

    expect(readProgress(localStorage).exerciseResults).toEqual({ 'ieyo-yeyo-1': true })
  })
})
