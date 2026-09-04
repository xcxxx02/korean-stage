import { describe, expect, it } from 'vitest'
import { vocabularyUnits } from './course'

describe('vocabulary unit catalogue', () => {
  it('exposes exactly the three approved Vocabulary units', () => {
    expect(vocabularyUnits.map(({ lessonSlug, itemLabel }) => [lessonSlug, itemLabel])).toEqual([
      ['lesson-1', 'Useful expressions'],
      ['lesson-2', 'Vocabulary words'],
      ['lesson-3', 'Vocabulary words'],
    ])
    expect(vocabularyUnits.map((unit) => unit.title)).not.toContain('이에요 / 예요 - to be')
  })
})
