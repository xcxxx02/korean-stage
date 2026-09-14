import { describe, expect, it } from 'vitest'
import { vocabularyUnits } from './course'

describe('vocabulary unit catalogue', () => {
  it('exposes exactly the two approved Vocabulary units', () => {
    expect(vocabularyUnits.map(({ lessonSlug, itemLabel }) => [lessonSlug, itemLabel])).toEqual([
      ['countries', 'Vocabulary words'],
      ['occupations', 'Vocabulary words'],
    ])
    expect(vocabularyUnits.map((unit) => unit.title)).not.toContain('이에요 / 예요 - to be')
  })
})
