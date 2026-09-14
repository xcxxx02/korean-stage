import { describe, expect, it } from 'vitest'
import { course, courseLessons, vocabularyUnits } from './course'

const originalLectureVocabulary = new Set([
  '안녕하세요?', '저는 미나예요.',
  '중국', '일본', '미국', '한국', '프랑스', '독일', '호주', '영국',
  '학생', '선생님', '회사원', '기자', '의사', '가수', '군인', '요리사',
])

describe('teacher-requested vocabulary revision', () => {
  it('replaces 15 of the 18 former items while keeping the three approved words', () => {
    expect(course.vocabulary.map((item) => item.korean)).toEqual([
      '태국', '베트남', '필리핀', '싱가포르', '인도네시아', '스페인', '이탈리아', '브라질', '뉴질랜드',
      '학생', '선생님', '엔지니어', '디자이너', '의사', '간호사', '소방관', '약사', '경찰관',
    ])

    const retained = course.vocabulary.filter((item) => originalLectureVocabulary.has(item.korean))
    expect(retained.map((item) => item.korean)).toEqual(['학생', '선생님', '의사'])
    expect(course.vocabulary.length - retained.length).toBe(15)
  })

  it('presents Unit 1 as individual vocabulary rather than sentence expressions', () => {
    expect(courseLessons[0].title).toBe('Countries & Nationalities')
    expect(vocabularyUnits[0]).toMatchObject({
      title: 'Countries & Nationalities',
      itemLabel: 'Vocabulary words',
    })
    expect(course.vocabulary.every((item) => item.displayKind === 'word')).toBe(true)
  })

  it('provides a distinct beginner tip for every vocabulary item', () => {
    const tips = course.vocabulary.map((item) => (item as typeof item & { grammarTip?: string }).grammarTip)
    expect(tips.every((tip) => Boolean(tip?.trim()))).toBe(true)
    expect(new Set(tips).size).toBe(course.vocabulary.length)
  })
})
