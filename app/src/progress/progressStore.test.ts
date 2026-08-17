import { beforeEach, describe, expect, it } from 'vitest'
import { readProgress, writeProgress, type CourseProgress } from './progressStore'

const defaultProgress: CourseProgress = {
  completedUnitIds: [],
  completedVocabularyIds: [],
  exerciseResults: {},
  lastPath: '/learn/unit-1',
}

const unavailableStorage: Storage = {
  get length(): number {
    throw new Error('Storage is unavailable')
  },
  clear() {
    throw new Error('Storage is unavailable')
  },
  getItem() {
    throw new Error('Storage is unavailable')
  },
  key() {
    throw new Error('Storage is unavailable')
  },
  removeItem() {
    throw new Error('Storage is unavailable')
  },
  setItem() {
    throw new Error('Storage is unavailable')
  },
}

describe('progressStore', () => {
  beforeEach(() => localStorage.clear())

  it('returns default progress when storage has no saved value', () => {
    expect(readProgress(localStorage)).toEqual(defaultProgress)
  })

  it('restores valid saved progress', () => {
    const saved: CourseProgress = {
      completedUnitIds: ['unit-1'],
      completedVocabularyIds: ['china'],
      exerciseResults: { 'ieyo-yeyo-1': true },
      lastPath: '/learn/unit-2',
    }
    localStorage.setItem('korean-stage-progress-v1', JSON.stringify(saved))

    expect(readProgress(localStorage)).toEqual(saved)
  })

  it('removes stale course IDs while preserving current progress', () => {
    localStorage.setItem('korean-stage-progress-v1', JSON.stringify({
      completedUnitIds: ['unit-2', 'unit-99', 'unit-2'],
      completedVocabularyIds: ['china', 'retired-word'],
      exerciseResults: { 'ieyo-yeyo-1': true, 'retired-exercise': false },
      lastPath: '/learn/unit-2',
    }))

    const expected: CourseProgress = {
      completedUnitIds: ['unit-2'],
      completedVocabularyIds: ['china'],
      exerciseResults: { 'ieyo-yeyo-1': true },
      lastPath: '/learn/unit-2',
    }
    expect(readProgress(localStorage)).toEqual(expected)
    expect(JSON.parse(localStorage.getItem('korean-stage-progress-v1')!)).toEqual(expected)
  })

  it('replaces an unsupported last path with the first unit path', () => {
    localStorage.setItem('korean-stage-progress-v1', JSON.stringify({
      completedUnitIds: ['unit-1'],
      completedVocabularyIds: [],
      exerciseResults: {},
      lastPath: 'https://example.com/phishing',
    }))

    expect(readProgress(localStorage)).toEqual({
      completedUnitIds: ['unit-1'],
      completedVocabularyIds: [],
      exerciseResults: {},
      lastPath: '/learn/unit-1',
    })
  })

  it('removes corrupt JSON and returns default progress', () => {
    localStorage.setItem('korean-stage-progress-v1', '{not-json')

    expect(readProgress(localStorage)).toEqual(defaultProgress)
    expect(localStorage.getItem('korean-stage-progress-v1')).toBeNull()
  })

  it('removes saved data with an invalid shape and returns default progress', () => {
    localStorage.setItem('korean-stage-progress-v1', JSON.stringify({ completedUnitIds: ['unit-1'] }))

    expect(readProgress(localStorage)).toEqual(defaultProgress)
    expect(localStorage.getItem('korean-stage-progress-v1')).toBeNull()
  })

  it('does not throw when storage is unavailable', () => {
    expect(() => readProgress(unavailableStorage)).not.toThrow()
    expect(readProgress(unavailableStorage)).toEqual(defaultProgress)
    expect(() => writeProgress(defaultProgress, unavailableStorage)).not.toThrow()
  })

  it('preserves all progress fields through a write and read round trip', () => {
    const progress: CourseProgress = {
      completedUnitIds: ['unit-1', 'unit-4'],
      completedVocabularyIds: ['china', 'student'],
      exerciseResults: { 'ieyo-yeyo-1': true, 'eun-neun-2': false },
      lastPath: '/learn/unit-4',
    }

    writeProgress(progress, localStorage)

    expect(readProgress(localStorage)).toEqual(progress)
  })
})
