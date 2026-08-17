import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { course } from '../content/course'
import { readProgress, writeProgress } from '../progress/progressStore'
import { GrammarPage } from '../pages/GrammarPage'
import { UnitPage } from '../pages/UnitPage'
import { GrammarLesson } from './GrammarLesson'

beforeEach(() => localStorage.clear())
afterEach(cleanup)

const ieyoYeyo = course.grammar.find((grammarPoint) => grammarPoint.id === 'ieyo-yeyo')!

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

describe('grammar routes', () => {
  it('links all three bilingual grammar units and shows completion state', () => {
    writeProgress({
      completedUnitIds: ['unit-5'],
      completedVocabularyIds: [],
      exerciseResults: {
        'eun-neun-1': true,
        'eun-neun-2': true,
        'eun-neun-3': true,
      },
      lastPath: '/grammar',
    }, localStorage)

    render(<MemoryRouter><GrammarPage /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Grammar' })).toBeVisible()
    const units = screen.getByRole('list', { name: 'Grammar units' })
    expect(within(units).getAllByRole('listitem')).toHaveLength(3)
    expect(within(units).getByRole('link', { name: /이에요 \/ 예요.*to be/i })).toHaveAttribute('href', '/learn/unit-4')
    const completedUnit = within(units).getByRole('link', { name: /은 \/ 는.*topic marker/i })
    expect(completedUnit).toHaveAttribute('href', '/learn/unit-5')
    expect(within(completedUnit).getByText('Complete')).toBeVisible()
    expect(within(completedUnit).queryByText('Not complete')).not.toBeInTheDocument()
    expect(within(units).getByRole('link', { name: /이 \/ 가 아니에요.*is not/i })).toHaveAttribute('href', '/learn/unit-6')
  })

  it('records a grammar unit complete only after all three exercises are correct', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/learn/unit-4']}>
        <Routes><Route path="learn/:unitId" element={<UnitPage />} /></Routes>
      </MemoryRouter>,
    )

    const exercises = screen.getAllByRole('group', { name: /of 3/i })
    for (let index = 0; index < exercises.length; index += 1) {
      await user.click(within(exercises[index]).getByRole('radio', { name: ieyoYeyo.exercises[index].answer }))
      await user.click(within(exercises[index]).getByRole('button', { name: `Check answer ${index + 1}` }))
      await waitFor(() => expect(readProgress(localStorage).exerciseResults[ieyoYeyo.exercises[index].id]).toBe(true))
      if (index < 2) expect(readProgress(localStorage).completedUnitIds).not.toContain('unit-4')
    }

    await waitFor(() => expect(readProgress(localStorage).completedUnitIds).toContain('unit-4'))
    expect(screen.getByText('Score: 3 of 3 correct')).toBeVisible()
    expect(screen.getByText('Unit complete')).toBeVisible()
  })

  it('hydrates two saved correct answers and completes after the third', async () => {
    const user = userEvent.setup()
    writeProgress({
      completedUnitIds: [],
      completedVocabularyIds: [],
      exerciseResults: {
        'ieyo-yeyo-1': true,
        'ieyo-yeyo-2': true,
      },
      lastPath: '/learn/unit-4',
    }, localStorage)

    render(
      <MemoryRouter initialEntries={['/learn/unit-4']}>
        <Routes><Route path="learn/:unitId" element={<UnitPage />} /></Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Score: 2 of 3 correct')).toBeVisible()
    const exercises = screen.getAllByRole('group', { name: /of 3/i })
    expect(within(exercises[0]).getByRole('button', { name: 'Answer 1 correct' })).toBeDisabled()
    expect(within(exercises[1]).getByRole('button', { name: 'Answer 2 correct' })).toBeDisabled()
    expect(screen.queryByText('Unit complete')).not.toBeInTheDocument()

    await user.click(within(exercises[2]).getByRole('radio', { name: '제니예요' }))
    await user.click(within(exercises[2]).getByRole('button', { name: 'Check answer 3' }))

    await waitFor(() => expect(readProgress(localStorage)).toMatchObject({
      completedUnitIds: ['unit-4'],
      exerciseResults: {
        'ieyo-yeyo-1': true,
        'ieyo-yeyo-2': true,
        'ieyo-yeyo-3': true,
      },
    }))
    expect(screen.getByText('Score: 3 of 3 correct')).toBeVisible()
    expect(screen.getByText('Unit complete')).toBeVisible()
  })

  it('shows a completed saved unit as three of three with every exercise locked', () => {
    writeProgress({
      completedUnitIds: ['unit-4'],
      completedVocabularyIds: [],
      exerciseResults: {
        'ieyo-yeyo-1': true,
        'ieyo-yeyo-2': true,
        'ieyo-yeyo-3': true,
      },
      lastPath: '/learn/unit-4',
    }, localStorage)

    render(
      <MemoryRouter initialEntries={['/learn/unit-4']}>
        <Routes><Route path="learn/:unitId" element={<UnitPage />} /></Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Score: 3 of 3 correct')).toBeVisible()
    expect(screen.getByText('Unit complete')).toBeVisible()
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled()
    expect(screen.getAllByRole('button', { name: /Answer \d correct/ })).toHaveLength(3)
  })
})
