import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { course } from '../content/course'
import { GrammarLesson } from './GrammarLesson'

afterEach(cleanup)

const grammarLessonCases = [
  {
    grammarId: 'identity',
    title: '이에요 / 예요 + 은 / 는 - talking about identity',
    rules: [
      'Consonant-ending topic + 은; vowel-ending topic + 는',
      'Consonant-ending identity noun + 이에요; vowel-ending identity noun + 예요',
      'Pattern: Topic + 은/는 + Noun + 이에요/예요',
    ],
    examples: [
      ['저는 학생이에요.', 'I am a student.'],
      ['지민은 간호사예요.', 'Jimin is a nurse.'],
    ],
  },
  {
    grammarId: 'i-ga-anieyo',
    title: '이 / 가 아니에요 - is not',
    rules: ['Consonant-ending noun + 이 아니에요', 'Vowel-ending noun + 가 아니에요'],
    examples: [
      ['저는 태국 사람이 아니에요.', 'I am not Thai.'],
      ['민수는 디자이너가 아니에요.', 'Minsu is not a designer.'],
    ],
  },
] as const

describe('GrammarLesson', () => {
  it.each(grammarLessonCases)('renders $title with exact rules, bilingual examples, and its full exercise set', ({ grammarId, title, rules, examples: expectedExamples }) => {
    const grammarPoint = course.grammar.find((candidate) => candidate.id === grammarId)!
    render(<GrammarLesson grammarPoint={grammarPoint} />)

    expect(screen.getByRole('heading', { name: title })).toBeVisible()
    for (const rule of rules) expect(screen.getByText(rule)).toBeVisible()
    const examples = screen.getByRole('list', { name: 'Bilingual examples' })
    for (const [korean, english] of expectedExamples) {
      expect(within(examples).getByRole('listitem', { name: `${korean} — ${english}` })).toBeVisible()
    }

    const exercises = screen.getAllByRole('group', { name: /of [36]/i })
    expect(exercises).toHaveLength(grammarPoint.exercises.length)
  })
})
