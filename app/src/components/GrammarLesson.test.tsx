import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { course } from '../content/course'
import { GrammarLesson } from './GrammarLesson'

afterEach(cleanup)

const grammarLessonCases = [
  {
    grammarId: 'ieyo-yeyo',
    title: '이에요 / 예요 - to be',
    rules: ['Consonant-ending noun + 이에요', 'Vowel-ending noun + 예요'],
    examples: [
      ['저는 학생이에요.', 'I am a student.'],
      ['제니는 가수예요.', 'Jenny is a singer.'],
    ],
  },
  {
    grammarId: 'eun-neun',
    title: '은 / 는 - topic marker',
    rules: ['Consonant-ending noun + 은', 'Vowel-ending noun + 는'],
    examples: [
      ['저는 학생이에요.', 'As for me, I am a student.'],
      ['선생님은 한국 사람이에요.', 'The teacher is Korean.'],
    ],
  },
  {
    grammarId: 'i-ga-anieyo',
    title: '이 / 가 아니에요 - is not',
    rules: ['Consonant-ending noun + 이 아니에요', 'Vowel-ending noun + 가 아니에요'],
    examples: [
      ['저는 미국 사람이 아니에요.', 'I am not American.'],
      ['민수는 가수가 아니에요.', 'Minsu is not a singer.'],
    ],
  },
] as const

describe('GrammarLesson', () => {
  it.each(grammarLessonCases)('renders $title with exact rules, bilingual examples, and three prompts', ({ grammarId, title, rules, examples: expectedExamples }) => {
    const grammarPoint = course.grammar.find((candidate) => candidate.id === grammarId)!
    render(<GrammarLesson grammarPoint={grammarPoint} />)

    expect(screen.getByRole('heading', { name: title })).toBeVisible()
    for (const rule of rules) expect(screen.getByText(rule)).toBeVisible()
    const examples = screen.getByRole('list', { name: 'Bilingual examples' })
    for (const [korean, english] of expectedExamples) {
      expect(within(examples).getByRole('listitem', { name: `${korean} — ${english}` })).toBeVisible()
    }

    const exercises = screen.getAllByRole('group', { name: /of 3/i })
    expect(exercises).toHaveLength(3)
  })
})
