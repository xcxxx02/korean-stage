import { describe, expect, it } from 'vitest'
import { course, grammarUnits, vocabularyUnits } from './course'

describe('two-unit course structure', () => {
  it('offers two nine-word vocabulary units without sentence-style essentials', () => {
    expect(vocabularyUnits.map((unit) => unit.title)).toEqual([
      'Countries & Nationalities',
      'Jobs & Occupations',
    ])
    expect(course.vocabulary.filter((item) => item.unitId === 'vocabulary-1')).toHaveLength(9)
    expect(course.vocabulary.filter((item) => item.unitId === 'vocabulary-2')).toHaveLength(9)
    expect(course.vocabulary.some((item) => item.id === 'yes' || item.id === 'no')).toBe(false)
    expect(course.vocabulary.find((item) => item.id === 'new-zealand')?.korean).toBe('뉴질랜드')
    expect(course.vocabulary.find((item) => item.id === 'police-officer')?.korean).toBe('경찰관')
  })

  it('offers two independently numbered grammar units', () => {
    expect(grammarUnits.map((unit) => unit.title)).toEqual([
      'Talking about who someone is',
      'Saying what someone is not',
    ])
    expect(course.grammar).toHaveLength(2)
  })

  it('gives every word a unique example, tip, and learning image', () => {
    expect(new Set(course.vocabulary.map((item) => item.koreanExample)).size).toBe(18)
    expect(new Set(course.vocabulary.map((item) => item.grammarTip)).size).toBe(18)
    expect(course.vocabulary.every((item) => item.image?.src.startsWith('/assets/'))).toBe(true)
    expect(course.vocabulary.every((item) => Boolean(item.image?.alt.length))).toBe(true)
  })
})
