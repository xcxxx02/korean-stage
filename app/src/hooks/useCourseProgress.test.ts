import { act, renderHook } from '@testing-library/react'
import { createElement, StrictMode, type PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { readProgress } from '../progress/progressStore'
import { useCourseProgress } from './useCourseProgress'

const strictModeWrapper = ({ children }: PropsWithChildren) => createElement(StrictMode, null, children)

describe('useCourseProgress', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.unstubAllGlobals())

  it('skips the initial fallback write after a read failure but persists a later visit', () => {
    const writes: Array<{ key: string, value: string }> = []
    const partialFailureStorage: Storage = {
      length: 0,
      clear() {},
      getItem() {
        throw new Error('Temporary read failure')
      },
      key() {
        return null
      },
      removeItem() {},
      setItem(key, value) {
        writes.push({ key, value })
      },
    }
    vi.stubGlobal('localStorage', partialFailureStorage)

    const { result } = renderHook(() => useCourseProgress(), { wrapper: strictModeWrapper })

    expect(writes).toEqual([])

    act(() => result.current.visitUnit('unit-3'))

    expect(writes).toHaveLength(1)
    expect(writes[0].key).toBe('korean-stage-progress-v1')
    expect(JSON.parse(writes[0].value)).toMatchObject({ lastPath: '/learn/unit-3' })
  })

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

  it('keeps a correct exercise result true after a later wrong submission', () => {
    const { result } = renderHook(() => useCourseProgress())

    act(() => result.current.recordExerciseResult('ieyo-yeyo-1', false))
    act(() => result.current.recordExerciseResult('ieyo-yeyo-1', true))
    act(() => result.current.recordExerciseResult('ieyo-yeyo-1', false))

    expect(readProgress(localStorage).exerciseResults).toEqual({ 'ieyo-yeyo-1': true })
  })
})
